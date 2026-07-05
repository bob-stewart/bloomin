# Bloomin' Phase 1 Test Plan

## Scope

Verify the hostname-aware Vite/React sites for:

- `bloom.giving`
- `bloomin.institute`
- `bloomin.foundation`
- `bloom.gdn`

## Local Verification

1. Install dependencies with `npm install`.
2. Run the production build with `npm run build`.
3. Run the Playwright smoke suite with `npm run test:smoke:hosts`.
4. Review the app at desktop and mobile widths.
5. For each hostname, confirm the domain role, hero CTA, Shared Bloom
   Constitution, Bloom Cycle, ecosystem links, and reduced visual clutter.

## Automated Coverage

The Playwright smoke suite covers:

- All accepted Railway/custom hostnames return HTTP 200 from preview.
- Each primary domain renders its hostname-specific identity.
- The hero section and animated SVG are present.
- The Bloom Cycle section includes Truth, Stewardship, and Bloom.
- The Shared Bloom Constitution includes dignity, stewardship, technology as root
  system, and Bloomin' as practice.
- Desktop and mobile viewports avoid horizontal overflow.

## Deployment Verification

1. Confirm GitHub contains the Phase 1 branch and `railway.json`.
2. Confirm Railway builds with `npm run build`.
3. Confirm Railway starts with `npm start`.
4. Confirm all four custom domains remain attached to the Railway service.
5. Verify DNS records at Cloudflare still match Railway's domain instructions.
6. Probe each public domain over HTTPS and verify the expected hostname-aware
   title, hero, cycle, and constitution render.

## Acceptance Criteria

- `npm run build` exits successfully.
- `npm run test:smoke:hosts` exits successfully.
- Each custom domain can render its own role in the shared ecosystem.
- A first-time visitor can understand that the sites are about human
  flourishing, belonging, contribution, and stewardship before technology.
- The experience remains clean, responsive, keyboard-accessible, and lightweight.
