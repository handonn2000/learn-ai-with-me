import { Link } from 'react-router-dom';
import { CanvasScene } from '@/components/CanvasScene';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { INPUT_EX, OUTPUT_EX } from '@/content/courses/csc14003/lab-searching.locale';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { drawGrow, drawHill } from './lesson03.scenes';
import { prefersReducedMotion as rm } from '@/lib/motion';
import { SearchLab } from './SearchLab';
import { Code, CodeLab, HELPER_PY, MAIN_PY } from './CodeLab';
import { T } from './lesson03.text';


interface Stat { k: string; v: string; cls?: string; bd?: string }
function AlgoCard({ color, abbr, name, en, chips, body, stats, children, border }: {
  color: string; abbr: string; name: string; en: string;
  chips: [string, 'cyan' | 'yellow' | 'plain'][];
  body: string; stats: Stat[]; children?: React.ReactNode; border?: string;
}) {
  const chipStyle = (kind: string): React.CSSProperties =>
    kind === 'cyan'
      ? { color: 'var(--cyan-soft)', borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }
      : kind === 'yellow'
        ? { color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 40%, transparent)' }
        : { color: 'var(--muted)' };
  return (
    <Reveal className="card" style={{ marginTop: 16, padding: '24px 26px', borderColor: border }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontWeight: 700, fontSize: 20, color }}>{abbr}</span>
        <span style={{ fontSize: 16, fontWeight: 600 }}>{name}</span>
        <span style={{ color: 'var(--faint)', fontStyle: 'italic', fontFamily: 'var(--font-serif)' }}>{en}</span>
        {chips.map(([label, kind]) => (
          <span key={label} className="chip chip--mono" style={{ fontSize: 11, ...chipStyle(kind) }}>{label}</span>
        ))}
      </div>
      <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 14.5, lineHeight: 1.75, margin: '14px 0 0', maxWidth: 860 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
        {stats.map((s) => (
          <div key={s.k} className={`stat ${s.cls ?? ''}`} style={{ borderColor: s.bd }}>
            <div className="stat__k">{s.k}</div>
            <Html as="div" t={s.v} className="stat__v" />
          </div>
        ))}
      </div>
      {children}
      <div style={{ marginTop: 14, display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 13 }}>
        <a href="#lab">{T.hero.s1}</a>
        <a href="#codelab">⌨ Pseudo-code + Python</a>
      </div>
    </Reveal>
  );
}

