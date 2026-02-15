import answers from "../../data/en-answers.json";
import valid from "../../data/en-valid.json";

const ANSWERS = answers.map((w) => w.toUpperCase());
const VALID = new Set(valid.map((w) => w.toUpperCase()));

export function getRandomWord(): string[] {
  const word = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
  return word.split("");
}

export function isValidWord(guess: string[]): boolean {
  return VALID.has(guess.join(""));
}
