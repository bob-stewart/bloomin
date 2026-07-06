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

const validReturnSeed = `RETURN_SEED_V1
stage: Soil
petal: Whole Garden
within: A buried dream still has warmth.
between: Family duty shaped the soil.
beyond: I want this to give shade.
buried_dream: Writing music in public.
survival_wisdom: I set it aside to keep a stable home.
living_seed: I still hear melodies.
weathered_strength: Endurance and listening.
shade_to_give: Encouragement for others who buried art.
root_boundary: One evening a week protected for practice.
practice: Hum for five minutes after dinner.
next_prompt_request: Help me move from Soil to Seed.
END_RETURN_SEED_V1`;

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
    await page.route('**/api/seed-return', async (route) => {
      const payload = route.request().postDataJSON();

      expect(payload.sourceDomain).toBe(site.host);
      expect(payload.consentToReturn).toBe(true);
      expect(payload.returnSeedText).toContain('RETURN_SEED_V1');

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          id: '11111111-2222-4333-8444-555555555555',
          stored: true,
          seed: {
            stage: 'Soil',
            nextStage: 'Seed',
            petal: 'Whole Garden',
            reflectiveFieldCount: 9
          },
          nextPrompt: 'You are SeedKind. Begin at Seed and carry the living seed forward.',
          bloom: {
            source: 'openrouter',
            message: 'The living seed is still warm.',
            practice: 'Hum for five minutes after dinner.',
            question: 'What small sound wants daylight?'
          }
        })
      });
    });

    await page.goto(`http://${site.host}:4173/`);

    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.getByRole('img', { name: 'Root to Bloom circulation' })).toBeVisible();
    await expect(page.getByRole('heading', { name: site.title, level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: site.cta, exact: true })).toBeVisible();
    await expect(page.locator('.site')).toHaveClass(new RegExp(`site-${site.theme}`));
    await expect(page.getByText(site.role, { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Plant a Seed', exact: true }).first()).toBeVisible();

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

    const eden = page.locator('#eden');
    await expect(eden).toBeVisible();
    for (const stage of ['Soil', 'Seed', 'Shoot', 'Root', 'Stalk', 'Leaf', 'Bud', 'Petal', 'Bloom']) {
      await expect(eden.locator('.ladder')).toContainText(stage);
    }
    await expect(eden.getByRole('button', { name: 'Begin at Soil', exact: true })).toBeVisible();
    await expect(eden.getByRole('button', { name: 'Copy Seed Prompt', exact: true })).toBeVisible();
    await expect(eden).toContainText('well come');

    await eden.getByRole('button', { name: 'Tend Returned Seed', exact: true }).click();
    await expect(eden).toContainText('Consent is required');

    await eden.getByLabel('Returned seed text').fill(validReturnSeed);
    await eden
      .getByLabel('I choose to return this seed to Eden on this page for tending and learning.')
      .check();
    await eden.getByRole('button', { name: 'Tend Returned Seed', exact: true }).click();
    await expect(eden).toContainText('Seed returned to Eden');
    await expect(eden).toContainText('Next prompt: Seed');
    await expect(eden).toContainText('The living seed is still warm');
    await expect(eden).toContainText('Stored seed: 11111111');
    await expect(eden.getByRole('button', { name: 'Copy Next Prompt', exact: true })).toBeVisible();

    const horizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(horizontalOverflow).toBeLessThanOrEqual(1);
  });
}
