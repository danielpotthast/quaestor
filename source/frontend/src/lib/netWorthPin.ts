import { safeStorage } from './storage'

export const STORAGE_KEY = 'netWorth.pinnedDate'

const store = safeStorage(STORAGE_KEY, 'session')

export function readPinnedDate(): string | null {
  return store.read()
}

export function writePinnedDate(date: string | null): void {
  store.write(date)
}
