import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const LANGUAGES = [
  {
    code: "en",
    input: "data/raw/en_full.txt",
    regex: /^[a-z]{5}$/,
  },
  {
    code: "ru",
    input: "data/raw/ru_full.txt",
    // Base Cyrillic alphabet only, no ё variant mixing — normalize ё→е
    regex: /^[а-яё]{5}$/,
    normalize: (w) => w.replace(/ё/g, "е"),
  },
  {
    code: "he",
    input: "data/raw/he_full.txt",
    // Base Hebrew letters only (\u05D0–\u05EA), no nikud/diacritics
    regex: /^[\u05D0-\u05EA]{5}$/,
  },
];

const ANSWERS_SIZE = 1000;
const VALID_SIZE = 10000;

mkdirSync(join(root, "data"), { recursive: true });

for (const lang of LANGUAGES) {
  const raw = readFileSync(join(root, lang.input), "utf8");

  const words = raw
    .split("\n")
    .map((line) => line.split(" ")[0].toLowerCase().trim())
    .filter((w) => lang.regex.test(w))
    .map((w) => (lang.normalize ? lang.normalize(w) : w))
    .filter((w, i, arr) => arr.indexOf(w) === i); // deduplicate, preserve frequency order

  const answers = words.slice(0, ANSWERS_SIZE);
  const valid = words.slice(0, VALID_SIZE);

  writeFileSync(
    join(root, `data/${lang.code}-answers.json`),
    JSON.stringify(answers),
  );
  writeFileSync(
    join(root, `data/${lang.code}-valid.json`),
    JSON.stringify(valid),
  );

  console.log(
    `${lang.code}: ${words.length} total 5-letter words → ${answers.length} answers, ${valid.length} valid`,
  );
}
