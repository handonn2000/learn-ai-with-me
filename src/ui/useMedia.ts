import { useEffect, useState } from 'react'

/** `matchMedia` làm hook. Dùng khi hai bố cục khác nhau về cấu trúc (không chỉ về kiểu) giữa máy tính và điện thoại. */
export function useMedia(query: string) {
  const [match, setMatch] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false))
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setMatch(m.matches)
    on()
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [query])
  return match
}
