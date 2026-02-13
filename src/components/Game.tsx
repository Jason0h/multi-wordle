"use client";

import { useState, useEffect, useCallback } from "react";
import { useImmer } from "use-immer";
import Board from "./Board";
import { trpc } from "@/lib/trpc";
import { WORD_LENGTH, MAX_GUESSES } from "@/lib/constants";

const emptyBoard = () =>
  Array.from({ length: MAX_GUESSES }, () =>
    Array<string>(WORD_LENGTH).fill(""),
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

  const submitGuess = trpc.game.submitGuess.useMutation({
    onSuccess(data) {
      setBoard(data.board);
      setCurrentRow((prev) => prev + 1);
    },
  });

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
        }
      }
    },
    [board, currentRow, setBoard, submitGuess],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return <Board board={board} />;
}
