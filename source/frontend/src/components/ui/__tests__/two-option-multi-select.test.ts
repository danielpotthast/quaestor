import { describe, expect, it } from 'vitest'

import { scalarToSelection, selectionToScalar } from '@/components/ui/two-option-multi-select'

const ALL = ['with', 'without'] as const

describe('two-option scalar bridge', () => {
  it('maps scalar -> selection', () => {
    expect(scalarToSelection(undefined, [...ALL])).toEqual(['with', 'without'])
    expect(scalarToSelection('with', [...ALL])).toEqual(['with'])
    expect(scalarToSelection('none', [...ALL])).toEqual([])
  })

  it('maps selection -> scalar', () => {
    expect(selectionToScalar(['with', 'without'], 2)).toBeUndefined()
    expect(selectionToScalar(['without'], 2)).toBe('without')
    expect(selectionToScalar([], 2)).toBe('none')
  })

  it('round-trips every state', () => {
    for (const value of [undefined, 'with', 'without', 'none'] as const) {
      expect(selectionToScalar(scalarToSelection(value, [...ALL]), 2)).toBe(value)
    }
  })
})
