"use client";

import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "https://gabbers-signaling.herokuapp.com";

interface SignalData {
    type: "offer" | "answer" | "ice-candidate";
    offer?: RTCSessionDescriptionInit;
    answer?: RTCSessionDescriptionInit;
    candidate?: RTCIceCandidateInit;
    roomId: string;
}

interface VoiceRoomProps {
    roomId: string;
}

export default function VoiceRoom({ roomId }: VoiceRoomProps) {
    const [socket, setSocket] = useState<Socket | null>(null);
    // Removed unused peerConnection state variable.
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
                } as SignalData);
            }
        };

        // When a remote track is received, set it on the remote audio element
        pc.ontrack = (event) => {
            if (remoteAudioRef.current) {
                remoteAudioRef.current.srcObject = event.streams[0];
            }
        };

        // Listen for signaling messages from the server
        socket.on("signal", async (data: SignalData) => {
            if (!pc) return;
            if (data.type === "offer" && data.offer) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.offer));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.emit("signal", { type: "answer", answer, roomId } as SignalData);
            } else if (data.type === "answer" && data.answer) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
            } else if (data.type === "ice-candidate" && data.candidate) {
                try {
                    await pc.addIceCandidate(data.candidate);
                } catch (error) {
                    console.error("Error adding received ice candidate", error);
                }
            }
        });

        // Notify server that we've joined the room.
        socket.emit("join", { roomId });
        socket.on("room-joined", async (data: { initiator: boolean }) => {
            if (data.initiator) {
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                socket.emit("signal", { type: "offer", offer, roomId } as SignalData);
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
