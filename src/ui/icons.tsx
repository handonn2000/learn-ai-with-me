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
