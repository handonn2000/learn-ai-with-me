import { useLocalList } from '@/lib/useLocalList';
import { UI } from '@/content/ui';

// Khối "ZERO → HERO — tự kiểm" cuối bài học, tick lưu localStorage.
export function CheckList({ storageKey, items }: { storageKey: string; items: string[] }) {
  const [done, toggle] = useLocalList(storageKey);
  return (
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--green)', letterSpacing: '0.8px' }}>{UI.checklist.title}</span>
        <span className="mono" style={{ fontSize: 12, color: 'var(--faint)' }}>{done.length}/{items.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
        {items.map((text, i) => {
          const isDone = done.includes(i);
          return (
            <button key={i} onClick={() => toggle(i)} className={`check-item${isDone ? ' is-done' : ''}`}>
              <span className="check-item__mark">{isDone ? '✓' : ''}</span>
              <span style={{ flex: 1 }}>{text}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
