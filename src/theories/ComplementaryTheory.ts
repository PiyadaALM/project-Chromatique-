import { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import { BaseColorTheory } from './BaseColorTheory'

export class ComplementaryTheory extends BaseColorTheory {
  constructor() {
    super(
      'complementary',
      'Complementary',
      'Opposite hues in balance, creating contrast with natural tension.',
    )
  }

  generatePalette(baseColor: Color): Palette {
    const { hue, saturation, lightness } = baseColor
    const opposite = hue + 180

    const colors = [
      baseColor,
      baseColor.withAdjustments({ saturation: -8, lightness: 15, name: 'Warm tint' }),
      baseColor.withAdjustments({ saturation: 2, lightness: -17, name: 'Warm shade' }),
      new Color(opposite, saturation - 9, lightness + 12, 'Cool tint'),
      new Color(opposite, saturation, lightness - 8, 'Cool shade'),
    ]

    return this.composePalette(baseColor, colors)
  }
}
