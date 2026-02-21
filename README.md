<img width="563" height="656" alt="image" src="https://github.com/user-attachments/assets/6059d5da-189a-4b9a-ad45-006376aa27c1" />

## Development Guide

### Setup

```bash
pnpm install
```

Copy `.env.example` to `.env.local` and fill in your values:

```
SESSION_PASSWORD=your-secret-key-at-least-32-characters-long  # openssl rand -base64 32
GT_PROJECT_ID=prj_...
GT_API_KEY=gtx-dev-...  # dev key from dash.generaltranslation.com
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
curl -L "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/es/es_full.txt" -o data/raw/es_full.txt
```

Then run the extraction script:

```bash
node scripts/extract-words.mjs
```

This outputs `data/{lang}-answers.json` (1,000 most frequent words) and `data/{lang}-valid.json` (10,000 most frequent words) for each language.

### Translations

UI strings are managed by [gt-next](https://www.generaltranslation.com). The compiled translation files (`public/_gt/*.json`) are committed to the repo, so **no translation step is needed for normal development**.

If you add or change translatable strings (`<T>`, `useGT()`), regenerate the translation files:

```bash
npx gtx-cli translate   # uses GT_API_KEY + GT_PROJECT_ID from .env.local
```

**For production deploys**, use a production key (`gtx-api-...`) in your CI/CD environment. The build script already runs `gtx-cli translate` before `next build`:

```json
"build": "npx gtx-cli translate && next build"
```

### Dev utilities

- **Reset session**: visit [/api/dev/reset](http://localhost:3000/api/dev/reset) to clear your session cookie and start fresh (dev only).
