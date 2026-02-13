"use client";

import { useState, useEffect, useCallback } from "react";
import { useImmer } from "use-immer";
import Board from "./Board";

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

const emptyBoard = () =>
  Array.from({ length: MAX_GUESSES }, () =>
    Array<string>(WORD_LENGTH).fill(""),
  );

export default function Game() {
  const [board, setBoard] = useImmer(emptyBoard);
  const [currentRow, setCurrentRow] = useState(0);

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
          setCurrentRow((prev) => prev + 1);
        }
      }
    },
    [board, currentRow, setBoard],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return <Board board={board} />;
}
