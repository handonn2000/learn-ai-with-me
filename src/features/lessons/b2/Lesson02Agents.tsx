import { Link } from 'react-router-dom';
import { CheckList } from '@/components/CheckList';
import { Html } from '@/components/Html';
import { Kicker } from '@/components/Kicker';
import { LessonNav } from '@/components/LessonNav';
import { MathPrimer, type MathTerm } from '@/components/MathPrimer';
import { Reveal } from '@/components/Reveal';
import { DeckToggle, LessonDeck, useDeckMode } from '@/components/LessonDeck';
import { SectionHead } from '@/components/SectionHead';
import { SessionQuiz } from '@/components/SessionQuiz';
import { HW, PEAS_ROWS } from '@/content/courses/csc14003/agents-data.locale';
import { MATH_PRIMERS } from '@/content/courses/csc14003/math-primers.locale';
import { AgentArchDiagram } from './AgentArchDiagram';
import { EnvExplorer } from './EnvExplorer';
import { VacuumLab } from './VacuumLab';
import { T } from './lesson02.text';


const P: React.CSSProperties = { color: 'var(--text-2)', fontSize: 13.5, lineHeight: 1.72, margin: '10px 0 0' };

const NAV = [
          { href: '#toan', label: T.hero.s1 }, { href: '#ch1', label: '01 Agent' }, { href: '#ch2', label: T.hero.s2 },
          { href: '#ch3', label: T.hero.s3, hot: true }, { href: '#ch4', label: T.hero.s4 }, { href: '#ch5', label: '05 PEAS' },
          { href: '#ch6', label: T.hero.s5, hot: true }, { href: '#ch7', label: T.hero.s6 }, { href: '#ch8', label: T.hero.s7, hot: true },
          { href: '#ch9', label: T.hero.s8 }, { href: '#quiz', label: '10 Quiz', hot: true }, { href: '#hw', label: T.hero.s9 },
];
const SLIDES = [{ id: 'hero', label: T.hero.s10 }, ...NAV.map((n) => ({ id: n.href.slice(1), label: n.label }))];

