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

  const currentPrompt = useMemo(() => composeSeedPrompt({ stage, petal }), [stage, petal]);
  const branchInvitation = useMemo(
    () => composeBranchInvitation({ stage, petal }),
    [stage, petal]
  );
  const activeStage = stageDetails[stage];
  const parsedSeed = result?.ok ? result.seed : null;
  const nextPrompt = parsedSeed ? composeNextPrompt(parsedSeed) : '';

  function handleReturnSeed(event) {
    event.preventDefault();

    if (!consent) {
      setResult({
        ok: false,
        errors: ['Consent is required before Eden tends a returned seed on this page.']
      });
      return;
    }

    const parsed = parseReturnSeed(returnedSeed);
    setResult(parsed);
  }

  function loadExample() {
    setReturnedSeed(initialSeed);
    setResult(null);
  }

  return (
    <section id="eden" className="eden" aria-labelledby="eden-title">
      <div className="edenShell">
        <div className="sectionIntro edenIntro">
          <p className="kicker">SeedKind Eden Protocol</p>
          <h2 id="eden-title">Plant a seed in your own ChatGPT.</h2>
          <p>
            Eden gives you copyable prompts. The conversation belongs to you. Nothing
            leaves your own ChatGPT unless you choose to return a seed here.
          </p>
        </div>

        <div className="edenNotice" role="note">
          <ShieldCheck aria-hidden="true" size={20} />
          <p>
            Copy first. Reflect privately. Return only what you choose. This first Eden
            loop validates your returned seed locally and composes the next prompt without
            sending it across the network.
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
              ['Soil', 'Begin at Soil', Sprout],
              ['Petal', 'Open a Petal', Flower2],
              ['Seed', 'Return a Seed', Send],
              ['Leaf', 'Invite a Branch', GitBranch]
            ].map(([targetStage, label, Icon]) => (
              <button
                className={stage === targetStage ? 'edenAction active' : 'edenAction'}
                key={label}
                type="button"
                onClick={() => setStage(targetStage)}
              >
                <Icon aria-hidden="true" size={18} />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div className="selectorRow" aria-label="Prompt settings">
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
            <CopyButton text={currentPrompt} label="Copy Seed Prompt" />
            <pre className="promptText" tabIndex="0">
              {currentPrompt}
            </pre>
          </article>
        </div>

        <form className="returnSeedForm" onSubmit={handleReturnSeed} aria-labelledby="return-seed-title">
          <div className="returnSeedHead">
            <div>
              <p className="kicker">Return Seed</p>
              <h3 id="return-seed-title">Paste back only what you choose.</h3>
              <p>
                Eden checks the plain-text seed, honors consent, and gives you the next
                stacking prompt. Source doorway: {sourceDomain}.
              </p>
            </div>
            <button className="textButton" type="button" onClick={loadExample}>
              <RotateCcw aria-hidden="true" size={17} />
              <span>Load Example</span>
            </button>
          </div>

          <label className="wideField">
            <span>Returned seed text</span>
            <textarea
              aria-label="Returned seed text"
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
              <span>Before</span>
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
              <span>After</span>
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
            <span>Efficacy note optional</span>
            <textarea
              aria-label="Efficacy note optional"
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
            <span>I choose to return this seed to Eden on this page for tending and learning.</span>
          </label>

          <label className="consentBox">
            <input
              type="checkbox"
              checked={contactAllowed}
              onChange={(event) => setContactAllowed(event.target.checked)}
            />
            <span>Bloomin may contact me later if I also provided an email.</span>
          </label>

          <button className="button formSubmit" type="submit">
            <Send aria-hidden="true" size={18} />
            <span>Tend Returned Seed</span>
          </button>

          {result && (
            <div
              className={result.ok ? 'parserFeedback success' : 'parserFeedback error'}
              role="status"
              aria-live="polite"
            >
              {result.ok ? (
                <p>
                  Seed received by Eden on this page. Current stage: {result.seed.stage}.
                  Next prompt: {result.seed.nextStage}.
                </p>
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

        {nextPrompt && (
          <article className="nextPrompt" aria-labelledby="next-prompt-title">
            <div>
              <p className="kicker">Next Stacking Prompt</p>
              <h3 id="next-prompt-title">The next doll opens from the returned seed.</h3>
            </div>
            <CopyButton text={nextPrompt} label="Copy Next Prompt" copiedLabel="Next prompt copied" />
            <pre className="promptText" tabIndex="0">
              {nextPrompt}
            </pre>
          </article>
        )}

        <article className="branchInvite" aria-labelledby="branch-title">
          <div>
            <p className="kicker">Branch Invitation</p>
            <h3 id="branch-title">Invite without recruiting.</h3>
            <p>
              A branch is a trusted relation invited into their own sovereign reflection,
              not into your interpretation of them.
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
