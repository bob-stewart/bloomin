# SeedKind Eden Protocol Design

## Status

Approved for codification from the July 5 Bloomin design conversation. This
document defines the protocol, interaction model, data contract, and first build
scope for the copy/paste-first Eden experience.

## Purpose

Eden is the first living protocol surface of Bloomin. It is not a perfect
garden. It is a tended beginning where a visitor can bring what still matters,
notice what survived, and give it a truthful form.

SeedKind is the protocol inside Eden. It gives visitors copyable prompts they
run in their own ChatGPT instance. The visitor owns the conversation. Bloomin
only receives what the visitor intentionally returns.

The goal is to help living meaning become matter in ways that matter.

## Core Doctrine

### Sovereignty Before Capture

The visitor starts in their own ChatGPT, not inside an owned Bloomin chat box.
This preserves privacy, agency, and trust. The site provides prompts, language,
and structure. The visitor decides what to copy back.

### Eden As Tended Beginning

Eden is the first garden: a place to begin again without pretending the ground is
untouched. It welcomes buried dreams, weathered strengths, scars, twisted trunks,
broken limbs, and the shade a life can still give.

### Matter Doctrine

1. Every seed matters before it is useful.
2. A dream given up for survival deserves witness, not shame.
3. The goal is gentle rematerialization, not escape fantasy.
4. What becomes matter should nourish life, not extract from it.
5. Mattering is proven by flourishing across self, branch, grove, and world.

### Giving Without Extraction

Giving is the circulatory system of Bloom, but giving must not become depletion.
The protocol asks what a person can give from where they are, what they once gave
up to survive, and what boundaries protect future giving from becoming
extraction.

### Weathered Strength

The protocol respects scars and difficult growth. It does not romanticize harm or
claim all storms were good. It asks what strength formed, what deserves witness,
and where that strength can give shade without requiring continued suffering.

## Visitor Experience

### Entry

Every Bloomin domain receives a `Plant a Seed` call to action. The CTA opens the
Eden protocol section or route.

Intro copy:

> This protocol runs in your own ChatGPT. Nothing is sent to Bloomin unless you
> choose to return a seed.

The first screen offers:

- `Begin at Soil`
- `Open a Petal`
- `Return a Seed`
- `Invite a Branch`

`Begin at Soil` is the recommended path.

### Copy/Paste Loop

1. Visitor chooses a prompt.
2. Site displays a copyable SeedKind prompt.
3. Visitor pastes the prompt into their own ChatGPT.
4. ChatGPT asks questions one at a time.
5. ChatGPT outputs a reflection plus a structured `RETURN_SEED_V1` block.
6. Visitor may keep it private or paste the returned seed back into Eden.
7. Eden validates the returned seed and offers the next prompt.

This creates the stacking-doll mechanic:

`Prompt -> Reflection -> Return Seed -> Next Prompt -> Deeper Reflection`

### Optional Return Form

The Return Seed form is consent-first.

Required:

- returned seed text
- consent checkbox: `I choose to return this seed to Bloomin for tending and learning.`

Optional:

- name
- email
- life petal
- feeling before, 1-5
- feeling after, 1-5
- free-text efficacy note
- permission to be contacted

No account is required.

## Growth Ladder

The SeedKind ladder is:

`Soil -> Seed -> Shoot -> Root -> Stalk -> Leaf -> Bud -> Petal -> Bloom`

### Soil

Current conditions, safety, constraints, fatigue, nourishment, history, weather,
and what the visitor has been surviving.

Primary inquiry:

> What kind of ground are you in?

### Seed

The intention, longing, question, buried dream, or living possibility that wants
to grow.

Primary inquiry:

> What still matters enough to become matter?

### Shoot

The first visible movement: courage, signal, confession, experiment, or small
act of becoming.

Primary inquiry:

> What is the smallest honest sign of life?

### Root

Hidden support: values, faith, memory, kinship, ancestry, discipline, and
sources of nourishment.

Primary inquiry:

> What can this life root into?

### Stalk

Structure: habits, commitments, containers, rhythm, practice, and the upright
strength that lets growth carry weight.

Primary inquiry:

> What structure would help this keep rising?

### Leaf

Exchange: learning, sensing, breathing, listening, energy, attention, and
relationship with the environment.

Primary inquiry:

> What does this growth need to receive and release?

### Bud

Not-yet-open potential: patience, protection, timing, tenderness, promise, and
capacity that should not be forced.

Primary inquiry:

> What is forming that is not ready to be forced open?

### Petal

Aspect-specific unfolding. Petals are the life domains through which the seed
finds color, texture, and expression.

Initial petals:

- Health
- Wealth
- Faith
- Family
- Friends
- Work / Craft
- Goals
- Giving
- Belonging
- Stewardship

Primary inquiry:

> Which aspect of life is asking to open?

### Bloom

Integrated expression, contribution, beauty, stewardship, and visible life that
can nourish more than itself.

Primary inquiry:

