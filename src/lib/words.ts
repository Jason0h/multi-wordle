import { stripAccents } from "./normalize";
import enAnswers from "../../data/en-answers.json";
import enValid from "../../data/en-valid.json";
import ruAnswers from "../../data/ru-answers.json";
import ruValid from "../../data/ru-valid.json";
import heAnswers from "../../data/he-answers.json";
import heValid from "../../data/he-valid.json";
import esAnswers from "../../data/es-answers.json";
import esValid from "../../data/es-valid.json";

const ANSWERS: Record<string, string[]> = {
  en: enAnswers.map((w) => w.toUpperCase()),
  ru: ruAnswers.map((w) => w.toUpperCase()),
  he: heAnswers,
  es: esAnswers.map((w) => w.toUpperCase()),
};

const VALID: Record<string, Set<string>> = {
  en: new Set(enValid.map((w) => w.toUpperCase())),
  ru: new Set(ruValid.map((w) => w.toUpperCase())),
  he: new Set(heValid),
  es: new Set(esValid.map((w) => w.toUpperCase())),
};

// For Spanish: normalized set so unaccented guesses match accented words
const VALID_NORMALIZED: Record<string, Set<string>> = {
  es: new Set(esValid.map((w) => stripAccents(w.toUpperCase()))),
};

export function getRandomWord(locale: string = "en"): string[] {
  const answers = ANSWERS[locale] ?? ANSWERS.en;
  const word = answers[Math.floor(Math.random() * answers.length)];
  return word.split("");
}

export function isValidWord(guess: string[], locale: string = "en"): boolean {
  const normalized = VALID_NORMALIZED[locale];
  if (normalized) {
    return normalized.has(stripAccents(guess.join("")));
  }
  const valid = VALID[locale] ?? VALID.en;
  return valid.has(guess.join(""));
}
