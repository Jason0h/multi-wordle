import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { initTRPC } from "@trpc/server";
import { GameSession, sessionOptions } from "@/lib/session";

export async function createContext() {
  const session = await getIronSession<GameSession>(
    await cookies(),
    sessionOptions,
  );
  return { session };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
