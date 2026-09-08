import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CanvasScene } from '@/components/CanvasScene';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { localeBase } from '@/lib/locale';
import { prefersReducedMotion as rm } from '@/lib/motion';
import { Kicker } from '@/components/Kicker';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { QUAD, QUIZ, FIELDS, CANDO, TOPICS, CHECKS } from '@/content/courses/csc14003/intro-ai.locale';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { drawQuad, drawTuring, drawTimeline } from './lesson01.scenes';
import { T } from './lesson01.text';


interface QuadCell { id: string; vn: string; en: string; tag: string; color: string }
interface QuizItem { q: string; a: string; why: string }

const NAV = [
          { href: '#toan', label: T.nav.toan }, { href: '#ch1', label: T.nav.ch1 }, { href: '#ch2', label: T.nav.ch2 }, { href: '#ch3', label: T.nav.ch3 },
          { href: '#ch4', label: T.nav.ch4 }, { href: '#ch5', label: T.nav.ch5, hot: true }, { href: '#ch6', label: T.nav.ch6 },
          { href: '#ch7', label: T.nav.ch7 }, { href: '#ch8', label: T.nav.ch8 }, { href: '#ch9', label: T.nav.ch9 }, { href: '#quiz', label: T.nav.quiz, hot: true }, { href: '#hw', label: T.nav.hw },
];
const SLIDES = [{ id: 'hero', label: T.nav.hero }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson01Intro() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge={T.hero.s12} title={T.hero.s13} backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 470px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>{T.hero.s14}</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                {T.hero.s15}<br /><em style={{ color: 'var(--cyan)' }}>{T.hero.s16}</em> {T.hero.s17}
              </h1>
              <p style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, maxWidth: 600, margin: '20px 0 0', textWrap: 'pretty' }}>
                {T.hero.s18}
              </p>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 27, whiteSpace: 'nowrap' }}>
                  <span style={{ color: 'var(--text-hi)' }}>f</span><span style={{ color: 'var(--faint)' }}> : </span>
                  <span style={{ color: 'var(--cyan)' }}>𝓟</span><span style={{ color: 'var(--faint)' }}> → </span><span style={{ color: 'var(--yellow)' }}>𝓐</span>
                </span>
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>{T.hero.s19}</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>{T.hero.s20}</span>
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[T.hero.s21, T.hero.s22, T.hero.s23, T.hero.s24].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ color: 'var(--muted-2)', fontSize: 11 }}>{t}</span>
                ))}
              </div>
            </div>
            <div data-anim style={{ flex: '0 1 400px', minWidth: 300, animation: 'mnFloat 7s ease-in-out infinite' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '64px 1fr 1fr', gridTemplateRows: 'auto 1fr 1fr', gap: 8 }}>
                <div />
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', textAlign: 'center', letterSpacing: '.6px' }}>{T.hero.s25}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', textAlign: 'center', letterSpacing: '.6px' }}>{T.hero.s26}</div>
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', display: 'flex', alignItems: 'center' }}>{T.hero.s27}</div>
                {heroCell(T.hero.s28, 'think humanly', 'var(--cyan)')}
                {heroCell(T.hero.s29, 'think rationally', 'var(--purple)')}
                <div className="mono" style={{ fontSize: 10, color: 'var(--muted-2)', display: 'flex', alignItems: 'center' }}>{T.hero.s30}</div>
                {heroCell(T.hero.s31, 'act humanly', 'var(--yellow)')}
                {heroCell(T.hero.s32, 'act rationally', 'var(--green)')}
              </div>
            </div>
          </div>
        </div>

        {/* Toán nền — mở màn, không đánh số */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b1 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 01 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title={T.ch1.s1} en="Intelligence vs. Artificial Intelligence"
            lead={T.ch1.s2} />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14, marginTop: 24 }}>
            <div className="card">
              <Kicker color="var(--cyan)">{T.ch1.s3}</Kicker>
              <Html as="p" t={T.ch1.s4} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }}>
              <Kicker color="var(--yellow)">ARTIFICIAL INTELLIGENCE — AI</Kicker>
              <Html as="p" t={T.ch1.s5} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
            </div>
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(330px,1fr))', gap: 14 }}>
            <div className="card">
              <Kicker>{T.ch1.s6}</Kicker>
              <Html as="p" t={T.ch1.s7} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                {['John McCarthy (1927–2011)', 'Marvin Minsky (1927–2016)', 'Allen Newell (1927–1992)', 'Arthur Samuel (1901–1990)', 'Herbert Simon (1916–2001)'].map((t) => (
                  <span key={t} className="chip chip--mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{t}</span>
                ))}
              </div>
            </div>
            <div className="card">
              <Kicker>{T.ch1.s8}</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t={T.ch1.s9} />
                <Html t={T.ch1.s10} />
                <Html t={T.ch1.s11} />
                <Html t={T.ch1.s12} />
              </div>
              <p style={{ color: 'var(--muted-2)', fontSize: 13, fontStyle: 'italic', lineHeight: 1.65, margin: '12px 0 0' }}>
                {T.ch1.s13}
              </p>
            </div>
          </Reveal>
        </div>

        {/* 02 */}
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title={T.ch2.s1} en="Thinking / Acting × Humanly / Rationally"
            lead={T.ch2.s2} />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">{T.ch2.s3}</span>
              <span className="canvas-panel__sub">{T.ch2.s4}</span>
            </div>
            <CanvasScene height={380} draw={(x, api) => drawQuad(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 16, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', padding: '16px 20px' }}>
            <Kicker>{T.ch2.s5}</Kicker>
            {[T.ch2.s6, T.ch2.s7, T.ch2.s8, T.ch2.s9].map((t) => (
              <span key={t} className="chip" style={{ fontSize: 12.5 }}>{t}</span>
            ))}
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>{T.ch2.s10}</span>
          </Reveal>
        </div>

        {/* 03 */}
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title={T.ch3.s1} en="Alan Turing, 1950" color="var(--yellow)"
            lead={T.ch3.s2} />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">{T.ch3.s3}</span>
              <span className="canvas-panel__sub">{T.ch3.s4}</span>
            </div>
            <CanvasScene height={300} draw={(x, api) => drawTuring(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            <div className="card">
              <Kicker>{T.ch3.s5}</Kicker>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t={T.ch3.s6} />
                <Html t={T.ch3.s7} />
              </div>
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
              <Kicker color="var(--red)">{T.ch3.s8}</Kicker>
              <Html as="p" t={T.ch3.s9} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
              <Html as="p" t={T.ch3.s10} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
              <p style={{ color: 'var(--muted-2)', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0', fontStyle: 'italic' }}>
                {T.ch3.s11}
              </p>
            </div>
          </Reveal>
        </div>

        {/* 04 */}
        <div id="ch4" className="lesson-section">
          <SectionHead no="04" title={T.ch4.s1} en="Thinking humanly · Thinking rationally" color="var(--purple)"
            lead={T.ch4.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 14 }}>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--cyan) 40%, transparent)' }}>
              <Kicker color="var(--cyan)">{T.ch4.s3}</Kicker>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{T.ch4.s4}</div>
              <Html as="p" t={T.ch4.s5} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
              <div className="panel-inner" style={{ marginTop: 14 }}>
                <Kicker>{T.ch4.s6}</Kicker>
                <Html as="p" t={T.ch4.s7} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '8px 0 0' }} />
              </div>
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--purple) 40%, transparent)' }}>
              <Kicker color="var(--purple)">{T.ch4.s8}</Kicker>
              <div style={{ fontWeight: 600, fontSize: 15, marginTop: 8 }}>{T.ch4.s9}</div>
              <Html as="p" t={T.ch4.s10} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
              <div className="panel-inner" style={{ marginTop: 14, display: 'flex', gap: 18, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 150, fontSize: 13, lineHeight: 1.8, color: 'var(--text-2)' }}>
                  {T.ch4.s11}<br />{T.ch4.s12}<br /><span style={{ color: 'var(--green)' }}>{T.ch4.s13}</span>
                </div>
                <div className="mono" style={{ flex: 1, minWidth: 150, fontSize: 12.5, lineHeight: 1.9, color: 'var(--muted)' }}>
                  ∀x. man(x) ⇒ mortal(x)<br />man(Socrates)<br /><span style={{ color: 'var(--green)' }}>⊢ mortal(Socrates)</span>
                </div>
              </div>
              <div style={{ marginTop: 14 }}><Kicker color="var(--red)">{T.ch4.s14}</Kicker></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8, fontSize: 13, lineHeight: 1.65, color: 'var(--muted)' }}>
                <Html t={T.ch4.s15} />
                <Html t={T.ch4.s16} />
              </div>
              <p style={{ color: 'var(--muted-2)', fontSize: 12.5, fontStyle: 'italic', lineHeight: 1.6, margin: '10px 0 0' }}>
                {T.ch4.s17}
              </p>
            </div>
          </Reveal>
        </div>

        {/* 05 */}
        <Ch5 />

        {/* 06 */}
        <div id="ch6" className="lesson-section">
          <SectionHead no="06" title={T.ch6.s1} en="Foundations of AI"
            lead={T.ch6.s2} />
          <Reveal delay={0.1} className="card" style={{ marginTop: 22, padding: '8px 18px 14px', overflowX: 'auto' }}>
            <table className="dtable" style={{ minWidth: 640 }}>
              <tbody>
                <tr className="dtable__head"><td>{T.ch6.s3}</td><td>{T.ch6.s4}</td><td>{T.ch6.s5}</td></tr>
                {(FIELDS as [string, string, string][]).map((f) => (
                  <tr key={f[0]}>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--cyan)' }}>{f[0]}</td>
                    <td style={{ color: 'var(--text-hi)', whiteSpace: 'nowrap' }}>{f[1]}</td>
                    <td style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{f[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
            <div className="card">
              <Kicker>AI ⊃ MACHINE LEARNING ⊃ DEEP LEARNING</Kicker>
              <div style={{ border: '1px solid color-mix(in srgb, var(--cyan) 45%, transparent)', borderRadius: 14, padding: '14px 16px', marginTop: 14 }}>
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--cyan)' }}>ARTIFICIAL INTELLIGENCE</div>
                <div style={{ border: '1px solid color-mix(in srgb, var(--yellow) 45%, transparent)', borderRadius: 12, padding: '12px 14px', marginTop: 10 }}>
                  <div className="mono" style={{ fontSize: 11.5, color: 'var(--yellow)' }}>MACHINE LEARNING</div>
                  <div style={{ border: '1px solid color-mix(in srgb, var(--green) 45%, transparent)', borderRadius: 10, padding: '10px 12px', marginTop: 10 }}>
                    <div className="mono" style={{ fontSize: 11.5, color: 'var(--green)' }}>DEEP LEARNING</div>
                  </div>
                </div>
              </div>
              <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.6, margin: '12px 0 0', fontStyle: 'italic' }}>
                {T.ch6.s6}
              </p>
            </div>
            <div className="card">
              <Kicker>{T.ch6.s7}</Kicker>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14, marginTop: 12 }}>
                <div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--green)' }}>{T.ch6.s8}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8, fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>
                    {[T.ch6.s9, T.ch6.s10, T.ch6.s11, T.ch6.s12, T.ch6.s13, T.ch6.s14].map((t) => <div key={t}>{t}</div>)}
                  </div>
                </div>
                <div>
                  <div className="mono" style={{ fontSize: 10.5, color: 'var(--red)' }}>{T.ch6.s15}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 8, fontSize: 13, lineHeight: 1.55, color: 'var(--muted)' }}>
                    {[T.ch6.s16, T.ch6.s17, T.ch6.s18].map((t) => <div key={t}>{t}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 07 */}
        <div id="ch7" className="lesson-section">
          <SectionHead no="07" title={T.ch7.s1} en="A brief history of AI" color="var(--yellow)"
            lead={T.ch7.s2} />
          <Reveal delay={0.1} className="canvas-panel" style={{ marginTop: 22 }}>
            <div className="canvas-panel__head">
              <span className="canvas-panel__title">{T.ch7.s3}</span>
              <span className="canvas-panel__sub">{T.ch7.s4}</span>
            </div>
            <CanvasScene height={340} draw={(x, api) => drawTimeline(x, api, rm)} />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
            {([
              ['var(--cyan)', T.ch7.s5, T.ch7.s6, ''],
              ['var(--red)', T.ch7.s7, T.ch7.s8, 'color-mix(in srgb, var(--red) 30%, transparent)'],
              ['var(--green)', T.ch7.s9, T.ch7.s10, ''],
              ['var(--yellow)', T.ch7.s11, T.ch7.s12, ''],
            ] as [string, string, string, string][]).map(([color, k, body, bd]) => (
              <div key={k} className="card" style={{ padding: '18px 20px', borderColor: bd || undefined }}>
                <div className="mono" style={{ fontSize: 11, color }}>{k}</div>
                <Html as="p" t={body} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '9px 0 0' }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.7, margin: '14px 0 0', fontStyle: 'italic' }}>
              {T.ch7.s13}
            </p>
          </Reveal>
        </div>

        {/* 08 */}
        <Ch8 />

        {/* 09 */}
        <Ch9 />

        {/* 10 — Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="10" title={T.quiz.s1} en={T.quiz.s2} color="var(--cyan)"
            lead={T.quiz.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b1" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* 11 */}
        <Ch10 />
      </LessonDeck>
    </>
  );
}

