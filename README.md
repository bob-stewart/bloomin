# Bloomin' Sites

A clean, responsive Vite/React launch bundle for the four secured domains:

- bloomin.institute
- bloomin.foundation
- bloom.giving
- bloom.gdn

## Local

```bash
npm install
npm run dev
```

## Railway

1. Push this folder to a GitHub repo.
2. In Railway: New Project → Deploy from GitHub Repo.
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add custom domains in Railway for each secured domain.
6. Point DNS as Railway instructs.

The app detects hostname and adapts copy/theme per domain.
