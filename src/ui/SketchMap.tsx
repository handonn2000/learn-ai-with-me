import type { ReactNode } from 'react'

export interface MapStation {
  id: string
  x: number
  y: number
  node: ReactNode
}

/**
 * Khung bản đồ nét vẽ tay. Phần trang trí (đường mòn, cây, núi) là SVG `aria-hidden` truyền qua `decor`;
 * ga là phần tử HTML thật đặt tuyệt đối theo toạ độ trong hệ `width × height`.
 * Nét vẽ roughjs với seed cố định sẽ thêm ở mốc 3, khi có dữ liệu toạ độ.
 */
export function SketchMap({ width, height, decor, stations, label, className = '' }: { width: number; height: number; decor?: ReactNode; stations: MapStation[]; label: string; className?: string }) {
  return (
    <div role="group" aria-label={label} className={`relative mx-auto w-full max-w-full overflow-hidden rounded-3xl bg-paper ${className}`} style={{ aspectRatio: `${width} / ${height}`, maxWidth: width, backgroundImage: 'radial-gradient(var(--color-paper-dot) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' }}>
      <svg aria-hidden viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 size-full">
        {decor}
      </svg>
      {stations.map((s) => (
        <div key={s.id} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(s.x / width) * 100}%`, top: `${(s.y / height) * 100}%` }}>
          {s.node}
        </div>
      ))}
    </div>
  )
}
