import { toPng } from 'html-to-image'
import type { Palette } from '../core/Palette'

const filenameFor = (palette: Palette): string => {
  const theory = palette.theoryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `chromatique-${theory}-${palette.baseColor.hex.replace('#', '').toLowerCase()}.png`
}

/**
 * Renders the live palette block to a 2× PNG. Elements marked with
 * data-export-ignore are excluded so actions do not appear in the artwork.
 */
export async function exportPaletteAsPng(
  element: HTMLElement,
  palette: Palette,
): Promise<void> {
  await document.fonts.ready

  const dataUrl = await toPng(element, {
    backgroundColor: '#F7F5F0',
    cacheBust: true,
    pixelRatio: 2,
    filter: (node) => {
      const candidate = node as HTMLElement
      return candidate?.dataset?.exportIgnore !== 'true'
    },
  })

  const link = document.createElement('a')
  link.download = filenameFor(palette)
  link.href = dataUrl
  link.click()
}
