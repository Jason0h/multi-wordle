import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { GameSession, sessionOptions } from "@/lib/session";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await getIronSession<GameSession>(
    await cookies(),
    sessionOptions,
  );
  session.destroy();

  return NextResponse.json({ ok: true });
}
