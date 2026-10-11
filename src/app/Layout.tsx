import { NavLink, Outlet, Link } from 'react-router'
import { BrandMark } from '@/ui/Brand'
import { useDue } from '@/learning/hooks'

const navCls = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-[15px] font-medium transition-colors ${isActive ? 'bg-surface text-ink shadow-[0_0_0_1px_var(--line)]' : 'text-muted hover:text-ink'}`

export function Layout() {
  const due = useDue()
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <BrandMark />
          <span className="hidden sm:inline">Học AI cùng tôi</span>
        </Link>
        <nav className="flex items-center gap-1" aria-label="Chính">
          <NavLink to="/" end className={navCls}>
            Hôm nay
          </NavLink>
          <NavLink to="/map" className={navCls}>
            Bản đồ
          </NavLink>
          <NavLink to="/review" className={navCls}>
            Ôn tập
            {due.length > 0 && (
              <span className="ml-1.5 inline-grid min-w-5 place-items-center rounded-full bg-signal px-1 text-[12px] font-bold text-[#1b1500]">
                {due.length}
              </span>
            )}
          </NavLink>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
