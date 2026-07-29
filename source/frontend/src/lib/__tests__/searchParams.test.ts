import { describe, expect, it } from 'vitest'

import { appendParams } from '@/lib/searchParams'

describe('appendParams', () => {
  const build = (entries: Record<string, unknown>) => {
    const params = new URLSearchParams()
    appendParams(params, entries)
    return params.toString()
  }

  it.each([
    [{ id: [1, 2, 3] }, 'id=1&id=2&id=3'],
    [{ a: undefined, b: null, c: 1 }, 'c=1'],
    [{ a: '', b: 0 }, 'b=0'],
    [{ a: 'x', n: 42, flag: false }, 'a=x&n=42&flag=false'],
    [{ list: [] }, ''],
  ])('appendParams(%j) → %s', (entries, expected) => {
    expect(build(entries)).toBe(expected)
  })
})
