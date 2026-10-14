import { ArrowDown, ArrowUp } from 'lucide-react'

/**
 * Vòng tác tử ↔ môi trường: tri giác đi vào qua cảm biến, hành động đi ra qua bộ chấp hành.
 * Dựng bằng HTML (không phải SVG) để chữ giữ cỡ đọc được trên điện thoại. Hình tĩnh.
 */
export function AgentLoop({ env, sensors, actuators }: { env: string; sensors: string; actuators: string }) {
  return (
    <figure className="m-0 rounded-2xl border-2 border-ink bg-paper p-3 text-[15px] leading-snug min-[560px]:p-4">
      <div className="rounded-xl border-2 border-ink bg-surface px-4 py-3">
        <b className="block text-base">Môi trường</b>
        <span className="text-muted">{env}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 py-2">
        <div className="flex items-center gap-2">
          <ArrowDown aria-hidden className="size-7 shrink-0 text-violet" strokeWidth={2.5} />
          <span>
            <b className="text-violet">tri giác</b> vào qua <b>cảm biến</b>
            <span className="block text-muted">{sensors}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowUp aria-hidden className="size-7 shrink-0 text-g" strokeWidth={2.5} />
          <span>
            <b className="text-g">hành động</b> ra qua <b>bộ chấp hành</b>
            <span className="block text-muted">{actuators}</span>
          </span>
        </div>
      </div>
      <div className="rounded-xl border-2 border-ink bg-violet-soft px-4 py-3">
        <b className="block text-base">Tác tử</b>
        <span className="text-muted">chọn hành động từ những gì đã cảm nhận</span>
      </div>
    </figure>
  )
}
