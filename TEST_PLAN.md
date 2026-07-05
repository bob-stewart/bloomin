# Bloomin' Launch Test Plan

## Scope

Verify the hostname-aware Vite/React launch site for:

- `bloomin.institute`
- `bloomin.foundation`
- `bloom.giving`
- `bloom.gdn`

## Local Verification

1. Install dependencies with `npm install`.
2. Run the production build with `npm run build`.
3. Run the production preview with `npm start`.
4. Open the preview in desktop and mobile widths.
5. For each launch hostname, verify that the rendered hero copy, CTA, and theme match the configured domain entry.

## Deployment Verification

1. Confirm GitHub `main` contains the launch bundle and `railway.json`.
2. Confirm Railway builds with `npm run build`.
3. Confirm Railway starts with `npm start`.
4. Add all four custom domains to the Railway service.
5. Verify DNS records at Cloudflare match Railway's domain instructions.
6. Probe each public domain over HTTPS and verify the expected hostname-aware title is present.

## Acceptance Criteria

- `npm run build` exits successfully.
- GitHub Actions build check passes on `main`.
- Railway deployment reaches `SUCCESS`.
- Each custom domain returns HTTP 200 over HTTPS.
- Each custom domain renders its own hostname-specific content.
