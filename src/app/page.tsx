import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { GameSession, GameSessionSchema, sessionOptions } from "@/lib/session";
import Game from "@/components/Game";

export default async function Home() {
  const session = await getIronSession<GameSession>(
    await cookies(),
    sessionOptions,
  );

  const parsed = GameSessionSchema.safeParse(session);
  const validSession = parsed.success ? parsed.data : {};

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Game
        initialBoard={validSession.board}
        initialFeedback={validSession.feedback}
      />
    </div>
  );
}
