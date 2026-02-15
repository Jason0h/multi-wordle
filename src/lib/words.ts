const DICTIONARY = new Set(["APPLE", "CREAM", "HAPPY", "MAPLE"]);

export function getRandomWord(): string[] {
  const words = [...DICTIONARY];
  const word = words[Math.floor(Math.random() * words.length)];
  return word.split("");
}

export function isValidWord(guess: string[]): boolean {
  return DICTIONARY.has(guess.join(""));
}
