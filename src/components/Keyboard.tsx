"use client";

import { motion } from "motion/react";
import { TileStatus } from "@/types";
import { stripAccents } from "@/lib/normalize";

const KEYBOARD_LAYOUTS: Record<string, string[][]> = {
  en: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
  ru: [
    ["Й", "Ц", "У", "К", "Е", "Н", "Г", "Ш", "Щ", "З", "Х", "Ъ"],
    ["Ф", "Ы", "В", "А", "П", "Р", "О", "Л", "Д", "Ж", "Э"],
    ["Я", "Ч", "С", "М", "И", "Т", "Ь", "Б", "Ю"],
  ],
  he: [
    ["ק", "ר", "א", "ט", "ו", "ן", "ם", "פ"],
    ["ש", "ד", "ג", "כ", "ע", "י", "ח", "ל", "ך", "ף"],
    ["ז", "ס", "ב", "ה", "נ", "מ", "צ", "ת", "ץ"],
  ],
  es: [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ñ"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ],
};

const KEY_COLORS: Record<Exclude<TileStatus, "idle">, string> = {
  correct: "bg-chart-2 text-white dark:text-black border-chart-2",
  present: "bg-primary text-white dark:text-black border-primary",
  absent:
    "bg-muted-foreground text-white dark:text-black border-muted-foreground",
};

const STATUS_PRIORITY: Record<TileStatus, number> = {
  idle: 0,
  absent: 1,
  present: 2,
  correct: 3,
};

function deriveKeyStatuses(
  board: string[][],
  feedback: TileStatus[][],
): Record<string, TileStatus> {
  const statuses: Record<string, TileStatus> = {};
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const letter = stripAccents(board[row][col]);
      const status = feedback[row][col];
      if (!letter || status === "idle") continue;
      const current = statuses[letter] ?? "idle";
      if (STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
        statuses[letter] = status;
      }
    }
  }
  return statuses;
}

export default function Keyboard({
  board,
  feedback,
  locale = "en",
  onKeyPress,
}: {
  board: string[][];
  feedback: TileStatus[][];
  locale?: string;
  onKeyPress: (key: string) => void;
}) {
  const keyStatuses = deriveKeyStatuses(board, feedback);
  const rows = KEYBOARD_LAYOUTS[locale] ?? KEYBOARD_LAYOUTS.en;
  const isWide = locale === "ru";

  return (
    <div dir="ltr" className="flex flex-col items-center gap-1.5">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-1.5">
          {row.map((key) => {
            const status = keyStatuses[key];
            const colorClasses =
              status && status !== "idle"
                ? KEY_COLORS[status]
                : "bg-background border-border";
            return (
              <motion.button
                key={key}
                onClick={(e) => {
                  onKeyPress(key);
                  e.currentTarget.blur();
                }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.1 }}
                style={{ WebkitTapHighlightColor: "transparent" }}
                className={`flex h-14 select-none items-center justify-center rounded border-2 text-base font-bold outline-none ${
                  isWide ? "min-w-9 flex-1" : "w-11"
                } ${colorClasses}`}
              >
                {key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
