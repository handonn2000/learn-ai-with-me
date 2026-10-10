import { ButtonLink } from '@/ui/Button'

export function NotFound() {
  return (
    <div className="pt-16">
      <h1 className="text-[28px] font-bold">Không có trang này.</h1>
      <p className="mt-2 text-muted">Đường dẫn có thể đã đổi. Quay về trang chính để học tiếp.</p>
      <ButtonLink to="/" className="mt-6">
        Về trang chính
      </ButtonLink>
    </div>
  )
}