> What form of contribution would let this life bloom without abandoning its roots?

## Three Lenses At Every Stage

Every ladder stage uses three lenses.

### Within

What is alive inside this?

### Between

What relationship, branch, family, circle, system, or weather is tending or
affecting this?

### Beyond

What might this eventually nourish, shelter, teach, free, or pollinate?

Pollination is not a final step. It is within every stage. Soil already contains
prior pollination. Seed already carries relation. Bloom makes visible what has
been relational all along.

## Buried Dream Inquiry

This inquiry belongs inside Soil and can reappear whenever the protocol detects
grief, resignation, survival, or tolerated toil.

Questions:

- What dream did you once carry?
- When did it become unsafe, impractical, embarrassing, or too expensive to keep
  carrying openly?
- What did setting it down help you survive?
- What part of that dream still feels alive?
- Where might that life be celebrated, not merely tolerated?
- Who would recognize it as worthy?
- What is one small way to replant it without burning down the life that
  currently protects you?

Seed card fields:

- Buried Dream
- Survival Wisdom
- Living Seed
- Celebration Soil
- Gentle Replanting

## Weathered Strength Inquiry

This inquiry respects scars, twisted trunks, broken limbs, and endurance without
requiring pain to justify itself.

Questions:

- What weather have you survived?
- What scar deserves respect?
- What twisted growth helped you keep reaching light?
- What broken limb changed how you carry life?
- What strength did that weather form?
- Where can that strength give shade?
- What boundary protects you from becoming shelter at the cost of your own roots?

Seed card fields:

- Weather Witnessed
- Scar Respected
- Strength Formed
- Shade Given
- Root Boundary

## Giving And Giving Up

Each reflection asks about giving in two senses.

### Giving

What can the visitor give from where they are?

Examples:

- attention
- honesty
- encouragement
- support
- consistency
- listening
- patience
- beauty
- contribution
- possibility

### Giving Up

What did the visitor set down, surrender, set aside, bury, or resign to survive?

The protocol treats this as sacred material, not failure. It asks whether the
given-up dream is still alive and whether it can be gently rematerialized where
the person is celebrated instead of merely tolerated.

## Self, Branch, Grove

The protocol supports three scopes.

### Self

The visitor germinates privately. Nothing leaves their own ChatGPT unless they
choose to return a seed.

### Branch

The visitor optionally invites a family member, friend, mentor, collaborator, or
trusted relation to cultivate one petal together.

Branch invitation language must feel like welcome, not recruitment.

Core phrase:

> You are well come here, if this would help you grow.

### Grove

A larger circle may share returned seeds around a common intention, practice, or
act of giving. Grove mode remains consent-bound: every participant owns their
own seed and chooses what to return.

Initial build supports Self and a copyable Branch invitation. Grove appears only
as language and data shape so the protocol does not need to be redesigned when
community seeds arrive.

## Prompt Contract

Every SeedKind prompt instructs ChatGPT to:

1. act as a gentle garden protocol, not a therapist, guru, recruiter, or judge
2. ask one question at a time
3. avoid diagnosis, coercion, shame, and forced optimism
4. respect survival wisdom and weathered strength
5. distinguish giving from depletion
6. return both human reflection and structured data
7. invite professional or emergency help when the user describes imminent harm,
   abuse, medical crisis, or severe distress

## Seed Prompt Template

```text
You are SeedKind, a gentle garden protocol for Bloomin.

This conversation belongs to me. Ask one question at a time. Help me examine
what is alive within, what relationships affect it, and what it may nourish
beyond me.

Do not diagnose me. Do not rush me. Do not force positivity. Respect scars,
weathered strengths, buried dreams, survival choices, and boundaries. Help me
notice what I can give from where I am without turning giving into depletion.

Use this growth ladder:
Soil -> Seed -> Shoot -> Root -> Stalk -> Leaf -> Bud -> Petal -> Bloom

Begin at Soil unless I name another stage. Ask me about current conditions,
what I have been surviving, what dream I may have set down, and what still
matters enough to become matter.

When you have enough, produce:
1. A brief reflection.
2. My current stage.
3. My strongest Within / Between / Beyond signals.
4. One practice.
5. One form of giving available to me now.
6. One boundary that protects my roots.
7. A RETURN_SEED_V1 block I may choose to paste back into Bloomin.
```

## Return Seed Format

Returned seeds use plain text so visitors can inspect them before returning.

```text
RETURN_SEED_V1
stage: Soil
petal: Whole Garden
within: ...
between: ...
beyond: ...
buried_dream: ...
survival_wisdom: ...
living_seed: ...
weathered_strength: ...
shade_to_give: ...
root_boundary: ...
practice: ...
next_prompt_request: ...
END_RETURN_SEED_V1
```

The site validates:

- opening marker exists
- ending marker exists
- `stage` matches the ladder
- `petal` is present
- at least three reflective fields are non-empty

If validation fails, the site explains what is missing and keeps the visitor's
text intact.