const NAV = [
          { href: '#toan', label: T.hero.s2 }, { href: '#ch1', label: '01 Agent' }, { href: '#ch2', label: T.hero.s3 }, { href: '#ch3', label: '03 Khung' },
          { href: '#ch4', label: T.hero.s4 }, { href: '#lab', label: 'LAB', hot: true }, { href: '#ch5', label: '05 Heuristic' },
          { href: '#ch6', label: T.hero.s5 }, { href: '#ch7', label: T.hero.s6 }, { href: '#codelab', label: '08 Code' }, { href: '#quiz', label: '09 Quiz', hot: true }, { href: '#hw', label: T.hero.s7 },
];
const SLIDES = [{ id: 'hero', label: T.hero.s8 }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson03Search() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge={T.hero.s9} title={T.hero.s10} backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 480px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>CSC14003 · PART I — SEARCHING · ZERO → HERO</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                {T.hero.s11}<br />{T.hero.s12} <em style={{ color: 'var(--cyan)' }}>{T.hero.s13}</em>
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 600, margin: '20px 0 0', textWrap: 'pretty' }}>
                {T.hero.s14}
              </p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 27, whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--text-hi)' }}>f(n)</span><span style={{ color: 'var(--faint)' }}> = </span>
                  <span style={{ color: 'var(--cyan)' }}>g(n)</span><span style={{ color: 'var(--faint)' }}> + </span><span style={{ color: 'var(--yellow)' }}>h(n)</span>
                </span>
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>{T.hero.s15}</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>{T.hero.s16}</span>
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[T.hero.s17, 'Lab 1 — Searching', 'Quiz 03', T.hero.s18].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--muted-2)', fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
            <div data-anim style={{ flex: '0 1 400px', minWidth: 300, animation: 'mnFloat 7s ease-in-out infinite' }}>
              <svg viewBox="0 0 380 300" style={{ width: '100%', display: 'block' }}>
                {([[30, 150, 120, 62], [30, 150, 120, 238], [120, 62, 230, 42], [120, 62, 230, 258], [120, 238, 230, 258], [230, 42, 330, 150], [230, 258, 330, 150]] as const).map((l, i) => (
                  <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#2A3242" strokeWidth="2" />
                ))}
                {([[30, 150, 120, 62], [120, 62, 230, 42], [230, 42, 330, 150]] as const).map((l, i) => (
                  <line key={'f' + i} data-anim x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#58C4DD" strokeWidth="2.5" strokeDasharray="5 22" style={{ animation: 'mnFlow 1.5s linear infinite' }} />
                ))}
                <circle cx="30" cy="150" r="16" fill="#12151A" stroke="#F4D345" strokeWidth="2" />
                <circle cx="120" cy="62" r="15" fill="#12151A" stroke="#58C4DD" strokeWidth="2" />
                <circle cx="120" cy="238" r="15" fill="#12151A" stroke="#3A4254" strokeWidth="2" />
                <circle cx="230" cy="42" r="15" fill="#12151A" stroke="#58C4DD" strokeWidth="2" />
                <circle cx="230" cy="258" r="15" fill="#12151A" stroke="#3A4254" strokeWidth="2" />
                <circle cx="330" cy="150" r="16" fill="#12151A" stroke="#83C167" strokeWidth="2.5" />
                <circle cx="330" cy="150" r="23" fill="none" stroke="rgba(131,193,103,.5)" strokeWidth="1.2" strokeDasharray="4 4" />
                <text x="30" y="155" textAnchor="middle" fill="#F4D345" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>S</text>
                <text x="330" y="155" textAnchor="middle" fill="#83C167" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700 }}>G</text>
                <text x="120" y="67" textAnchor="middle" fill="#ECEFF4" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>a</text>
                <text x="120" y="243" textAnchor="middle" fill="#8B93A7" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>b</text>
                <text x="230" y="47" textAnchor="middle" fill="#ECEFF4" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>c</text>
                <text x="230" y="263" textAnchor="middle" fill="#8B93A7" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>d</text>
                <text x="52" y="128" fill="rgba(244,211,69,.75)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=6</text>
                <text x="140" y="48" fill="rgba(244,211,69,.75)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=4</text>
                <text x="250" y="30" fill="rgba(244,211,69,.75)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=2</text>
                <text x="305" y="122" fill="rgba(131,193,103,.8)" style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5 }}>h=0</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Toán nền — mở màn, không đánh số */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b3 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 01 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title={T.ch1.s1} en="Problem-solving agents"
            lead={T.ch1.s2} />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 14, marginTop: 24 }}>
            {([
              ['var(--cyan)', T.ch1.s3, T.ch1.s4, T.ch1.s5],
              ['var(--cyan)', T.ch1.s6, T.ch1.s7, T.ch1.s8],
              ['var(--yellow)', T.ch1.s9, T.ch1.s10, T.ch1.s11],
              ['var(--green)', T.ch1.s12, T.ch1.s13, T.ch1.s14],
            ] as [string, string, string, string][]).map(([c, k, t, body]) => (
              <div key={k} className="card" style={{ padding: 20 }}>
                <div className="mono" style={{ fontSize: 11, color: c }}>{k}</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{t}</div>
                <Html as="p" t={body} style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 16, padding: '16px 20px', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="kicker">{T.ch1.s15}</span>
            {[T.ch1.s16, T.ch1.s17, T.ch1.s18, T.ch1.s19].map((t) => <span key={t} className="chip">{t}</span>)}
            <Html as="span" t={T.ch1.s20} style={{ fontSize: 13, color: 'var(--muted)' }} />
          </Reveal>
        </div>

        {/* 02 */}
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title={T.ch2.s1} en="Problem formulation"
            lead={T.ch2.s2} />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginTop: 24 }}>
            {([
              ['1 · INITIAL STATE', T.ch2.s3, 'In(Arad)'],
              ['2 · ACTIONS(s)', T.ch2.s4, '{Go(Sibiu), Go(Timișoara), Go(Zerind)}'],
              ['3 · TRANSITION MODEL', T.ch2.s5, 'Result(In(Arad), Go(Sibiu)) = In(Sibiu)'],
              ['4 · GOAL TEST', T.ch2.s6, 's = In(Bucharest)?'],
              ['5 · PATH COST', T.ch2.s7, T.ch2.s8],
            ] as [string, string, string][]).map(([k, body, ex]) => (
              <div key={k} className="card" style={{ padding: 18 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>{k}</div>
                <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.6, margin: '8px 0 0' }}>{body}</p>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--muted-2)', marginTop: 8 }}>{ex}</div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15}>
            <Html as="p" t={T.ch2.s9} style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, margin: '16px 0 0', display: 'block' }} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">{T.ch2.s10}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {[T.ch2.s11, '15-puzzle: ~10¹³', '24-puzzle: ~10²⁵'].map((t) => <span key={t} className="chip">{t}</span>)}
                <span className="chip" style={{ color: 'var(--red)', borderColor: 'color-mix(in srgb, var(--red) 35%, transparent)' }}>sliding-block: NP-complete</span>
              </div>
              <Html as="p" t={T.ch2.s12} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">{T.ch2.s13}</span>
              <Html as="p" t={T.ch2.s14} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
            </div>
          </Reveal>
        </div>

        {/* 03 */}
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title={T.ch3.s1} en="Tree search · Graph search"
            lead={T.ch3.s2} />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(340px,100%),1fr))', gap: 14, marginTop: 24 }}>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{T.ch3.s3}</div>
              <Html as="div" t={T.ch3.s4} />
            </div>
            <div className="canvas-panel" style={{ borderColor: 'rgba(244,211,69,.3)' }}>
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#F4D345' }}>{T.ch3.s5}</div>
              <Html as="div" t={T.ch3.s6} />
            </div>
          </Reveal>
          <Reveal delay={0.15} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginTop: 16 }}>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">{T.ch3.s7}</span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['STATE', 'PARENT', 'ACTION', 'PATH-COST g(n)'].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--cyan-soft)', borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }}>{t}</span>
                ))}
              </div>
              <Html as="p" t={T.ch3.s8} style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
            </div>
            <div className="card" style={{ padding: '18px 20px' }}>
              <span className="kicker">{T.ch3.s9}</span>
              <Html as="p" t={T.ch3.s10} style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.65, margin: '10px 0 0' }}>{T.ch3.s11}</p>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 16, padding: '18px 20px' }}>
            <span className="kicker">{T.ch3.s12}</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12, marginTop: 14 }}>
              {([
                [T.ch3.s13, T.ch3.s14],
                [T.ch3.s15, T.ch3.s16],
                [T.ch3.s17, T.ch3.s18],
                [T.ch3.s19, T.ch3.s20],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-hi)' }}>{k}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginTop: 4 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
              {[T.ch3.s21, T.ch3.s22, T.ch3.s23].map((t) => (
                <span key={t} className="chip chip--mono">{t}</span>
              ))}
            </div>
          </Reveal>
        </div>

        {/* 04 — Tìm kiếm mù */}
        <div id="ch4" className="lesson-section">
          <SectionHead no="04" title={T.ch4.s1} en="Uninformed search — BFS · UCS · DFS · DLS · IDS"
            lead={T.ch4.s2} />
          <AlgoCard color="var(--cyan)" abbr="BFS" name={T.ch4.s3} en="Breadth-first search"
            chips={[['frontier: FIFO queue', 'cyan'], [T.ch4.s4, 'plain']]}
            body={T.ch4.s5}
            stats={[
              { k: T.ch4.s6, v: T.ch4.s7, cls: 'stat--good' },
              { k: T.ch4.s8, v: T.ch4.s9, cls: 'stat--good' },
              { k: T.ch4.s10, v: 'O(b<sup>d</sup>)' },
              { k: T.ch4.s11, v: T.ch4.s12, cls: 'stat--bad stat--bad-b' },
            ]}>
            <div style={{ marginTop: 16, overflowX: 'auto' }}>
              <table className="dtable mono" style={{ fontSize: 12.5 }}>
                <tbody>
                  <tr style={{ color: 'var(--faint)' }}><td style={{ padding: '6px 10px' }}>{T.ch4.s13}</td><td style={{ padding: '6px 10px' }}>{T.ch4.s14}</td><td style={{ padding: '6px 10px' }}>{T.ch4.s15}</td><td style={{ padding: '6px 10px' }}>{T.ch4.s16}</td></tr>
                  {([['6', '10⁶', T.ch4.s17, '1 GB', 'var(--text-2)'], ['10', '10¹⁰', T.ch4.s18, '10 TB', 'var(--text-2)'], ['12', '10¹²', T.ch4.s19, '1 PB', 'var(--red-soft)'], ['16', '10¹⁶', T.ch4.s20, '10 EB', 'var(--red)']] as string[][]).map((row) => (
                    <tr key={row[0]} style={{ color: row[4] }}>
                      {row.slice(0, 4).map((c, j) => <td key={j} style={{ padding: '6px 10px', borderBottom: 'none' }}>{c}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 6, fontStyle: 'italic' }}>{T.ch4.s21}</div>
            </div>
          </AlgoCard>
          <Reveal className="canvas-panel" style={{ marginTop: 16 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">{T.ch4.s22}</span>
              <span className="canvas-panel__sub">{T.ch4.s23}</span>
            </div>
            <CanvasScene height={250} draw={(x, api) => drawGrow(x, api, rm)} />
          </Reveal>
          <AlgoCard color="var(--green)" abbr="UCS" name={T.ch4.s24} en="Uniform-cost search = Dijkstra"
            chips={[['frontier: priority queue theo g(n)', 'cyan'], [T.ch4.s25, 'yellow']]}
            body={T.ch4.s26}
            stats={[
              { k: T.ch4.s27, v: T.ch4.s28, cls: 'stat--good' },
              { k: T.ch4.s29, v: T.ch4.s30, cls: 'stat--good' },
              { k: T.ch4.s31, v: 'O(b<sup>1+⌊C*/ε⌋</sup>)' },
              { k: T.ch4.s32, v: T.ch4.s33 },
            ]}>
            <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '12px 0 0' }}>{T.ch4.s34}</p>
          </AlgoCard>
          <AlgoCard color="var(--red)" abbr="DFS" name={T.ch4.s35} en="Depth-first search"
            chips={[['frontier: LIFO stack', 'cyan'], [T.ch4.s36, 'plain']]}
            body={T.ch4.s37}
            stats={[
              { k: T.ch4.s38, v: T.ch4.s39, cls: 'stat--warn' },
              { k: T.ch4.s40, v: '✗', cls: 'stat--bad' },
              { k: T.ch4.s41, v: T.ch4.s42 },
              { k: T.ch4.s43, v: T.ch4.s44, cls: 'stat--good stat--good-b' },
            ]}>
            <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12, marginTop: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--red)' }}>{T.ch4.s45}</div>
              <Html as="p" t={T.ch4.s46} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 12, marginTop: 12 }}>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>{T.ch4.s47}</div>
                  <Html as="p" t={T.ch4.s48} style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.65, margin: '6px 0 0' }} />
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 11, color: 'var(--yellow)' }}>{T.ch4.s49}</div>
                  <Html as="p" t={T.ch4.s50} style={{ color: 'var(--muted)', fontSize: 12.5, lineHeight: 1.65, margin: '6px 0 0' }} />
                </div>
              </div>
              <Html as="p" t={T.ch4.s51} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
          </AlgoCard>
          <AlgoCard color="var(--purple)" abbr="DLS → IDS" name={T.ch4.s52} en="Depth-limited · Iterative deepening"
            chips={[[T.ch4.s53, 'cyan']]}
            body={T.ch4.s54}
            stats={[
              { k: T.ch4.s55, v: T.ch4.s56, cls: 'stat--good' },
              { k: T.ch4.s57, v: T.ch4.s58, cls: 'stat--good' },
              { k: T.ch4.s59, v: 'O(b<sup>d</sup>)' },
              { k: T.ch4.s60, v: 'O(bd)', cls: 'stat--good stat--good-b' },
            ]}>
            <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12, marginTop: 16 }}>
              <div className="mono" style={{ fontSize: 11, color: 'var(--purple)' }}>{T.ch4.s61}</div>
              <Html as="p" t={T.ch4.s62} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
                <div className="stat stat--bad"><div className="stat__k">{T.ch4.s63}</div><Html as="div" t="✗ khi ℓ &lt; d" className="stat__v" /></div>
                <div className="stat stat--bad"><div className="stat__k">{T.ch4.s64}</div><Html as="div" t="✗ khi ℓ &gt; d" className="stat__v" /></div>
                <div className="stat"><div className="stat__k">{T.ch4.s65}</div><Html as="div" t="O(b<sup>ℓ</sup>)" className="stat__v" /></div>
                <div className="stat"><div className="stat__k">{T.ch4.s66}</div><Html as="div" t="O(bℓ)" className="stat__v" /></div>
              </div>
              <Html as="p" t={T.ch4.s67} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
            <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '12px 0 0' }}>{T.ch4.s68}</p>
          </AlgoCard>
          <Reveal className="card" style={{ marginTop: 16, background: 'color-mix(in srgb, var(--cyan) 4%, transparent)', borderColor: 'color-mix(in srgb, var(--cyan) 25%, transparent)', padding: '16px 20px' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--cyan)', letterSpacing: '.8px' }}>BONUS · BIDIRECTIONAL SEARCH</span>
            <Html as="p" t={T.ch4.s69} style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '8px 0 0' }} />
          </Reveal>
        </div>

        {/* LAB */}
        <div id="lab" className="lesson-section">
          <Reveal>
            <div className="sec-head">
              <span className="mono" style={{ color: 'var(--on-accent)', fontSize: 12, fontWeight: 700, background: 'var(--yellow)', borderRadius: 7, padding: '3px 9px' }}>LAB</span>
              <h2 className="sec-head__title">{T.lab.s1}</h2>
            </div>
            <div className="sec-rule" style={{ '--rule-color': 'var(--yellow)' } as React.CSSProperties} />
            <Html as="p" t={T.lab.s2} className="sec-lead" />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SearchLab />
          </Reveal>
          <Reveal delay={0.15}>
            <Html as="p" t={T.lab.s3} style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '14px 0 0', display: 'block' }} />
          </Reveal>
        </div>

        {/* 05 */}
        <div id="ch5" className="lesson-section">
          <SectionHead no="05" title={T.ch5.s1} en="Informed search — GBFS · A*" color="var(--yellow)"
            lead={T.ch5.s2} />
          <Reveal delay={0.05} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {['h(Arad) = 366', 'h(Sibiu) = 253', T.ch5.s3, 'h(Pitești) = 100'].map((t) => <span key={t} className="chip chip--mono">{t}</span>)}
            <span className="chip chip--mono" style={{ color: 'var(--green)', borderColor: 'color-mix(in srgb, var(--green) 40%, transparent)' }}>h(București) = 0</span>
          </Reveal>
          <AlgoCard color="var(--orange)" abbr="GBFS" name="Tham lam theo heuristic" en="Greedy best-first search"
            chips={[['frontier: priority queue theo h(n)', 'cyan'], [T.ch5.s4, 'plain']]}
            body={T.ch5.s5}
            stats={[
              { k: T.ch5.s6, v: T.ch5.s7, cls: 'stat--warn' },
              { k: T.ch5.s8, v: '✗', cls: 'stat--bad' },
              { k: T.ch5.s9, v: 'O(b<sup>m</sup>)' },
              { k: T.ch5.s10, v: T.ch5.s11 },
            ]} />
          <AlgoCard color="var(--yellow)" abbr="A*" name={T.ch5.s12} en="A-star search" border="color-mix(in srgb, var(--yellow) 30%, transparent)"
            chips={[['frontier: priority queue theo f(n)', 'cyan'], [T.ch5.s13, 'yellow']]}
            body={T.ch5.s14}
            stats={[
              { k: T.ch5.s15, v: '✓', cls: 'stat--good' },
              { k: T.ch5.s16, v: '✓ admissible / consistent', cls: 'stat--good' },
              { k: T.ch5.s17, v: T.ch5.s18 },
              { k: T.ch5.s19, v: T.ch5.s20, cls: 'stat--bad stat--bad-b' },
            ]}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14, marginTop: 16 }}>
              <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>{T.ch5.s21}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, marginTop: 8, color: 'var(--text-hi)' }}>{T.ch5.s22}</div>
                <Html as="p" t={T.ch5.s23} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
              <div className="panel-inner" style={{ padding: '16px 18px', borderRadius: 12 }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--green)' }}>{T.ch5.s24}</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, marginTop: 8, color: 'var(--text-hi)' }}>h(n) ≤ c(n, a, n′) + h(n′)</div>
                <Html as="p" t={T.ch5.s25} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
            </div>
            <div className="canvas-panel" style={{ marginTop: 16 }}>
              <div className="canvas-panel__head">
                <span className="canvas-panel__title">{T.ch5.s26}</span>
                <span className="canvas-panel__sub">{T.ch5.s27}</span>
              </div>
              <svg viewBox="0 0 700 220" style={{ width: '100%', display: 'block', padding: '10px 0 4px' }}>
                {[30, 55, 80, 105, 130].map((r, i) => (
                  <circle key={r} cx="170" cy="118" r={r} fill="none" stroke="#58C4DD" strokeWidth="1.3" opacity={0.62 - i * 0.09} />
                ))}
                {([[445, 35, 26], [461, 62, 37], [479, 90, 46], [498, 120, 55], [516, 150, 63]] as const).map(([cx, rx, ry], i) => (
                  <ellipse key={cx} cx={cx} cy="118" rx={rx} ry={ry} fill="none" stroke="#F4D345" strokeWidth="1.3" opacity={0.62 - i * 0.09} />
                ))}
                {([[170, 300, '#58C4DD'], [430, 600, '#F4D345']] as const).map(([sx, gx, c]) => (
                  <g key={sx}>
                    <line x1={sx} y1="118" x2={gx} y2="118" stroke="#3A4254" strokeWidth="1.5" strokeDasharray="4 5" />
                    <circle cx={sx} cy="118" r="11" fill="#12151A" stroke={c} strokeWidth="2" />
                    <circle cx={gx} cy="118" r="11" fill="#12151A" stroke="#83C167" strokeWidth="2" />
                    <text x={sx} y="122" textAnchor="middle" fill={c} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>S</text>
                    <text x={gx} y="122" textAnchor="middle" fill="#83C167" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>G</text>
                  </g>
                ))}
                <text x="170" y="30" textAnchor="middle" fill="#58C4DD" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>UCS — h(n) = 0</text>
                <text x="170" y="206" textAnchor="middle" fill="#5C6579" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>{T.ch5.s28}</text>
                <text x="500" y="30" textAnchor="middle" fill="#F4D345" style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5 }}>{T.ch5.s29}</text>
                <text x="500" y="206" textAnchor="middle" fill="#5C6579" style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5 }}>{T.ch5.s30}</text>
                <line x1="350" y1="46" x2="350" y2="190" stroke="#1E2430" strokeWidth="1" />
              </svg>
            </div>
            <Html as="p" t={T.ch5.s31} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '14px 0 0' }} />
            <Html as="p" t={T.ch5.s32} style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '12px 0 0' }} />
          </AlgoCard>
          <Reveal style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(330px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <span className="kicker">{T.ch5.s33}</span>
              <Html as="p" t={T.ch5.s34} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <Html as="p" t={T.ch5.s35} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <Html as="p" t="<span style='font-family:var(--font-serif);font-style:italic;font-size:1.25em'>N + 1 = 1 + b* + (b*)² + … + (b*)<sup>d</sup></span>" style={{ color: 'var(--text-hi)', margin: '12px 0 0', textAlign: 'center' }} />
              <Html as="p" t={T.ch5.s36} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <div style={{ overflowX: 'auto', marginTop: 14 }}>
                <table className="dtable mono" style={{ fontSize: 12 }}>
                  <tbody>
                    <tr style={{ color: 'var(--faint)' }}><td /><td colSpan={2} style={{ textAlign: 'center' }}>{T.ch5.s37}</td><td colSpan={2} style={{ textAlign: 'center' }}>b*</td></tr>
                    <tr style={{ color: 'var(--faint)' }}><td /><td>d = 12</td><td>d = 24</td><td>d = 12</td><td>d = 24</td></tr>
                    <tr style={{ color: 'var(--red-soft)' }}><td>IDS</td><td>3.644.035</td><td>–</td><td>2,78</td><td>–</td></tr>
                    <tr style={{ color: 'var(--text-2)' }}><td>A*(h₁)</td><td>227</td><td>39.135</td><td>1,42</td><td>1,48</td></tr>
                    <tr style={{ color: 'var(--green-soft)' }}><td>A*(h₂)</td><td>73</td><td>1.641</td><td>1,24</td><td>1,26</td></tr>
                  </tbody>
                </table>
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 8, fontStyle: 'italic' }}>{T.ch5.s38}</div>
            </div>
            <div className="card">
              <span className="kicker">{T.ch5.s39}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t={T.ch5.s40} />
                <Html t={T.ch5.s41} />
                <Html t={T.ch5.s42} />
                <Html t={T.ch5.s43} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* 06 */}
        <div id="ch6" className="lesson-section">
          <SectionHead no="06" title={T.ch6.s1} en="Hill-climbing, first-choice" color="var(--red)"
            lead={T.ch6.s2} />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">{T.ch6.s3}</span>
              <span className="canvas-panel__sub">{T.ch6.s4}</span>
            </div>
            <CanvasScene height={290} draw={(x, api) => drawHill(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="kicker">{T.ch6.s5}</span>
            {[T.ch6.s6, T.ch6.s7, T.ch6.s8].map((t) => (
              <span key={t} className="chip" style={{ fontSize: 12.5, color: 'var(--red-soft)', borderColor: 'color-mix(in srgb, var(--red) 35%, transparent)' }}>{t}</span>
            ))}
            <Html as="span" t={T.ch6.s9} style={{ fontSize: 13, color: 'var(--muted)' }} />
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--muted-2)', fontSize: 13.5, lineHeight: 1.7, margin: '14px 0 0', fontStyle: 'italic' }}>
              {T.ch6.s10}
            </p>
          </Reveal>
        </div>

        {/* 07 */}
        <div id="ch7" className="lesson-section">
          <SectionHead no="07" title={T.ch7.s1} en="" />
          <Reveal delay={0.1} className="card" style={{ marginTop: 22, padding: '8px 18px 14px', overflowX: 'auto' }}>
            <table className="dtable" style={{ minWidth: 820 }}>
              <tbody>
                <tr className="dtable__head"><td>{T.ch7.s2}</td><td>FRONTIER</td><td>{T.ch7.s3}</td><td>{T.ch7.s4}</td><td>{T.ch7.s5}</td><td>{T.ch7.s6}</td><td>{T.ch7.s7}</td></tr>
                {([
                  ['BFS', 'var(--cyan)', 'FIFO', ['✓¹', 'g'], ['✓²', 'g'], 'O(b<sup>d</sup>)', ['O(b<sup>d</sup>)', 'r'], T.ch7.s8],
                  ['DFS', 'var(--red)', 'LIFO', ['✓³', 'y'], ['✗', 'r'], 'O(b<sup>m</sup>)', ['O(bm)', 'g'], T.ch7.s9],
                  ['UCS', 'var(--green)', 'PQ theo g', ['✓¹', 'g'], ['✓', 'g'], 'O(b<sup>1+⌊C*/ε⌋</sup>)', [T.ch7.s10, 'n'], T.ch7.s11],
                  ['IDS', 'var(--purple)', T.ch7.s12, ['✓¹', 'g'], ['✓²', 'g'], 'O(b<sup>d</sup>)', ['O(bd)', 'g'], T.ch7.s13],
                  ['GBFS', 'var(--orange)', 'PQ theo h', ['✗ / ✓³', 'y'], ['✗', 'r'], 'O(b<sup>m</sup>)', ['O(b<sup>m</sup>)', 'n'], T.ch7.s14],
                  ['A*', 'var(--yellow)', 'PQ theo f = g+h', ['✓', 'g'], ['✓⁴', 'g'], T.ch7.s15, ['O(b<sup>d</sup>)', 'r'], T.ch7.s16],
                  ['HC', 'var(--pink)', T.ch7.s17, ['✗', 'r'], ['✗', 'r'], T.ch7.s18, ['O(1)', 'g'], T.ch7.s19],
                ] as [string, string, string, [string, string], [string, string], string, [string, string], string][]).map(([name, c, fr, comp, opt, time, mem, use]) => {
                  const cc = (k: string) => (k === 'g' ? 'var(--green)' : k === 'r' ? 'var(--red)' : k === 'y' ? 'var(--yellow)' : 'var(--text-2)');
                  return (
                    <tr key={name}>
                      <td className="mono" style={{ fontWeight: 700, color: c }}>{name}</td>
                      <td style={{ color: 'var(--muted)' }}>{fr}</td>
                      <td style={{ color: cc(comp[1]) }}>{comp[0]}</td>
                      <td style={{ color: cc(opt[1]) }}>{opt[0]}</td>
                      <Html as="td" t={time} style={{ color: 'var(--text-2)' }} />
                      <Html as="td" t={mem[0]} style={{ color: cc(mem[1]) }} />
                      <td style={{ color: 'var(--muted)' }}>{use}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 10, fontStyle: 'italic' }}>
              {T.ch7.s20}
            </div>
          </Reveal>
        </div>

        {/* 08 — Code Lab */}
        <div id="codelab" className="lesson-section">
          <SectionHead no="08" title={T.codelab.s1} en="Lab 1 — Searching · CSC14003" color="var(--green)"
            lead={T.codelab.s2} />
          <Reveal delay={0.05} className="card" style={{ marginTop: 20, background: 'color-mix(in srgb, var(--yellow) 5%, transparent)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)', padding: '16px 20px' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--yellow)', letterSpacing: '.8px' }}>{T.codelab.s3}</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10, fontSize: 13.5, color: 'var(--text-hi)' }}>
              <Html as="span" t={T.codelab.s4} className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
              <Html as="span" t={T.codelab.s5} className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
              <Html as="span" t={T.codelab.s6} className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
            </div>
          </Reveal>
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(330px,100%),1fr))', gap: 14, marginTop: 16 }}>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{T.codelab.s7}</div>
              <div style={{ padding: '14px 18px 0', fontSize: 13, color: '#97A0B5', lineHeight: 1.7 }}>{T.codelab.s8}</div>
              <pre className="codeblock" style={{ background: 'transparent', color: '#B8C0D2' }}>{INPUT_EX}</pre>
            </div>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{T.codelab.s9}</div>
              <div style={{ padding: '14px 18px 0', fontSize: 13, color: '#97A0B5', lineHeight: 1.7 }}>{T.codelab.s10}</div>
              <pre className="codeblock" style={{ background: 'transparent', color: '#B8C0D2' }}>{OUTPUT_EX}</pre>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{T.codelab.s11}</div>
            <Code src={HELPER_PY} />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 16 }}>
            <CodeLab />
          </Reveal>
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{T.codelab.s12}</span>
              <span style={{ fontSize: 12, color: '#5C6579', fontStyle: 'italic' }}>{T.codelab.s13}</span>
            </div>
            <Code src={MAIN_PY} style={{ maxHeight: 460, fontSize: 12 }} />
          </Reveal>
          <Reveal delay={0.1} className="card" style={{ marginTop: 16, padding: '18px 20px' }}>
            <span className="kicker">{T.codelab.s14}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
              <Html t={T.codelab.s15} />
              <Html t={T.codelab.s16} />
              <Html t={T.codelab.s17} />
              <Html t={T.codelab.s18} />
              <Html t={T.codelab.s19} />
            </div>
          </Reveal>
        </div>

        {/* 09 — Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="09" title={T.quiz.s1} en={T.quiz.s2} color="var(--cyan)"
            lead={T.quiz.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b3" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* 10 — Bài tập & tự kiểm */}
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="10" title={T.hw.s1} en={T.hw.s2} color="var(--purple)" />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(430px,100%),1fr))', gap: 14, marginTop: 22 }}>
            {([
              [T.hw.s3, T.hw.s4, T.hw.s5],
              [T.hw.s6, T.hw.s7, T.hw.s8],
              [T.hw.s9, T.hw.s10, T.hw.s11],
              [T.hw.s12, T.hw.s13, T.hw.s14],
            ] as [string, string, string][]).map(([k, body, links]) => (
              <div key={k} className="card">
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k}</div>
                <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
                <Html as="div" t={links} style={{ marginTop: 12, fontSize: 12.5 }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 24 }}>
            <CheckList storageKey="b3v3-checks" items={[
              T.hw.s15,
              T.hw.s16,
              T.hw.s17,
              T.hw.s18,
              T.hw.s19,
              T.hw.s20,
              T.hw.s21,
            ]} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t={T.hw.s22} style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>{T.hw.s23}</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
