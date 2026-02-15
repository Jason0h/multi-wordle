"use client";

import { CircleHelp, RotateCcw } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header({ onNewGame }: { onNewGame: () => void }) {
  return (
    <div className="flex w-full items-center justify-between">
      <h1 className="text-xl font-bold tracking-wide">MULTI WORDLE</h1>
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.currentTarget.blur();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border outline-none transition-colors hover:bg-accent"
        >
          <CircleHelp className="h-4 w-4" />
          <span className="sr-only">Help</span>
        </button>
        <button
          onClick={(e) => {
            onNewGame();
            e.currentTarget.blur();
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border outline-none transition-colors hover:bg-accent"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="sr-only">New game</span>
        </button>
        <ThemeToggle />
      </div>
    </div>
  );
}
