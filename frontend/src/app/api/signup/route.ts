// src/app/api/signup/route.ts
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const passwordHash = await hash(password, 12);
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO users (username, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, passwordHash]
    );
    const newUser = result.rows[0];
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
