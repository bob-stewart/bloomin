import {
  composeBranchInvitation,
  composeNextPrompt,
  parseReturnSeed,
  stageDetails
} from '../src/seedkind.mjs';

const MAX_SEED_TEXT_LENGTH = 24_000;
const MAX_SHORT_TEXT_LENGTH = 254;
const MAX_LONG_TEXT_LENGTH = 1_500;
const DEFAULT_MODEL = '~openai/gpt-latest';
const DEFAULT_REFERER = 'https://bloomin.institute';
const APP_TITLE = 'Bloomin SeedKind Eden';

function trimText(value, maxLength) {
  const text = String(value || '').trim();
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

function asBoolean(value) {
  return value === true || value === 'true' || value === 'on' || value === 1 || value === '1';
}

export function normalizeRating(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  const rating = Number(value);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Rating must be an integer between 1 and 5.');
  }

  return rating;
}

function validateEmail(email) {
  if (!email) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateSeedReturnPayload(payload) {
  const errors = [];

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return {
      ok: false,
      errors: ['Seed return payload must be a JSON object.']
    };
  }

  const consentToReturn = asBoolean(payload.consentToReturn);

  if (!consentToReturn) {
    errors.push('Explicit consent is required before Eden can tend a returned seed.');
  }

  const sourceDomain = trimText(payload.sourceDomain || 'unknown', 120) || 'unknown';
  const name = trimText(payload.name, 120);
  const email = trimText(payload.email, MAX_SHORT_TEXT_LENGTH).toLowerCase();
  const permissionToContact = asBoolean(payload.permissionToContact);
  const efficacyNote = trimText(payload.efficacyNote, MAX_LONG_TEXT_LENGTH);
  const returnSeedText = String(payload.returnSeedText || '').trim();

  if (!returnSeedText) {
    errors.push('Returned seed label is required.');
  }

  if (returnSeedText.length > MAX_SEED_TEXT_LENGTH) {
    errors.push(`Returned seed label must be ${MAX_SEED_TEXT_LENGTH} characters or fewer.`);
  }

  if (!validateEmail(email)) {
    errors.push('Email must be valid if provided.');
  }

  if (permissionToContact && !email) {
    errors.push('Email is required when contact permission is granted.');
  }

  let feelingBefore = null;
  let feelingAfter = null;

  try {
    feelingBefore = normalizeRating(payload.feelingBefore);
  } catch (error) {
    errors.push(`Before feeling ${error.message.toLowerCase()}`);
  }

  try {
    feelingAfter = normalizeRating(payload.feelingAfter);
  } catch (error) {
    errors.push(`After feeling ${error.message.toLowerCase()}`);
  }

  const parsed = parseReturnSeed(returnSeedText);

  if (!parsed.ok) {
    errors.push(...parsed.errors);
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    errors: [],
    value: {
      sourceDomain,
      returnSeedText,
      consentToReturn,
      permissionToContact,
      name,
      email,
      feelingBefore,
      feelingAfter,
      efficacyNote,
      seed: parsed.seed
    }
  };
}

export function buildFallbackBloom({ seed, nextPrompt }) {
  const fields = seed?.fields || {};
  const detail = stageDetails[seed?.nextStage] || stageDetails[seed?.stage] || stageDetails.Soil;
  const practice = fields.practice || 'Choose one small act that protects the roots and lets life move.';
  const question =
    fields.next_prompt_request ||
    detail?.inquiry ||
    'What is the next honest sign of life asking for?';
  const messageParts = [
    fields.living_seed ? `The living seed is still present: ${fields.living_seed}` : '',
    fields.weathered_strength ? `The weathered strength is not a flaw: ${fields.weathered_strength}` : '',
    fields.shade_to_give ? `The shade to give is already named: ${fields.shade_to_give}` : ''
  ].filter(Boolean);

  return {
    source: 'fallback',
    message:
      messageParts.join(' ') ||
      'This returned seed has enough structure to keep unfolding without forcing the bloom.',
    practice,
    question,
    nextPrompt,
    branchInvitation: composeBranchInvitation({
      petal: seed?.petal,
      stage: seed?.stage
    })
  };
}