function heroCell(vn: string, en: string, color: string) {
  return (
    <div style={{ background: 'var(--panel)', border: `1px solid color-mix(in srgb, ${color} 45%, transparent)`, borderRadius: 14, padding: '16px 14px' }}>
      <div style={{ fontSize: 14.5, fontWeight: 600, color }}>{vn}</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--faint)', marginTop: 6 }}>{en}</div>
    </div>
  );
}

/* ===== 05 · Hành động duy lý + quiz tương tác ===== */
function Ch5() {
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number[]>([]);
  const quiz = QUIZ as QuizItem[];
  const quad = QUAD as QuadCell[];
  const q = quiz[qi];

  const pick = (id: string) => {
    if (picked) return;
    const ok = q.a === id;
    const first = !answered.includes(qi);
    setPicked(id);
    if (ok && first) setScore((s) => s + 1);
    if (first) setAnswered((a) => [...a, qi]);
  };

  return (
    <div id="ch5" className="lesson-section">
      <SectionHead no="05" title={T.ch5.s1} en="The rational agent approach" color="var(--green)"
        lead={T.ch5.s2} />
      <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 14 }}>
        <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--green) 40%, transparent)' }}>
          <Kicker>{T.ch5.s3}</Kicker>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 28, marginTop: 12 }}>
            <span style={{ color: 'var(--text-hi)' }}>f</span><span style={{ color: 'var(--faint)' }}> : </span>
            <span style={{ color: 'var(--cyan)' }}>𝓟</span><span style={{ color: 'var(--faint)' }}> → </span><span style={{ color: 'var(--yellow)' }}>𝓐</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }}>
            {T.ch5.s4}
          </p>
        </div>
        <div className="card">
          <Kicker>{T.ch5.s5}</Kicker>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12, fontSize: 13.5, lineHeight: 1.65, color: 'var(--muted)' }}>
            <Html t={T.ch5.s6} />
            <Html t={T.ch5.s7} />
            <Html t={T.ch5.s8} />
          </div>
        </div>
        <div className="card">
          <Kicker>{T.ch5.s9}</Kicker>
          <Html as="p" t={T.ch5.s10} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0' }} />
        </div>
      </Reveal>
      <Reveal delay={0.15} className="card card--flat" style={{ marginTop: 16, borderRadius: 16 }}>
        <div style={{ padding: '13px 18px', borderBottom: '1px solid var(--border-2)', display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 11, color: 'var(--yellow)', letterSpacing: '.8px' }}>{T.ch5.s11}</span>
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--faint)' }}>{T.ch5.qCount(qi + 1, quiz.length)}</span>
          <div style={{ flex: 1 }} />
          <span className="mono" style={{ fontSize: 11.5, color: 'var(--green)' }}>{T.ch5.score(score, quiz.length)}</span>
          <button className="btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => { setQi(0); setPicked(null); setScore(0); setAnswered([]); }}>{T.ch5.s12}</button>
        </div>
        <div style={{ padding: 20 }}>
          <p style={{ color: 'var(--text)', fontSize: 15.5, lineHeight: 1.7, margin: 0, maxWidth: 760, textWrap: 'pretty' }}>{q.q}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12, marginTop: 18 }}>
            {quad.map((qd) => {
              const isPick = picked === qd.id;
              const isAns = !!picked && q.a === qd.id;
              return (
                <button key={qd.id} onClick={() => pick(qd.id)} style={{
                  display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-start', textAlign: 'left', padding: '14px 16px', borderRadius: 12, width: '100%',
                  border: `1.5px solid ${isAns ? 'var(--green)' : isPick ? 'var(--red)' : 'var(--border)'}`,
                  background: isAns ? 'color-mix(in srgb, var(--green) 10%, transparent)' : isPick ? 'color-mix(in srgb, var(--red) 8%, transparent)' : 'var(--panel-2)',
                  color: isAns ? 'var(--green-soft)' : isPick ? 'var(--red-soft)' : 'var(--text-2)',
                  cursor: picked ? 'default' : 'pointer', fontFamily: 'inherit',
                }}>
                  <span className="mono" style={{ fontSize: 10, letterSpacing: '.6px', opacity: 0.8 }}>{qd.tag}</span>
                  <span style={{ fontSize: 15, fontWeight: 600 }}>{qd.vn}</span>
                  <span style={{ fontSize: 12, fontStyle: 'italic', opacity: 0.7 }}>{qd.en}</span>
                </button>
              );
            })}
          </div>
          {picked ? (
            <div style={{
              marginTop: 16, borderRadius: 10, padding: '12px 14px', fontSize: 13.5, lineHeight: 1.65,
              border: `1px solid ${picked === q.a ? 'color-mix(in srgb, var(--green) 40%, transparent)' : 'color-mix(in srgb, var(--red) 40%, transparent)'}`,
              background: picked === q.a ? 'color-mix(in srgb, var(--green) 8%, transparent)' : 'color-mix(in srgb, var(--red) 7%, transparent)',
              color: picked === q.a ? 'var(--green-soft)' : 'var(--red-soft)',
            }}>
              {(picked === q.a ? T.ch5.s13 : T.ch5.s14 + (quad.find((v) => v.id === q.a)?.vn ?? '') + '. ') + q.why}
            </div>
          ) : null}
          {picked ? (
            <div style={{ marginTop: 14 }}>
              <button className="btn" style={{ borderColor: 'var(--cyan)', background: 'color-mix(in srgb, var(--cyan) 12%, transparent)', color: 'var(--cyan-soft)', borderRadius: 9, padding: '8px 16px', fontWeight: 700 }}
                onClick={() => { setQi((qi + 1) % quiz.length); setPicked(null); }}>
                {qi === quiz.length - 1 ? T.ch5.s15 : T.ch5.s16}
              </button>
            </div>
          ) : null}
        </div>
      </Reveal>
      <Reveal delay={0.2} className="card" style={{ marginTop: 16 }}>
        <Kicker>{T.ch5.s17}</Kicker>
        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '10px 0 0' }}>
          {T.ch5.s18}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12, marginTop: 14 }}>
          {[T.ch5.s19, T.ch5.s20, T.ch5.s21, T.ch5.s22].map((t) => (
            <div key={t} className="panel-inner" style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--text-2)' }}>{t}</div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/* ===== 08 · Ứng dụng + chips "máy làm được?" ===== */
function Ch8() {
  const [on, setOn] = useState<number[]>([]);
  return (
    <div id="ch8" className="lesson-section">
      <SectionHead no="08" title={T.ch8.s1} en="AI applications · What can AI do?" color="var(--green)"
        lead={T.ch8.s2} />
      <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
        <div className="card">
          <div className="mono" style={{ fontSize: 11, color: 'var(--cyan)' }}>{T.ch8.s3}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            {[T.ch8.s4, T.ch8.s5, T.ch8.s6].map((t) => <div key={t}>{t}</div>)}
          </div>
        </div>
        <div className="card">
          <div className="mono" style={{ fontSize: 11, color: 'var(--purple)' }}>{T.ch8.s7}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            <div>{T.ch8.s8}</div>
            <div>{T.ch8.s9}</div>
          </div>
          <div className="panel-inner mono" style={{ marginTop: 12, fontSize: 11.5, lineHeight: 1.75, color: 'var(--muted-2)', padding: '12px 14px' }}>
            <div><span style={{ color: 'var(--cyan)' }}>MYCIN:</span> {T.ch8.s10}</div>
            <div><span style={{ color: 'var(--yellow)' }}>{T.ch8.s11}</span> {T.ch8.s12}</div>
            <div><span style={{ color: 'var(--cyan)' }}>MYCIN:</span> {T.ch8.s13}</div>
            <div><span style={{ color: 'var(--yellow)' }}>{T.ch8.s14}</span> {T.ch8.s15}</div>
            <div><span style={{ color: 'var(--green)' }}>{T.ch8.s16}</span></div>
          </div>
        </div>
        <div className="card">
          <div className="mono" style={{ fontSize: 11, color: 'var(--yellow)' }}>{T.ch8.s17}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10, fontSize: 13.5, lineHeight: 1.6, color: 'var(--muted)' }}>
            {[T.ch8.s18, T.ch8.s19, 'OpenAI Five — Dota 2', T.ch8.s20].map((t) => <div key={t}>{t}</div>)}
          </div>
          <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.6, margin: '10px 0 0', fontStyle: 'italic' }}>
            {T.ch8.s21}
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.15} className="card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--yellow)', letterSpacing: '.8px' }}>{T.ch8.s22}</span>
          <span style={{ color: 'var(--faint)', fontSize: 12.5, fontStyle: 'italic' }}>{T.ch8.s23}</span>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
          {(CANDO as string[]).map((t, i) => {
            const active = on.includes(i);
            return (
              <button key={i} onClick={() => setOn((s) => (s.includes(i) ? s.filter((v) => v !== i) : [...s, i]))} style={{
                padding: '7px 12px', borderRadius: 9, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                border: `1px solid ${active ? 'color-mix(in srgb, var(--green) 50%, transparent)' : 'var(--border)'}`,
                background: active ? 'color-mix(in srgb, var(--green) 9%, transparent)' : 'var(--panel-2)',
                color: active ? 'var(--green-soft)' : 'var(--muted)',
              }}>{t}</button>
            );
          })}
        </div>
        <p style={{ color: 'var(--muted-2)', fontSize: 12.5, lineHeight: 1.65, margin: '12px 0 0', fontStyle: 'italic' }}>
          {T.ch8.s24}
        </p>
      </Reveal>
      <Reveal delay={0.2} className="card" style={{ marginTop: 16, borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
        <Kicker color="var(--red)">{T.ch8.s25}</Kicker>
        <p style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '12px 0 0', maxWidth: 840 }}>
          {T.ch8.s26}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(230px,1fr))', gap: 12, marginTop: 14 }}>
          {[
            T.ch8.s27,
            T.ch8.s28,
            T.ch8.s29,
            T.ch8.s30,
          ].map((t) => <Html key={t} as="div" t={t} className="panel-inner" style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--muted)' }} />)}
        </div>
      </Reveal>
    </div>
  );
}

