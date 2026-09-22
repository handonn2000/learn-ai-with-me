import { Link } from 'react-router-dom';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { T } from './lesson03.text';

const NAV = [
  { href: '#toan', label: T.hero.navMath }, { href: '#ch1', label: T.hero.nav01 },
  { href: '#ch2', label: T.hero.nav02 }, { href: '#ch3', label: T.hero.nav03 },
  { href: '#quiz', label: T.hero.navQuiz, hot: true }, { href: '#hw', label: T.hero.navHw },
];
const SLIDES = [{ id: 'hero', label: T.hero.cover }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson03Problem() {
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
                <span className="chip" style={{ color: 'var(--cyan)', borderColor: 'color-mix(in srgb, var(--cyan) 35%, transparent)' }}>{T.hero.chipState}</span>
                <span className="chip" style={{ color: 'var(--yellow)', borderColor: 'color-mix(in srgb, var(--yellow) 35%, transparent)' }}>{T.hero.chipAction}</span>
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

        {/* Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="04" title={T.quiz.s1} en={T.quiz.s2} color="var(--cyan)"
            lead={T.quiz.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b3" color="var(--cyan)" />
          </Reveal>
        </div>

        {/* Bài tập & tự kiểm */}
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="05" title={T.hw.s1} en={T.hw.s2} color="var(--purple)" />
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
            <CheckList storageKey="b3-problem-checks" items={[
              T.hw.s9,
              T.hw.s10,
              T.hw.s11,
              T.hw.s12,
            ]} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t={T.hw.s13} style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>{T.hw.s14}</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
