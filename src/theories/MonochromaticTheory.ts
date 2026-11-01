import type { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import { BaseColorTheory } from './BaseColorTheory'

export class MonochromaticTheory extends BaseColorTheory {
  constructor() {
    super(
      'monochromatic',
      'Monochromatic',
      'A single hue, explored through tint, tone, and shadow.',
    )
  }

  generatePalette(baseColor: Color): Palette {
    const colors = [
      baseColor.withAdjustments({ saturation: -15, lightness: 29, name: 'Chalk' }),
      baseColor.withAdjustments({ saturation: -8, lightness: 15, name: 'Veil' }),
      baseColor.withAdjustments({ name: 'Core' }),
      baseColor.withAdjustments({ saturation: 3, lightness: -16, name: 'Umber' }),
      baseColor.withAdjustments({ saturation: 2, lightness: -29, name: 'Ink' }),
    ]

    return this.composePalette(baseColor, colors)
  }
}
