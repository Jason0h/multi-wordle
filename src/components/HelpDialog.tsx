"use client";

import { T, useGT } from "gt-next";
import { useLocale } from "gt-next/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function ExampleRow({
  word,
  highlightIndex,
  highlightColor,
  explanation,
}: {
  word: string;
  highlightIndex: number;
  highlightColor: string;
  explanation: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex">
        <div dir="ltr" className="flex gap-1">
          {word.split("").map((letter, i) => (
            <div
              key={i}
              className={`flex h-10 w-10 items-center justify-center border-2 text-lg font-bold uppercase ${
                i === highlightIndex
                  ? `${highlightColor} text-white dark:text-black`
                  : "border-border"
              }`}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{explanation}</p>
    </div>
  );
}

const EXAMPLES: Record<
  string,
  { word: string; index: number; letter: string }[]
> = {
  en: [
    { word: "WORDY", index: 0, letter: "W" },
    { word: "LIGHT", index: 1, letter: "I" },
    { word: "ROGUE", index: 3, letter: "U" },
  ],
  ru: [
    { word: "СЛОВО", index: 0, letter: "С" },
    { word: "КНИГА", index: 1, letter: "Н" },
    { word: "ДОМИК", index: 3, letter: "И" },
  ],
  he: [
    { word: "אנשים", index: 0, letter: "א" },
    { word: "דברים", index: 1, letter: "ב" },
    { word: "קדימה", index: 3, letter: "מ" },
  ],
  es: [
    { word: "PLAZA", index: 0, letter: "P" },
    { word: "TIGRE", index: 1, letter: "I" },
    { word: "NOCHE", index: 3, letter: "H" },
  ],
};

const HIGHLIGHT_COLORS = [
  "bg-chart-2 border-chart-2",
  "bg-primary border-primary",
  "bg-muted-foreground border-muted-foreground",
];

export default function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useGT();
  const locale = useLocale();
  const examples = EXAMPLES[locale] ?? EXAMPLES.en;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <T>How To Play</T>
          </DialogTitle>
        </DialogHeader>
        <p className="font-medium">
          <T>Guess the Wordle in 6 tries.</T>
        </p>
        <ul className="list-disc space-y-1 ps-5 text-sm">
          <li>
            <T>Each guess must be a valid 5-letter word.</T>
          </li>
          <li>
            <T>
              The color of the tiles will change to show how close your guess
              was to the word.
            </T>
          </li>
        </ul>
        <div className="space-y-3">
          <p className="text-sm font-semibold">
            <T>Examples</T>
          </p>
          <ExampleRow
            word={examples[0].word}
            highlightIndex={examples[0].index}
            highlightColor={HIGHLIGHT_COLORS[0]}
            explanation={t("{letter} is in the word and in the correct spot.", {
              letter: examples[0].letter,
            })}
          />
          <ExampleRow
            word={examples[1].word}
            highlightIndex={examples[1].index}
            highlightColor={HIGHLIGHT_COLORS[1]}
            explanation={t("{letter} is in the word but in the wrong spot.", {
              letter: examples[1].letter,
            })}
          />
          <ExampleRow
            word={examples[2].word}
            highlightIndex={examples[2].index}
            highlightColor={HIGHLIGHT_COLORS[2]}
            explanation={t("{letter} is not in the word in any spot.", {
              letter: examples[2].letter,
            })}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
