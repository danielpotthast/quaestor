'use client'

import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronRight } from 'lucide-react'

export function AdvancedFilters({
  storageKey,
  children,
}: {
  storageKey: string
  children: ReactNode
}) {
  const { t } = useTranslation()
  const key = `advanced-filters:${storageKey}`
  const [open, setOpen] = useState(() => sessionStorage.getItem(key) === '1')

  const onToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    const next = event.currentTarget.open
    setOpen(next)
    sessionStorage.setItem(key, next ? '1' : '0')
  }

  return (
    <details open={open} onToggle={onToggle} className="group border-border border-t pt-3">
      <summary className="text-muted-foreground hover:text-foreground flex cursor-pointer list-none select-none items-center gap-1 text-sm font-medium">
        <ChevronRight
          className="size-4 transition-transform group-open:rotate-90"
          aria-hidden="true"
        />
        {t('search.advancedFilters')}
      </summary>
      <div className="flex flex-col gap-3 pt-3">{children}</div>
    </details>
  )
}
