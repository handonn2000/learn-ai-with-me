import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 h-11 text-[15px] font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed select-none'
const variants: Record<Variant, string> = {
  primary: 'bg-route text-white dark:text-[#0d1a17] hover:brightness-110',
  secondary: 'bg-surface text-ink border border-line hover:border-muted',
  ghost: 'text-muted hover:text-ink hover:bg-surface',
  danger: 'bg-stop text-white hover:brightness-110',
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />
}

export function ButtonLink({ variant = 'primary', className = '', ...rest }: LinkProps & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
