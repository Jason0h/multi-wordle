import { z } from "zod/v4";
import { router, publicProcedure } from "../trpc";
import { WORD_LENGTH, MAX_GUESSES } from "@/lib/constants";

export const gameRouter = router({
  newGame: publicProcedure.mutation(async ({ ctx }) => {
    ctx.session.board = Array.from({ length: MAX_GUESSES }, () =>
      Array<string>(WORD_LENGTH).fill(""),
    );
    await ctx.session.save();
    return { board: ctx.session.board };
  }),

  submitGuess: publicProcedure
    .input(z.object({ guess: z.array(z.string()).length(WORD_LENGTH) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.board) {
        ctx.session.board = Array.from({ length: MAX_GUESSES }, () =>
          Array<string>(WORD_LENGTH).fill(""),
        );
      }

      const currentRow = ctx.session.board.findIndex((row) =>
        row.every((l) => l === ""),
      );
      if (currentRow === -1) {
        throw new Error("No guesses remaining");
      }

      ctx.session.board[currentRow] = input.guess;
      await ctx.session.save();

      return { board: ctx.session.board };
    }),
});
