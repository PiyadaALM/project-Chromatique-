import { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import { BaseColorTheory } from './BaseColorTheory'

export class SplitComplementaryTheory extends BaseColorTheory {
  constructor() {
    super(
      'split-complementary',
      'Split Complementary',
      'A hue paired with the two neighbours of its opposite, softened by a tint.',
    )
  }

  generatePalette(baseColor: Color): Palette {
    const { hue, saturation, lightness } = baseColor

    const colors = [
      baseColor,
      new Color(hue + 150, saturation - 5, lightness + 9, 'Left split'),
      new Color(hue + 210, saturation - 2, lightness - 4, 'Right split'),
      baseColor.withAdjustments({ saturation: -10, lightness: 24, name: 'Halo' }),
      new Color(hue + 150, saturation, lightness - 18, 'Left shade'),
    ]

    return this.composePalette(baseColor, colors)
  }
}
