import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildFallbackBloom,
  buildOpenRouterMessages,
  createSeedReturnRecord,
  normalizeRating,
  parseOpenRouterBloom,
  requestOpenRouterBloom,
  validateSeedReturnPayload
} from '../server/seedkind-api.mjs';

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

test('normalizeRating accepts blanks and bounded integers', () => {
  assert.equal(normalizeRating(''), null);
  assert.equal(normalizeRating(undefined), null);
  assert.equal(normalizeRating('3'), 3);
  assert.equal(normalizeRating(5), 5);
  assert.throws(() => normalizeRating('6'), /between 1 and 5/);
  assert.throws(() => normalizeRating('steady'), /between 1 and 5/);
});

test('validateSeedReturnPayload requires explicit return consent', () => {
  const result = validateSeedReturnPayload({
    sourceDomain: 'bloomin.institute',
    returnSeedText: validReturnSeed,
    consentToReturn: false
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /consent/i);
});

test('validateSeedReturnPayload accepts a complete sovereign seed return', () => {
  const result = validateSeedReturnPayload({
    sourceDomain: 'bloomin.institute',
    returnSeedText: validReturnSeed,
    consentToReturn: true,
    permissionToContact: true,
    name: 'Ada',
    email: 'ada@example.com',
    feelingBefore: '2',
    feelingAfter: 4,
    efficacyNote: 'It helped me name the buried dream.'
  });

  assert.equal(result.ok, true);
  assert.equal(result.value.seed.stage, 'Soil');
  assert.equal(result.value.seed.nextStage, 'Seed');
  assert.equal(result.value.permissionToContact, true);
  assert.equal(result.value.feelingBefore, 2);
  assert.equal(result.value.feelingAfter, 4);
});

test('validateSeedReturnPayload requires email when contact permission is granted', () => {
  const result = validateSeedReturnPayload({
    sourceDomain: 'bloomin.institute',
    returnSeedText: validReturnSeed,
    consentToReturn: true,
    permissionToContact: true
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.join(' '), /email/i);
});

test('parseOpenRouterBloom extracts strict or fenced JSON', () => {
  const parsed = parseOpenRouterBloom(`\`\`\`json
{
  "message": "This seed is still warm.",
  "practice": "Hum for five minutes after dinner.",
  "question": "What small sound wants daylight?"
}
\`\`\``);

  assert.deepEqual(parsed, {
    message: 'This seed is still warm.',
    practice: 'Hum for five minutes after dinner.',
    question: 'What small sound wants daylight?'
  });
});

test('buildOpenRouterMessages keeps the model prompt consentful and bounded', () => {
  const validated = validateSeedReturnPayload({
    sourceDomain: 'bloom.giving',
    returnSeedText: validReturnSeed,
    consentToReturn: true
  });

  const messages = buildOpenRouterMessages({
    seed: validated.value.seed,
    nextPrompt: 'Carry this forward gently.',
    survey: validated.value
  });

  assert.equal(messages.length, 2);
  assert.match(messages[0].content, /Do not diagnose/);
  assert.match(messages[0].content, /Return only JSON/);
  assert.match(messages[1].content, /bloom.giving/);
  assert.match(messages[1].content, /I still hear melodies/);
});

test('createSeedReturnRecord stores parsed fields without exposing secrets', () => {
  const validated = validateSeedReturnPayload({
    sourceDomain: 'bloomin.foundation',
    returnSeedText: validReturnSeed,
    consentToReturn: true,
    name: 'Ada',
    email: 'ada@example.com'
  });
  const fallback = buildFallbackBloom({
    seed: validated.value.seed,
    nextPrompt: 'Next prompt text'
  });
  const record = createSeedReturnRecord({
    id: 'seed-id',
    value: validated.value,
    bloom: fallback,
    model: 'local-fallback'
  });

  assert.equal(record.id, 'seed-id');
  assert.equal(record.sourceDomain, 'bloomin.foundation');
  assert.equal(record.parsedFields.living_seed, 'I still hear melodies.');
  assert.equal(record.bloomResponse.source, 'fallback');
  assert.equal(record.openrouterModel, 'local-fallback');
});

test('requestOpenRouterBloom calls the chat completion API with attribution headers', async () => {
  const validated = validateSeedReturnPayload({
    sourceDomain: 'bloom.gdn',
    returnSeedText: validReturnSeed,
    consentToReturn: true
  });
  let capturedRequest;

  const response = await requestOpenRouterBloom({
    apiKey: 'test-key',
    model: 'test/model',
    siteUrl: 'https://bloom.gdn',
    seed: validated.value.seed,
    nextPrompt: 'Next prompt text',
    survey: validated.value,
    fetchImpl: async (url, options) => {
      capturedRequest = { url, options };

      return {
        ok: true,
        json: async () => ({
          id: 'or-test',
          model: 'test/model',
          choices: [
            {
              message: {
                content: JSON.stringify({
                  message: 'This seed can keep opening.',
                  practice: 'Name the smallest next practice.',
                  question: 'What would protect the root?'
                })
              }
            }
          ],
          usage: { prompt_tokens: 12, completion_tokens: 18 }
        })
      };
    }
  });

  assert.equal(capturedRequest.url, 'https://openrouter.ai/api/v1/chat/completions');
  assert.equal(capturedRequest.options.headers.Authorization, 'Bearer test-key');
  assert.equal(capturedRequest.options.headers['HTTP-Referer'], 'https://bloom.gdn');
  assert.equal(capturedRequest.options.headers['X-OpenRouter-Title'], 'Bloomin SeedKind Eden');
  assert.equal(JSON.parse(capturedRequest.options.body).model, 'test/model');
  assert.equal(response.bloom.source, 'openrouter');
  assert.equal(response.bloom.message, 'This seed can keep opening.');
  assert.equal(response.model, 'test/model');
});
