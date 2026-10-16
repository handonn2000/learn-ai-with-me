import { useEffect } from 'react'
import { useRouteError } from 'react-router'
import { Button } from '@/ui/Button'

// Sau một lần deploy, tab đang mở vẫn giữ index.html cũ và trỏ tới chunk đã bị xóa.
// Gặp lỗi đó thì tải lại trang một lần để lấy bản mới; lặp lại trong 10 giây thì thôi, hiện lỗi.
const RELOAD_KEY = 'learn-ai-v2:chunk-reload'

function isStaleChunkError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return /dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message)
}

export function reloadForNewVersion(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
    if (Date.now() - last < 10_000) return false
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  } catch {
    // Không có sessionStorage: vẫn tải lại, chấp nhận rủi ro lặp.
  }
  window.location.reload()
  return true
}

export function RouteError() {
  const error = useRouteError()
  const stale = isStaleChunkError(error)

  useEffect(() => {
    if (stale) reloadForNewVersion()
  }, [stale])

  return (
    <div className="mx-auto max-w-xl px-4 pt-16">
      <h1 className="text-[28px] font-bold">{stale ? 'App vừa có bản mới.' : 'Có lỗi khi mở trang này.'}</h1>
      <p className="mt-2 text-muted">
        {stale ? 'Tải lại trang để dùng bản mới. Tiến độ của bạn vẫn còn.' : 'Thử tải lại trang. Tiến độ của bạn vẫn còn.'}
      </p>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Tải lại trang
      </Button>
    </div>
  )
}
