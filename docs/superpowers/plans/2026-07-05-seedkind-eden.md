# SeedKind Eden Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the copy/paste-first Eden protocol experience into the Bloomin site.

**Architecture:** Keep the app frontend-only for this pass. Add a pure protocol module for ladder data, prompt composition, return-seed parsing, and next-prompt generation; add one focused React component for the Eden interface; wire it into the existing host-aware page and extend smoke tests.

**Tech Stack:** Vite, React, lucide-react, CSS, Node `node:test`, Playwright.

---

## File Structure

- Create `src/seedkind.mjs`: protocol constants, prompt builders, `parseReturnSeed`, `composeNextPrompt`, and `composeBranchInvitation`.
- Create `src/SeedKindEden.jsx`: Eden UI state, prompt selection, copy controls, return seed form, parser feedback, next prompt display, and branch invitation.
- Modify `src/main.jsx`: import Eden, add navigation item and `Plant a Seed` CTA, render Eden before closing.
- Modify `src/styles.css`: add Eden layouts, controls, form states, growth ladder, prompt cards, mobile behavior, and reduced-motion-compatible styles.
- Create `tests/seedkind.test.mjs`: unit tests for return-seed parsing, validation, stage progression, prompt carry-forward, and branch invitation.
- Modify `tests/launch-hosts.spec.js`: assert Eden CTA, growth ladder, copy prompt, consent gating, valid return seed next prompt, and mobile overflow.
- Modify `package.json`: add `test:unit` and `test` scripts.
- Modify `.github/workflows/ci.yml`: run `npm test` before build.
- Modify `README.md` and `TEST_PLAN.md`: document Eden and the new verification commands.

## Task 1: Add Protocol Unit Tests

**Files:**
- Create: `tests/seedkind.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Add test scripts**

Patch `package.json` scripts to include:

```json
"test:unit": "node --test tests/seedkind.test.mjs",
"test": "npm run test:unit"
```

- [ ] **Step 2: Write failing protocol tests**

Create `tests/seedkind.test.mjs` with tests that import from `../src/seedkind.mjs`:

```js
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
  assert.deepEqual(growthStages, ['Soil', 'Seed', 'Shoot', 'Root', 'Stalk', 'Leaf', 'Bud', 'Petal', 'Bloom']);
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
```

- [ ] **Step 3: Run unit tests and verify they fail**

Run: `npm run test:unit`

Expected: FAIL because `src/seedkind.mjs` does not exist.

## Task 2: Implement Protocol Helpers

**Files:**
- Create: `src/seedkind.mjs`
- Test: `tests/seedkind.test.mjs`

- [ ] **Step 1: Create protocol module**

Create `src/seedkind.mjs` with:

- `growthStages`
- `petals`
- `stageDetails`
- `composeSeedPrompt({ stage, petal, carry })`
- `parseReturnSeed(text)`
- `composeNextPrompt(seed)`
- `composeBranchInvitation({ petal, stage })`

The parser must preserve user text, parse `key: value` lines, require both markers, validate `stage`, require `petal`, and require at least three non-empty reflective fields from `within`, `between`, `beyond`, `buried_dream`, `living_seed`, `weathered_strength`, `shade_to_give`, `root_boundary`, and `practice`.

- [ ] **Step 2: Run unit tests and verify pass**

Run: `npm run test:unit`

Expected: PASS.

- [ ] **Step 3: Commit protocol helpers**

Run:

```bash
git add package.json tests/seedkind.test.mjs src/seedkind.mjs
git commit -m "Add SeedKind protocol helpers"
```

## Task 3: Add Eden UI

**Files:**
- Create: `src/SeedKindEden.jsx`
- Modify: `src/main.jsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Implement Eden component**

Create `src/SeedKindEden.jsx` with:

- a stage selector using `growthStages`
- a petal selector using `petals`
- a copyable current prompt generated by `composeSeedPrompt`
- a `ReturnSeedForm` with returned seed text, consent checkbox, optional name/email, optional 1-5 feeling fields, optional efficacy note, and contact permission
- parser feedback using `parseReturnSeed`
- next prompt display using `composeNextPrompt`
- branch invitation display using `composeBranchInvitation`
- accessible copy status messages using `aria-live`

- [ ] **Step 2: Wire Eden into the page**

Modify `src/main.jsx`:

- import `SeedKindEden`
- add `Plant a Seed` to the nav
- add a `Plant a Seed` hero CTA linking to `#eden`
- render `<SeedKindEden sourceDomain={site.host} />` before the closing section

- [ ] **Step 3: Add Eden CSS**

Modify `src/styles.css` with:

- `.eden`
- `.edenShell`
- `.edenActions`
- `.ladder`
- `.promptGarden`
- `.promptPanel`
- `.copyButton`
- `.returnSeedForm`
- `.formGrid`
- `.consentBox`
- `.parserFeedback`
- `.nextPrompt`
- `.branchInvite`

The layout must remain responsive with no nested cards inside cards, no decorative orbs, no font sizes using viewport units, and no text overflow.

- [ ] **Step 4: Run build**

Run: `npm run build`

Expected: PASS.

## Task 4: Expand Playwright Smoke Tests

**Files:**
- Modify: `tests/launch-hosts.spec.js`

- [ ] **Step 1: Add Eden assertions**

Extend each host-specific test to assert:

- `Plant a Seed` link is visible
- `#eden` is visible
- the ladder contains Soil, Seed, Shoot, Root, Stalk, Leaf, Bud, Petal, Bloom
- `Begin at Soil` prompt can be selected
- copy prompt button is visible
- return form blocks parsing without consent
- a valid `RETURN_SEED_V1` produces a next prompt
- branch invitation contains `well come`

- [ ] **Step 2: Run smoke tests**

Run: `npm run test:smoke:hosts`

Expected: PASS across desktop and mobile.

## Task 5: Update Documentation And CI

**Files:**
- Modify: `README.md`
- Modify: `TEST_PLAN.md`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Document Eden**

Update `README.md` with:

- Eden as copy/paste-first protocol
- growth ladder
- return-seed consent rule
- `npm test`

- [ ] **Step 2: Update test plan**

Update `TEST_PLAN.md` with:

- unit protocol tests
- Eden Playwright coverage
- manual review notes for sovereignty and non-extraction

- [ ] **Step 3: Add unit tests to CI**

Insert a workflow step after install dependencies:

```yaml
- name: Unit tests
  run: npm test
```

- [ ] **Step 4: Run all verification**

Run:

```bash
npm test
npm run build
npm run test:smoke:hosts
git diff --check
```

Expected: all pass.

- [ ] **Step 5: Commit implementation**

Run:

```bash
git add .github/workflows/ci.yml README.md TEST_PLAN.md src/main.jsx src/styles.css src/SeedKindEden.jsx tests/launch-hosts.spec.js
git commit -m "Sew Eden protocol into Bloomin"
```

## Self-Review Checklist

- Spec coverage: Eden CTA, ladder, prompts, return seed parser, next prompt, branch invitation, optional survey, safety copy, consent-first form, tests, docs.
- Completion-language scan: no empty markers or vague implementation steps.
- Type consistency: `growthStages`, `petals`, `parseReturnSeed`, `composeSeedPrompt`, `composeNextPrompt`, `composeBranchInvitation`, `RETURN_SEED_V1`.

## Execution Mode

The user approved implementation with “make it sew,” so this plan will be executed inline in the current session using the executing-plans discipline.
