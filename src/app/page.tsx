import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { GameSession, sessionOptions } from "@/lib/session";
import Game from "@/components/Game";

export default async function Home() {
  const session = await getIronSession<GameSession>(
    await cookies(),
    sessionOptions,
  );

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Game initialBoard={session.board ?? null} />
    </div>
  );
}
