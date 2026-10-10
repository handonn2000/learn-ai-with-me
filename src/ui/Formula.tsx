import katex from 'katex'
import { useMemo } from 'react'

export function Formula({ tex, block = false }: { tex: string; block?: boolean }) {
  const html = useMemo(() => katex.renderToString(tex, { displayMode: block, throwOnError: false }), [tex, block])
  return block ? (
    <div className="my-2 overflow-x-auto py-1" dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span dangerouslySetInnerHTML={{ __html: html }} />
  )
}
