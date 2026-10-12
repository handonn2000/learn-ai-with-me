import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Khung bản đồ nét vẽ tay, kích thước cố định `width × height` (px) để nhãn không bị co theo màn hình.
 * Màn hẹp thì cuộn ngang trong chính khung này. Phần trang trí (đường mòn, cây, núi) là SVG `aria-hidden`
 * truyền qua `decor`; ga và nhãn là HTML thật, đặt tuyệt đối trong `children` bằng `MapAt`.
 */
export function SketchMap({ width, height, decor, label, children, fit = false, className = '' }: { width: number; height: number; decor?: ReactNode; label: string; children: ReactNode; fit?: boolean; className?: string }) {
  // fit: thu nhỏ cả khung cho vừa bề ngang (điện thoại hẹp hơn `width`) thay vì cuộn ngang.
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    if (!fit || !ref.current) return
    const el = ref.current
    const update = () => setScale(Math.min(1, el.clientWidth / width))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [fit, width])
  return (
    <div ref={ref} role="group" aria-label={label} className={`${fit ? 'overflow-hidden' : 'overflow-x-auto'} rounded-3xl border-2 border-ink bg-paper ${className}`} style={{ backgroundImage: 'radial-gradient(var(--color-paper-dot) 1.2px, transparent 1.2px)', backgroundSize: '22px 22px', ...(fit ? { height: height * scale } : null) }}>
      <div className="relative mx-auto" style={{ width, height, ...(fit ? { transform: `scale(${scale})`, transformOrigin: 'top left' } : null) }}>
        <svg aria-hidden viewBox={`0 0 ${width} ${height}`} width={width} height={height} className="absolute inset-0 overflow-visible">
          {decor}
        </svg>
        {children}
      </div>
    </div>
  )
}

/** Đặt một phần tử HTML lên bản đồ. `center` căn giữa theo (x, y); `align="right"` đặt lề phải tại x. */
export function MapAt({ x, y, w, center, align = 'left', canvasWidth, children, className = '' }: { x: number; y: number; w?: number; center?: boolean; align?: 'left' | 'right' | 'center'; canvasWidth?: number; children: ReactNode; className?: string }) {
  const style: React.CSSProperties = { top: y, width: w, textAlign: align }
  if (center) {
    style.left = x
    style.top = y
    style.transform = 'translate(-50%, -50%)'
  } else if (align === 'right' && canvasWidth) style.right = canvasWidth - x
  else if (align === 'center') {
    style.left = x - (w ?? 0) / 2
  } else style.left = x
  return (
    <div className={`absolute ${className}`} style={style}>
      {children}
    </div>
  )
}
