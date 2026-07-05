import React, {useMemo, useState} from 'react';
import { createRoot } from 'react-dom/client';
import { Leaf, Sprout, Heart, Network, ShieldCheck, BookOpen, ArrowRight, CircleDot } from 'lucide-react';
import './styles.css';

const domains = {
  'bloomin.institute': {kicker:'Research • Protocols • AI-IRB', title:"The Bloomin' Institute", cta:'Explore the Protocol', theme:'institute'},
  'bloomin.foundation': {kicker:'Stewardship • Grants • Public Benefit', title:"The Bloomin' Foundation", cta:'Steward the Garden', theme:'foundation'},
  'bloom.giving': {kicker:'Honor Good • Give More Than You Take', title:'Bloom Giving', cta:'Honor Good', theme:'giving'},
  'bloom.gdn': {kicker:'The Garden • The Symbol • The Soil', title:'Bloom Garden', cta:'Enter the Garden', theme:'garden'},
  default: {kicker:'Adaptive Ecosystem Stewardship', title:"Keep Bloomin'", cta:'Begin Bloomin\'', theme:'default'}
};

function hostConfig(){
  const h = window.location.hostname.replace(/^www\./,'');
  return domains[h] || domains.default;
}

function Toroid(){
  const rings = useMemo(()=>Array.from({length:9},(_,i)=>i),[]);
  return <div className="toroid" aria-hidden="true">
    <svg viewBox="0 0 600 600" role="img">
      <defs>
        <radialGradient id="g" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(244,255,236,.9)"/>
          <stop offset="55%" stopColor="rgba(126,177,124,.35)"/>
          <stop offset="100%" stopColor="rgba(88,122,91,.05)"/>
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="265" fill="url(#g)" />
      {rings.map(i => <ellipse key={i} cx="300" cy="300" rx={235-i*18} ry={82+i*10} className={`ring r${i}`} transform={`rotate(${i*20} 300 300)`}/>) }
      <path className="flow" d="M300 555 C210 460 190 385 300 302 C410 219 390 140 300 45" />
      <circle className="pulse" cx="300" cy="300" r="16" />
    </svg>
  </div>
}

const chakras = ['Ground','Flow','Shine','Love','Say','See','Know'];
const principles = [
  ['Truth','What is can be witnessed without distortion.'],
  ['Trust','What is witnessed can be relied upon.'],
  ['Belonging','What belongs has courage to grow.'],
  ['Stewardship','What is entrusted is tended with care.'],
  ['Merit','What contributes becomes visible.'],
  ['Bloom','What is nourished naturally emerges.'],
];

function App(){
  const cfg = hostConfig();
  const [open,setOpen] = useState('institute');
  return <main className={`site ${cfg.theme}`}>
    <nav>
      <a className="mark" href="#top"><Sprout size={22}/> Bloomin'</a>
      <div className="navlinks"><a href="#protocol">Protocol</a><a href="#sites">Sites</a><a href="#charter">Charter</a></div>
    </nav>
    <section id="top" className="hero">
      <div className="heroText">
        <p className="kicker">{cfg.kicker}</p>
        <h1>{cfg.title}</h1>
        <p className="lede">A responsive, evidence-seeking ecosystem for human flourishing: clean technology, adaptive stewardship, trustworthy provenance, and the spacious conditions where people, communities, and institutions can bloom.</p>
        <div className="actions"><a className="button" href="#protocol">{cfg.cta}<ArrowRight size={18}/></a><a className="ghost" href="#charter">Read the charter</a></div>
      </div>
      <Toroid />
    </section>
    <section className="mantra" aria-label="Flow mantra">
      {chakras.map((c,i)=><span key={c} style={{'--i':i}}>{c}</span>)}
    </section>
    <section id="protocol" className="gridSection">
      <div className="sectionHead"><p className="kicker">Bloom Protocol</p><h2>Ground → Flow → Shine → Love → Say → See → Know</h2><p>From root to crown, the system supports natural blooming: safety, curiosity, capability, contribution, recognition, and stewardship.</p></div>
      <div className="cards">{principles.map(([t,d],i)=><article className="card" key={t}><CircleDot/><h3>{t}</h3><p>{d}</p></article>)}</div>
    </section>
    <section id="sites" className="sites">
      <div><p className="kicker">Symphony of Sites</p><h2>One ethos. Four seeds.</h2></div>
      <div className="accordion">
        {[
          ['institute','bloomin.institute','DOE protocols, AI-IRB oversight, research notes, publications, and learning pathways.',BookOpen],
          ['foundation','bloomin.foundation','Public-benefit stewardship, grants, scholarships, and Honor Good initiatives.',Heart],
          ['giving','bloom.giving','The philosophy-facing home for Give More Than You Take and Leave More Than You Found.',Leaf],
          ['garden','bloom.gdn','The symbolic garden: explainer stories, animated maps, and the living Bloom doctrine.',Network],
        ].map(([id,name,copy,Icon])=><button className={`siteCard ${open===id?'active':''}`} onClick={()=>setOpen(id)} key={id}><Icon/><strong>{name}</strong><span>{copy}</span></button>)}
      </div>
    </section>
    <section id="charter" className="charter">
      <ShieldCheck size={30}/>
      <h2>Honor Good. Cultivate Belonging. Give More Than You Take. Leave More Than You Found. Keep Bloomin'.</h2>
      <p>We do not manufacture human potential. We steward environments of trust, curiosity, care, and evidence in which the life already present may more freely express itself.</p>
      <p className="aum">Aum Shanti Aikyam Premena Ananda Vipassana Swaha</p>
    </section>
  </main>
}
createRoot(document.getElementById('root')).render(<App/>);
