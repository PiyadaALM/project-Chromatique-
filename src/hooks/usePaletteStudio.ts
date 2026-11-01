import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { chromatiqueWheel } from '../core/ColorWheel'
import type { Palette } from '../core/Palette'
import type { TheoryId } from '../core/theoryTypes'
import { colorTheories } from '../theories'

const DEFAULT_THEORIES: TheoryId[] = ['monochromatic', 'complementary', 'analogous']
const DEFAULT_HUE_INDEX = 1
const DEBOUNCE_DELAY = 3000

function composePalettes(
  baseIndex: number,
  activeTheoryIds: readonly TheoryId[],
): Palette[] {
  const baseColor = chromatiqueWheel.colorAt(baseIndex)
  const activeIds = new Set(activeTheoryIds)

  // The base contract is enough here: each subclass resolves its own algorithm.
  return colorTheories
    .filter((theory) => activeIds.has(theory.id))
    .map((theory) => theory.generatePalette(baseColor))
}

/**
 * UI-facing state machine for choosing a hue and composing theories.
 * All colour maths stays inside the domain classes.
 */
export function usePaletteStudio() {
  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_HUE_INDEX)
  const [activeTheoryIds, setActiveTheoryIds] =
    useState<TheoryId[]>(DEFAULT_THEORIES)
  const [displayedPalettes, setDisplayedPalettes] = useState<Palette[]>(() =>
    composePalettes(DEFAULT_HUE_INDEX, DEFAULT_THEORIES),
  )
  const [isProcessing, setIsProcessing] = useState(false)
  const resultsRef = useRef<HTMLElement>(null)
  const hasAutoScrolled = useRef(false)

  const selectedSegment = chromatiqueWheel.segments[selectedIndex]
  const baseColor = selectedSegment.color
  const activeKey = activeTheoryIds.join('|')
  const previousInputKey = useRef(`${DEFAULT_HUE_INDEX}|${DEFAULT_THEORIES.join('|')}`)

  const selectedTheoryCount = activeTheoryIds.length

  const selectHue = useCallback((index: number) => {
    if (index < 0 || index >= chromatiqueWheel.length) {
      return
    }

    setSelectedIndex(index)
  }, [])

  const toggleTheory = useCallback((id: TheoryId) => {
    setActiveTheoryIds((current) =>
      current.includes(id)
        ? current.filter((theoryId) => theoryId !== id)
        : [...current, id],
    )
  }, [])

  useEffect(() => {
    const inputKey = `${selectedIndex}|${activeKey}`

    // Ignore the initial render (including React StrictMode's double effect).
    if (inputKey === previousInputKey.current) {
      return
    }

    previousInputKey.current = inputKey
    setIsProcessing(true)

    let scrollFrame: number | null = null

    const debounceTimer = window.setTimeout(() => {
      setDisplayedPalettes(composePalettes(selectedIndex, activeTheoryIds))
      setIsProcessing(false)

      // The scroll belongs to the first interaction only. Later changes update
      // in place, even if the user has navigated back to the studio.
      if (hasAutoScrolled.current || !resultsRef.current) {
        return
      }

      scrollFrame = window.requestAnimationFrame(() => {
        const results = resultsRef.current

        if (!results) {
          return
        }

        hasAutoScrolled.current = true
        const reduceMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches
        const top = results.getBoundingClientRect().top + window.scrollY

        window.scrollTo({
          top,
          behavior: reduceMotion ? 'auto' : 'smooth',
        })
      })
    }, DEBOUNCE_DELAY)

    return () => {
      window.clearTimeout(debounceTimer)

      if (scrollFrame !== null) {
        window.cancelAnimationFrame(scrollFrame)
      }
    }
    // activeKey is the stable serialisation of activeTheoryIds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex, activeKey])

  const activeTheories = useMemo(
    () => new Set(activeTheoryIds),
    [activeTheoryIds],
  )

  return {
    wheel: chromatiqueWheel,
    selectedIndex,
    selectedSegment,
    baseColor,
    activeTheoryIds,
    activeTheories,
    selectedTheoryCount,
    displayedPalettes,
    isProcessing,
    resultsRef,
    selectHue,
    toggleTheory,
  }
}
