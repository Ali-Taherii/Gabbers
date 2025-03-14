import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT NOW() as now");
    return NextResponse.json({ message: `DB Connection successful: ${res.rows[0].now}` });
  } catch (error) {
    console.error("DB Test Error:", error);
    return NextResponse.json({ error: "DB Connection failed" }, { status: 500 });
  } finally {
    client.release();
  }
}
