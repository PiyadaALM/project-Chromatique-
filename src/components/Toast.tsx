import { CircleAlert, Check } from 'lucide-react'
import type { ToastMessage } from '../hooks/useToast'

interface ToastProps {
  toast: ToastMessage | null
}

export function Toast({ toast }: ToastProps) {
  if (!toast) {
    return null
  }

  return (
    <div
      key={toast.id}
      className="pointer-events-none fixed bottom-6 left-1/2 z-[80] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 animate-soft-in"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-canvas shadow-[0_12px_40px_rgba(28,27,24,0.14)]">
        <span
          className="flex h-4 w-4 items-center justify-center rounded-full bg-canvas/15"
          aria-hidden="true"
        >
          {toast.tone === 'error' ? (
            <CircleAlert size={11} strokeWidth={1.8} />
          ) : (
            <Check size={11} strokeWidth={2} />
          )}
        </span>
        <p className="text-[10px] font-medium uppercase tracking-[0.13em]">
          {toast.text}
        </p>
      </div>
    </div>
  )
}
