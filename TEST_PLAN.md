# Bloomin' Phase 1 Test Plan

## Scope

Verify the hostname-aware Vite/React sites for:

- `bloom.giving`
- `bloomin.institute`
- `bloomin.foundation`
- `bloom.gdn`

## Local Verification

1. Install dependencies with `npm install`.
2. Run protocol unit tests with `npm test`.
3. Run the production build with `npm run build`.
4. Run the Playwright smoke suite with `npm run test:smoke:hosts`.
5. Review the app at desktop and mobile widths.
6. For each hostname, confirm the domain role, hero CTA, Eden, Shared Bloom
   Constitution, Bloom Cycle, ecosystem links, and reduced visual clutter.

## Automated Coverage

The Node unit suite covers:

- The Eden ladder order: Soil -> Seed -> Shoot -> Root -> Stalk -> Leaf -> Bud
  -> Petal -> Bloom.
- Valid `RETURN_SEED_V1` parsing.
- Missing marker rejection.
- Unsupported stage rejection.
- Seed prompt sovereignty language.
- Next-prompt carry-forward.
- Branch invitation "well come" language.
- Server-side SeedKind return validation.
- Consent and contact-permission guardrails.
- Before/after rating normalization.
- OpenRouter JSON parsing and prompt message shape.
- Database-ready seed-return record construction.

The Playwright smoke suite covers:

- All accepted Railway/custom hostnames return HTTP 200 from preview.
- Each primary domain renders its hostname-specific identity.
- The hero section and animated SVG are present.
- Eden renders the Plant a Seed path.
- Eden renders the full growth ladder.
- Eden exposes the copyable SeedKind prompt.
- Eden blocks return-seed tending without consent.
- Eden posts a consented returned seed to the API.
- Eden accepts a stored returned seed response, bloom guidance, and next prompt.
- Eden renders a branch invitation with welcome language.
- The Bloom Cycle section includes Truth, Stewardship, and Bloom.
- The Shared Bloom Constitution includes dignity, stewardship, technology as root
  system, and Bloomin' as practice.
- Desktop and mobile viewports avoid horizontal overflow.

## Deployment Verification

1. Confirm GitHub contains the Phase 1 branch and `railway.json`.
2. Confirm Railway builds with `npm run build`.
3. Confirm Railway starts with `npm start`.
4. Confirm the app service has `DATABASE_URL` and `OPENROUTER_API_KEY` set.
5. Confirm all four custom domains remain attached to the Railway service.
6. Verify DNS records at Cloudflare still match Railway's domain instructions.
7. Probe `/api/health` and confirm Eden storage and OpenRouter are configured.
8. Submit one consented live `RETURN_SEED_V1` probe and confirm the response is
   stored and includes bloom guidance plus the next prompt.
9. Probe each public domain over HTTPS and verify the expected hostname-aware
   title, hero, cycle, and constitution render.

## Acceptance Criteria

- `npm run build` exits successfully.
- `npm test` exits successfully.
- `npm run test:smoke:hosts` exits successfully.
- Each custom domain can render its own role in the shared ecosystem.
- A visitor can copy a SeedKind prompt, return a seed with consent, store it in
  Eden, receive bloom guidance, and copy a coherent next prompt.
- A first-time visitor can understand that the sites are about human
  flourishing, belonging, contribution, and stewardship before technology.
- The experience remains clean, responsive, keyboard-accessible, and lightweight.

## Manual Eden Review

- The return form must be honest that validation starts locally and transmission
  starts only after consent.
- Prompt language must respect buried dreams and weathered strengths without
  romanticizing harm.
- Giving language must invite generosity without depletion.
- Branch invitations must feel like welcome rather than recruitment.
