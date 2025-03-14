"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:4000"; // Your signaling server URL

interface VoiceRoomProps {
    roomId: string;
}

export default function VoiceRoom({ roomId }: VoiceRoomProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    // Initialize Socket.io connection
    useEffect(() => {
        const newSocket = io(SOCKET_SERVER_URL, { query: { roomId } });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [roomId]);

    // Get local audio stream
    useEffect(() => {
        async function getLocalStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setLocalStream(stream);
                if (localAudioRef.current) {
                    localAudioRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing microphone:", error);
            }
        }
        getLocalStream();
    }, []);

    // Setup WebRTC connection once we have local stream and socket
    useEffect(() => {
        if (!localStream || !socket) return;

        // Create RTCPeerConnection with a STUN server
        const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // Add local stream tracks to peer connection
        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        // When ICE candidates are gathered, send them via signaling server
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("signal", {
                    type: "ice-candidate",
                    candidate: event.candidate,
                    roomId,
                });
            }
        };

        // When a remote track is received, set it on the remote audio element
        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }
        };

        setPeerConnection(pc);

        // Listen for signaling messages from the server
        socket.on("signal", async (data: any) => {
            if (!pc) return;
            if (data.type === "offer") {
                // Received an offer; set remote description and create an answer
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("signal", { type: "answer", answer, roomId });
            } else if (data.type === "answer") {
                // Received answer; set remote description
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.type === "ice-candidate") {
                // Received ICE candidate; add it to the peer connection
                try {
                    await pc.addIceCandidate(data.candidate);
                } catch (error) {
                    console.error("Error adding received ice candidate", error);
                }
            }
        });

        // Notify server that we've joined the room.
        // The server will respond with whether this client should be the offer initiator.
        socket.emit("join", { roomId });
        socket.on("room-joined", async (data: any) => {
            // If designated as initiator, create and send an offer.
            if (data.initiator) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("signal", { type: "offer", offer, roomId });
            }
        });

        return () => {
            pc.close();
        };
    }, [localStream, socket, roomId]);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">Voice Room: {roomId}</h1>
            <div className="mt-4">
                <h2 className="text-lg">Local Audio (muted):</h2>
                <audio ref={localAudioRef} autoPlay muted className="border p-2" />
            </div>
            <div className="mt-4">
                <h2 className="text-lg">Remote Audio:</h2>
                <audio ref={remoteAudioRef} autoPlay className="border p-2" />
            </div>
        </div>
    );
}
