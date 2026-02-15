## Development Guide

### Setup

```bash
pnpm install
```

Create a `.env.local` file with a session password (must be at least 32 characters):

```
SESSION_PASSWORD=your-secret-key-at-least-32-characters-long
```

### Running

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Word list generation

The JSON word lists in `data/` are pre-generated and committed to the repo — you do not need to run this during normal development.

If you need to regenerate them (e.g. to change language coverage or answer/valid counts), first download the raw frequency files:

```bash
curl -L "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_full.txt" -o data/raw/en_full.txt
curl -L "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/ru/ru_full.txt" -o data/raw/ru_full.txt
curl -L "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/he/he_full.txt" -o data/raw/he_full.txt
```

Then run the extraction script:

```bash
node scripts/extract-words.mjs
```

This outputs `data/{lang}-answers.json` (1,000 most frequent words) and `data/{lang}-valid.json` (10,000 most frequent words) for each language.

### Dev utilities

- **Reset session**: visit [/api/dev/reset](http://localhost:3000/api/dev/reset) to clear your session cookie and start fresh (dev only).
