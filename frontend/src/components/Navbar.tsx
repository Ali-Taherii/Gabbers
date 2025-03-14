"use client";

import AuthButtons from "./AuthButtons";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div>
        <h1 className="text-xl font-bold">Gabbers</h1>
      </div>
      <div className="flex items-center">
        {session && <p className="mr-4">{session.user?.name}</p>}
        <AuthButtons />
      </div>
    </nav>
  );
}