/* ===== 09 · Tổng kết + tự kiểm ===== */
function Ch9() {
  interface Topic { t: string; n: string; c: string; d: string }
  const colorMap: Record<string, string> = { '#58C4DD': 'var(--cyan)', '#C792EA': 'var(--purple)', '#83C167': 'var(--green)', '#7A8399': 'var(--muted-2)' };
  return (
    <div id="ch9" className="lesson-section">
      <SectionHead no="09" title={T.ch9.s1} en="What are we going to learn?"
        lead={T.ch9.s2} />
      <Reveal delay={0.1} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(TOPICS as Topic[]).map((t) => {
          const c = colorMap[t.c] || t.c;
          return (
            <div key={t.t} className="card" style={{ borderLeft: `3px solid ${c}`, padding: '18px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--text-hi)' }}>{t.t}</span>
                <span className="mono" style={{ fontSize: 10.5, color: c, border: `1px solid color-mix(in srgb, ${c} 33%, transparent)`, borderRadius: 7, padding: '3px 8px' }}>{t.n}</span>
              </div>
              <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.7, margin: '8px 0 0', maxWidth: 900 }}>{t.d}</p>
            </div>
          );
        })}
      </Reveal>
      <Reveal delay={0.2} style={{ marginTop: 24 }}>
        <CheckList storageKey="b1-checks" items={CHECKS as string[]} />
      </Reveal>
    </div>
  );
}

/* ===== 10 · Bài tập về nhà ===== */
function Ch10() {
  const recall: [string, string][] = [
    [T.ch9.s3, T.ch9.s4],
    [T.ch9.s5, T.ch9.s6],
    [T.ch9.s7, T.ch9.s8],
  ];
  return (
    <div id="hw" className="lesson-section lesson-section--last">
      <SectionHead no="11" title={T.hw.s1} en={T.hw.s2} color="var(--purple)"
        lead={T.hw.lead(localeBase)} />
      <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14, marginTop: 22 }}>
        {recall.map(([k, body]) => (
          <div key={k} className="card">
            <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k.toUpperCase()}</div>
            <Html as="p" t={body} style={{ color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.7, margin: '10px 0 0' }} />
          </div>
        ))}
      </Reveal>
      <Reveal delay={0.15} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
        <Html as="span" t={T.hw.s3} style={{ fontSize: 13, color: 'var(--muted)' }} />
        <div style={{ flex: 1 }} />
        <Link to="/courses/csc14003" style={{ fontSize: 13 }}>{T.hw.s4}</Link>
      </Reveal>
    </div>
  );
}
