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

### Dev utilities

- **Reset session**: visit [/api/dev/reset](http://localhost:3000/api/dev/reset) to clear your session cookie and start fresh (dev only).
