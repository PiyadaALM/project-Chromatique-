import { useCallback, useEffect, useRef, useState } from 'react'

export type ToastTone = 'success' | 'error'

export interface ToastMessage {
  readonly id: number
  readonly text: string
  readonly tone: ToastTone
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timeout = useRef<number | null>(null)

  const showToast = useCallback((text: string, tone: ToastTone = 'success') => {
    if (timeout.current !== null) {
      window.clearTimeout(timeout.current)
    }

    setToast({ id: Date.now(), text, tone })
    timeout.current = window.setTimeout(() => setToast(null), 2400)
  }, [])

  useEffect(
    () => () => {
      if (timeout.current !== null) {
        window.clearTimeout(timeout.current)
      }
    },
    [],
  )

  return { toast, showToast }
}
