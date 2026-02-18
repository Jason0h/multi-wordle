import { SessionOptions } from "iron-session";
import { z } from "zod";

export const GameSessionSchema = z.object({
  secret: z.array(z.string()).optional(),
  board: z.array(z.array(z.string())).optional(),
  feedback: z
    .array(z.array(z.enum(["idle", "correct", "present", "absent"])))
    .optional(),
  locale: z.string().optional(),
});

export type GameSession = z.infer<typeof GameSessionSchema>;

export const sessionOptions: SessionOptions = {
  password:
    process.env.SESSION_PASSWORD ?? "PLEASE_SET_A_REAL_SECRET_THAT_IS_32_CHARS",
  cookieName: "wordle-session",
};
