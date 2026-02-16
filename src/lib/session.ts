import { SessionOptions } from "iron-session";
import { TileStatus } from "@/types";

export interface GameSession {
  secret?: string[];
  board?: string[][];
  feedback?: TileStatus[][];
  locale?: string;
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ?? "PLEASE_SET_A_REAL_SECRET_THAT_IS_32_CHARS",
  cookieName: "wordle-session",
};