export function buildOpenRouterMessages({ seed, nextPrompt, survey }) {
  const fields = seed?.fields || {};
  const compactFields = {
    stage: seed?.stage,
    nextStage: seed?.nextStage,
    petal: seed?.petal,
    within: fields.within,
    between: fields.between,
    beyond: fields.beyond,
    buriedDream: fields.buried_dream,
    survivalWisdom: fields.survival_wisdom,
    livingSeed: fields.living_seed,
    weatheredStrength: fields.weathered_strength,
    shadeToGive: fields.shade_to_give,
    rootBoundary: fields.root_boundary,
    practice: fields.practice,
    requestedNextPrompt: fields.next_prompt_request,
    sourceDomain: survey?.sourceDomain,
    feelingBefore: survey?.feelingBefore,
    feelingAfter: survey?.feelingAfter,
    efficacyNote: survey?.efficacyNote
  };

  return [
    {
      role: 'system',
      content: `You are SeedKind for Bloomin, a consent-first garden protocol for human flourishing.

Do not diagnose. Do not prescribe medical, legal, financial, or spiritual authority. Do not force positivity. Respect scars, weathered strengths, survival choices, buried dreams, boundaries, family systems, faith, work, and giving without depletion.

Return only JSON with these string fields: message, practice, question. Keep each field under 320 characters. Be concrete, gentle, and luminous. No markdown. No extra keys.`
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          seed: compactFields,
          nextPrompt
        },
        null,
        2
      )
    }
  ];
}

export function parseOpenRouterBloom(text) {
  const raw = String(text || '').trim();

  if (!raw) {
    return null;
  }

  const unfenced = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const candidates = [unfenced];
  const firstBrace = unfenced.indexOf('{');
  const lastBrace = unfenced.lastIndexOf('}');

  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(unfenced.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      const bloom = {
        message: trimText(parsed.message, 320),
        practice: trimText(parsed.practice, 320),
        question: trimText(parsed.question, 320)
      };

      if (bloom.message && bloom.practice && bloom.question) {
        return bloom;
      }
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

export async function requestOpenRouterBloom({
  apiKey,
  fetchImpl = globalThis.fetch,
  model = DEFAULT_MODEL,
  siteUrl = DEFAULT_REFERER,
  seed,
  nextPrompt,
  survey,
  timeoutMs = 12_000
}) {
  const fallback = buildFallbackBloom({ seed, nextPrompt });

  if (!apiKey || !fetchImpl) {
    return {
      bloom: fallback,
      model: 'local-fallback',
      openrouterMeta: {
        source: 'fallback',
        reason: 'openrouter_not_configured'
      }
    };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': siteUrl,
        'X-OpenRouter-Title': APP_TITLE
      },
      body: JSON.stringify({
        model,
        temperature: 0.45,
        messages: buildOpenRouterMessages({ seed, nextPrompt, survey })
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter returned HTTP ${response.status}.`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content || '';
    const parsedBloom = parseOpenRouterBloom(content);

    if (!parsedBloom) {
      throw new Error('OpenRouter returned unparseable bloom JSON.');
    }

    return {
      bloom: {
        ...fallback,
        ...parsedBloom,
        source: 'openrouter'
      },
      model: data?.model || model,
      openrouterMeta: {
        source: 'openrouter',
        id: data?.id || null,
        usage: data?.usage || null
      }
    };
  } catch (error) {
    return {
      bloom: fallback,
      model: 'local-fallback',
      openrouterMeta: {
        source: 'fallback',
        reason: error.name === 'AbortError' ? 'openrouter_timeout' : 'openrouter_error',
        message: error.message
      }
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function createSeedReturnRecord({ id, value, bloom, model, openrouterMeta = null }) {
  return {
    id,
    sourceDomain: value.sourceDomain,
    stage: value.seed.stage,
    petal: value.seed.petal,
    returnSeedText: value.returnSeedText,
    parsedFields: value.seed.fields,
    name: value.name || null,
    email: value.email || null,
    consentToReturn: value.consentToReturn,
    permissionToContact: value.permissionToContact,
    feelingBefore: value.feelingBefore,
    feelingAfter: value.feelingAfter,
    efficacyNote: value.efficacyNote || null,
    openrouterModel: model,
    bloomResponse: {
      ...bloom,
      openrouterMeta
    }
  };
}

export function buildSeedReturnResponse({ id, value, bloom, stored }) {
  return {
    ok: true,
    id,
    stored,
    seed: {
      stage: value.seed.stage,
      nextStage: value.seed.nextStage,
      petal: value.seed.petal,
      reflectiveFieldCount: value.seed.reflectiveFieldCount
    },
    nextPrompt: composeNextPrompt(value.seed),
    bloom
  };
}
