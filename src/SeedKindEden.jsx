import React, { useMemo, useState } from 'react';
import {
  Check,
  Clipboard,
  Flower2,
  GitBranch,
  RotateCcw,
  Send,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import {
  composeBranchInvitation,
  composeNextPrompt,
  composeSeedPrompt,
  growthStages,
  parseReturnSeed,
  petals,
  stageDetails
} from './seedkind.mjs';
import seedPacketsImage from './assets/bloomin-apothecary-seed-packets.avif';

const initialSeed = `RETURN_SEED_V1
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

function CopyButton({ text, label, copiedLabel = 'Copied' }) {
  const [status, setStatus] = useState('');

  async function copyText() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus(copiedLabel);
    } catch {
      setStatus('Select the text and copy manually');
    }

    window.setTimeout(() => setStatus(''), 2400);
  }

  return (
    <div className="copyControl">
      <button className="copyButton" type="button" onClick={copyText}>
        {status === copiedLabel ? (
          <Check aria-hidden="true" size={18} />
        ) : (
          <Clipboard aria-hidden="true" size={18} />
        )}
        <span>{label}</span>
      </button>
      <span className="copyStatus" aria-live="polite">
        {status}
      </span>
    </div>
  );
}

export function SeedKindEden({ sourceDomain }) {
  const [stage, setStage] = useState('Soil');
  const [petal, setPetal] = useState('Whole Garden');
  const [returnedSeed, setReturnedSeed] = useState('');
  const [consent, setConsent] = useState(false);
  const [contactAllowed, setContactAllowed] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feelingBefore, setFeelingBefore] = useState('');
  const [feelingAfter, setFeelingAfter] = useState('');
  const [efficacyNote, setEfficacyNote] = useState('');
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);

  const currentPrompt = useMemo(() => composeSeedPrompt({ stage, petal }), [stage, petal]);
  const branchInvitation = useMemo(
    () => composeBranchInvitation({ stage, petal }),
    [stage, petal]
  );
  const activeStage = stageDetails[stage];
  const parsedSeed = result?.seed || null;
  const nextPrompt =
    result?.nextPrompt ||
    result?.localNextPrompt ||
    (parsedSeed?.fields ? composeNextPrompt(parsedSeed) : '');

  async function handleReturnSeed(event) {
    event.preventDefault();

    if (!consent) {
      setReturnOpen(true);
      setResult({
        ok: false,
        errors: ['Consent is required before Eden tends a returned seed on this page.']
      });
      return;
    }

    const parsed = parseReturnSeed(returnedSeed);

    if (!parsed.ok) {
      setResult(parsed);
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch('/api/seed-return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceDomain,
          returnSeedText: returnedSeed,
          consentToReturn: consent,
          permissionToContact: contactAllowed,
          name,
          email,
          feelingBefore,
          feelingAfter,
          efficacyNote
        })
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        setResult({
          ok: false,
          seed: parsed.seed,
          localNextPrompt: composeNextPrompt(parsed.seed),
          errors:
            data?.errors?.length > 0
              ? data.errors
              : ['Eden could not complete the server return. Your local next seed is still available below.']
        });
        return;
      }

      setResult(data);
    } catch {
      setResult({
        ok: false,
        seed: parsed.seed,
        localNextPrompt: composeNextPrompt(parsed.seed),
        errors: ['Eden could not reach the server. Your local next seed is still available below.']
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function loadExample() {
    setReturnedSeed(initialSeed);
    setResult(null);
    setReturnOpen(true);
  }

  return (
    <section id="eden" className="eden" aria-labelledby="eden-title">
      <div className="edenShell">
        <div className="edenThreshold">
          <div className="sectionIntro edenIntro">
            <p className="kicker">SeedKind Eden / private apothecary</p>
            <h2 id="eden-title">Choose a seed packet. Bring back only the label.</h2>
            <p>
              Start with Soil if you are unsure. The packet opens in your own ChatGPT
              and asks one careful question at a time. Bloomin sees nothing unless you
              return the label.
            </p>
            <p className="edenPromise">
              Keep the story yours. Return only what is alive, what weather shaped it,
              what boundary protects it, and one small practice.
            </p>
          </div>

          <figure className="edenImagePanel">
            <img
              className="edenBloomImage"
              src={seedPacketsImage}
              alt="Seed packets, pressed herbs, and amber bottles arranged on an old apothecary workbench."
              width="1200"
              height="676"
              loading="lazy"
              decoding="async"
            />
            <figcaption>Seed packets, labels, and living remedies.</figcaption>
          </figure>
        </div>

        <div className="edenNotice" role="note">
          <ShieldCheck aria-hidden="true" size={20} />
          <p>
            Your first conversation stays yours. Eden receives only a consented
            RETURN_SEED_V1 label: stage, petal, within, between, beyond, buried dream,
            weathered strength, shade to give, boundary, practice, and the next question.
          </p>
        </div>

        <ol className="ladder" aria-label="SeedKind growth ladder">
          {growthStages.map((item) => (
            <li key={item} className={item === stage ? 'active' : ''}>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <div className="promptGarden">
          <div className="edenActions" aria-label="Eden entry points">
            {[
              { targetStage: 'Soil', label: 'Begin at Soil', Icon: Sprout },
              { targetStage: 'Petal', label: 'Choose a Petal', Icon: Flower2 },
              { targetStage: 'Seed', label: 'Return a Label', Icon: Send, openReturn: true },
              { targetStage: 'Leaf', label: 'Invite a Branch', Icon: GitBranch }
            ].map(({ targetStage, label, Icon, openReturn }) => (
              <button
                className={stage === targetStage ? 'edenAction active' : 'edenAction'}
                key={label}
                type="button"
                onClick={() => {
                  setStage(targetStage);
                  if (openReturn) {
                    setReturnOpen(true);
                  }
                }}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="selectorRow" aria-label="Seed settings">
            <label>
              <span>Stage</span>
              <select value={stage} onChange={(event) => setStage(event.target.value)}>
                {growthStages.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>Petal</span>
              <select value={petal} onChange={(event) => setPetal(event.target.value)}>
                {petals.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <article className="promptPanel" aria-labelledby="seed-prompt-title">
            <div>
              <p className="kicker">{stage}</p>
              <h3 id="seed-prompt-title">{activeStage.inquiry}</h3>
              <p>{activeStage.focus}</p>
            </div>
            <CopyButton text={currentPrompt} label="Copy Seed Packet" />
            <pre className="promptText" tabIndex="0">
              {currentPrompt}
            </pre>
          </article>
        </div>

        <details
          className="returnSeedDetails"
          open={returnOpen}
          onToggle={(event) => setReturnOpen(event.currentTarget.open)}
        >
          <summary>
            <Send aria-hidden="true" size={18} />
            <span>Already have a returned seed label?</span>
          </summary>

          <form
            className="returnSeedForm"
            onSubmit={handleReturnSeed}
            aria-labelledby="return-seed-title"
            aria-busy={isSubmitting}
          >
            <div className="returnSeedHead">
              <div>
                <p className="kicker">Returned seed label</p>
                <h3 id="return-seed-title">Bring back the label, not the whole story.</h3>
                <p>
                  Eden reads the plain-text label, checks its structure, honors your
                  consent, stores the seed record, and grows the next question from what
                  you chose to return. Doorway: {sourceDomain}.
                </p>
              </div>
              <button className="textButton" type="button" onClick={loadExample}>
                <RotateCcw aria-hidden="true" size={17} />
                <span>Fill Example Label</span>
              </button>
            </div>

            <label className="wideField">
              <span>Returned seed label</span>
              <textarea
                aria-label="Returned seed label"
                value={returnedSeed}
                onChange={(event) => setReturnedSeed(event.target.value)}
                rows={14}
              />
            </label>

            <div className="formGrid">
              <label>
                <span>Name optional</span>
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                <span>Email optional</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </label>
              <label>
                <span>Felt before</span>
                <select value={feelingBefore} onChange={(event) => setFeelingBefore(event.target.value)}>
                  <option value="">No answer</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                <span>Felt after</span>
                <select value={feelingAfter} onChange={(event) => setFeelingAfter(event.target.value)}>
                  <option value="">No answer</option>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="wideField">
              <span>What felt alive or confusing? optional</span>
              <textarea
                aria-label="What felt alive or confusing? optional"
                value={efficacyNote}
                onChange={(event) => setEfficacyNote(event.target.value)}
                rows={4}
              />
            </label>

            <label className="consentBox">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              <span>I choose to return this seed label to Eden for tending and learning.</span>
            </label>

            <label className="consentBox">
              <input
                type="checkbox"
                checked={contactAllowed}
                onChange={(event) => setContactAllowed(event.target.checked)}
              />
              <span>Bloomin may contact me later if I also provided an email.</span>
            </label>

            <button className="button formSubmit" type="submit" disabled={isSubmitting}>
              <Send aria-hidden="true" size={18} />
              <span>{isSubmitting ? 'Tending This Seed' : 'Tend This Seed'}</span>
            </button>

            {result && (
              <div
                className={result.ok ? 'parserFeedback success' : 'parserFeedback error'}
                role="status"
                aria-live="polite"
              >
                {result.ok ? (
                  <div>
                    <p>
                      Seed label returned. Current stage: {result.seed.stage}. Next
                      question: {result.seed.nextStage}.
                    </p>
                    {result.id && (
                      <p className="resultMeta">
                        Stored seed: {String(result.id).slice(0, 8)}
                      </p>
                    )}
                    {result.bloom && (
                      <div className="bloomGuidance" aria-label="Eden bloom guidance">
                        <p>{result.bloom.message}</p>
                        <p>
                          <strong>Practice:</strong> {result.bloom.practice}
                        </p>
                        <p>
                          <strong>Question:</strong> {result.bloom.question}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>Eden needs a little more structure before it can tend this seed.</p>
                    <ul>
                      {result.errors.map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </form>
        </details>

        {nextPrompt && (
          <article className="nextPrompt" aria-labelledby="next-prompt-title">
            <div>
              <p className="kicker">Next Stacking Prompt</p>
              <h3 id="next-prompt-title">The next question grows from the returned seed.</h3>
            </div>
            <CopyButton text={nextPrompt} label="Copy Next Seed" copiedLabel="Next seed copied" />
            <pre className="promptText" tabIndex="0">
              {nextPrompt}
            </pre>
          </article>
        )}

        <article className="branchInvite" aria-labelledby="branch-title">
          <div>
            <p className="kicker">Branch Invitation</p>
            <h3 id="branch-title">Invite a trusted branch without recruiting.</h3>
            <p>
              A branch is someone welcomed into their own reflection, not pulled into
              your interpretation of them. Give them a seed and leave their roots intact.
            </p>
          </div>
          <CopyButton text={branchInvitation} label="Copy Branch Invitation" />
          <pre className="promptText" tabIndex="0">
            {branchInvitation}
          </pre>
        </article>
      </div>
    </section>
  );
}