export default function Lesson02Agents() {
  const [deck, setDeck] = useDeckMode();
  return (
    <>
      <LessonNav badge={T.hero.s11} title={T.hero.s12} backTo="/courses/csc14003"
        items={NAV}
        right={<DeckToggle on={deck} onChange={setDeck} />} />

      <LessonDeck on={deck} slides={SLIDES}>
        {/* Hero */}
        <div className="lesson-hero" style={{ background: 'radial-gradient(700px 340px at 72% 10%, var(--bg-glow), transparent)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '64px 24px 10px', display: 'flex', gap: 44, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 470px', minWidth: 320 }}>
              <div className="mono" style={{ fontSize: 12, letterSpacing: '1.5px', color: 'var(--yellow)' }}>{T.hero.s13}</div>
              <h1 className="hero-title" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: 52, lineHeight: 1.12, margin: '16px 0 0' }}>
                {T.hero.s14} <em style={{ color: 'var(--cyan)' }}>{T.hero.s15}</em><br />{T.hero.s15b}
              </h1>
              <Html as="p" t={T.hero.s16}
                style={{ color: 'var(--text-2)', fontSize: 15.5, lineHeight: 1.75, margin: '20px 0 0', maxWidth: 620 }} />
            </div>
            <div style={{ flex: '1 1 340px', minWidth: 300 }}>
              <svg viewBox="0 0 380 240" style={{ width: '100%', display: 'block' }} role="img" aria-label={T.hero.s17}>
                <defs>
                  <marker id="hero-ah" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 z" fill="var(--cyan)" />
                  </marker>
                  <marker id="hero-ah2" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                    <path d="M0,0 L7,3.5 L0,7 z" fill="var(--yellow)" />
                  </marker>
                </defs>
                <rect x={10} y={70} width={140} height={100} rx={14} fill="var(--panel)" stroke="var(--border-2)" />
                <text x={80} y={112} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={17} fill="var(--text-hi)">Agent</text>
                <text x={80} y={133} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10} fill="var(--faint)">f : 𝓟* → 𝓐</text>
                <rect x={230} y={70} width={140} height={100} rx={14} fill="var(--panel-2)" stroke="var(--border-2)" />
                <text x={300} y={125} textAnchor="middle" fontFamily="var(--font-serif)" fontSize={16} fill="var(--muted)">{T.hero_ah2.s1}</text>
                <path d="M228,96 C190,70 170,70 152,94" fill="none" stroke="var(--cyan)" strokeWidth={1.5} markerEnd="url(#hero-ah)" />
                <text x={190} y={62} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill="var(--cyan)">{T.hero_ah2.s2}</text>
                <path d="M152,146 C170,172 190,172 228,146" fill="none" stroke="var(--yellow)" strokeWidth={1.5} markerEnd="url(#hero-ah2)" />
                <text x={190} y={192} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={10.5} fill="var(--yellow)">{T.hero_ah2.s3}</text>
                <text x={80} y={56} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9.5} fill="var(--faint-2)">{T.hero_ah2.s4}</text>
                <text x={80} y={192} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9.5} fill="var(--faint-2)">{T.hero_ah2.s5}</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Toán nền */}
        <div id="toan" className="lesson-section lesson-section--first">
          <MathPrimer {...(MATH_PRIMERS.b2 as { minutes: number; lead: string; terms: MathTerm[] })} />
        </div>

        {/* 01 */}
        <div id="ch1" className="lesson-section">
          <SectionHead no="01" title={T.ch1.s1} en="Agents and environments" color="var(--cyan)"
            lead={T.ch1.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 14 }}>
            {[
              [T.ch1.s3, 'var(--cyan)', T.ch1.s4, T.ch1.s5],
              ['AGENT ROBOT', 'var(--green)', T.ch1.s6, T.ch1.s7],
              [T.ch1.s8, 'var(--yellow)', T.ch1.s9, T.ch1.s10],
            ].map(([k, c, sen, act]) => (
              <div key={k} className="card">
                <Kicker color={c}>{k}</Kicker>
                <div style={{ marginTop: 12, display: 'grid', gap: 9 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--faint)' }}>{T.ch1.s11}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 2 }}>{sen}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ fontSize: 10, color: 'var(--faint)' }}>{T.ch1.s12}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 2 }}>{act}</div>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14 }}>
            <Kicker>{T.ch1.s13}</Kicker>
            <Html as="p" t={T.ch1.s14} style={P} />
          </Reveal>
        </div>

        {/* 02 */}
        <div id="ch2" className="lesson-section">
          <SectionHead no="02" title={T.ch2.s1} en="Percept sequence · agent function · agent program" color="var(--yellow)"
            lead={T.ch2.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--yellow)">{T.ch2.s3}</Kicker>
              <div style={{ display: 'grid', gap: 11, marginTop: 12 }}>
                <Html t={T.ch2.s4} style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)' }} />
                <Html t={T.ch2.s5} style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)' }} />
                <Html t={T.ch2.s6} style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-2)' }} />
              </div>
              <div className="panel-inner" style={{ marginTop: 13 }}>
                <Html as="p" t={T.ch2.s7} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: 0 }} />
              </div>
            </div>
            <div className="card">
              <Kicker color="var(--cyan)">{T.ch2.s8}</Kicker>
              <Html as="p" t={T.ch2.s9} style={P} />
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table className="dtable" style={{ minWidth: 380 }}>
                  <tbody>
                    <tr className="dtable__head"><td>{T.ch2.s10}</td><td>{T.ch2.s11}</td></tr>
                    {[
                      ['[A, Clean]', 'Right'], ['[A, Dirty]', 'Suck'], ['[B, Clean]', 'Left'], ['[B, Dirty]', 'Suck'],
                      ['[A, Clean], [A, Clean]', 'Right'], ['[A, Clean], [A, Dirty]', 'Suck'],
                    ].map(([a, b]) => (
                      <tr key={a}><td className="mono" style={{ fontSize: 11.5, color: 'var(--muted)' }}>{a}</td>
                        <td className="mono" style={{ fontSize: 11.5, color: 'var(--yellow)' }}>{b}</td></tr>
                    ))}
                    <tr><td className="mono" style={{ fontSize: 11.5, color: 'var(--faint-2)' }}>⋮</td><td className="mono" style={{ fontSize: 11.5, color: 'var(--faint-2)' }}>⋮</td></tr>
                  </tbody>
                </table>
              </div>
              <Html as="p" t={T.ch2.s12} style={P} />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 14, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px 0' }}>
              <Kicker color="var(--green)">{T.ch2.s13}</Kicker>
            </div>
            <pre className="codeblock" style={{ marginTop: 12 }}>{`function REFLEX-VACUUM-AGENT([location, status]) returns an action
      if status = Dirty then return Suck
      else if location = A then return Right
      else if location = B then return Left`}</pre>
          </Reveal>
        </div>

        {/* 03 */}
        <div id="ch3" className="lesson-section">
          <SectionHead no="03" title={T.ch3.s1} en="Rationality · performance measure" color="var(--green)"
            lead={T.ch3.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--green)">{T.ch3.s3}</Kicker>
              <Html as="p" t={T.ch3.s4} style={P} />
              <div className="panel-inner" style={{ marginTop: 12 }}>
                <Kicker>{T.ch3.s5}</Kicker>
                <Html as="p" t={T.ch3.s6} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '7px 0 0' }} />
              </div>
            </div>
            <div className="card">
              <Kicker color="var(--green)">{T.ch3.s7}</Kicker>
              <Html as="p" t={T.ch3.s8} style={{ ...P, color: 'var(--text-hi)' }} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                {[
                  [T.ch3.s9, T.ch3.s10],
                  [T.ch3.s11, T.ch3.s12],
                  [T.ch3.s13, T.ch3.s14],
                  [T.ch3.s15, T.ch3.s16],
                ].map(([k, v]) => (
                  <div key={k} className="stat"><div className="stat__k">{k}</div><div className="stat__v" style={{ fontSize: 12.5, fontWeight: 400, color: 'var(--text-2)' }}>{v}</div></div>
                ))}
              </div>
              <Html as="p" t={T.ch3.s17} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: '12px 0 0' }} />
            </div>
          </Reveal>

          <Reveal delay={0.15} style={{ marginTop: 16 }}>
            <VacuumLab />
          </Reveal>

          <Reveal delay={0.15} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)' }}>
            <Kicker color="var(--yellow)">{T.ch3.s18}</Kicker>
            <Html as="p" t={T.ch3.s19} style={P} />
            <Html as="p" t={T.ch3.s20} style={P} />
            <Html as="p" t={T.ch3.s21} style={P} />
          </Reveal>
        </div>

        {/* 04 */}
        <div id="ch4" className="lesson-section">
          <SectionHead no="04" title={T.ch4.s1} en="Omniscience · information gathering · learning · autonomy" color="var(--purple)"
            lead={T.ch4.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 14 }}>
            {[
              [T.ch4.s3, 'var(--red)', T.ch4.s4],
              [T.ch4.s5, 'var(--cyan)', T.ch4.s6],
              [T.ch4.s7, 'var(--green)', T.ch4.s8],
              [T.ch4.s9, 'var(--yellow)', T.ch4.s10],
            ].map(([k, c, body]) => (
              <div key={k} className="card">
                <Kicker color={c}>{k}</Kicker>
                <Html as="p" t={body} style={P} />
              </div>
            ))}
          </Reveal>
        </div>

        {/* 05 */}
        <div id="ch5" className="lesson-section">
          <SectionHead no="05" title={T.ch5.s1} en="Specifying the task environment" color="var(--cyan)"
            lead={T.ch5.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: 14 }}>
            {[
              ['P', 'Performance measure', T.ch5.s3, T.ch5.s4, 'var(--green)'],
              ['E', 'Environment', T.ch5.s5, T.ch5.s6, 'var(--cyan)'],
              ['A', 'Actuators', T.ch5.s7, T.ch5.s8, 'var(--yellow)'],
              ['S', 'Sensors', T.ch5.s9, T.ch5.s10, 'var(--purple)'],
            ].map(([l, en, vn, q, c]) => (
              <div key={l} className="card" style={{ borderColor: `color-mix(in srgb, ${c} 30%, transparent)` }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span className="mono" style={{ fontSize: 26, fontWeight: 700, color: c }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{vn}</span>
                </div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--faint)', marginTop: 2 }}>{en}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 10, lineHeight: 1.6 }}>{q}</div>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14, padding: '20px 22px' }}>
            <Kicker color="var(--cyan)">{T.ch5.s11}</Kicker>
            <Html as="p" t={T.ch5.s12} style={{ ...P, marginBottom: 4 }} />
            <div style={{ marginTop: 12, overflowX: 'auto' }}>
              <table className="dtable" style={{ minWidth: 900 }}>
                <tbody>
                  <tr className="dtable__head">
                    <td style={{ width: 170 }}>AGENT</td><td>{T.ch5.s13}</td><td>{T.ch5.s14}</td><td>{T.ch5.s15}</td><td>{T.ch5.s16}</td>
                  </tr>
                  {(PEAS_ROWS as { agent: string; en: string; hero?: boolean; p: string; e: string; a: string; s: string }[]).map((r) => (
                    <tr key={r.agent}>
                      <td>
                        <div style={{ fontSize: 13, fontWeight: r.hero ? 700 : 400, color: r.hero ? 'var(--cyan)' : 'var(--text-2)' }}>{r.agent}</div>
                        <div className="mono" style={{ fontSize: 10, color: 'var(--faint-2)' }}>{r.en}</div>
                      </td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.p}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.e}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.a}</td>
                      <td style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.s}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--purple)">{T.ch5.s17}</Kicker>
              <Html as="p" t={T.ch5.s18} style={P} />
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)' }}>
              <Kicker color="var(--yellow)">{T.ch5.s19}</Kicker>
              <Html as="p" t={T.ch5.s20} style={P} />
            </div>
          </Reveal>
        </div>

        {/* 06 */}
        <div id="ch6" className="lesson-section">
          <SectionHead no="06" title={T.ch6.s1} en="Properties of task environments" color="var(--yellow)"
            lead={T.ch6.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <EnvExplorer />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--cyan) 30%, transparent)' }}>
              <Kicker color="var(--cyan)">{T.ch6.s3}</Kicker>
              <Html as="p" t={T.ch6.s4} style={P} />
              <Html as="p" t={T.ch6.s5} style={P} />
              <Html as="p" t={T.ch6.s6} style={P} />
            </div>
            <div className="card">
              <Kicker color="var(--yellow)">{T.ch6.s7}</Kicker>
              <Html as="p" t={T.ch6.s8} style={P} />
              <Html as="p" t={T.ch6.s9} style={P} />
            </div>
            </div>
            <div style={{ display: 'grid', gap: 14, alignContent: 'start' }}>
              <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--green) 30%, transparent)' }}>
                <Kicker color="var(--green)">{T.ch6.s10}</Kicker>
                <Html as="p" t={T.ch6.s11} style={{ ...P, fontSize: 13 }} />
              </div>
              <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
                <Kicker color="var(--red)">{T.ch6.s12}</Kicker>
                <Html as="p" t={T.ch6.s13} style={{ ...P, fontSize: 13 }} />
              </div>
              <div className="card">
                <Kicker>{T.ch6.s14}</Kicker>
                <Html as="p" t={T.ch6.s15} style={{ ...P, fontSize: 13 }} />
                <Html as="p" t={T.ch6.s16} style={{ ...P, fontSize: 13 }} />
                <Html as="p" t={T.ch6.s17} style={{ ...P, fontSize: 13 }} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* 07 */}
        <div id="ch7" className="lesson-section">
          <SectionHead no="07" title={T.ch7.s1} en="agent = architecture + program · the table-driven agent" color="var(--red)"
            lead={T.ch7.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px 0' }}>
                <Kicker color="var(--red)">{T.ch7.s3}</Kicker>
              </div>
              <pre className="codeblock" style={{ marginTop: 12 }}>{T.ch7.s4}</pre>
              <div style={{ padding: '14px 20px 18px' }}>
                <Html as="p" t={T.ch7.s5} style={{ ...P, marginTop: 0 }} />
              </div>
            </div>
            <div className="card" style={{ borderColor: 'color-mix(in srgb, var(--red) 30%, transparent)' }}>
              <Kicker color="var(--red)">{T.ch7.s6}</Kicker>
              <Html as="p" t={T.ch7.s7} style={P} />
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
                <div className="stat stat--bad stat--bad-b"><div className="stat__k">{T.ch7.s8}</div><div className="stat__v">{T.ch7.s9}</div></div>
                <div className="stat"><div className="stat__k">{T.ch7.s10}</div><div className="stat__v" style={{ color: 'var(--muted)' }}>≈ 10⁸⁰</div></div>
              </div>
              <Html as="p" t={T.ch7.s11} style={P} />
            </div>
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--green) 32%, transparent)' }}>
            <Kicker color="var(--green)">{T.ch7.s12}</Kicker>
            <Html as="p" t={T.ch7.s13} style={{ ...P, fontSize: 14.5 }} />
            <Html as="p" t={T.ch7.s14} style={P} />
            <div className="panel-inner" style={{ marginTop: 13 }}>
              <Html as="p" t={T.ch7.s15} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.65, margin: 0 }} />
            </div>
          </Reveal>
        </div>

        {/* 08 */}
        <div id="ch8" className="lesson-section">
          <SectionHead no="08" title={T.ch8.s1} en="The structure of agents" color="var(--purple)"
            lead={T.ch8.s2} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <AgentArchDiagram />
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 14 }}>
            <div className="card">
              <Kicker color="var(--cyan)">{T.ch8.s3}</Kicker>
              <Html as="p" t={T.ch8.s4} style={P} />
              <div className="panel-inner mono" style={{ marginTop: 12, fontSize: 12, lineHeight: 1.9, color: 'var(--text-2)' }}>
                <div>{T.ch8.s5} <span style={{ color: 'var(--green)' }}>{T.ch8.s6}</span></div>
                <div>{T.ch8.s7} <span style={{ color: 'var(--red)' }}>{T.ch8.s8}</span>{T.ch8.s9}</div>
                <div>{T.ch8.s10} <span style={{ color: 'var(--faint)' }}>{T.ch8.s11}</span></div>
              </div>
              <Html as="p" t={T.ch8.s12} style={P} />
            </div>
            <div className="card">
              <Kicker color="var(--green)">{T.ch8.s13}</Kicker>
              <Html as="p" t={T.ch8.s14} style={P} />
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table className="dtable" style={{ minWidth: 420 }}>
                  <tbody>
                    <tr className="dtable__head"><td>{T.ch8.s15}</td><td style={{ width: 110 }}>{T.ch8.s16}</td></tr>
                    {[
                      [T.ch8.s17, T.ch8.s18],
                      [T.ch8.s19, T.ch8.s20],
                      [T.ch8.s21, T.ch8.s22],
                      [T.ch8.s23, T.ch8.s24],
                    ].map(([a, b], i) => (
                      <tr key={a}>
                        <td style={{ fontSize: 12.5, color: i >= 2 ? 'var(--text-hi)' : 'var(--muted)' }}>{a}</td>
                        <td className="mono" style={{ fontSize: 11.5, color: 'var(--yellow)' }}>{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Html as="p" t={T.ch8.s25} style={P} />
            </div>
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--cyan) 30%, transparent)' }}>
            <Kicker color="var(--cyan)">{T.ch8.s26}</Kicker>
            <Html as="p" t={T.ch8.s27} style={P} />
            <Html as="p" t={T.ch8.s28} style={P} />
            <Html as="p" t={T.ch8.s29} style={P} />
          </Reveal>
          <Reveal delay={0.2} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--purple) 30%, transparent)' }}>
            <Kicker color="var(--purple)">{T.ch8.s30}</Kicker>
            <Html as="p" t={T.ch8.s31} style={P} />
          </Reveal>
        </div>

        {/* 09 */}
        <div id="ch9" className="lesson-section">
          <SectionHead no="09" title={T.ch9.s1} en={T.ch9.s2} color="var(--green)"
            lead={T.ch9.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 14 }}>
            {[
              ['AGENT', 'var(--cyan)', T.ch9.s4],
              [T.ch9.s5, 'var(--green)', T.ch9.s6],
              ['PEAS', 'var(--yellow)', T.ch9.s7],
              [T.ch9.s8, 'var(--purple)', T.ch9.s9],
            ].map(([k, c, body]) => (
              <div key={k} className="card" style={{ borderColor: `color-mix(in srgb, ${c} 26%, transparent)` }}>
                <Kicker color={c}>{k}</Kicker>
                <Html as="p" t={body} style={P} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} style={{ marginTop: 22 }}>
            <Kicker color="var(--green)">{T.ch9.s10}</Kicker>
            <div style={{ marginTop: 12 }}>
              <CheckList storageKey="b2-checks" items={[
                T.ch9.s11,
                T.ch9.s12,
                T.ch9.s13,
                T.ch9.s14,
                T.ch9.s15,
                T.ch9.s16,
                T.ch9.s17,
                T.ch9.s18,
              ]} />
            </div>
          </Reveal>
        </div>

        {/* 10 */}

        {/* 10 — Quiz */}
        <div id="quiz" className="lesson-section">
          <SectionHead no="10" title={T.quiz.s1} en={T.quiz.s2} color="var(--cyan)"
            lead={T.quiz.s3} />
          <Reveal delay={0.1} style={{ marginTop: 22 }}>
            <SessionQuiz sessionId="b2" color="var(--cyan)" />
          </Reveal>
        </div>
        <div id="hw" className="lesson-section lesson-section--last">
          <SectionHead no="11" title={T.hw.s1} en={T.hw.s2} color="var(--purple)"
            lead={T.hw.s3} />
          <Reveal delay={0.1} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(400px,100%),1fr))', gap: 14, marginTop: 22 }}>
            {(HW as [string, string, string][]).map(([k, body, links]) => (
              <div key={k} className="card">
                <div className="mono" style={{ fontSize: 11.5, color: 'var(--purple)' }}>{k}</div>
                <Html as="p" t={body} style={P} />
                <Html as="div" t={links} style={{ marginTop: 12, fontSize: 12.5 }} />
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.15} className="card" style={{ marginTop: 14, borderColor: 'color-mix(in srgb, var(--yellow) 30%, transparent)' }}>
            <Kicker color="var(--yellow)">{T.hw.s4}</Kicker>
            <Html as="p" t={T.hw.s5} style={P} />
          </Reveal>
          <Reveal delay={0.2} style={{ marginTop: 24, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', borderTop: '1px solid var(--border-2)', paddingTop: 20 }}>
            <Html as="span" t={T.hw.s6} style={{ fontSize: 13, color: 'var(--muted)' }} />
            <div style={{ flex: 1 }} />
            <Link to="/courses/csc14003" style={{ fontSize: 13 }}>{T.hw.s7}</Link>
          </Reveal>
        </div>
      </LessonDeck>
    </>
  );
}
