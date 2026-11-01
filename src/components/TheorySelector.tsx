import { Check } from 'lucide-react'
import type { BaseColorTheory } from '../theories/BaseColorTheory'
import type { TheoryId } from '../core/theoryTypes'

interface TheorySelectorProps {
  theories: readonly BaseColorTheory[]
  activeTheories: ReadonlySet<TheoryId>
  selectedCount: number
  onToggle: (id: TheoryId) => void
}

export function TheorySelector({
  theories,
  activeTheories,
  selectedCount,
  onToggle,
}: TheorySelectorProps) {
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="section-index">
            <span className="text-ink">02</span>
            <span className="mx-2 text-line">/</span>
            Build harmonies
          </p>
          <h2
            id="theory-heading"
            className="mt-5 font-serif text-[40px] leading-[0.92] tracking-[-0.035em] sm:text-[48px]"
          >
            Select your
            <br />
            <span className="italic text-muted">theories.</span>
          </h2>
        </div>

        <div className="shrink-0 pt-7 text-right" aria-live="polite">
          <p className="font-serif text-[32px] leading-none tracking-[-0.04em]">
            {selectedCount}
            <span className="text-muted/70">/{theories.length}</span>
          </p>
          <p className="mt-1.5 text-[8px] uppercase tracking-[0.2em] text-muted">
            selected
          </p>
        </div>
      </div>

      <p className="mt-6 max-w-[32rem] text-[12px] leading-[1.8] text-muted sm:text-[13px]">
        Choose one or several approaches. There is no confirmation step — your
        palettes compose as you go.
      </p>

      <fieldset className="mt-7 border-t border-line">
        <legend className="sr-only">Colour theory</legend>

        {theories.map((theory, index) => {
          const isActive = activeTheories.has(theory.id)
          const number = String(index + 1).padStart(2, '0')

          return (
            <label
              key={theory.id}
              className="group flex cursor-pointer items-start gap-3.5 border-b border-line py-[17px] sm:gap-4"
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggle(theory.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={[
                  'mt-[5px] flex h-[17px] w-[17px] shrink-0 items-center justify-center border transition-all duration-200',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-ink peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-canvas',
                  isActive
                    ? 'border-ink bg-ink text-canvas'
                    : 'border-muted/45 bg-transparent text-transparent group-hover:border-ink',
                ].join(' ')}
              >
                <Check size={11} strokeWidth={2.4} aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-4">
                  <span
                    className={[
                      'font-serif text-[23px] leading-none tracking-[-0.015em] transition-colors duration-200',
                      isActive ? 'text-ink' : 'text-ink/75 group-hover:text-ink',
                    ].join(' ')}
                  >
                    {theory.name}
                  </span>
                  <span className="text-[8px] font-medium tracking-[0.16em] text-muted/80">
                    {number}
                  </span>
                </span>
                <span
                  className={[
                    'mt-1.5 block max-w-[26rem] text-[10.5px] leading-[1.65] transition-colors duration-200 sm:text-[11px]',
                    isActive ? 'text-muted' : 'text-muted/70',
                  ].join(' ')}
                >
                  {theory.description}
                </span>
              </span>
            </label>
          )
        })}
      </fieldset>

      <p className="mt-5 flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-muted/75">
        <span className="inline-block h-1 w-1 rounded-full bg-clay" aria-hidden="true" />
        All six may be active at once
      </p>
    </div>
  )
}
