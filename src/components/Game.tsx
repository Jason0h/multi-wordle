"use client";

import { useState, useEffect } from "react";
import { useImmer } from "use-immer";
import { useAnimate } from "motion/react";
import Board from "./Board";
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
}: {
  initialBoard: string[][] | null;
}) {
  const [board, setBoard] = useImmer(initialBoard ?? emptyBoard);
  const [currentRow, setCurrentRow] = useState(() => {
    if (!initialBoard) return 0;
    const idx = initialBoard.findIndex((row) => row.some((l) => l === ""));
    return idx === -1 ? MAX_GUESSES : idx;
  });

  const [feedback, setFeedback] = useImmer(emptyFeedback);
  const [currentRowScope, animateRow] = useAnimate();

  const submitGuess = trpc.game.submitGuess.useMutation({
    onSuccess(data) {
      setBoard(data.board);
      // Hardcoded fake feedback for testing the flip animation
      const fakeFeedback: TileStatus[] = [
        "correct",
        "present",
        "absent",
        "absent",
        "correct",
      ];
      setFeedback((draft) => {
        draft[currentRow] = fakeFeedback;
      });
      setCurrentRow((prev) => prev + 1);
    },
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (currentRow >= MAX_GUESSES) return;

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
    <Board
      board={board}
      feedback={feedback}
      currentRow={currentRow}
      currentRowRef={currentRowScope}
    />
  );
}
