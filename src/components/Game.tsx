"use client";

import { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useAnimate } from "motion/react";
import { toast } from "sonner";
import Header from "./Header";
import Board from "./Board";
import Keyboard from "./Keyboard";
import HelpDialog from "./HelpDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { T, Var, useGT } from "gt-next";
import { useLocale } from "gt-next/client";
import { trpc } from "@/lib/trpc";
import { WORD_LENGTH, MAX_GUESSES } from "@/lib/constants";
import { TileStatus } from "@/types";
import { GameSession } from "@/lib/session";

const emptyBoard = () =>
  Array.from({ length: MAX_GUESSES }, () =>
    Array<string>(WORD_LENGTH).fill(""),
  );

const emptyFeedback = (): TileStatus[][] =>
  Array.from({ length: MAX_GUESSES }, () =>
    Array<TileStatus>(WORD_LENGTH).fill("idle"),
  );

export default function Game({
  initialBoard,
  initialFeedback,
}: {
  initialBoard: GameSession["board"];
  initialFeedback: GameSession["feedback"];
}) {
  const [board, setBoard] = useImmer(initialBoard ?? emptyBoard);
  const [currentRow, setCurrentRow] = useState(() => {
    if (!initialBoard) return 0;
    const idx = initialBoard.findIndex((row) => row.some((l) => l === ""));
    return idx === -1 ? MAX_GUESSES : idx;
  });

  const [feedback, setFeedback] = useImmer(initialFeedback ?? emptyFeedback);
  const [keyboardFeedback, setKeyboardFeedback] = useImmer(
    initialFeedback ?? emptyFeedback,
  );
  const [gameId, setGameId] = useState(0);
  const [showWinDialog, setShowWinDialog] = useState(false);
  const [showLossDialog, setShowLossDialog] = useState(false);
  const [lostSecret, setLostSecret] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [currentRowScope, animateRow] = useAnimate();
  const t = useGT();
  const locale = useLocale();
  const isRtl = locale === "he";
  const gameOver =
    currentRow > 0 &&
    (currentRow >= MAX_GUESSES ||
      feedback[currentRow - 1].every((s) => s === "correct"));

  const FLIP_DURATION = (WORD_LENGTH - 1) * 200 + 300 + 200; // Time for all tiles to flip plus a little buffer

  const newGame = trpc.game.newGame.useMutation({
    onSuccess(data) {
      setBoard(data.board);
      setFeedback(data.feedback);
      setKeyboardFeedback(data.feedback);
      setCurrentRow(0);
      setGameId((prev) => prev + 1);
      setShowWinDialog(false);
      setShowLossDialog(false);
    },
  });

  const BOUNCE_DURATION = (WORD_LENGTH - 1) * 100 + 300; // Wave bounce after flip

  const submitGuess = trpc.game.submitGuess.useMutation({
    onSuccess(data) {
      setBoard(data.board);
      setFeedback(data.feedback);
      setCurrentRow((prev) => prev + 1);
      setTimeout(() => {
        setKeyboardFeedback(data.feedback);
      }, FLIP_DURATION);

      const isWin = data.feedback[currentRow].every(
        (s: TileStatus) => s === "correct",
      );
      if (isWin) {
        setTimeout(() => {
          setShowWinDialog(true);
        }, FLIP_DURATION + BOUNCE_DURATION);
      } else if (data.secret) {
        setTimeout(() => {
          setLostSecret(data.secret!);
          setShowLossDialog(true);
        }, FLIP_DURATION);
      }
    },
    onError() {
      toast(t("Not in word list"));
      animateRow(currentRowScope.current, {
        x: [0, -4, 4, -4, 4, 0],
        transition: { duration: 0.3 },
      });
    },
  });

  const handleInput = (key: string) => {
    if (gameOver) return;

    const INPUT_PATTERNS: Record<string, RegExp> = {
      en: /^[a-zA-Z]$/,
      ru: /^[а-яёА-ЯЁ]$/,
      he: /^[\u05D0-\u05EA]$/,
      es: /^[a-zA-ZÑñ]$/,
    };
    const pattern = INPUT_PATTERNS[locale] ?? INPUT_PATTERNS.en;

    if (pattern.test(key)) {
      setBoard((draft) => {
        if (isRtl) {
          const lastEmpty = draft[currentRow].findLastIndex((l) => l === "");
          if (lastEmpty !== -1) {
            draft[currentRow][lastEmpty] = key.toUpperCase();
          }
        } else {
          const nextEmpty = draft[currentRow].indexOf("");
          if (nextEmpty !== -1) {
            draft[currentRow][nextEmpty] = key.toUpperCase();
          }
        }
      });
    } else if (key === "Backspace") {
      setBoard((draft) => {
        const row = draft[currentRow];
        if (isRtl) {
          const firstFilled = row.findIndex((l) => l !== "");
          if (firstFilled !== -1) {
            row[firstFilled] = "";
          }
        } else {
          const lastFilled = row.findLastIndex((l) => l !== "");
          if (lastFilled !== -1) {
            row[lastFilled] = "";
          }
        }
      });
    } else if (key === "Enter") {
      const row = board[currentRow];
      if (row.every((l) => l !== "")) {
        submitGuess.mutate({ guess: row });
      } else {
        toast(t("Not enough letters"));
        animateRow(currentRowScope.current, {
          x: [0, -4, 4, -4, 4, 0],
          transition: { duration: 0.3 },
        });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleInput(e.key);
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <Header
        onNewGame={() => newGame.mutate()}
        onHelp={() => setShowHelp(true)}
      />
      <Board
        key={gameId}
        board={board}
        feedback={feedback}
        currentRow={currentRow}
        currentRowRef={currentRowScope}
        rtl={isRtl}
      />
      <Keyboard
        board={board}
        feedback={keyboardFeedback}
        locale={locale}
        onKeyPress={handleInput}
      />
      <HelpDialog open={showHelp} onOpenChange={setShowHelp} />
      <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <T>You won! 🎉</T>
            </DialogTitle>
            <DialogDescription>
              {currentRow === 1 ? (
                <T>
                  You guessed the word in <Var>{currentRow}</Var> guess.
                </T>
              ) : (
                <T>
                  You guessed the word in <Var>{currentRow}</Var> guesses.
                </T>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <Dialog open={showLossDialog} onOpenChange={setShowLossDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <T>Better luck next time 😢</T>
            </DialogTitle>
            <DialogDescription>
              <T>
                The word was{" "}
                <Var>
                  <span className="font-bold text-foreground">
                    {lostSecret}
                  </span>
                </Var>
                .
              </T>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
