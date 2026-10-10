import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
const KEY = 'learn-ai-v2-theme'

function read(): Theme {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

export function applyTheme(t: Theme = read()) {
  if (t === 'system') document.documentElement.removeAttribute('data-theme')
  else document.documentElement.setAttribute('data-theme', t)
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(read)
  useEffect(() => {
    applyTheme(theme)
    try {
      if (theme === 'system') localStorage.removeItem(KEY)
      else localStorage.setItem(KEY, theme)
    } catch {
      /* chế độ riêng tư: bỏ qua */
    }
  }, [theme])
  const isDark =
    theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  return { isDark, toggle: () => setTheme(isDark ? 'light' : 'dark') }
}
