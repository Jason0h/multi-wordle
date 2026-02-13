import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { GameSession, sessionOptions } from "@/lib/session";

export async function POST(request: NextRequest) {
  const session = await getIronSession<GameSession>(
    await cookies(),
    sessionOptions,
  );

  if (!session.board) {
    session.board = Array.from({ length: 6 }, () => Array<string>(5).fill(""));
  }

  const { guess } = (await request.json()) as { guess: string[] };

  const currentRow = session.board.findIndex((row) =>
    row.every((l) => l === ""),
  );
  if (currentRow === -1) {
    return NextResponse.json(
      { error: "No guesses remaining" },
      { status: 400 },
    );
  }

  session.board[currentRow] = guess;
  await session.save();

  return NextResponse.json({ board: session.board });
}
