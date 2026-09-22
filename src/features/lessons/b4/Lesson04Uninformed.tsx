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
import { drawGrow } from '@/features/search-lab/scenes';
import { T as L } from '@/features/search-lab/lab.text';
import { prefersReducedMotion as rm } from '@/lib/motion';
import { T } from './lesson04.text';

const NAV = [
  { href: '#toan', label: T.hero.navMath },
  { href: '#ch1', label: T.hero.nav01 }, { href: '#lab', label: T.hero.navLab, hot: true },
  { href: '#codelab', label: T.hero.navCode },
  { href: '#quiz', label: T.hero.navQuiz, hot: true }, { href: '#hw', label: T.hero.navHw },
];
const SLIDES = [{ id: 'hero', label: T.hero.cover }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson04Uninformed() {
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
                {T.hero.titleA}<br />{T.hero.titleB} <em style={{ color: 'var(--cyan)' }}>{T.hero.titleC}</em>
              </h1>
              <Html as="p" t={T.hero.lead} style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 600, margin: '20px 0 0', textWrap: 'pretty' }} />
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>{T.hero.chipFifo}</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>{T.hero.chipLifo}</span>
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
          <MathPrimer {...(MATH_PRIMERS.b4 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 04 — Tìm kiếm mù */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title={T.ch4.s1} en="Uninformed search — BFS · UCS · DFS · DLS · IDS"
            lead={T.ch4.s2} />
          <AlgoCard labCta={T.hero.labCta} color="var(--cyan)" abbr="BFS" name={T.ch4.s3} en="Breadth-first search"
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
          <AlgoCard labCta={T.hero.labCta} color="var(--green)" abbr="UCS" name={T.ch4.s24} en="Uniform-cost search = Dijkstra"
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
          <AlgoCard labCta={T.hero.labCta} color="var(--red)" abbr="DFS" name={T.ch4.s35} en="Depth-first search"
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
          <AlgoCard labCta={T.hero.labCta} color="var(--purple)" abbr="DLS → IDS" name={T.ch4.s52} en="Depth-limited · Iterative deepening"
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
              <h2 className="sec-head__title">{L.lab.s1}</h2>
            </div>
            <div className="sec-rule" style={{ '--rule-color': 'var(--yellow)' } as React.CSSProperties} />
            <Html as="p" t={L.lab.s2} className="sec-lead" />
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SearchLab only={['BFS', 'DFS', 'UCS', 'IDS']} />
          </Reveal>
          <Reveal delay={0.15}>
            <Html as="p" t={L.lab.s3} style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', margin: '14px 0 0', display: 'block' }} />
          </Reveal>
        </div>

        {/* 08 — Code Lab */}
        <div id="codelab" className="lesson-section">
          <SectionHead no="02" title={L.codelab.s1} en="Lab 1 — Searching · CSC14003" color="var(--green)"
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
            <CodeLab only={['BFS', 'DFS', 'UCS', 'IDS']} />
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
          <SectionHead no="03" title={T.quiz.s1} en={T.quiz.s2} color="var(--cyan)"
            lead={T.quiz.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b4" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* Bài tập & tự kiểm */}
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="04" title={T.hw.s1} en={T.hw.s2} color="var(--purple)" />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(430px,100%),1fr))', gap: 14, marginTop: 22 }}>
            {([
              [T.hw.s3, T.hw.s4, T.hw.s5],
              [T.hw.s6, T.hw.s7, T.hw.s8],
            ] as [string, string, string][]).map(([k, body, links]) => (
              <div key={k} className="card">
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k}</div>
                <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
                <Html as="div" t={links} style={{ marginTop: 12, fontSize: 12.5 }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 24 }}>
            <CheckList storageKey="b4-uninformed-checks" items={[
              T.hw.s9,
              T.hw.s10,
              T.hw.s11,
              T.hw.s12,
              T.hw.s13,
            ]} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t={T.hw.s14} style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>{T.hw.s15}</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
