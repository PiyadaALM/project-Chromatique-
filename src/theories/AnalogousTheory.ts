import { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import { BaseColorTheory } from './BaseColorTheory'

export class AnalogousTheory extends BaseColorTheory {
  constructor() {
    super(
      'analogous',
      'Analogous',
      'Neighbouring hues that flow into one another with quiet continuity.',
    )
  }

  generatePalette(baseColor: Color): Palette {
    const { hue, saturation, lightness } = baseColor

    const colors = [
      new Color(hue - 60, saturation - 10, lightness + 12, 'Dawn'),
      new Color(hue - 30, saturation - 3, lightness + 7, 'Glow'),
      baseColor,
      new Color(hue + 30, saturation + 1, lightness - 9, 'Dusk'),
      new Color(hue + 60, saturation - 6, lightness - 16, 'Night'),
    ]

    return this.composePalette(baseColor, colors)
  }
}
