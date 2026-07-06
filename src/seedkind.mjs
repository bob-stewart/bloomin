export const growthStages = ['Soil', 'Seed', 'Shoot', 'Root', 'Stalk', 'Leaf', 'Bud', 'Petal', 'Bloom'];

export const petals = [
  'Whole Garden',
  'Health',
  'Wealth',
  'Faith',
  'Family',
  'Friends',
  'Work / Craft',
  'Goals',
  'Giving',
  'Belonging',
  'Stewardship'
];

export const stageDetails = {
  Soil: {
    inquiry: 'What kind of ground are you in?',
    focus: 'conditions, safety, constraints, survival, nourishment, history, and weather'
  },
  Seed: {
    inquiry: 'What still matters enough to become matter?',
    focus: 'intention, longing, buried dream, living possibility, and the thing wanting to grow'
  },
  Shoot: {
    inquiry: 'What is the smallest honest sign of life?',
    focus: 'first movement, early signal, courage, confession, and small acts of becoming'
  },
  Root: {
    inquiry: 'What can this life root into?',
    focus: 'values, faith, memory, kinship, ancestry, support, and hidden nourishment'
  },
  Stalk: {
    inquiry: 'What structure would help this keep rising?',
    focus: 'habits, commitments, containers, rhythm, practice, and upright strength'
  },
  Leaf: {
    inquiry: 'What does this growth need to receive and release?',
    focus: 'learning, sensing, breathing, listening, attention, and energy exchange'
  },
  Bud: {
    inquiry: 'What is forming that is not ready to be forced open?',
    focus: 'patience, protection, tenderness, timing, promise, and not-yet-open potential'
  },
  Petal: {
    inquiry: 'Which aspect of life is asking to open?',
    focus: 'life-domain unfolding across health, wealth, faith, family, friends, goals, and giving'
  },
  Bloom: {
    inquiry: 'What form of contribution would let this life bloom without abandoning its roots?',
    focus: 'integrated expression, contribution, stewardship, and visible life that nourishes more than itself'
  }
};

const reflectiveFields = [
  'within',
  'between',
  'beyond',
  'buried_dream',
  'living_seed',
  'weathered_strength',
  'shade_to_give',
  'root_boundary',
  'practice'
];

const returnSeedStart = 'RETURN_SEED_V1';
const returnSeedEnd = 'END_RETURN_SEED_V1';
const crisisSupportLanguage =
  'If I describe imminent harm, abuse, medical crisis, or severe distress, encourage immediate support from local emergency services, crisis resources, trusted people, or qualified professionals.';

function composeReturnSeedBlock(stage, petal) {
  return `${returnSeedStart}
stage: ${stage}
petal: ${petal}
within:
between:
beyond:
buried_dream:
survival_wisdom:
living_seed:
weathered_strength:
shade_to_give:
root_boundary:
practice:
next_prompt_request:
${returnSeedEnd}`;
}

function normalizeStage(stage) {
  const value = String(stage || '').trim().toLowerCase();
  return growthStages.find((item) => item.toLowerCase() === value) || '';
}

function normalizePetal(petal) {
  const value = String(petal || '').trim().toLowerCase();
  return petals.find((item) => item.toLowerCase() === value) || String(petal || '').trim();
}

export function getNextStage(stage) {
  const normalized = normalizeStage(stage);
  const index = growthStages.indexOf(normalized);

  if (index === -1) {
    return 'Soil';
  }

  if (normalized === 'Bloom') {
    return 'Giving / Pollination / Branch';
  }

  return growthStages[index + 1];
}

export function composeSeedPrompt({ stage = 'Soil', petal = 'Whole Garden', carry = '' } = {}) {
  const selectedStage = normalizeStage(stage) || 'Soil';
  const selectedPetal = normalizePetal(petal) || 'Whole Garden';
  const detail = stageDetails[selectedStage];
  const carryText = String(carry || '').trim();

  return `SEEDKIND SEED PACKET
For private planting in my own ChatGPT.

Packet: ${selectedPetal} / ${selectedStage}
Apothecary note: living meaning becoming matter in ways that matter.
Planting depth: one question at a time.
Water with: patience, consent, truthful naming, and enough warmth to keep going.
Do not harvest early.

You are SeedKind, a gentle garden protocol for Bloomin. Speak like a careful garden apothecary: plain, warm, practical, and a little ceremonial. Make the reflection feel like a seed packet with an honest label, not a productivity worksheet.

This conversation belongs to me. Ask one question at a time. Help me examine what is alive within, what relationships affect it, and what it may nourish beyond me.

Do not diagnose me. Do not rush me. Do not force positivity. Respect scars, weathered strengths, buried dreams, survival choices, and boundaries. Help me notice what I can give from where I am without turning giving into depletion.

Use this growth ladder:
Soil -> Seed -> Shoot -> Root -> Stalk -> Leaf -> Bud -> Petal -> Bloom

Begin at ${selectedStage}. The life petal is ${selectedPetal}. Focus on ${detail.focus}. Ask: "${detail.inquiry}"

${carryText ? `Carry this returned seed label forward gently:\n${carryText}\n` : ''}Read the packet through three garden lenses:
- Within: what is alive inside this seed?
- Between: what relationship, family, circle, system, or weather affects this soil?
- Beyond: what might this eventually nourish, shelter, teach, free, or pollinate?

Include buried dream inquiry when survival, resignation, tolerated toil, or old longing appears. Include weathered strength inquiry when scars, twisted trunks, broken limbs, endurance, or giving shade appears.

When enough has sprouted, prepare:
1. A brief seed-card reflection.
2. My current stage.
3. My strongest Within / Between / Beyond signals.
4. One practice.
5. One form of giving available to me now.
6. One boundary that protects my roots.
7. A plain-text RETURN_SEED_V1 apothecary label I may choose to paste back into Bloomin.

Use this exact return label:
${composeReturnSeedBlock(selectedStage, selectedPetal)}

${crisisSupportLanguage}`;
}

