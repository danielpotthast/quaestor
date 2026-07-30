export function safeStorage(key: string, kind: 'local' | 'session' = 'local') {
  const get = (): Storage | undefined => {
    if (typeof window === 'undefined') return undefined
    return kind === 'session' ? window.sessionStorage : window.localStorage
  }
  return {
    read(): string | null {
      try {
        return get()?.getItem(key) ?? null
      } catch {
        return null
      }
    },
    write(value: string | null): void {
      try {
        const storage = get()
        if (!storage) return
        if (value == null) storage.removeItem(key)
        else storage.setItem(key, value)
      } catch {
        // storage unavailable (private mode, quota) — ignore
      }
    },
  }
}
