import { expect, test } from '@playwright/test';

const hostCases = [
  {
    host: 'bloomin.institute',
    title: "The Bloomin' Institute",
    cta: 'Explore the Protocol',
    theme: 'institute'
  },
  {
    host: 'bloomin.foundation',
    title: "The Bloomin' Foundation",
    cta: 'Steward the Garden',
    theme: 'foundation'
  },
  {
    host: 'bloom.giving',
    title: 'Bloom Giving',
    cta: 'Honor Good',
    theme: 'giving'
  },
  {
    host: 'bloom.gdn',
    title: 'Bloom Garden',
    cta: 'Enter the Garden',
    theme: 'garden'
  }
];

const allowedHosts = [
  'bloomin-production.up.railway.app',
  ...hostCases.map((site) => site.host)
];

for (const host of allowedHosts) {
  test(`${host} is accepted by the preview server`, async ({ request }) => {
    const response = await request.get('http://127.0.0.1:4173/', {
      headers: { Host: host }
    });

    expect(response.status()).toBe(200);
  });
}

for (const site of hostCases) {
  test(`${site.host} renders hostname-specific launch copy`, async ({ page }) => {
    await page.goto(`http://${site.host}:4173/`);

    await expect(page.getByRole('heading', { name: site.title, level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: new RegExp(site.cta) })).toBeVisible();
    await expect(page.locator('.site')).toHaveClass(new RegExp(site.theme));

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
}
