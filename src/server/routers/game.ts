import { z } from "zod/v4";
import { TRPCError } from "@trpc/server";
import { router, publicProcedure } from "../trpc";
import { WORD_LENGTH, MAX_GUESSES } from "@/lib/constants";
import { TileStatus } from "@/types";
import { getRandomWord, isValidWord } from "@/lib/words";

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
    ctx.session.secret = undefined;
    await ctx.session.save();
    return { board, feedback };
  }),

  submitGuess: publicProcedure
    .input(z.object({ guess: z.array(z.string()).length(WORD_LENGTH) }))
    .mutation(async ({ ctx, input }) => {
      const secret: string[] = ctx.session.secret ?? getRandomWord();
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

      if (!isValidWord(input.guess)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not in word list",
        });
      }

      board[currentRow] = input.guess;

      const secretBank = [...secret];
      for (let i = 0; i < board[currentRow].length; i++) {
        if (board[currentRow][i] === secret[i]) {
          secretBank[i] = "";
          feedback[currentRow][i] = "correct";
        }
      }
      for (let i = 0; i < board[currentRow].length; i++) {
        if (feedback[currentRow][i] === "correct") continue;
        if (secretBank.includes(board[currentRow][i])) {
          feedback[currentRow][i] = "present";
          secretBank[secretBank.indexOf(board[currentRow][i])] = "";
        } else {
          feedback[currentRow][i] = "absent";
        }
      }

      ctx.session.board = board;
      ctx.session.feedback = feedback;
      ctx.session.secret = secret;
      await ctx.session.save();

      const isLoss =
        currentRow === MAX_GUESSES - 1 &&
        !feedback[currentRow].every((s) => s === "correct");

      return { board, feedback, ...(isLoss ? { secret: secret.join("") } : {}) };
    }),
});
