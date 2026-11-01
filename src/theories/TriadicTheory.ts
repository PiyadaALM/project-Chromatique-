import { Color } from '../core/Color'
import type { Palette } from '../core/Palette'
import { BaseColorTheory } from './BaseColorTheory'

export class TriadicTheory extends BaseColorTheory {
  constructor() {
    super(
      'triadic',
      'Triadic',
      'Three evenly spaced hues, each given a lighter voice for balance.',
    )
  }

  generatePalette(baseColor: Color): Palette {
    const { hue, saturation, lightness } = baseColor
    const offsets = [0, 120, 240]

    const colors = offsets.flatMap((offset, index) => {
      const color = new Color(
        hue + offset,
        saturation - index * 3,
        lightness + index * 2,
        ['Primary', 'Second', 'Third'][index],
      )

      return [
        color,
        color.withAdjustments({
          hue: 2,
          saturation: -10,
          lightness: 18,
          name: `${color.name} light`,
        }),
      ]
    })

    return this.composePalette(baseColor, colors)
  }
}
