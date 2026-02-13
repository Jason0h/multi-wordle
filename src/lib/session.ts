import { SessionOptions } from "iron-session";
import { TileStatus } from "@/types";

export interface GameSession {
  board: string[][];
  feedback: TileStatus[][];
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ?? "PLEASE_SET_A_REAL_SECRET_THAT_IS_32_CHARS",
  cookieName: "wordle-session",
};
