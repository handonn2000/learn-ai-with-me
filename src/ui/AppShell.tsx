import type { ComponentType, SVGProps } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { todayMock } from '@/content/mock/today'
import { useDue } from '@/learning/hooks'
import { AccountButton } from './AccountButton'
import { HomeIcon, NotebookIcon, ReviewIcon, TargetIcon } from './icons'

const items: { to: string; label: string; end?: boolean; Icon: ComponentType<SVGProps<SVGSVGElement>>; badge?: boolean }[] = [
  { to: '/', label: 'Hôm nay', end: true, Icon: HomeIcon },
  { to: '/courses', label: 'Khóa học', Icon: TargetIcon },
  { to: '/review', label: 'Ôn tập', Icon: ReviewIcon, badge: true },
  { to: '/notebook', label: 'Sổ tay', Icon: NotebookIcon },
]

function Badge({ n }: { n: number }) {
  return (
    <span className="grid h-[22px] min-w-[22px] place-items-center rounded-full border-2 border-ink bg-sun px-1 text-xs font-extrabold text-ink">
      <span className="sr-only">{n} thẻ đến hạn: </span>
      <span aria-hidden>{n}</span>
    </span>
  )
}

/** Khung chung: thanh trên (máy tính) và tab đáy (dưới 720px). Màn học và kiểm tra không dùng khung này. */
export function AppShell() {
  const due = useDue().length
  const path = useLocation().pathname
  const onToday = path === '/'
  // Màn mục tiêu có thanh riêng trên điện thoại, nên bỏ thanh trên của khung chung ở đó.
  const ownHeader = path.startsWith('/goal/')
  return (
    <div className="min-h-dvh">
      <header className={`mx-auto flex max-w-[1236px] items-center justify-between gap-4 px-4 py-4 min-[720px]:px-7 min-[720px]:py-5 ${ownHeader ? 'max-[719px]:hidden' : ''}`}>
        <Link to="/" className="font-display text-[21px] font-extrabold whitespace-nowrap tracking-[-0.02em] text-ink no-underline min-[720px]:text-2xl">
          học AI cùng tôi
        </Link>
        <div className="flex items-center gap-3 min-[720px]:gap-4">
          <nav aria-label="Chính" className="hidden items-center gap-1.5 min-[720px]:flex">
            {items.map(({ to, label, end, badge }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-2 rounded-xl border-2 px-4 py-2 no-underline ${isActive ? 'border-ink bg-surface font-bold text-ink' : 'border-transparent font-semibold text-muted hover:text-ink'}`
                }
              >
                {label}
                {badge && due > 0 && <Badge n={due} />}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {onToday && <span className="text-sm font-bold whitespace-nowrap min-[720px]:hidden">{todayMock.streakDays} ngày liền</span>}
            <AccountButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1236px] px-4 pt-1.5 pb-28 min-[720px]:px-7 min-[720px]:pt-2 min-[720px]:pb-18">
        <Outlet />
      </main>

      <nav aria-label="Chính" className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t-2 border-ink bg-surface px-1 pt-1.5 pb-[max(18px,env(safe-area-inset-bottom))] min-[720px]:hidden">
        {items.map(({ to, label, end, Icon, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex min-h-11 flex-col items-center gap-0.5 py-1.5 text-xs no-underline ${isActive ? 'font-extrabold text-violet' : 'font-semibold text-muted'}`
            }
          >
            <Icon width={22} height={22} />
            {label}
            {badge && due > 0 && (
              <span className="absolute top-0.5 left-1/2 ml-2 grid h-4 min-w-4 place-items-center rounded-full border-2 border-ink bg-sun px-0.5 text-[10px] leading-none font-extrabold text-ink">
                <span className="sr-only">{due} thẻ đến hạn: </span>
                <span aria-hidden>{due}</span>
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
