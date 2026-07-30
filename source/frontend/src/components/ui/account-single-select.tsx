'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { accountDisplayName } from '@/lib/accounts'
import { useAccountGroupLayout } from '@/lib/accountGroups'
import type { CredentialRead } from '@/lib/auth'
import { AccountOptionContent, AccountSelectPopover } from '@/components/ui/account-select'
import { accountOptionRowClass, groupAccounts } from '@/components/ui/account-select-utils'

export interface AccountSingleSelectProps {
  id?: string
  credentials: CredentialRead[]
  value: number | null
  onChange: (next: number) => void
  placeholder?: string
  className?: string
}

function AccountSingleSelect({
  id,
  credentials,
  value,
  onChange,
  placeholder,
  className,
}: AccountSingleSelectProps) {
  const [open, setOpen] = useState(false)
  const layout = useAccountGroupLayout()
  const groups = groupAccounts(credentials, layout.data)
  const selectedAccount =
    groups.flatMap((group) => group.accounts).find((account) => account.id === value) ?? null

  return (
    <AccountSelectPopover
      id={id}
      className={className}
      open={open}
      onOpenChange={setOpen}
      triggerLabel={selectedAccount ? accountDisplayName(selectedAccount) : (placeholder ?? '')}
      isEmpty={!selectedAccount}
      emptyVariant="default"
      groups={groups}
      renderAccount={(account) => (
        <button
          key={account.id}
          type="button"
          data-select-row=""
          onClick={() => {
            onChange(account.id)
            setOpen(false)
          }}
          className={cn(accountOptionRowClass, 'text-left')}
        >
          <AccountOptionContent account={account} />
          {account.id === value ? (
            <Check className="text-primary size-4 shrink-0" aria-hidden="true" />
          ) : null}
        </button>
      )}
    />
  )
}

export { AccountSingleSelect }
