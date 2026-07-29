'use client'

import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

function FilterHeading({ onReset }: { onReset?: () => void }) {
  const { t } = useTranslation()
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="text-primary flex items-center gap-2 text-sm font-semibold">
        <Search className="size-3.5" aria-hidden="true" />
        {t('common.searchAndFilters')}
      </h2>
      {onReset ? (
        <button
          type="button"
          className="text-primary hover:text-primary/80 cursor-pointer text-xs transition-colors"
          onClick={onReset}
        >
          {t('common.resetFilters')}
        </button>
      ) : null}
    </div>
  )
}

export { FilterHeading }