## Next Prompt Selection

Eden generates the next copyable prompt from the returned seed.

Rules:

- `Soil` returns `Seed`
- `Seed` returns `Shoot`
- `Shoot` returns `Root`
- `Root` returns `Stalk`
- `Stalk` returns `Leaf`
- `Leaf` returns `Bud`
- `Bud` returns `Petal`
- `Petal` returns either the selected life petal or `Bloom`
- `Bloom` returns `Giving / Pollination / Branch`

If `buried_dream`, `weathered_strength`, or `root_boundary` is strong in the
returned seed, the next prompt carries that language forward so the protocol
feels continuous.

## Optional Survey Layer

After a returned seed, Eden may ask lightweight efficacy questions.

Questions:

- Before this reflection, how oriented did you feel? 1-5
- After this reflection, how oriented do you feel? 1-5
- Did this help you feel more seen, capable, generous, or grounded?
- What part felt most alive?
- What part felt confusing or too much?

These questions are optional and separate from the returned seed.

## Data Model

Returned seed records contain:

- id
- created_at
- source_domain
- stage
- petal
- return_seed_text
- parsed_fields
- name_optional
- email_optional
- consent_to_return
- permission_to_contact
- feeling_before_optional
- feeling_after_optional
- efficacy_note_optional

The first implementation stores only returned seeds submitted with consent.
Private prompt use creates no Bloomin-side record.

## Safety And Ethics

Eden is reflective and invitational. It does not provide medical, legal,
financial, therapeutic, or crisis services.

Guardrails:

- no scoring of human worth
- no hidden profiling
- no account requirement
- no default sharing
- no interpretation of another person's returned seed without their consent
- no pressure to invite family, friends, or community
- no claim that harm was necessary or good
- no replacing professional care

If a visitor indicates imminent harm, abuse, medical crisis, or severe distress,
the prompt instructs ChatGPT to encourage immediate support from local emergency
services, crisis resources, trusted people, or qualified professionals.

## Information Architecture

Navigation additions:

- Primary CTA: `Plant a Seed`
- Section or route: `#eden` or `/eden`

Eden surface sections:

1. Invitation
2. Growth Ladder
3. Prompt Garden
4. Return a Seed
5. Branch Invitation
6. Privacy and Consent

## Component Boundaries

### EdenProtocol

Owns the overall section, state, and stage selection.

### GrowthLadder

Displays Soil -> Bloom and explains each stage.

### PromptGarden

Lists prompt entry points and renders the active prompt.

### CopyPromptButton

Copies prompt text and announces success accessibly.

### ReturnSeedForm

Collects returned seed text, consent, optional contact fields, and optional
survey fields.

### ReturnSeedParser

Parses and validates `RETURN_SEED_V1` text.

### NextPromptComposer

Creates the next prompt from validated returned seed fields.

### BranchInvite

Creates a copyable well-come invitation for one trusted relation.

## Error Handling

- Missing consent blocks submission.
- Invalid returned seed preserves user input and explains missing fields.
- Network failure preserves user input and offers retry.
- Copy failure selects the prompt text and asks the visitor to copy manually.
- Unsupported stage falls back to Soil with a clear explanation.
- Empty optional fields never block submission.

## Testing Plan

Automated tests cover:

- Eden CTA exists on all host variants.
- Growth ladder renders all nine stages in order.
- Prompt selection reveals the correct copyable prompt.
- Copy button exposes success feedback.
- Return Seed form blocks submission without consent.
- Return Seed parser accepts valid `RETURN_SEED_V1`.
- Return Seed parser rejects malformed seed text with a visible explanation.
- Next prompt generation advances stages correctly.
- Branch invitation can be copied.
- Desktop and mobile viewports have no horizontal overflow.
- Reduced-motion support remains intact.

Manual review covers:

- tone feels calm, sovereign, and non-extractive
- prompt language respects scars and survival without romanticizing harm
- giving language invites generosity without depletion
- branch invitation feels like welcome rather than recruitment

## Initial Build Scope

The first build adds Eden as a frontend protocol experience with a minimal
consentful return path. It includes:

- Plant a Seed CTA
- Eden protocol surface
- Growth ladder
- prompt cards
- copy-to-clipboard
- return seed parsing
- optional return form
- next prompt composition
- branch invitation
- tests and README updates

The first build does not include accounts, dashboards, paid features, custom GPT
publishing, automated email sequences, hidden tracking, or social graphs.

## Acceptance Criteria

A first-time visitor can:

1. understand that Eden runs in their own ChatGPT
2. copy a SeedKind prompt
3. receive a reflection and returned seed from ChatGPT
4. paste the returned seed back into Bloomin only if they choose
5. receive a coherent next prompt
6. see how the protocol respects buried dreams, weathered strengths, giving,
   boundaries, and branch invitations
7. leave without submitting anything and still retain value

The experience is successful when it feels less like lead capture and more like
a trustworthy ritual for becoming.
