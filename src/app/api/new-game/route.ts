import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import { GameSession, sessionOptions } from "@/lib/session";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export async function POST() {
  const session = await getIronSession<GameSession>(
    await cookies(),
    sessionOptions,
  );

  session.board = Array.from({ length: MAX_GUESSES }, () =>
    Array<string>(WORD_LENGTH).fill(""),
  );

  await session.save();

  return NextResponse.json({ board: session.board });
}
