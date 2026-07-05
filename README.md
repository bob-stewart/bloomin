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
site system. The implementation stays frontend-only and Railway-friendly:

- Host-aware content is configured in `src/main.jsx`.
- The Shared Bloom Constitution section introduces the constitutional ethos.
- The Bloom Cycle section renders the full ecosystem loop:
  Truth -> Trust -> Belonging -> Curiosity -> Exploration -> Competence ->
  Contribution -> Merit -> Stewardship -> Bloom.
- The SVG hero expresses Root -> Ground -> Flow -> Shine -> Love -> Say -> See
  -> Know with lightweight CSS motion and reduced-motion support.
- No backend, auth, CMS, dashboards, or heavy animation dependencies are added.

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
- Nothing is sent across the network by the Eden return form.
- Returned seeds are validated locally on the page.
- Eden composes the next stacking prompt from the returned seed.
- Branch invitations are copyable and framed as welcome, not recruitment.

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
5. Add custom domains in Railway for each secured domain.
6. Point DNS in Cloudflare as Railway instructs.

The Railway path remains unchanged: build with Vite, start with
`vite preview`, and serve the same hostname-aware bundle for all four domains.
