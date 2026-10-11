import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer } from '@/components/MathPrimer';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { getCourse } from '@/content/courses';
import { tokenize } from '@/features/search-lab/search-engine.js';
import { GameLoop, GameExperiment, Recall, ChanceVisual } from './GameVisuals';
import { MINIMAX_CODE } from './lesson07.code';
import { T } from './lesson07.text';
import './lesson07.css';

const NAV = [
  {href:'#toan',label:T.nav.math}, {href:'#model',label:T.nav.model},
  {href:'#minimax',label:T.nav.minimax}, {href:'#lab',label:T.nav.lab,hot:true},
  {href:'#pruning',label:T.nav.pruning}, {href:'#limits',label:T.nav.limits},
  {href:'#chance',label:T.nav.chance}, {href:'#extensions',label:T.nav.extensions},
  {href:'#summary',label:T.nav.summary}, {href:'#quiz',label:T.nav.quiz,hot:true},
  {href:'#practice',label:T.nav.practice},
];
const SLIDES = [{id:'hero',label:T.hero.badge}, ...NAV.map(n=>({id:n.href.slice(1),label:n.label}))];
const HOMEWORK = getCourse('csc14003')?.sessions.find(s=>s.id==='b7')?.links[0]?.href;
const P=({text}:{text:string})=><Html as="p" t={text} className="ls-prose"/>;
function Chapter({id,no,text,children}:{id:string;no:string;text:{title:string;en:string;lead:string};children:ReactNode}) {
  return <section id={id} className={`lesson-section ${id==='practice' ? 'lesson-section--last' : ''}`}><SectionHead no={no} title={text.title} en={text.en} lead={text.lead}/><div className="ls-chapter-body ag-body">{children}</div></section>;
}
function Cards({items}:{items:{title:string;body:string}[]}) { return <div className="ag-cards">{items.map(c=><div className="card" key={c.title}><h3>{c.title}</h3><P text={c.body}/></div>)}</div>; }
function Paras({items}:{items:string[]}) { return <>{items.map(p=><P key={p} text={p}/>)}</>; }
function Table({headers,rows}:{headers:string[];rows:string[][]}) { return <div className="ag-table-scroll" tabIndex={0} aria-label={headers.join(' · ')} onTouchStart={event=>event.stopPropagation()} onTouchEnd={event=>event.stopPropagation()} onKeyDown={event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight') event.stopPropagation();}}><table className="dtable"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,k)=><td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>; }
function BoardExample() {
  return <figure className="card ag-board-example"><div className="ag-boards">{[false,true].map(after=><div key={String(after)}><strong>{after ? T.model.boardAfter : T.model.boardBefore}</strong><div className="ag-board">{['X','X',after?'X':'','O','O','','','',''].map((v,i)=><span key={i} className={after && i===2 ? 'ag-new-mark':''}>{v||'·'}</span>)}</div></div>)}</div><figcaption><P text={T.model.boardCaption}/></figcaption></figure>;
}
export default function Lesson07Adversarial() {
  const [deck,setDeck]=useDeckMode();
  const codeTokens:{c:string;s:string}[]=tokenize(MINIMAX_CODE);
  return <div className="ls-lesson ag-lesson">
    <LessonNav badge={T.hero.badge} title={T.hero.title} backTo="/courses/csc14003" items={NAV} right={<DeckToggle on={deck} onChange={setDeck}/>}/>
    <LessonDeck on={deck} slides={SLIDES}>
      <div className="lesson-hero ls-hero"><div className="ag-hero"><div className="mono ls-eyebrow">{T.hero.eyebrow}</div><h1>{T.hero.title}<br/><em>{T.hero.accent}</em></h1><p className="ls-hero-lead">{T.hero.lead}</p><div className="ls-choices">{[T.hero.time,T.hero.families,T.hero.quiz].map(t=><span className="chip" key={t}>{t}</span>)}</div><div className="ls-choices"><a className="btn btn--primary" href="#model">{T.hero.cta}</a><Link to="/courses/csc14003/lessons/b6">{T.hero.back}</Link></div><div className="card ag-goals"><h3>{T.goals.title}</h3><ul>{T.goals.items.map(goal=><li key={goal}>{goal}</li>)}</ul><p className="ls-note">{T.goals.path}</p></div></div></div>
      <div id="toan" className="lesson-section lesson-section--first"><MathPrimer {...MATH_PRIMERS.b7}/></div>
      <Chapter id="model" no="01" text={T.model}><Paras items={T.model.paras}/><BoardExample/><Cards items={T.model.cards}/><div className="ls-callout"><P text={T.model.assumptions}/></div><h3>{T.model.classifyTitle}</h3><Table headers={T.model.headers} rows={T.model.rows}/></Chapter>
      <Chapter id="minimax" no="02" text={T.minimax}><Paras items={T.minimax.paras}/><div className="ag-formula mono">{T.minimax.formula}</div><GameLoop/><ol className="ag-steps">{T.minimax.steps.map(step=><li key={step}>{step}</li>)}</ol><div className="ls-callout"><P text={T.minimax.takeaway}/></div><P text={T.minimax.strategy}/><div className="card"><h3>{T.minimax.exampleTitle}</h3><P text={T.minimax.example}/></div><Recall question={T.minimax.check}/></Chapter>
      <Chapter id="lab" no="03" text={T.lab}><P text={T.lab.intro}/><GameExperiment/><details className="card ag-details"><summary>{T.hw.hint}</summary><P text={T.lab.answer}/></details></Chapter>
      <Chapter id="pruning" no="04" text={T.pruning}><Paras items={T.pruning.paras}/><GameLoop pruning/><ol className="ag-steps">{T.pruning.steps.map(step=><li key={step}>{step}</li>)}</ol><P text={T.pruning.ordering}/><div className="ls-callout"><P text={T.pruning.cost}/></div><Recall question={T.pruning.check}/></Chapter>
      <Chapter id="limits" no="05" text={T.limits}><Paras items={T.limits.paras}/><div className="card"><P text={T.limits.evaluation}/></div><Cards items={T.limits.cards}/><div className="ls-callout"><P text={T.limits.rule}/></div></Chapter>
      <Chapter id="chance" no="06" text={T.chance}><Paras items={T.chance.paras}/><div className="ag-formula mono">{T.chance.formula}</div><P text={T.chance.example}/><ChanceVisual/><div className="card"><h3>{T.chance.scaleTitle}</h3><P text={T.chance.scale}/></div><P text={T.chance.prune}/><Recall question={T.chance.check}/></Chapter>
      <Chapter id="extensions" no="07" text={T.extensions}><Cards items={T.extensions.cards}/><h3>{T.extensions.codeTitle}</h3><P text={T.extensions.codeLead}/><pre className="codeblock ls-python"><code>{codeTokens.map((token,i)=><span key={i} className={`ls-token-${token.c}`}>{token.s}</span>)}</code></pre></Chapter>
      <Chapter id="summary" no="08" text={T.summary}><Table headers={T.summary.headers} rows={T.summary.rows}/><div className="ls-callout"><P text={T.summary.recall}/></div></Chapter>
      <Chapter id="quiz" no="09" text={T.quiz}><SessionQuiz sessionId="b7"/></Chapter>
      <Chapter id="practice" no="10" text={T.hw}><div className="ag-cards">{T.hw.cards.map(card=><div className="card" key={card.title}><h3>{card.title}</h3><P text={card.body}/><details><summary>{T.hw.hint}</summary><P text={card.hint}/></details></div>)}</div>{HOMEWORK && <a href={HOMEWORK} target="_blank" rel="noreferrer" className="btn">{T.hw.file}</a>}<CheckList storageKey="b7-checks" items={T.hw.checks}/><P text={T.hw.next}/><Link to="/courses/csc14003">{T.hw.roadmap}</Link></Chapter>
    </LessonDeck>
  </div>;
}
