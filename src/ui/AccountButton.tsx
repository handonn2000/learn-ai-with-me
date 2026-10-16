import { useEffect, useRef, useState, type ReactNode } from 'react'
import { signIn, signOut, useAccount, type SyncState } from '@/learning/account'
import { GithubIcon } from './icons'

const syncLabel: Record<SyncState, string> = {
  idle: 'Tiến độ lưu trên mây',
  saving: 'Đang lưu lên mây…',
  saved: 'Đã lưu trên mây',
  error: 'Chưa lưu được lên mây',
}

/** Hộp nhỏ thả xuống dưới nút; đóng khi bấm ra ngoài hoặc nhấn Esc. */
function Popover({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const down = (e: PointerEvent) => {
      const box = ref.current?.parentElement
      if (box && e.target instanceof Node && !box.contains(e.target)) onClose()
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', down)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', down)
      document.removeEventListener('keydown', key)
    }
  }, [onClose])
  return (
    <div ref={ref} className="absolute top-full right-0 z-20 mt-2 w-[min(280px,calc(100vw-32px))] rounded-2xl border-2 border-ink bg-surface p-4 shadow-block">
      {children}
    </div>
  )
}

/** Đăng nhập GitHub để giữ tiến độ khi đổi máy. Không đăng nhập vẫn học được; tiến độ nằm trong máy. */
export function AccountButton() {
  const { status, user, sync, error } = useAccount()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const close = () => setOpen(false)

  // Đang hỏi Firebase phiên cũ: giữ chỗ để thanh trên không nhảy.
  if (status === 'loading') return <span className="block size-11" aria-hidden />

  if (status === 'signedOut' || !user) {
    return (
      <div className="relative">
        <button
          type="button"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            await signIn()
            setBusy(false)
          }}
          aria-label="Đăng nhập bằng GitHub"
          title="Đăng nhập để giữ tiến độ khi đổi máy"
          className="flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-xl border-2 border-ink bg-surface px-2.5 text-sm font-bold whitespace-nowrap text-ink disabled:border-disabled-line disabled:text-disabled-ink min-[720px]:px-3"
        >
          <GithubIcon width={18} height={18} />
          {/* Điện thoại: chỉ logo, tên nút nằm ở aria-label. */}
          <span className="max-[719px]:hidden">Đăng nhập</span>
        </button>
        {error && (
          <Popover onClose={() => useAccount.setState({ error: null })}>
            <p role="alert" className="m-0 text-sm text-wrong-ink">
              {error}
            </p>
          </Popover>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={`Tài khoản: ${user.name}`}
        className="relative grid size-11 place-items-center rounded-full"
      >
        {user.photo ? (
          <img src={user.photo} alt="" referrerPolicy="no-referrer" className="size-10 rounded-full border-2 border-ink bg-fill object-cover" />
        ) : (
          <span className="grid size-10 place-items-center rounded-full border-2 border-ink bg-violet-soft font-extrabold text-ink">
            {user.name.slice(0, 1).toUpperCase()}
          </span>
        )}
        {sync === 'error' && <span className="absolute top-0.5 right-0.5 size-3 rounded-full border-2 border-surface bg-wrong" aria-hidden />}
      </button>
      {open && (
        <Popover onClose={close}>
          <p className="m-0 truncate font-bold">{user.name}</p>
          <p className={`mt-1 mb-0 text-sm ${sync === 'error' ? 'text-wrong-ink' : 'text-muted'}`} role="status">
            {syncLabel[sync]}
          </p>
          {sync === 'error' && error && <p className="mt-1 mb-0 text-sm text-wrong-ink">{error}</p>}
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              await signOut()
              setBusy(false)
              close()
            }}
            className="mt-3 min-h-11 w-full rounded-xl border-2 border-ink bg-surface font-bold text-ink disabled:border-disabled-line disabled:text-disabled-ink"
          >
            {busy ? 'Đang lưu rồi đăng xuất…' : 'Đăng xuất'}
          </button>
          <p className="mt-2 mb-0 text-xs text-muted">Đăng xuất xong, tiến độ trên máy này được xóa; đăng nhập lại là có lại.</p>
        </Popover>
      )}
    </div>
  )
}