export function parseReturnSeed(text) {
  const raw = String(text || '').trim();
  const errors = [];

  if (!raw.includes(returnSeedStart)) {
    errors.push(`Returned seed must include ${returnSeedStart}.`);
  }

  if (!raw.includes(returnSeedEnd)) {
    errors.push(`Returned seed must include ${returnSeedEnd}.`);
  }

  const fields = {};
  const lines = raw.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed === returnSeedStart || trimmed === returnSeedEnd) {
      continue;
    }

    const separatorIndex = trimmed.indexOf(':');

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim().toLowerCase();
    const value = trimmed.slice(separatorIndex + 1).trim();

    if (key) {
      fields[key] = value;
    }
  }

  const stage = normalizeStage(fields.stage);
  const petal = normalizePetal(fields.petal);
  const nonEmptyReflectiveFields = reflectiveFields.filter((field) => fields[field]);

  if (!stage) {
    errors.push('Returned seed stage must match Soil, Seed, Shoot, Root, Stalk, Leaf, Bud, Petal, or Bloom.');
  }

  if (!petal) {
    errors.push('Returned seed must include a petal.');
  }

  if (nonEmptyReflectiveFields.length < 3) {
    errors.push('Returned seed must include at least three reflective fields.');
  }

  const seed = {
    raw,
    fields,
    stage: stage || fields.stage || '',
    petal,
    nextStage: getNextStage(stage),
    reflectiveFieldCount: nonEmptyReflectiveFields.length
  };

  return {
    ok: errors.length === 0,
    errors,
    seed
  };
}

function summarizeCarry(seed) {
  const fields = seed?.fields || {};
  const lines = [];

  if (fields.living_seed) {
    lines.push(`Living seed: ${fields.living_seed}`);
  }

  if (fields.buried_dream) {
    lines.push(`Buried dream: ${fields.buried_dream}`);
  }

  if (fields.survival_wisdom) {
    lines.push(`Survival wisdom: ${fields.survival_wisdom}`);
  }

  if (fields.weathered_strength) {
    lines.push(`Weathered strength: ${fields.weathered_strength}`);
  }

  if (fields.root_boundary) {
    lines.push(`Root boundary: ${fields.root_boundary}`);
  }

  if (fields.shade_to_give) {
    lines.push(`Shade to give: ${fields.shade_to_give}`);
  }

  if (fields.practice) {
    lines.push(`Practice: ${fields.practice}`);
  }

  return lines.join('\n');
}

export function composeNextPrompt(seed) {
  const nextStage = seed?.nextStage || getNextStage(seed?.stage);
  const stage = growthStages.includes(nextStage) ? nextStage : 'Bloom';
  const petal = seed?.petal || 'Whole Garden';
  const carry = summarizeCarry(seed);

  if (nextStage === 'Giving / Pollination / Branch') {
    return `SEEDKIND POLLINATION PACKET
For private planting in my own ChatGPT.

Packet: ${petal} / Bloom
Apothecary note: a bloom may give scent, seed, shade, or silence. It does not have to give itself away.
Planting depth: one question at a time.

You are SeedKind, a gentle garden protocol for Bloomin. Speak like a careful garden apothecary: plain, warm, practical, and a little ceremonial.

This conversation belongs to me. I have reached Bloom for this round. Help me ask what this bloom can give without becoming depleted, who may be well come to receive shade, and what boundary protects the roots.

Carry this returned seed context forward gently:
${carry}

Ask one question at a time. Look for honest pollination: what can be offered, what should remain rooted, who is well come, and what consent keeps the giving clean.

When enough has sprouted, prepare:
1. A brief seed-card reflection.
2. My current stage.
3. My strongest Within / Between / Beyond signals.
4. One practice.
5. One form of giving available to me now.
6. One boundary that protects my roots.
7. A plain-text RETURN_SEED_V1 apothecary label I may choose to paste back into Bloomin.

Use this exact return label:
${composeReturnSeedBlock('Bloom', petal)}

${crisisSupportLanguage}`;
  }

  return composeSeedPrompt({ stage, petal, carry });
}

export function composeBranchInvitation({ petal = 'Whole Garden', stage = 'Soil' } = {}) {
  const selectedPetal = normalizePetal(petal) || 'Whole Garden';
  const selectedStage = normalizeStage(stage) || 'Soil';

  return `SEEDKIND BRANCH SLIP

You are well come here, if this would help you grow.

I am tending a SeedKind reflection in the ${selectedPetal} petal, currently around ${selectedStage}. There is no pressure to join, perform, confess, or agree with me.

If you choose to participate, plant this in your own ChatGPT and keep the conversation private unless you decide to share:

"Receive this as a private SeedKind seed packet for the ${selectedPetal} petal. Walk me through the SeedKind ladder from ${selectedStage}. Ask what is alive within me, what is between us or around us, and what this might nourish beyond us. Respect my boundaries, weathered strengths, and what I can give without depletion."

If nothing else, receive this as gratitude: your life is allowed to bloom in its own time.`;
}
