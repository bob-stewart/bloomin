import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  BookOpen,
  CircleDot,
  Compass,
  Flower2,
  HandHeart,
  Heart,
  Landmark,
  Leaf,
  Microscope,
  Network,
  ShieldCheck,
  Sprout
} from 'lucide-react';
import './styles.css';

const sites = [
  {
    id: 'giving',
    host: 'bloom.giving',
    kicker: 'Honor Good / public invitation',
    title: 'Bloom Giving',
    role: 'Philosophy / public invitation',
    theme: 'giving',
    cta: 'Honor Good',
    Icon: HandHeart,
    heroLine: 'Give more than you take.',
    lede:
      'A welcoming front porch for the Bloomin ecosystem: clear philosophy, humane invitation, and simple practices that turn generosity into civic infrastructure.',
    roleHeading: 'The invitation people can feel first.',
    roleCopy:
      'Bloom Giving names the public practice: honor what is good, strengthen the soil around one another, and make contribution feel natural before it becomes formal.',
    practices: [
      'Public language for Honor Good',
      'Belonging-first invitations',
      'Gift, gratitude, and contribution pathways'
    ]
  },
  {
    id: 'institute',
    host: 'bloomin.institute',
    kicker: 'Research / protocols / AI-IRB',
    title: "The Bloomin' Institute",
    role: 'Research / protocols / AI-IRB / AI-SDLC / DOE',
    theme: 'institute',
    cta: 'Explore the Protocol',
    Icon: Microscope,
    heroLine: 'Discipline in service of flourishing.',
    lede:
      'A research home for protocols, evidence, AI-IRB stewardship, AI-SDLC discipline, and DOE-grounded learning systems that keep technology accountable to human dignity.',
    roleHeading: 'Where the root system becomes legible.',
    roleCopy:
      'The Institute turns care into method: protocols, reviews, experiments, and learning loops that make trust measurable without reducing people to metrics.',
    practices: [
      'AI-IRB stewardship patterns',
      'AI-SDLC and DOE protocols',
      'Research notes and learning pathways'
    ]
  },
  {
    id: 'foundation',
    host: 'bloomin.foundation',
    kicker: 'Stewardship / grants / public benefit',
    title: "The Bloomin' Foundation",
    role: 'Stewardship / grants / Honor Good / public benefit',
    theme: 'foundation',
    cta: 'Steward the Garden',
    Icon: Landmark,
    heroLine: 'Leave more than you found.',
    lede:
      'A public-benefit home for stewardship, grants, scholarships, and Honor Good initiatives that move resources toward fertile human and institutional conditions.',
    roleHeading: 'Where resources become responsibility.',
    roleCopy:
      'The Foundation protects the giving edge of the ecosystem: capital, recognition, and governance move toward people and communities ready to cultivate durable good.',
    practices: [
      'Grant and scholarship stewardship',
      'Public-benefit governance',
      'Honor Good initiatives'
    ]
  },
  {
    id: 'garden',
    host: 'bloom.gdn',
    kicker: 'Garden / symbol / living home',
    title: 'Bloom Garden',
    role: 'Garden metaphor / visual ecosystem / living symbolic home',
    theme: 'garden',
    cta: 'Enter the Garden',
    Icon: Flower2,
    heroLine: 'A living map for the whole ecosystem.',
    lede:
      'A symbolic garden for seeing the relationships among truth, trust, belonging, curiosity, contribution, stewardship, and the condition we call Bloom.',
    roleHeading: 'Where the pattern can be seen at a glance.',
    roleCopy:
      'Bloom Garden gives the movement a visual home: quiet maps, living metaphors, and gentle explanations that help people orient without being overwhelmed.',
    practices: [
      'Living symbolic maps',
      'Ecosystem explainers',
      'Visual doctrine for Bloom'
    ]
  }
];

const defaultSite = {
  id: 'default',
  host: 'bloomin-production.up.railway.app',
  kicker: 'Adaptive ecosystem stewardship',
  title: "Keep Bloomin'",
  role: 'Launch preview / shared ecosystem',
  theme: 'default',
  cta: "Begin Bloomin'",
  Icon: Sprout,
  heroLine: 'Technology as root system. Bloom as invitation.',
  lede:
    'A calm, living, intelligent garden of ideas for human flourishing, public benefit, trustworthy systems, and contribution that leaves the soil richer.',
  roleHeading: 'One shared ecosystem, many doors.',
  roleCopy:
    'This preview carries the same constitution and cycle used by each secured domain while Railway serves the production bundle.',
  practices: [
    'Hostname-aware launch surface',
    'Shared constitution and cycle',
    'Railway-ready Vite delivery'
  ]
};

const siteByHost = Object.fromEntries(sites.map((site) => [site.host, site]));

const motionSteps = ['Root', 'Ground', 'Flow', 'Shine', 'Love', 'Say', 'See', 'Know'];

