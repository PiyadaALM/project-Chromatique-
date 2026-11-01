import type { Color } from '../core/Color'
import { Palette } from '../core/Palette'
import type { TheoryId } from '../core/theoryTypes'

/**
 * Abstract base for every harmony algorithm.
 *
 * Subclasses inherit palette construction + validation, and must implement
 * their own polymorphic generatePalette algorithm.
 */
export abstract class BaseColorTheory {
  readonly id: TheoryId
  readonly name: string
  readonly description: string

  protected constructor(id: TheoryId, name: string, description: string) {
    this.id = id
    this.name = name
    this.description = description
  }

  abstract generatePalette(baseColor: Color): Palette

  protected composePalette(baseColor: Color, colors: readonly Color[]): Palette {
    const uniqueColors = colors.filter(
      (color, index, collection) =>
        collection.findIndex((candidate) => candidate.hex === color.hex) === index,
    )

    if (uniqueColors.length < 4) {
      throw new Error(`${this.name} produced fewer than four distinct colours.`)
    }

    return new Palette({
      theoryId: this.id,
      theoryName: this.name,
      theoryDescription: this.description,
      baseColor,
      colors: uniqueColors.slice(0, 6),
    })
  }
}
