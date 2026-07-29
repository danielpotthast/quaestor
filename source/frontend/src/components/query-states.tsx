import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function QueryStates({
  query,
  loadingText,
  errorText,
  isEmpty = false,
  emptyText,
  emptyClassName,
  children,
}: {
  query: { isLoading: boolean; isError: boolean }
  loadingText: ReactNode
  errorText: ReactNode
  isEmpty?: boolean
  emptyText?: ReactNode
  emptyClassName?: string
  children: ReactNode
}) {
  if (query.isLoading) return <p className="text-muted-foreground text-sm">{loadingText}</p>
  if (query.isError) return <p className="text-destructive text-sm">{errorText}</p>
  if (isEmpty)
    return <p className={cn('text-muted-foreground text-sm', emptyClassName)}>{emptyText}</p>
  return <>{children}</>
}