const constitutionPoints = [
  {
    title: 'Intrinsic human dignity',
    copy: 'People arrive whole, worthy, and never reducible to output, data, role, or utility.'
  },
  {
    title: 'Stewardship over extraction',
    copy: 'Every system should return more trust, capability, and fertility than it consumes.'
  },
  {
    title: 'Belonging as soil',
    copy: 'Growth begins where people have enough safety, agency, and welcome to become honest.'
  },
  {
    title: 'Technology as root system',
    copy: 'The machinery stays quiet, accountable, and beneath the human flourishing it supports.'
  },
  {
    title: 'Bloom as condition',
    copy: 'Bloom is the environment where truth, trust, curiosity, competence, and care can emerge.'
  },
  {
    title: "Bloomin' as practice",
    copy: "Bloomin' is the daily tending: honor good, give more, leave more, and keep cultivating."
  }
];

const bloomCycle = [
  ['Truth', 'Name what is real without distortion.'],
  ['Trust', 'Make reality reliable enough to share.'],
  ['Belonging', 'Let people take root without surrendering agency.'],
  ['Curiosity', 'Invite attention, wonder, and honest questions.'],
  ['Exploration', 'Move through uncertainty with care and evidence.'],
  ['Competence', 'Turn practice into embodied capability.'],
  ['Contribution', 'Offer capability back to the commons.'],
  ['Merit', 'Let contribution become visible without vanity.'],
  ['Stewardship', 'Protect what has been entrusted.'],
  ['Bloom', 'Create conditions where life can flourish again.']
];

function getHostConfig() {
  const hostname = window.location.hostname.replace(/^www\./, '');
  return siteByHost[hostname] || defaultSite;
}

