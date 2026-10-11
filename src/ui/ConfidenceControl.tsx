export type Confidence = 'guess' | 'fair' | 'sure'

const options: { value: Confidence; label: string }[] = [
  { value: 'guess', label: 'Đoán thôi' },
  { value: 'fair', label: 'Khá chắc' },
  { value: 'sure', label: 'Rất chắc' },
]

/** 3 mức tự tin. Là radiogroup nên dùng được bằng phím mũi tên. */
export function ConfidenceControl({ value, onChange }: { value?: Confidence; onChange: (v: Confidence) => void }) {
  return (
    <div role="radiogroup" aria-label="Mức chắc chắn" className="inline-flex overflow-hidden rounded-[14px] border-2 border-ink text-[15px]">
      {options.map((o, i) => (
        <label key={o.value} className={`relative min-h-11 cursor-pointer whitespace-nowrap px-3 py-2.5 sm:px-4 has-[:focus-visible]:outline-3 has-[:focus-visible]:-outline-offset-3 has-[:focus-visible]:outline-violet ${i > 0 ? 'border-l-2 border-ink' : ''} ${value === o.value ? 'bg-ink font-bold text-white' : 'font-semibold'}`}>
          <input type="radio" name="confidence" value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} className="sr-only" />
          {o.label}
        </label>
      ))}
    </div>
  )
}
