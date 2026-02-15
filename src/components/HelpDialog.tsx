"use client";

import { T, useGT } from "gt-next";
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
      <div className="flex gap-1">
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
      <p className="text-sm text-muted-foreground">{explanation}</p>
    </div>
  );
}

export default function HelpDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useGT();

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
        <ul className="list-disc space-y-1 pl-5 text-sm">
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
            word="WORDY"
            highlightIndex={0}
            highlightColor="bg-chart-2 border-chart-2"
            explanation={t("W is in the word and in the correct spot.")}
          />
          <ExampleRow
            word="LIGHT"
            highlightIndex={1}
            highlightColor="bg-primary border-primary"
            explanation={t("I is in the word but in the wrong spot.")}
          />
          <ExampleRow
            word="ROGUE"
            highlightIndex={3}
            highlightColor="bg-muted-foreground border-muted-foreground"
            explanation={t("U is not in the word in any spot.")}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
