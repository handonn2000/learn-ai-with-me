import { ButtonLink } from '@/ui/Button'

/** Chỗ giữ cho màn chưa dựng (Khóa học: mốc 3, Sổ tay: mốc 6). */
export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="pt-10">
      <h1 className="m-0 text-[34px] leading-tight font-extrabold tracking-[-0.03em]">{title}</h1>
      <p className="mt-3 max-w-[44ch] text-lg text-muted">Màn này đang được dựng. Bạn có thể học tiếp ở trang Hôm nay.</p>
      <ButtonLink to="/" className="mt-6">
        Về Hôm nay
      </ButtonLink>
    </div>
  )
}
