import { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import { BaseColorTheory } from './BaseColorTheory'

export class NeutralTheory extends BaseColorTheory {
  constructor() {
    super(
      'neutral',
      'Neutral',
      'The base hue softened into a quiet set of warm and cool neutral tones.',
    )
  }

  generatePalette(baseColor: Color): Palette {
    const { hue, saturation, lightness } = baseColor

    const colors = [
      baseColor,
      new Color(hue + 9, Math.max(16, saturation - 35), lightness + 28, 'Linen'),
      new Color(hue + 19, Math.max(11, saturation - 44), lightness + 12, 'Stone'),
      new Color(hue + 6, Math.max(9, saturation - 48), lightness - 15, 'Taupe'),
      new Color(hue, 8, 18, 'Charcoal'),
    ]

    return this.composePalette(baseColor, colors)
  }
}