function BloomHeroArt() {
  return (
    <figure className="heroArt" aria-label="Root to Bloom circulation">
      <svg
        className="bloomSvg"
        viewBox="0 0 640 640"
        role="img"
        aria-labelledby="bloom-art-title bloom-art-desc"
      >
        <title id="bloom-art-title">Root to Bloom circulation</title>
        <desc id="bloom-art-desc">
          Subtle animated roots, ground, circulation paths, and emerging nodes.
        </desc>
        <defs>
          <linearGradient id="rootGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--shine)" />
            <stop offset="46%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--soil)" />
          </linearGradient>
          <radialGradient id="seedGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--paper)" />
            <stop offset="62%" stopColor="var(--accent-soft)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        <circle className="gardenGlow" cx="320" cy="314" r="250" fill="url(#seedGlow)" />
        <path
          className="groundLine"
          d="M112 338 C174 319 226 318 284 337 C342 356 396 356 456 337 C492 326 526 326 558 338"
        />
        <g className="roots" stroke="url(#rootGradient)">
          <path d="M320 342 C310 384 293 421 260 468 C239 497 219 523 198 557" />
          <path d="M320 342 C337 384 358 421 395 465 C419 493 444 520 474 554" />
          <path d="M320 342 C320 389 318 437 315 558" />
          <path d="M286 417 C258 414 234 424 207 452" />
          <path d="M354 421 C385 416 413 426 445 457" />
          <path d="M315 493 C291 498 270 512 248 538" />
          <path d="M327 494 C350 504 369 519 388 543" />
        </g>
        <g className="orbit orbitOne">
          <ellipse cx="320" cy="292" rx="188" ry="70" />
          <ellipse cx="320" cy="292" rx="188" ry="70" transform="rotate(58 320 292)" />
          <ellipse cx="320" cy="292" rx="188" ry="70" transform="rotate(116 320 292)" />
        </g>
        <g className="orbit orbitTwo">
          <ellipse cx="320" cy="292" rx="134" ry="214" />
          <ellipse cx="320" cy="292" rx="92" ry="178" transform="rotate(38 320 292)" />
        </g>
        <path
          className="circulation circulationOne"
          d="M321 548 C218 456 196 375 287 310 C382 242 410 151 322 74"
        />
        <path
          className="circulation circulationTwo"
          d="M322 74 C425 159 452 247 360 310 C258 381 232 463 321 548"
        />
        <g className="nodes">
          <circle cx="320" cy="548" r="12" />
          <circle cx="255" cy="376" r="10" />
          <circle cx="190" cy="292" r="9" />
          <circle cx="262" cy="192" r="10" />
          <circle cx="320" cy="74" r="12" />
          <circle cx="438" cy="292" r="10" />
          <circle cx="382" cy="410" r="9" />
        </g>
        <circle className="centerSeed" cx="320" cy="312" r="23" />
        <path
          className="leafPath"
          d="M320 280 C283 239 286 197 326 164 C365 196 371 239 320 280 Z"
        />
      </svg>
      <figcaption className="motionSequence" aria-label="Bloom motion sequence">
        {motionSteps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </figcaption>
    </figure>
  );
}

function BloomConstitution() {
  return (
    <section id="constitution" className="constitution" aria-labelledby="constitution-title">
      <div className="sectionIntro">
        <p className="kicker">Shared Bloom Constitution</p>
        <h2 id="constitution-title">The ethos stays human.</h2>
        <p>
          Honor Good. Cultivate Belonging. Give More Than You Take. Leave More Than You
          Found. Keep Bloomin'.
        </p>
      </div>
      <div className="constitutionGrid">
        {constitutionPoints.map(({ title, copy }) => (
          <article className="principleCard" key={title}>
            <CircleDot aria-hidden="true" size={18} />
            <h3>{title}</h3>
            <p>{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BloomCycle() {
  return (
    <section id="bloom-cycle" className="cycle" aria-labelledby="cycle-title">
      <div className="sectionIntro">
        <p className="kicker">Bloom Cycle</p>
        <h2 id="cycle-title">An ecosystem loop, not a funnel.</h2>
        <p>
          Flourishing moves through trust and contribution, then returns as stewardship.
          The cycle keeps the garden alive because each gift becomes soil for the next.
        </p>
      </div>
      <ol className="cycleList">
        {bloomCycle.map(([title, copy], index) => (
          <li className="cycleStep" key={title}>
            <span className="cycleIndex">{String(index + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{copy}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function DomainRole({ site }) {
  const Icon = site.Icon;

  return (
    <section id="role" className="roleSection" aria-labelledby="role-title">
      <div className="roleLead">
        <Icon aria-hidden="true" size={34} />
        <p className="kicker">{site.role}</p>
        <h2 id="role-title">{site.roleHeading}</h2>
        <p>{site.roleCopy}</p>
      </div>
      <ul className="practiceList" aria-label={`${site.host} practices`}>
        {site.practices.map((practice) => (
          <li key={practice}>
            <Leaf aria-hidden="true" size={18} />
            <span>{practice}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EcosystemMap({ currentSite }) {
  return (
    <section id="ecosystem" className="ecosystem" aria-labelledby="ecosystem-title">
      <div className="sectionIntro">
        <p className="kicker">One ecosystem / four doors</p>
        <h2 id="ecosystem-title">Each domain tends a distinct role.</h2>
        <p>
          The sites share one constitution and cycle, while each hostname gives a
          first-time visitor a different way into the same living idea.
        </p>
      </div>
      <div className="siteGrid">
        {sites.map((site) => {
          const Icon = site.Icon;
          const isCurrent = site.id === currentSite.id;

          return (
            <a
              className="siteCard"
              href={`https://${site.host}`}
              key={site.host}
              aria-current={isCurrent ? 'page' : undefined}
            >
              <Icon aria-hidden="true" size={22} />
              <span className="siteHost">{site.host}</span>
              <span className="siteRole">{site.role}</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function App() {
  const site = getHostConfig();
  const SiteIcon = site.Icon;

  return (
    <>
      <header className="topbar">
        <a className="mark" href="#hero" aria-label="Bloomin home">
          <Sprout aria-hidden="true" size={22} />
          <span>Bloomin'</span>
        </a>
        <nav className="navlinks" aria-label="Primary">
          <a href="#role">Role</a>
          <a href="#bloom-cycle">Cycle</a>
          <a href="#constitution">Constitution</a>
          <a href="#ecosystem">Sites</a>
        </nav>
      </header>
      <main className={`site site-${site.theme}`}>
        <section id="hero" className="hero" aria-labelledby="hero-title">
          <div className="heroCopy">
            <p className="kicker">{site.kicker}</p>
            <h1 id="hero-title">{site.title}</h1>
            <p className="heroLine">{site.heroLine}</p>
            <p className="lede">{site.lede}</p>
            <div className="actions" aria-label="Primary actions">
              <a className="button" href="#role">
                <SiteIcon aria-hidden="true" size={18} />
                <span>{site.cta}</span>
                <ArrowRight aria-hidden="true" size={18} />
              </a>
              <a className="quietLink" href="#bloom-cycle">
                See the cycle
              </a>
            </div>
          </div>
          <BloomHeroArt />
        </section>

        <DomainRole site={site} />
        <BloomCycle />
        <BloomConstitution />
        <EcosystemMap currentSite={site} />

        <section className="closing" aria-labelledby="closing-title">
          <ShieldCheck aria-hidden="true" size={30} />
          <h2 id="closing-title">Technology roots. People bloom.</h2>
          <p>
            The root system can be precise, disciplined, and intelligent. The visible
            invitation stays spacious: truth, trust, belonging, curiosity, contribution,
            stewardship, Bloom.
          </p>
          <p className="closingLine">Honor Good. Keep Bloomin'.</p>
        </section>
      </main>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
