import type { InputHTMLAttributes } from 'react'

/** Ô số kiểu mono. `chip` là biến thể "g=" gắn cạnh nút trên bản đồ. */
export function NumberInput({ unit, prefix, chip = false, className = '', ...rest }: { unit?: string; prefix?: string; chip?: boolean } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'prefix'>) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {chip ? (
        <label className="inline-flex h-8 items-center gap-1 rounded-lg border-2 border-ink bg-surface px-2 font-mono text-sm font-bold has-[:focus-visible]:border-violet">
          {prefix && <span className="text-g">{prefix}</span>}
          <input type="number" inputMode="numeric" className={`w-10 bg-transparent text-center outline-none ${className}`} {...rest} />
        </label>
      ) : (
        <input
          type="number"
          inputMode="numeric"
          className={`h-[52px] w-24 rounded-[14px] border-2 border-ink bg-surface text-center font-mono text-[22px] font-bold focus:border-violet ${className}`}
          {...rest}
        />
      )}
      {unit && <span className="text-muted">{unit}</span>}
    </span>
  )
}
