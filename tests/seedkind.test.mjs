import test from 'node:test';
import assert from 'node:assert/strict';
import {
  composeBranchInvitation,
  composeNextPrompt,
  composeSeedPrompt,
  growthStages,
  parseReturnSeed
} from '../src/seedkind.mjs';

const validSeed = `RETURN_SEED_V1
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

test('growthStages preserves the Eden ladder', () => {
  assert.deepEqual(growthStages, [
    'Soil',
    'Seed',
    'Shoot',
    'Root',
    'Stalk',
    'Leaf',
    'Bud',
    'Petal',
    'Bloom'
  ]);
});

test('parseReturnSeed accepts a complete returned seed', () => {
  const result = parseReturnSeed(validSeed);

  assert.equal(result.ok, true);
  assert.equal(result.seed.stage, 'Soil');
  assert.equal(result.seed.nextStage, 'Seed');
  assert.equal(result.seed.fields.living_seed, 'I still hear melodies.');
});

test('parseReturnSeed rejects missing consent-format markers', () => {
  const result = parseReturnSeed('stage: Soil');

  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /RETURN_SEED_V1/);
});

test('parseReturnSeed rejects unsupported stage names', () => {
  const result = parseReturnSeed(validSeed.replace('stage: Soil', 'stage: Stone'));

  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /stage/);
});

test('composeSeedPrompt includes the selected stage and sovereignty language', () => {
  const prompt = composeSeedPrompt({ stage: 'Root', petal: 'Faith' });

  assert.match(prompt, /This conversation belongs to me/);
  assert.match(prompt, /Begin at Root/);
  assert.match(prompt, /Faith/);
});

test('composeNextPrompt advances stage and carries living seed language', () => {
  const parsed = parseReturnSeed(validSeed);
  const prompt = composeNextPrompt(parsed.seed);

  assert.match(prompt, /Begin at Seed/);
  assert.match(prompt, /I still hear melodies/);
  assert.match(prompt, /root boundary/i);
});

test('composeBranchInvitation produces well-come language', () => {
  const invite = composeBranchInvitation({ petal: 'Family', stage: 'Leaf' });

  assert.match(invite, /well come/i);
  assert.match(invite, /Family/);
  assert.match(invite, /Leaf/);
});
