'use client'

import { useTranslation } from 'react-i18next'
import { FileX, Paperclip } from 'lucide-react'

import type { MultiSelectOption } from '@/components/ui/multi-select-popover'
import {
  TwoOptionMultiSelect,
  scalarToSelection,
  selectionToScalar,
} from '@/components/ui/two-option-multi-select'

export type AttachmentFilter = 'with' | 'without' | 'none'

export interface AttachmentMultiSelectProps {
  id?: string
  value: AttachmentFilter | undefined
  onChange: (next: AttachmentFilter | undefined) => void
  className?: string
}

export function AttachmentMultiSelect({
  id,
  value,
  onChange,
  className,
}: AttachmentMultiSelectProps) {
  const { t } = useTranslation()

  const iconClass = 'text-muted-foreground size-4 shrink-0'
  const options: MultiSelectOption<'with' | 'without'>[] = [
    {
      value: 'with',
      label: t('filters.attachment.with'),
      leading: <Paperclip className={iconClass} aria-hidden="true" />,
    },
    {
      value: 'without',
      label: t('filters.attachment.without'),
      leading: <FileX className={iconClass} aria-hidden="true" />,
    },
  ]

  const all = options.map((option) => option.value)

  return (
    <TwoOptionMultiSelect
      id={id}
      ariaLabel={t('filters.attachmentLabel')}
      options={options}
      selected={scalarToSelection(value, all)}
      onChange={(next) => onChange(selectionToScalar(next, all.length))}
      checkboxIdPrefix="attachment"
      className={className}
    />
  )
}
