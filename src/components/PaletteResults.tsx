import type { RefObject } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import type { ToastTone } from '../hooks/useToast'
import { PaletteCard } from './PaletteCard'

interface PaletteResultsProps {
  palettes: readonly Palette[]
  baseColor: Color
  isProcessing: boolean
  resultsRef: RefObject<HTMLElement>
  onNotify: (message: string, tone?: ToastTone) => void
}

export function PaletteResults({
  palettes,
  baseColor,
  isProcessing,
  resultsRef,
  onNotify,
}: PaletteResultsProps) {
  const hasPalettes = palettes.length > 0
  // Keep the result header in sync with the palettes that are actually shown;
  // the new base colour only appears once the debounced composition lands.
  const displayedBaseColor = palettes[0]?.baseColor ?? baseColor

  return (
    <section
      id="palettes"
      ref={resultsRef}
      className="mt-24 scroll-mt-4 border-y border-line bg-[#F2EFE7]/65 sm:mt-32"
      aria-busy={isProcessing}
    >
      <div className="mx-auto w-full max-w-[1480px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="section-index">
              <span className="text-ink">03</span>
              <span className="mx-2 text-line">/</span>
              Result
            </p>
            <h2 className="mt-5 font-serif text-[52px] leading-[0.85] tracking-[-0.045em] sm:text-[64px]">
              The result<span className="italic text-muted">.</span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-5 md:justify-end md:pb-1">
            <div>
              <p className="text-[8px] uppercase tracking-[0.2em] text-muted">
                Base colour
              </p>
              <div className="mt-2 flex items-center gap-2.5">
                <span
                  className="h-4 w-4 rounded-full ring-1 ring-ink/10"
                  style={{ backgroundColor: displayedBaseColor.hex }}
                  aria-hidden="true"
                />
                <span className="font-serif text-[24px] leading-none tracking-[-0.02em]">
                  {displayedBaseColor.name}
                </span>
                <span className="text-[8px] uppercase tracking-[0.12em] text-muted">
                  {displayedBaseColor.hex}
                </span>
              </div>
            </div>

            <span className="hidden h-9 w-px bg-line sm:block" aria-hidden="true" />

            <div
              className="flex min-w-[104px] items-center gap-2.5 text-[8px] font-medium uppercase tracking-[0.18em] text-muted"
              role="status"
              aria-live="polite"
            >
              {isProcessing ? (
                <>
                  <span
                    className="h-3 w-3 animate-spin rounded-full border border-muted/25 border-t-ink"
                    aria-hidden="true"
                  />
                  <span>Composing</span>
                </>
              ) : hasPalettes ? (
                <>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: displayedBaseColor.hex }}
                    aria-hidden="true"
                  />
                  <span>Ready</span>
                </>
              ) : (
                <>
                  <span
                    className="h-1.5 w-1.5 rounded-full bg-muted/50"
                    aria-hidden="true"
                  />
                  <span>Awaiting theory</span>
                </>
              )}
            </div>
          </div>
        </div>

        {hasPalettes ? (
          <div className="mt-11 border-b border-line">
            {palettes.map((palette, index) => (
              <PaletteCard
                key={`${palette.theoryId}-${palette.baseColor.hex}`}
                palette={palette}
                index={index}
                onNotify={onNotify}
              />
            ))}
          </div>
        ) : (
          <div className="mt-11 border-t border-line py-20 text-center sm:py-24">
            <p className="font-serif text-[36px] leading-none tracking-[-0.035em]">
              No theories selected<span className="italic text-muted">.</span>
            </p>
            <p className="mx-auto mt-4 max-w-sm text-[11px] leading-[1.8] text-muted">
              Choose at least one harmony in the studio above and a palette will
              compose itself here.
            </p>
            <a
              href="#studio"
              className="group mt-7 inline-flex items-center gap-2 border-b border-line pb-1 text-[8px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:border-ink hover:text-ink"
            >
              Return to the studio
              <ArrowUpRight
                size={11}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        )}

        {hasPalettes && (
          <p className="mt-6 text-right text-[8px] uppercase tracking-[0.16em] text-muted/75">
            Click any hex to copy · Download exports the palette block
          </p>
        )}
      </div>
    </section>
  )
}
