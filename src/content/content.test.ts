import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { lessons } from './lessons'
import { skillIndex } from './skills'

const dir = join(__dirname, 'lessons')

/** Đếm từ phần chữ của MDX: bỏ import, thẻ JSX và ký hiệu markdown. */
function words(mdx: string): number {
  const text = mdx
    .replace(/^import .*$/gm, '')
    .replace(/<Deep[\s\S]*?<\/Deep>/g, '') // phần "Đào sâu" là tùy chọn, không tính
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>-]/g, ' ')
  return text.split(/\s+/).filter(Boolean).length
}

describe('nội dung lesson', () => {
  it('mỗi lesson khớp một kỹ năng có trỏ ngược về nó', () => {
    for (const l of Object.values(lessons)) {
      expect(skillIndex[l.skill], l.id).toBeDefined()
      expect(skillIndex[l.skill].lesson, l.id).toBe(l.id)
    }
  })

  it('phần giải thích (không tính Đào sâu) ≤ 550 từ mỗi lesson', () => {
    for (const id of readdirSync(dir).filter((f) => !f.includes('.'))) {
      const total = readdirSync(join(dir, id))
        .filter((f) => f.endsWith('.mdx'))
        .reduce((n, f) => n + words(readFileSync(join(dir, id, f), 'utf8')), 0)
      console.log(`${id}: ${total} từ`)
      expect(total, id).toBeLessThanOrEqual(550)
    }
  })
})

describe('MDX', () => {
  it('không có dấu { } trần trong văn bản (MDX sẽ hiểu là biểu thức JS)', () => {
    for (const id of readdirSync(dir).filter((f) => !f.includes('.')))
      for (const f of readdirSync(join(dir, id)).filter((x) => x.endsWith('.mdx'))) {
        const lines = readFileSync(join(dir, id, f), 'utf8').split('\n')
        lines.forEach((ln, i) => {
          if (/^\s*(import|<|\s*$)/.test(ln)) return
          const bare = ln.replace(/\\[{}]/g, '')
          expect(/[{}]/.test(bare), `${id}/${f}:${i + 1}: ${ln}`).toBe(false)
        })
      }
  })
})
