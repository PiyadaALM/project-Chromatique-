import { useEffect } from 'react'
import { ArrowUp } from 'lucide-react'
import { ColorWheelPicker } from './components/ColorWheelPicker'
import { Header } from './components/Header'
import { PaletteResults } from './components/PaletteResults'
import { TheorySelector } from './components/TheorySelector'
import { Toast } from './components/Toast'
import { usePaletteStudio } from './hooks/usePaletteStudio'
import { useToast } from './hooks/useToast'
import { colorTheories } from './theories'

function App() {
  const {
    wheel,
    selectedIndex,
    baseColor,
    activeTheories,
    selectedTheoryCount,
    displayedPalettes,
    isProcessing,
    resultsRef,
    selectHue,
    toggleTheory,
  } = usePaletteStudio()
  const { toast, showToast } = useToast()

  useEffect(() => {
    const targetId = window.location.hash.slice(1)

    if (!targetId) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ block: 'start' })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [])

  return (
    <div id="top" className="relative min-h-screen overflow-clip">
      <a
        href="#studio"
        className="sr-only z-[90] bg-ink px-4 py-3 text-[10px] uppercase tracking-editorial text-canvas focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to the studio
      </a>

      <Header />

      <main>
        <section
          aria-labelledby="hero-title"
          className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12"
        >
          <div className="border-t border-line pt-8 lg:pt-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.38fr)_minmax(260px,0.52fr)] lg:items-end lg:gap-12">
              <div>
                <p className="eyebrow flex items-center gap-3">
                  <span className="h-px w-7 bg-ink/35" aria-hidden="true" />
                  A study in colour theory
                </p>
                <h1
                  id="hero-title"
                  className="mt-5 font-serif text-[clamp(3.85rem,8.7vw,8.25rem)] font-light leading-[0.82] tracking-[-0.052em]"
                >
                  The language
                  <br />
                  <span className="italic">of colour.</span>
                </h1>
              </div>

              <div className="max-w-[335px] lg:justify-self-end lg:pb-1.5">
                <p className="text-[12px] leading-[1.85] text-muted sm:text-[13px]">
                  Begin with a hue. Pair it with a theory. Watch a system of
                  colour unfold — composed in real time, never confirmed.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <span className="h-px w-9 bg-line" aria-hidden="true" />
                  <span className="text-[8px] uppercase tracking-[0.21em] text-muted">
                    12 hues · 6 harmonies
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 grid border-t border-line lg:mt-14 lg:grid-cols-[minmax(0,1.45fr)_minmax(370px,0.8fr)]">
            <section
              id="studio"
              aria-labelledby="hue-heading"
              className="scroll-mt-6 py-9 lg:py-12 lg:pr-10 xl:pr-16"
            >
              <div className="flex items-center justify-between gap-6">
                <h2 id="hue-heading" className="section-index">
                  <span className="text-ink">01</span>
                  <span className="mx-2 text-line">/</span>
                  Choose a hue
                </h2>
                <p className="hidden text-[8px] uppercase tracking-[0.2em] text-muted/70 sm:block">
                  Select a segment
                </p>
              </div>

              <div className="mt-7 sm:mt-9">
                <ColorWheelPicker
                  segments={wheel.segments}
                  selectedIndex={selectedIndex}
                  baseColor={baseColor}
                  onSelect={selectHue}
                />
              </div>

              <div className="mx-auto mt-5 flex max-w-[560px] flex-col gap-3 border-t border-line/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-[280px] text-[9px] leading-relaxed text-muted/80">
                  Each of the twelve slices is a distinct colour family. Unselected
                  hues recede as you choose.
                </p>
                <p className="shrink-0 text-[8px] uppercase tracking-[0.18em] text-muted">
                  H {baseColor.hue.toFixed(0)}° · S {baseColor.saturation.toFixed(0)}% · L{' '}
                  {baseColor.lightness.toFixed(0)}%
                </p>
              </div>
            </section>

            <section
              id="theories"
              aria-labelledby="theory-heading"
              className="scroll-mt-6 border-t border-line py-9 lg:border-l lg:border-t-0 lg:py-12 lg:pl-10 xl:pl-14"
            >
              <TheorySelector
                theories={colorTheories}
                activeTheories={activeTheories}
                selectedCount={selectedTheoryCount}
                onToggle={toggleTheory}
              />
            </section>
          </div>
        </section>

        <PaletteResults
          palettes={displayedPalettes}
          baseColor={baseColor}
          isProcessing={isProcessing}
          resultsRef={resultsRef}
          onNotify={showToast}
        />

        <footer className="mx-auto w-full max-w-[1480px] px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col gap-5 py-10 sm:flex-row sm:items-center sm:justify-between lg:py-12">
            <p className="flex items-baseline gap-2">
              <span className="font-serif text-[24px] leading-none tracking-[-0.035em]">
                Chromatique
              </span>
              <span className="text-[7px] uppercase tracking-[0.3em] text-gray-500">
                AZAZIIN
              </span>
            </p>

            <p className="text-[8px] uppercase tracking-[0.17em] text-muted/75">
              An exercise in colour theory · {new Date().getFullYear()}
            </p>

            <a
              href="#top"
              className="group inline-flex w-fit items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
            >
              Back to top
              <ArrowUp
                size={11}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </footer>
      </main>

      <Toast toast={toast} />
    </div>
  )
}

export default App
