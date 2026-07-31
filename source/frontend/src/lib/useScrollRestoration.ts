import { useEffect } from 'react'

export function useScrollRestoration(key: string): void {
  useEffect(() => {
    const storageKey = `scroll:${key}`
    const saved = Number(sessionStorage.getItem(storageKey) ?? '0')

    let frame = 0
    let attempts = 0
    let persisting = false
    let ticking = false

    const persist = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)))
        ticking = false
      })
    }

    const startPersisting = () => {
      if (persisting) return
      persisting = true
      window.removeEventListener('wheel', stopRestore)
      window.removeEventListener('touchmove', stopRestore)
      window.removeEventListener('keydown', stopRestore)
      window.addEventListener('scroll', persist, { passive: true })
      window.addEventListener('pagehide', persist)
    }

    const stopRestore = () => {
      cancelAnimationFrame(frame)
      startPersisting()
    }

    if (saved > 0) {
      window.addEventListener('wheel', stopRestore, { passive: true })
      window.addEventListener('touchmove', stopRestore, { passive: true })
      window.addEventListener('keydown', stopRestore)
      const tryRestore = () => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight
        if (maxScroll >= saved || attempts++ > 180) {
          window.scrollTo(0, saved)
          startPersisting()
        } else {
          frame = requestAnimationFrame(tryRestore)
        }
      }
      frame = requestAnimationFrame(tryRestore)
    } else {
      startPersisting()
    }

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('wheel', stopRestore)
      window.removeEventListener('touchmove', stopRestore)
      window.removeEventListener('keydown', stopRestore)
      window.removeEventListener('scroll', persist)
      window.removeEventListener('pagehide', persist)
      if (persisting) sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)))
    }
  }, [key])
}
