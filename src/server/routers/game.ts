import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import { WORD_LENGTH, MAX_GUESSES } from "@/lib/constants";
import { TileStatus } from "@/types";

const emptyFeedback = (): TileStatus[][] =>
  Array.from({ length: MAX_GUESSES }, () =>
    Array<TileStatus>(WORD_LENGTH).fill("idle"),
  );

export const gameRouter = router({
  newGame: publicProcedure.mutation(async ({ ctx }) => {
    const board = Array.from({ length: MAX_GUESSES }, () =>
      Array<string>(WORD_LENGTH).fill(""),
    );
    const feedback = emptyFeedback();
    ctx.session.board = board;
    ctx.session.feedback = feedback;
    await ctx.session.save();
    return { board, feedback };
  }),

  submitGuess: publicProcedure
    .input(z.object({ guess: z.array(z.string()).length(WORD_LENGTH) }))
    .mutation(async ({ ctx, input }) => {
      const board: string[][] =
        ctx.session.board ??
        Array.from({ length: MAX_GUESSES }, () =>
          Array<string>(WORD_LENGTH).fill(""),
        );
      const feedback: TileStatus[][] = ctx.session.feedback ?? emptyFeedback();

      const currentRow = board.findIndex((row) => row.every((l) => l === ""));
      if (currentRow === -1) {
        throw new Error("No guesses remaining");
      }

      board[currentRow] = input.guess;

      // Hardcoded fake feedback for now
      feedback[currentRow] = [
        "correct",
        "present",
        "absent",
        "absent",
        "correct",
      ];

      ctx.session.board = board;
      ctx.session.feedback = feedback;
      await ctx.session.save();

      return { board, feedback };
    }),
});
