import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string | number> {
  value: T
  label: string
}

export interface SegmentedToggleProps<T extends string | number> {
  value: T | null
  options: SegmentedOption<T>[]
  onChange: (next: T) => void
  ariaLabel: string
  fullWidth?: boolean
}

export function SegmentedToggle<T extends string | number>({
  value,
  options,
  onChange,
  ariaLabel,
  fullWidth = false,
}: SegmentedToggleProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        'border-input flex h-8 shrink-0 gap-0.5 rounded-lg border bg-transparent p-0.5 dark:bg-input/30',
        fullWidth && 'w-full',
      )}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'cursor-pointer rounded-md text-sm font-medium whitespace-nowrap transition-colors',
              fullWidth ? 'flex-1' : 'px-2.5',
              selected
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
