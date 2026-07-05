import { expect, test } from '@playwright/test';

const hostCases = [
  {
    host: 'bloomin.institute',
    title: "The Bloomin' Institute",
    cta: 'Explore the Protocol',
    role: 'Research / protocols / AI-IRB / AI-SDLC / DOE',
    theme: 'institute'
  },
  {
    host: 'bloomin.foundation',
    title: "The Bloomin' Foundation",
    cta: 'Steward the Garden',
    role: 'Stewardship / grants / Honor Good / public benefit',
    theme: 'foundation'
  },
  {
    host: 'bloom.giving',
    title: 'Bloom Giving',
    cta: 'Honor Good',
    role: 'Philosophy / public invitation',
    theme: 'giving'
  },
  {
    host: 'bloom.gdn',
    title: 'Bloom Garden',
    cta: 'Enter the Garden',
    role: 'Garden metaphor / visual ecosystem / living symbolic home',
    theme: 'garden'
  }
];

const allowedHosts = [
  'bloomin-production.up.railway.app',
  ...hostCases.flatMap((site) => [site.host, `www.${site.host}`])
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
  test(`${site.host} renders hostname-specific embodied vision`, async ({ page }) => {
    await page.goto(`http://${site.host}:4173/`);

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Root to Bloom circulation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: site.title, level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: site.cta, exact: true })).toBeVisible();
    await expect(page.locator('.site')).toHaveClass(new RegExp(`site-${site.theme}`));
    await expect(page.getByText(site.role, { exact: true }).first()).toBeVisible();

    const cycle = page.locator('#bloom-cycle');
    await expect(cycle).toBeVisible();
    await expect(cycle).toContainText('Truth');
    await expect(cycle).toContainText('Stewardship');
    await expect(cycle).toContainText('Bloom');

    const constitution = page.locator('#constitution');
    await expect(constitution).toBeVisible();
    await expect(constitution).toContainText('Intrinsic human dignity');
    await expect(constitution).toContainText('Stewardship over extraction');
    await expect(constitution).toContainText('Technology as root system');
    await expect(constitution).toContainText("Bloomin' as practice");

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
}
