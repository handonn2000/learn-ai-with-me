import type { ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router'

/** `ghost` là tên cũ của `link`, giữ cho các màn chưa dựng lại. */
type Variant = 'primary' | 'secondary' | 'link' | 'ghost'

const base =
  'inline-flex items-center justify-center gap-2 font-bold select-none min-h-11 transition-[transform,box-shadow] duration-150 disabled:cursor-not-allowed'
const variants: Record<Variant, string> = {
  primary:
    'h-14 px-7 rounded-2xl border-2 border-ink bg-violet text-white text-lg shadow-block active:translate-y-[5px] active:shadow-none ' +
    'disabled:bg-track disabled:border-disabled-line disabled:text-disabled-ink disabled:shadow-none disabled:active:translate-y-0',
  secondary:
    'h-12 px-5 rounded-[14px] border-2 border-ink bg-surface text-ink text-base disabled:border-disabled-line disabled:text-disabled-ink',
  link: 'px-1 text-violet underline underline-offset-4 hover:text-ink disabled:text-disabled-ink',
  ghost: 'px-1 text-violet underline underline-offset-4 hover:text-ink disabled:text-disabled-ink',
}

export const buttonClass = (variant: Variant = 'primary', className = '') => `${base} ${variants[variant]} ${className}`

export function Button({ variant = 'primary', className = '', type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type={type} className={buttonClass(variant, className)} {...rest} />
}

export function ButtonLink({ variant = 'primary', className = '', ...rest }: LinkProps & { variant?: Variant }) {
  return <Link className={buttonClass(variant, className)} {...rest} />
}
