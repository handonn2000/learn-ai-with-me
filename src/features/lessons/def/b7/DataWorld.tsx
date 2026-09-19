import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { ScenarioTabs } from './LessonAnimation';
import { FrameworkLogo } from './IngestionVisuals';
import { SyntaxCode } from './SyntaxCode';
import { WORLD_TIMELINES, getWorldFrame, type WorldFrame } from './data-world-timeline';
import { T } from './lesson07.text';
import type { DataWorldController, DataWorldProjection } from './data-world.scene';
import './DataWorld.css';

const W = T.world;
const brands = ['postgresql', 'debezium', 'kafka', 'kafka', 'snowflake', 'airflow'] as const;
function WorldLogo({ id }: { id: number }) { return <span aria-hidden="true"><FrameworkLogo brand={brands[id]} label={false} /></span>; }
const routes = [[0, 1, 2, 4], [0, 1, 2, 3, 2, 4], [0, 4]];
const row = { order_id: 42, amount: 12 };
const wal = { order_id: 42, before_amount: 10, after_amount: 12 };
const event = { op: 'u', order_id: 42, after: { amount: 12 } };
const result = { order_id: 42, amount_cents: 1200 };
const batch = { rows: 3, order_ids: [42, 43, 44] };
const payloads = [
  [row, wal, event, event, row],
  [row, wal, event, event, result, result, result, result],
  [{ task: 'extract_orders' }, batch, { task: 'load_orders', after: 'extract_orders' }, batch, batch],
];

