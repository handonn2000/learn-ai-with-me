import type { SVGProps } from 'react'

const p = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

export const CheckIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={3} {...a}>
    <path d="M5 12l5 5L20 7" />
  </svg>
)
export const CrossIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={3} {...a}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)
export const BulbIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.5} {...a}>
    <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9V16h7v-2.1A6 6 0 0 0 12 3z" />
  </svg>
)
export const DocIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.5} {...a}>
    <path d="M4 5h16v14H4z" />
    <path d="M8 9h8M8 13h6" />
  </svg>
)
export const PenIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.5} {...a}>
    <path d="M4 20l4-1 11-11-3-3L5 16l-1 4z" />
  </svg>
)
export const CloseIcon = CrossIcon
export const CalendarIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.2} {...a}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)
export const ChevronRightIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.5} {...a}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)
export const LockIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.4} {...a}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
)
export const HomeIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.4} {...a}>
    <path d="M3 11l9-7 9 7v9H3z" />
  </svg>
)
export const TargetIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.2} {...a}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)
export const ReviewIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.2} {...a}>
    <path d="M4 12a8 8 0 1 0 3-6.2" />
    <path d="M4 4v4h4" />
  </svg>
)
export const NotebookIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.2} {...a}>
    <path d="M5 4h11l3 3v13H5z" />
    <path d="M9 10h6M9 14h6" />
  </svg>
)
export const MapIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.2} {...a}>
    <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </svg>
)
export const ListIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg {...p} strokeWidth={2.4} {...a}>
    <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />
  </svg>
)
/** Logo GitHub (Octicon mark-github), tô đặc. */
export const GithubIcon = (a: SVGProps<SVGSVGElement>) => (
  <svg width={20} height={20} viewBox="0 0 16 16" fill="currentColor" aria-hidden {...a}>
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)
