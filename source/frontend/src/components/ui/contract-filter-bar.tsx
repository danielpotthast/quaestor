'use client'

import { useTranslation } from 'react-i18next'
import { Archive, ChevronRight, CircleCheck, Repeat, TriangleAlert } from 'lucide-react'

import type { CredentialRead } from '@/lib/auth'
import {
  CONTRACT_FREQUENCY_FILTERS,
  CONTRACT_OVERDUE_FILTERS,
  DEFAULT_CONTRACT_STATUS,
  hasActiveContractFilters,
  type ContractFilters,
  type ContractOverdueFilter,
  type ContractStatusFilter,
} from '@/lib/contract'
import { FILTERABLE_CATEGORIES } from '@/lib/statistics'
import { AccountMultiSelect } from '@/components/ui/account-multi-select'
import { AmountRangeFields } from '@/components/ui/amount-range-fields'
import { CategoryMultiSelect } from '@/components/ui/category-multi-select'
import { FrequencyMultiSelect } from '@/components/ui/frequency-multi-select'
import { FilterHeading } from '@/components/ui/filter-heading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { MultiSelectPopover, type MultiSelectOption } from '@/components/ui/multi-select-popover'

export interface ContractFilterBarProps {
  credentials: CredentialRead[]
  filters: ContractFilters
  onChange: (next: ContractFilters) => void
}

function ContractFilterBar({ credentials, filters, onChange }: ContractFilterBarProps) {
  const { t } = useTranslation()
  const iconClass = 'text-muted-foreground size-4 shrink-0'
  const accountIds = credentials.flatMap((credential) =>
    credential.accounts.map((account) => account.id),
  )

  const update = <K extends keyof ContractFilters>(key: K, value: ContractFilters[K]) =>
    onChange({ ...filters, [key]: value })

  const shownOrAll = <T,>(selected: T[] | undefined, all: readonly T[]): T[] => selected ?? [...all]
  const normalize = <T,>(next: T[], total: number): T[] | undefined =>
    next.length >= total ? undefined : next

  const overdueOptions: MultiSelectOption<ContractOverdueFilter>[] = [
    {
      value: 'CURRENT',
      label: t('common.current'),
      leading: <CircleCheck className={iconClass} />,
    },
    {
      value: 'OVERDUE',
      label: t('common.overdue'),
      leading: <TriangleAlert className={iconClass} />,
    },
  ]
  const statusOptions: MultiSelectOption<ContractStatusFilter>[] = [
    {
      value: 'ACTIVE',
      label: t('contracts.statusOption.active'),
      leading: <Repeat className={iconClass} />,
    },
    { value: 'ARCHIVED', label: t('common.archived'), leading: <Archive className={iconClass} /> },
  ]
  const twoOptionLabel = <T extends string>(
    selected: T[],
    options: MultiSelectOption<T>[],
  ): string => {
    if (selected.length === 0) return t('search.selectNone')
    if (selected.length >= options.length) return t('common.any')
    return options.find((option) => option.value === selected[0])?.label ?? ''
  }
  const statusEqualsDefault = (next: ContractStatusFilter[]): boolean =>
    next.length === DEFAULT_CONTRACT_STATUS.length && next.every((value) => value === 'ACTIVE')

  return (
    <section className="border-border bg-card flex flex-col gap-3 rounded-lg border p-3">
      <FilterHeading />
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contract-filter-text">{t('common.name')}</Label>
        <Input
          id="contract-filter-text"
          type="search"
          inputMode="search"
          value={filters.text ?? ''}
          placeholder={t('contracts.searchPlaceholder')}
          onChange={(event) => update('text', event.target.value || undefined)}
        />
      </div>

      <AmountRangeFields
        idPrefix="contract-filter"
        fromLabel={t('common.amountFrom')}
        toLabel={t('common.amountTo')}
        from={filters.amount_from}
        to={filters.amount_to}
        onFromChange={(value) => update('amount_from', value)}
        onToChange={(value) => update('amount_to', value)}
      />

      <details className="group border-border border-t pt-3">
        <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer list-none select-none items-center gap-1 text-sm font-medium">
          <ChevronRight
            className="size-4 transition-transform group-open:rotate-90"
            aria-hidden="true"
          />
          {t('search.advancedFilters')}
        </summary>
        <div className="flex flex-col gap-3 pt-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contract-filter-accounts">{t('common.account')}</Label>
              <AccountMultiSelect
                id="contract-filter-accounts"
                credentials={credentials}
                selectedIds={shownOrAll(filters.account_ids, accountIds)}
                onChange={(next) => update('account_ids', normalize(next, accountIds.length))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contract-filter-categories">{t('common.categories')}</Label>
              <CategoryMultiSelect
                id="contract-filter-categories"
                selectedIds={shownOrAll(filters.categories, FILTERABLE_CATEGORIES)}
                onChange={(next) =>
                  update('categories', normalize(next, FILTERABLE_CATEGORIES.length))
                }
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contract-filter-frequencies">{t('filters.frequenciesLabel')}</Label>
              <FrequencyMultiSelect
                id="contract-filter-frequencies"
                selectedIds={shownOrAll(filters.frequencies, CONTRACT_FREQUENCY_FILTERS)}
                onChange={(next) =>
                  update('frequencies', normalize(next, CONTRACT_FREQUENCY_FILTERS.length))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contract-filter-overdue">{t('common.overdue')}</Label>
              <MultiSelectPopover
                id="contract-filter-overdue"
                ariaLabel={t('common.overdue')}
                checkboxIdPrefix="contract-overdue"
                selected={filters.overdue ?? [...CONTRACT_OVERDUE_FILTERS]}
                onChange={(next) =>
                  update('overdue', normalize(next, CONTRACT_OVERDUE_FILTERS.length))
                }
                triggerLabel={twoOptionLabel(
                  filters.overdue ?? [...CONTRACT_OVERDUE_FILTERS],
                  overdueOptions,
                )}
                options={overdueOptions}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="contract-filter-status">{t('contracts.statusLabel')}</Label>
              <MultiSelectPopover
                id="contract-filter-status"
                ariaLabel={t('contracts.statusLabel')}
                checkboxIdPrefix="contract-status"
                selected={filters.status ?? DEFAULT_CONTRACT_STATUS}
                onChange={(next) => update('status', statusEqualsDefault(next) ? undefined : next)}
                triggerLabel={twoOptionLabel(
                  filters.status ?? DEFAULT_CONTRACT_STATUS,
                  statusOptions,
                )}
                options={statusOptions}
              />
            </div>
          </div>
        </div>
      </details>

      {hasActiveContractFilters(filters) ? (
        <button
          type="button"
          className="text-primary hover:text-primary/80 cursor-pointer self-end text-xs transition-colors"
          onClick={() => onChange({})}
        >
          {t('contracts.filtersReset')}
        </button>
      ) : null}
    </section>
  )
}

export { ContractFilterBar }
