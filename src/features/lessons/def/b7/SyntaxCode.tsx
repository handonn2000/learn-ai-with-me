/** Lexical JSON colors: text stays escaped, selectable, and unchanged when copied. */
export function SyntaxCode({ value, compact = false, label = 'JSON' }: { value: string; compact?: boolean; label?: string }) {
  const tokens = value.split(/("(?:\\.|[^"\\])*"\s*(?=:)|"(?:\\.|[^"\\])*"|\b(?:true|false|null)\b|-?\b\d+(?:\.\d+)?(?:[eE][+-]?\d+)?\b|[{}\[\]:,])/g);
  return <div className={`def-syntax ${compact ? 'def-syntax--compact' : ''}`}><div className="def-syntax-label"><span aria-hidden="true">{'{ }'}</span>{label}</div><pre><code>{tokens.map((token, i) => {
    let kind = 'plain';
    if (/^"/.test(token)) kind = /^"(?:\\.|[^"\\])*"\s*$/.test(token) && /^\s*:/.test(tokens.slice(i + 1).join('')) ? 'key' : 'string';
    else if (/^(true|false|null)$/.test(token)) kind = 'literal';
    else if (/^-?\d/.test(token)) kind = 'number';
    else if (/^[{}\[\]:,]$/.test(token)) kind = 'punctuation';
    return <span key={i} className={`def-token--${kind}`}>{token}</span>;
  })}</code></pre></div>;
}
