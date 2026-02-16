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
    ctx.session.locale = undefined;
    await ctx.session.save();
    return { board, feedback };
  }),

  submitGuess: publicProcedure
    .input(z.object({ guess: z.array(z.string()).length(WORD_LENGTH) }))
    .mutation(async ({ ctx, input }) => {
      const gameLocale = ctx.session.locale ?? ctx.locale;
      const secret: string[] = ctx.session.secret ?? getRandomWord(gameLocale);
      console.log("Secret:", secret.join(""));
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

      const isRtl = gameLocale === "he";
      const guess = isRtl ? [...input.guess].reverse() : input.guess;

      if (!isValidWord(guess, gameLocale)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Not in word list",
        });
      }

      const rowFeedback: TileStatus[] = Array(WORD_LENGTH).fill("idle");
      const secretBank = [...secret];
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === secret[i]) {
          secretBank[i] = "";
          rowFeedback[i] = "correct";
        }
      }
      for (let i = 0; i < guess.length; i++) {
        if (rowFeedback[i] === "correct") continue;
        if (secretBank.includes(guess[i])) {
          rowFeedback[i] = "present";
          secretBank[secretBank.indexOf(guess[i])] = "";
        } else {
          rowFeedback[i] = "absent";
        }
      }

      // Store in display order (reverse back for RTL)
      board[currentRow] = input.guess;
      feedback[currentRow] = isRtl ? rowFeedback.reverse() : rowFeedback;

      ctx.session.board = board;
      ctx.session.feedback = feedback;
      ctx.session.secret = secret;
      ctx.session.locale = gameLocale;
      await ctx.session.save();

      const isLoss =
        currentRow === MAX_GUESSES - 1 &&
        !feedback[currentRow].every((s) => s === "correct");

      return {
        board,
        feedback,
        ...(isLoss ? { secret: secret.join("") } : {}),
      };
    }),
});