export function DataWorld() {
  const [scenario, setScenario] = useState(0);
  const [selected, setSelected] = useState(2);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const [reduced, setReduced] = useState(false);
  const [narrative, setNarrative] = useState<WorldFrame>(() => getWorldFrame(0, 0));
  const packetPin = useRef<HTMLDivElement>(null);
  const packetLeader = useRef<SVGLineElement>(null);
  const labelBounds = useRef<{ left: number; right: number; top: number; bottom: number }[]>([]);
  const sceneSize = useRef({ width: 0, height: 0 });
  const sceneHost = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const controller = useRef<DataWorldController | null>(null);
  const leaders = useRef<(SVGLineElement | null)[]>([]);
  const currentScenario = useRef(scenario);
  const currentSelection = useRef(selected);
  const hintId = useId();
  currentScenario.current = scenario;
  currentSelection.current = selected;

  function projectLabels(points: DataWorldProjection[]) {
    const host = sceneHost.current;
    if (!host) return;
    const packet = points.find(point => point.id === 6);
    if (packet && packetPin.current) {
      // Avoid the fixed landmark labels without measuring layout on animation frames.
      const { width, height } = sceneSize.current;
      const pinWidth = 104, pinHeight = 28;
      let x = packet.x, y = packet.y;
      for (const [dx, dy] of [[0, 0], [0, 38], [0, -42], [-82, 0], [82, 0], [-82, 38], [82, 38]]) {
        const nextX = Math.max(pinWidth / 2 + 8, Math.min(width - pinWidth / 2 - 8, packet.x + dx));
        const nextY = Math.max(90, Math.min(height - 105, packet.y + dy));
        if (labelBounds.current.some(rect => nextX - pinWidth / 2 < rect.right + 5 && nextX + pinWidth / 2 + 5 > rect.left && nextY - pinHeight < rect.bottom + 5 && nextY + 5 > rect.top)) continue;
        x = nextX; y = nextY; break;
      }
      packetPin.current.hidden = !packet.visible;
      packetPin.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -100%)`;
      const leader = packetLeader.current;
      if (leader) {
        leader.style.display = packet.visible ? '' : 'none';
        leader.setAttribute('x1', String(packet.x)); leader.setAttribute('y1', String(packet.y + 10));
        leader.setAttribute('x2', String(x)); leader.setAttribute('y2', String(y));
      }
    }
    // The renderer publishes only the moving packet on animation frames. Landmark
    // layout needs measuring only when the camera or container changes.
    if (!points.some(point => point.id < 6)) return;
    const { width, height } = host.getBoundingClientRect();
    sceneSize.current = { width, height };
    const occupied: { left: number; right: number; top: number; bottom: number }[] = [];
    // Keep projected HTML labels readable at every orbit angle; the thin leader retains its anchor.
    for (const point of points.filter(point => point.id < 6).sort((a, b) => a.y - b.y)) {
      const label = labels.current[point.id];
      const leader = leaders.current[point.id];
      if (!label || !leader) continue;
      // A label may have been hidden at the previous camera angle. Measure its actual
      // responsive form before collision placement, without painting it temporarily.
      label.style.visibility = 'hidden';
      label.hidden = false;
      const w = label.offsetWidth || (matchMedia('(max-width: 440px)').matches ? 44 : 130);
      const h = label.offsetHeight || 44;
      label.style.visibility = '';
      const candidates = [0, -48, 48, -96, 96].flatMap(dy => [0, -52, 52, -104, 104].map(dx => ({ dx, dy }))).sort((a, b) => a.dx * a.dx + a.dy * a.dy - b.dx * b.dx - b.dy * b.dy);
      let placement: { x: number; y: number } | undefined;
      if (point.visible) for (const { dx, dy } of candidates) {
        const x = Math.max(w / 2 + 8, Math.min(width - w / 2 - 8, point.x + dx));
        const y = Math.max(h + 78, Math.min(height - 105, point.y + dy));
        const rect = { left: x - w / 2, right: x + w / 2, top: y - h, bottom: y };
        if (occupied.some(other => rect.left < other.right + 6 && rect.right + 6 > other.left && rect.top < other.bottom + 6 && rect.bottom + 6 > other.top)) continue;
        placement = { x, y }; occupied.push(rect); break;
      }
      label.hidden = !placement;
      leader.style.display = placement ? '' : 'none';
      if (placement) {
        label.style.left = `${placement.x}px`; label.style.top = `${placement.y}px`;
        leader.setAttribute('x1', String(point.x)); leader.setAttribute('y1', String(point.y + 12));
        leader.setAttribute('x2', String(placement.x)); leader.setAttribute('y2', String(placement.y));
      }
    }
    labelBounds.current = occupied;
  }

  useEffect(() => {
    const host = sceneHost.current;
    if (!host) return;
    let cancelled = false;
    let loading = false;
    let visible = false;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(media.matches);
      controller.current?.setReducedMotion(media.matches);
      controller.current?.setActive(visible && !document.hidden);
    };
    const load = async () => {
      if (loading || cancelled) return;
      loading = true;
      try {
        const { createDataWorld } = await import('./data-world.scene');
        if (cancelled) return;
        controller.current = createDataWorld(host, projectLabels, setSelected, setNarrative);
        controller.current.setScenario(currentScenario.current);
        controller.current.setSelected(currentSelection.current);
        sync();
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('fallback');
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) void load();
      sync();
    });
    observer.observe(host);
    const contextLost = () => {
      controller.current?.dispose();
      controller.current = null;
      setStatus('fallback');
    };
    host.addEventListener('webglcontextlost', contextLost, true);
    media.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      cancelled = true;
      observer.disconnect();
      media.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      host.removeEventListener('webglcontextlost', contextLost, true);
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);
  useEffect(() => { if (status === 'ready') controller.current?.resetView(); }, [status]);
  useEffect(() => { controller.current?.setScenario(scenario); }, [scenario]);
  useEffect(() => { controller.current?.setSelected(selected); }, [selected]);

  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const actions: Record<string, () => void> = {
      ArrowLeft: () => controller.current?.orbit(-0.16, 0),
      ArrowRight: () => controller.current?.orbit(0.16, 0),
      ArrowUp: () => controller.current?.orbit(0, 0.1),
      ArrowDown: () => controller.current?.orbit(0, -0.1),
      '+': () => controller.current?.zoom(1.14),
      '=': () => controller.current?.zoom(1.14),
      '-': () => controller.current?.zoom(0.88),
      Home: () => controller.current?.resetView(),
    };
    if (actions[event.key]) { event.preventDefault(); actions[event.key](); }
  }
  const frame = reduced || status === 'fallback' ? getWorldFrame(scenario, 0, true)
    : narrative.scenario === scenario ? narrative : getWorldFrame(scenario, 0);
  const stage = WORLD_TIMELINES[scenario][frame.stage];
  const stageText = W.stageCopy[scenario][frame.stage];
  const hops = stage.edge?.split('>').map(Number);
  const station = W.stations[selected];
  const active = routes[scenario].includes(selected) || (scenario === 2 && selected === 5);
  return <figure className="data-world" id="data-world" data-scenario={scenario} data-status={status} data-narrative-stage={frame.stage} data-packet-kind={stage.packet} onKeyDown={event => event.stopPropagation()} onTouchStart={event => event.stopPropagation()} onTouchEnd={event => event.stopPropagation()}>
    <figcaption className="data-world__heading"><div><p className="kicker">{W.eyebrow}</p><h3>{W.title}</h3><p>{W.intro}</p></div><span className="data-world__edition" aria-hidden="true">07<span>{W.edition}</span></span></figcaption>
    <ScenarioTabs label={W.scenarioLabel} options={W.scenarios} selected={scenario} onChange={setScenario}>
      <div className="data-world__stage">
        <div className="data-world__scene" ref={sceneHost} tabIndex={status === 'ready' ? 0 : -1} role="group" aria-label={W.sceneLabel} aria-describedby={hintId} onKeyDown={keyboard} />
        {status !== 'ready' && <div className="data-world__placeholder"><span aria-hidden="true">◇</span><p>{status === 'loading' ? W.loading : W.fallback}</p></div>}
        <div className="data-world__map-labels" hidden={status !== 'ready'}><svg className="data-world__leaders" aria-hidden="true">{W.stations.map((station, id) => <line key={station.name} ref={element => { leaders.current[id] = element; }} />)}<line className="data-world__packet-leader" ref={packetLeader} /></svg>{W.stations.map((item, id) => <button type="button" key={item.name} ref={element => { labels.current[id] = element; }} className={`data-world__map-label${selected === id ? ' is-selected' : ''}`} onClick={() => setSelected(id)} aria-pressed={selected === id} aria-label={`${item.name} · ${item.role}`}><WorldLogo id={id} /><span>{item.name}</span></button>)}</div>
        <div className={`data-world__packet-pin is-${stage.packet}`} ref={packetPin} hidden={status !== 'ready' || reduced} aria-hidden="true">{scenario === 2 ? W.batchTag : W.packetTag}</div>
        <div className="data-world__world-badge" hidden={status !== 'ready'}><i className={reduced ? 'is-static' : ''} /><span>{reduced ? W.static : `${W.stageLabel} ${frame.stage + 1} / ${WORLD_TIMELINES[scenario].length} · ${stageText.title}`}</span></div>
        <div className="data-world__legend" hidden={status !== 'ready'}><span><i />{W.dataLegend}</span>{scenario === 1 && <span><i className="is-result" />{W.processedLegend}</span>}{scenario === 2 && <span><i className="is-control" />{W.controlLegend}</span>}</div>
        <div className="data-world__camera" hidden={status !== 'ready'}>
          <button type="button" title={W.rotateLeft} aria-label={W.rotateLeft} onClick={() => controller.current?.orbit(-0.25, 0)}>↶</button>
          <button type="button" title={W.rotateRight} aria-label={W.rotateRight} onClick={() => controller.current?.orbit(0.25, 0)}>↷</button>
          <span />
          <button type="button" title={W.zoomIn} aria-label={W.zoomIn} onClick={() => controller.current?.zoom(1.14)}>+</button>
          <button type="button" title={W.zoomOut} aria-label={W.zoomOut} onClick={() => controller.current?.zoom(0.88)}>−</button>
          <button type="button" title={W.home} aria-label={W.home} onClick={() => controller.current?.resetView()}>⌂</button>
        </div>
        <p className="data-world__hint" id={hintId} hidden={status !== 'ready'}>{W.hint}<span>{W.keys}</span></p>
      </div>
      <section className="data-world__route-reader" aria-label={W.traceTitle}>
        <header><p className="kicker">{W.traceTitle}</p><span>{reduced || status === 'fallback' ? W.allStages : `${W.stageLabel} ${frame.stage + 1} / ${WORLD_TIMELINES[scenario].length}`}</span></header>
        <ol className="data-world__stage-rail">{W.stageCopy[scenario].map((step, index) => <li key={step.title} data-state={reduced || status === 'fallback' ? 'complete' : index === frame.stage ? 'current' : index < frame.stage ? 'complete' : 'next'} aria-current={!reduced && status === 'ready' && index === frame.stage ? 'step' : undefined}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{step.title}</strong><small>{W.stations[WORLD_TIMELINES[scenario][index].node].name}</small></div></li>)}</ol>
        <div className="data-world__stage-detail">
          <div className="data-world__explanation">
            <div className={`data-world__hop is-${stage.packet}`}>
              {hops ? <><span><WorldLogo id={hops[0]} />{W.stations[hops[0]].name}</span><b aria-hidden="true">→</b><span><WorldLogo id={hops[1]} />{W.stations[hops[1]].name}</span></> : <span><WorldLogo id={stage.node} />{W.stations[stage.node].name}</span>}
            </div>
            <h4>{stageText.title}</h4><p>{stageText.detail}</p>
            <p className="data-world__route-key">{W.routeHelp}</p>
          </div>
          <div className="data-world__record"><p>{W.payloadLabel}<span>{W.packetNames[stage.packet]}</span></p><SyntaxCode value={JSON.stringify(payloads[scenario][frame.stage], null, 2)} compact /></div>
        </div>
        <details className="data-world__full-trace"><summary>{W.allStages}</summary><ol>{W.stageCopy[scenario].map((step, index) => <li key={step.title}><strong>{index + 1}. {step.title}</strong><p>{step.detail}</p></li>)}</ol></details>
      </section>
      <div className="data-world__station-list" role="group" aria-label={W.landmarkLabel}>{W.stations.map((item, id) => <button type="button" key={item.name} aria-pressed={selected === id} onClick={() => setSelected(id)}><span className="data-world__station-number">0{id + 1}</span><WorldLogo id={id} /><span>{item.name}<small>{item.role}</small></span></button>)}</div>
      <div className="data-world__reading">
        <article className="data-world__inspector"><p className="kicker">{W.inspect}</p><div className="data-world__station-title"><WorldLogo id={selected} /><div><h4>{station.name}</h4><span>{station.role}</span></div></div><p>{station.detail}</p><span className={`data-world__membership${active ? ' is-active' : ''}`}><i />{active ? W.active : W.inactive}</span></article>
        <div className="data-world__journey"><p className="kicker">{W.routeLabel}</p><ol aria-label={W.routeLabel}>{routes[scenario].map((id, index) => <li key={`${id}-${index}`}><span>{W.stations[id].name}</span>{index < routes[scenario].length - 1 && <b aria-hidden="true">→</b>}</li>)}</ol><p>{W.notes[scenario]}</p><strong>{W.takeaways[scenario]}</strong></div>
      </div>
    </ScenarioTabs>
    <p className="data-world__footnote">{W.modelNote}</p>
  </figure>;
}
