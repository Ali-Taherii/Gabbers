"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";

export default function SignUpPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<string | null>(null);
    const [testMessage, setTestMessage] = useState<string | null>(null);

    // Handle sign-up form submission
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            const res = await fetch("/api/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage("Registration successful! Welcome, " + data.username);
            } else {
                setMessage(data.error || "Registration failed");
            }
        } catch (err) {
            setMessage("Error: " + err);
        }
    };

    // Test database connection via API endpoint
    const testDBConnection = async () => {
        setTestMessage(null);
        try {
            const res = await fetch("/api/test-db");
            const data = await res.json();
            if (res.ok) {
                setTestMessage("DB Connection: " + data.message);
            } else {
                setTestMessage("Test failed: " + data.error);
            }
        } catch (err) {
            setTestMessage("Error: " + err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
                <h1 className="text-2xl mb-4 text-center">Sign Up</h1>
                <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Sign Up
                    </button>
                </form>
                {message && <p className="mt-4 text-center">{message}</p>}
                <hr className="my-6" />
                <h2 className="text-xl mb-4 text-center">Test DB Connection</h2>
                <div className="flex justify-center">
                    <button
                        onClick={testDBConnection}
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Test Connection
                    </button>
                </div>
                {testMessage && <p className="mt-4 text-center">{testMessage}</p>}
            </div>
        </div>);
}
