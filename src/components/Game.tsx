"use client";

import { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useAnimate } from "motion/react";
import { toast } from "sonner";
import Header from "./Header";
import Board from "./Board";
import Keyboard from "./Keyboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { WORD_LENGTH, MAX_GUESSES } from "@/lib/constants";
import { TileStatus } from "@/types";

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
  initialBoard: string[][] | null;
  initialFeedback: TileStatus[][] | null;
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
  const [currentRowScope, animateRow] = useAnimate();

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
      }
    },
    onError() {
      toast("Not in word list");
      animateRow(currentRowScope.current, {
        x: [0, -4, 4, -4, 4, 0],
        transition: { duration: 0.3 },
      });
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      const key = e.key;

      if (/^[a-zA-Z]$/.test(key)) {
        setBoard((draft) => {
          const nextEmpty = draft[currentRow].indexOf("");
          if (nextEmpty !== -1) {
            draft[currentRow][nextEmpty] = key.toUpperCase();
          }
        });
      } else if (key === "Backspace") {
        setBoard((draft) => {
          const row = draft[currentRow];
          const lastFilled = row.findLastIndex((l) => l !== "");
          if (lastFilled !== -1) {
            row[lastFilled] = "";
          }
        });
      } else if (key === "Enter") {
        const row = board[currentRow];
        if (row.every((l) => l !== "")) {
          submitGuess.mutate({ guess: row });
        } else {
          toast("Not enough letters");
          animateRow(currentRowScope.current, {
            x: [0, -4, 4, -4, 4, 0],
            transition: { duration: 0.3 },
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-6">
      <Header onNewGame={() => newGame.mutate()} />
      <Board
        key={gameId}
        board={board}
        feedback={feedback}
        currentRow={currentRow}
        currentRowRef={currentRowScope}
      />
      <Keyboard board={board} feedback={keyboardFeedback} />
      <Dialog open={showWinDialog} onOpenChange={setShowWinDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>You won!</DialogTitle>
            <DialogDescription>
              You guessed the word in {currentRow}{" "}
              {currentRow === 1 ? "guess" : "guesses"}.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
