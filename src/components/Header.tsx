import { ArrowDown } from 'lucide-react'

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-7 sm:px-8 lg:px-12 lg:py-8">
      <div className="flex items-baseline gap-2.5 sm:gap-3.5">
        <a
          href="#top"
          className="font-serif text-[34px] font-medium leading-none tracking-[-0.045em] text-ink transition-opacity hover:opacity-65 sm:text-[40px] lg:text-[43px]"
          aria-label="Chromatique — back to top"
        >
          Chromatique
        </a>
        <span className="text-[8px] font-medium uppercase tracking-[0.32em] text-gray-500 sm:text-[9px] lg:text-[10px]">
          AZAZIIN
        </span>
      </div>

      <div className="hidden items-center gap-4 sm:flex lg:gap-5">
        <span className="text-[9px] uppercase tracking-[0.2em] text-muted">
          An interactive colour study
        </span>
        <span className="h-px w-8 bg-line lg:w-12" aria-hidden="true" />
        <a
          href="#palettes"
          className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-ink"
        >
          View palettes
          <ArrowDown
            size={11}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </header>
  )
}
