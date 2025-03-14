"use client";

import { useParams } from "next/navigation";
import VoiceRoom from "@/components/VoiceRoom";

export default function RoomPage() {
    // useParams returns a plain object with the route parameters
    const params = useParams();
    const roomId = Array.isArray(params?.id) ? params.id[0] : params?.id;

    if (!roomId) {
        return <p>Error: Room ID is missing or invalid.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <VoiceRoom roomId={roomId} />
        </div>
    );
}
