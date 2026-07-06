# Bloomin' Sites

A clean, responsive Vite/React launch bundle for the secured Bloomin' domains.
The app detects the request hostname and renders a distinct doorway into one
shared ecosystem.

- `bloom.giving` - philosophy and public invitation
- `bloomin.institute` - research, protocols, AI-IRB, AI-SDLC, and DOE
- `bloomin.foundation` - stewardship, grants, Honor Good, and public benefit
- `bloom.gdn` - garden metaphor, visual ecosystem, and symbolic home

## Phase 1: Embodied Presence

Phase 1 evolves the launch bundle from a deployment seed into a calmer living
site system. The implementation stays lightweight and Railway-friendly:

- Host-aware content is configured in `src/main.jsx`.
- The Shared Bloom Constitution section introduces the constitutional ethos.
- The Bloom Cycle section renders the full ecosystem loop:
  Truth -> Trust -> Belonging -> Curiosity -> Exploration -> Competence ->
  Contribution -> Merit -> Stewardship -> Bloom.
- The SVG hero expresses Root -> Ground -> Flow -> Shine -> Love -> Say -> See
  -> Know with lightweight CSS motion and reduced-motion support.
- No auth, CMS, dashboards, or heavy animation dependencies are added.

## Eden: SeedKind Protocol

Eden adds the first living ritual to the sites. Visitors can click
`Plant a Seed`, copy a SeedKind prompt, run it in their own ChatGPT, and paste
back a plain-text `RETURN_SEED_V1` block only if they choose.

The SeedKind ladder is:

```text
Soil -> Seed -> Shoot -> Root -> Stalk -> Leaf -> Bud -> Petal -> Bloom
```

The first implementation is copy/paste-first and sovereign by design:

- Prompt reflection happens in the visitor's own ChatGPT.
- Returned seeds are validated locally before any server request.
- Nothing leaves the browser until the visitor checks the return-consent box.
- Consented returned seeds are stored in Railway Postgres through `/api/seed-return`.
- OpenRouter composes a gentle bloom response; Eden falls back to the local next
  prompt if model guidance is unavailable.
- Branch invitations are copyable and framed as welcome, not recruitment.

## Eden API

`npm start` runs a small Node server that serves the Vite build and the Eden API:

- `GET /api/health` reports whether Eden storage and OpenRouter are configured.
- `POST /api/seed-return` validates consent and `RETURN_SEED_V1`, stores the
  seed return, and responds with a bloom message plus the next stacking prompt.

Production environment variables:

- `DATABASE_URL` - Railway Postgres connection string, usually referenced from
  the Postgres service.
- `OPENROUTER_API_KEY` - OpenRouter key for bloom guidance.
- `OPENROUTER_MODEL` - optional, defaults to `~openai/gpt-latest`.
- `OPENROUTER_SITE_URL` - optional app attribution URL, defaults to
  `https://bloomin.institute`.

## Local

```bash
npm install
npm run dev
```

## Verification

```bash
npm test
npm run build
npm run test:smoke:hosts
```

The unit suite verifies the SeedKind protocol parser and prompt composers. The
Playwright smoke suite verifies all accepted hostnames, each domain's identity
and CTA, the hero SVG, Eden, the Bloom Cycle, the Shared Bloom Constitution, and
desktop/mobile overflow guardrails.

## Railway

1. Push this folder to the GitHub repo.
2. In Railway: New Project -> Deploy from GitHub Repo.
3. Build command: `npm run build`
4. Start command: `npm start`
5. Add `DATABASE_URL` from the Railway Postgres service to the app service.
6. Add `OPENROUTER_API_KEY` to the app service.
7. Add custom domains in Railway for each secured domain.
8. Point DNS in Cloudflare as Railway instructs.

The Railway path remains unchanged at the command level: build with
`npm run build`, start with `npm start`, and serve the same hostname-aware
bundle for all four domains.
