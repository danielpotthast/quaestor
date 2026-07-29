import { describe, expect, it } from 'vitest'

import {
  filterAndSortRules,
  ruleSignature,
  type NotificationRule,
  type NotificationTrigger,
} from '@/lib/notificationRules'

function rule(
  id: number,
  trigger: NotificationTrigger,
  name: string | null,
  account_ids: number[] = [],
): NotificationRule {
  return {
    id,
    trigger,
    name,
    account_ids,
    enabled: true,
    include_content: true,
  } as NotificationRule
}

const labels = {
  trigger: (trigger: NotificationTrigger) => trigger,
  title: (r: NotificationRule) => r.name ?? r.trigger,
}

describe('filterAndSortRules', () => {
  const rules = [
    rule(1, 'transaction', 'Zebra'),
    rule(2, 'digest', 'Bravo', [7]),
    rule(3, 'transaction', 'Alpha', [7]),
    rule(4, 'digest', 'Anton', [9]),
  ]

  it('sorts by trigger then name', () => {
    expect(filterAndSortRules(rules, {}, labels).map((r) => r.id)).toEqual([4, 2, 3, 1])
  })

  it('filters by name, case-insensitively', () => {
    expect(filterAndSortRules(rules, { text: ' alp ' }, labels).map((r) => r.id)).toEqual([3])
  })

  it('filters by trigger', () => {
    expect(filterAndSortRules(rules, { triggers: ['digest'] }, labels).map((r) => r.id)).toEqual([
      4, 2,
    ])
  })

  it('shows nothing when no account is selected', () => {
    expect(filterAndSortRules(rules, { accountIds: [] }, labels)).toEqual([])
  })

  it('filters by account, keeping rules that apply to all accounts', () => {
    expect(filterAndSortRules(rules, { accountIds: [7] }, labels).map((r) => r.id)).toEqual([
      2, 3, 1,
    ])
  })
})

describe('ruleSignature', () => {
  const sig = (fields: Record<string, unknown>) =>
    ruleSignature({ account_ids: [], ...fields } as unknown as NotificationRule)

  it('is order-independent in accounts, categories and types (so equal rules dedupe)', () => {
    const a = sig({
      trigger: 'transaction',
      account_ids: [3, 1, 2],
      categories: ['b', 'a'],
      types: ['y', 'x'],
    })
    const b = sig({
      trigger: 'transaction',
      account_ids: [1, 2, 3],
      categories: ['a', 'b'],
      types: ['x', 'y'],
    })
    expect(a).toBe(b)
  })

  it('distinguishes rules that differ only by trigger', () => {
    expect(sig({ trigger: 'expected_transaction', account_ids: [1] })).not.toBe(
      sig({ trigger: 'contract_amount_increased', account_ids: [1] }),
    )
  })

  it('includes days for days-based triggers', () => {
    expect(
      JSON.parse(sig({ trigger: 'upcoming_shortfall', account_ids: [1], days: 7 })),
    ).toMatchObject({
      trigger: 'upcoming_shortfall',
      accounts: [1],
      days: 7,
    })
  })

  it('keeps the weekday for a weekly digest but nulls it for a monthly one', () => {
    expect(JSON.parse(sig({ trigger: 'digest', period: 'weekly', weekday: 3 })).weekday).toBe(3)
    expect(JSON.parse(sig({ trigger: 'digest', period: 'monthly', weekday: 3 })).weekday).toBeNull()
  })

  it('includes threshold and direction for balance_threshold', () => {
    expect(
      JSON.parse(
        sig({ trigger: 'balance_threshold', account_ids: [1], threshold: 100, direction: 'below' }),
      ),
    ).toMatchObject({ threshold: 100, direction: 'below' })
  })
})
