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
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { INPUT_EX, OUTPUT_EX } from '@/content/courses/csc14003/lab-searching.locale';
import { AlgoCard } from '@/features/search-lab/AlgoCard';
import { SearchLab } from '@/features/search-lab/SearchLab';
import { Code, CodeLab, HELPER_PY, MAIN_PY } from '@/features/search-lab/CodeLab';
import { drawHill } from '@/features/search-lab/scenes';
import { T as L } from '@/features/search-lab/lab.text';
import { prefersReducedMotion as rm } from '@/lib/motion';
import { T } from './lesson05.text';

const NAV = [
  { href: '#toan', label: T.hero.navMath },
  { href: '#ch1', label: T.hero.nav01 }, { href: '#ch2', label: T.hero.nav02 },
  { href: '#ch3', label: T.hero.nav03 }, { href: '#lab', label: T.hero.navLab, hot: true },
  { href: '#codelab', label: T.hero.navCode },
  { href: '#quiz', label: T.hero.navQuiz, hot: true }, { href: '#hw', label: T.hero.navHw },
];
const SLIDES = [{ id: 'hero', label: T.hero.cover }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson05Informed() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge={T.hero.badge} title={T.hero.navTitle} backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 480px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>CSC14003 · PART II — SEARCHING</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                {T.hero.titleA}<br />{T.hero.titleB} <em style={{ color: 'var(--yellow)' }}>{T.hero.titleC}</em>
              </h1>
              <Html as="p" t={T.hero.lead} style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 600, margin: '20px 0 0', textWrap: 'pretty' }} />
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>{T.hero.chipG}</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>{T.hero.chipH}</span>
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[T.hero.chipSections, T.hero.chipHours].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--muted-2)', fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toán nền — mở màn, không đánh số */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b5 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 05 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title={T.ch5.s1} en="Informed search — GBFS · A*" color="var(--yellow)"
            lead={T.ch5.s2} />
          <Reveal delay={0.05} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
            {['h(Arad) = 366', 'h(Sibiu) = 253', T.ch5.s3, 'h(Pitești) = 100'].map((t) => <span key={t} className="chip chip--mono">{t}</span>)}
            <span className="chip chip--mono" style={{ color: 'var(--green)', borderColor: 'color-mix(in srgb, var(--green) 40%, transparent)' }}>h(București) = 0</span>
          </Reveal>
          <AlgoCard labCta={T.hero.labCta} color="var(--orange)" abbr="GBFS" name="Tham lam theo heuristic" en="Greedy best-first search"
            chips={[['frontier: priority queue theo h(n)', 'cyan'], [T.ch5.s4, 'plain']]}
            body={T.ch5.s5}
            stats={[
              { k: T.ch5.s6, v: T.ch5.s7, cls: 'stat--warn' },
              { k: T.ch5.s8, v: '✗', cls: 'stat--bad' },
              { k: T.ch5.s9, v: 'O(b<sup>m</sup>)' },
              { k: T.ch5.s10, v: T.ch5.s11 },
            ]} />
          <AlgoCard labCta={T.hero.labCta} color="var(--yellow)" abbr="A*" name={T.ch5.s12} en="A-star search" border="color-mix(in srgb, var(--yellow) 30%, transparent)"
            chips={[['frontier: priority queue theo f(n)', 'cyan'], [T.ch5.s13, 'yellow']]}
            body={T.ch5.s14}
            stats={[
              { k: T.ch5.s15, v: T.ch5.s44, cls: 'stat--good' },
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
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title={T.ch6.s1} en="Hill-climbing, first-choice" color="var(--red)"
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
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title={T.ch7.s1} en="" />
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
                  ['A*', 'var(--yellow)', 'PQ theo f = g+h', ['✓¹', 'g'], ['✓⁴', 'g'], T.ch7.s15, ['O(b<sup>d</sup>)', 'r'], T.ch7.s16],
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

        {/* LAB */}
        <div id="lab" className="lesson-section">
          <Reveal>
            <div className="sec-head">
              <span className="mono" style={{ color: 'var(--on-accent)', fontSize: 12, fontWeight: 700, background: 'var(--yellow)', borderRadius: 7, padding: '3px 9px' }}>LAB</span>
              <h2 className="sec-head__title">{L.lab.s1}</h2>
            </div>
            <div className="sec-rule" style={{ '--rule-color': 'var(--yellow)' } as React.CSSProperties} />
            <Html as="p" t={L.lab.s2} className="sec-lead" />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SearchLab only={['GBFS', 'ASTAR', 'HC']} />
          </Reveal>
          <Reveal delay={0.15}>
            <Html as="p" t={L.lab.s3} style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '14px 0 0', display: 'block' }} />
          </Reveal>
        </div>

        {/* 08 — Code Lab */}
        <div id="codelab" className="lesson-section">
          <SectionHead no="04" title={L.codelab.s1} en="Lab 1 — Searching · CSC14003" color="var(--green)"
            lead={L.codelab.s2} />
          <Reveal delay={0.05} className="card" style={{ marginTop: 20, background: 'color-mix(in srgb, var(--yellow) 5%, transparent)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)', padding: '16px 20px' }}>
            <span className="mono" style={{ fontSize: 11, color: 'var(--yellow)', letterSpacing: '.8px' }}>{L.codelab.s3}</span>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10, fontSize: 13.5, color: 'var(--text-hi)' }}>
              <Html as="span" t={L.codelab.s4} className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
              <Html as="span" t={L.codelab.s5} className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
              <Html as="span" t={L.codelab.s6} className="chip" style={{ padding: '6px 10px', background: 'var(--panel)' }} />
            </div>
          </Reveal>
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(330px,100%),1fr))', gap: 14, marginTop: 16 }}>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{L.codelab.s7}</div>
              <div style={{ padding: '14px 18px 0', fontSize: 13, color: '#97A0B5', lineHeight: 1.7 }}>{L.codelab.s8}</div>
              <pre className="codeblock" style={{ background: 'transparent', color: '#B8C0D2' }}>{INPUT_EX}</pre>
            </div>
            <div className="canvas-panel">
              <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{L.codelab.s9}</div>
              <div style={{ padding: '14px 18px 0', fontSize: 13, color: '#97A0B5', lineHeight: 1.7 }}>{L.codelab.s10}</div>
              <pre className="codeblock" style={{ background: 'transparent', color: '#B8C0D2' }}>{OUTPUT_EX}</pre>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{L.codelab.s11}</div>
            <Code src={HELPER_PY} />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 16 }}>
            <CodeLab only={['GBFS', 'ASTAR', 'HC']} />
          </Reveal>
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 16 }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid #1E2430', display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#97A0B5' }}>{L.codelab.s12}</span>
              <span style={{ fontSize: 12, color: '#5C6579', fontStyle: 'italic' }}>{L.codelab.s13}</span>
            </div>
            <Code src={MAIN_PY} style={{ maxHeight: 460, fontSize: 12 }} />
          </Reveal>
          <Reveal delay={0.1} className="card" style={{ marginTop: 16, padding: '18px 20px' }}>
            <span className="kicker">{L.codelab.s14}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
              <Html t={L.codelab.s15} />
              <Html t={L.codelab.s16} />
              <Html t={L.codelab.s17} />
              <Html t={L.codelab.s18} />
              <Html t={L.codelab.s19} />
            </div>
          </Reveal>
        </div>

        {/* Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="05" title={T.quiz.s1} en={T.quiz.s2} color="var(--cyan)"
            lead={T.quiz.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b5" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* Bài tập & tự kiểm */}
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="06" title={T.hw.s1} en={T.hw.s2} color="var(--purple)" />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(430px,100%),1fr))', gap: 14, marginTop: 22 }}>
            {([
              [T.hw.s3, T.hw.s4, T.hw.s5],
              [T.hw.s6, T.hw.s7, T.hw.s8],
              [T.hw.s9, T.hw.s10, T.hw.s11],
            ] as [string, string, string][]).map(([k, body, links]) => (
              <div key={k} className="card">
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k}</div>
                <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
                <Html as="div" t={links} style={{ marginTop: 12, fontSize: 12.5 }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 24 }}>
            <CheckList storageKey="b5-informed-checks" items={[
              T.hw.s12,
              T.hw.s13,
              T.hw.s14,
              T.hw.s15,
              T.hw.s16,
            ]} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t={T.hw.s17} style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>{T.hw.s18}</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
