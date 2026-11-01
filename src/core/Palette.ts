import type { Color } from './Color'
import type { TheoryId } from './theoryTypes'

export interface PaletteInit {
  readonly theoryId: TheoryId
  readonly theoryName: string
  readonly theoryDescription: string
  readonly baseColor: Color
  readonly colors: readonly Color[]
}

/**
 * A composition of Colour instances plus the theory metadata needed to present
 * and export the palette. Palettes are immutable snapshots.
 */
export class Palette {
  readonly #theoryId: TheoryId
  readonly #theoryName: string
  readonly #theoryDescription: string
  readonly #baseColor: Color
  readonly #colors: readonly Color[]
  readonly #hexCodes: readonly string[]

  constructor({
    theoryId,
    theoryName,
    theoryDescription,
    baseColor,
    colors,
  }: PaletteInit) {
    if (colors.length < 4) {
      throw new Error('A palette must contain at least four colours.')
    }

    this.#theoryId = theoryId
    this.#theoryName = theoryName
    this.#theoryDescription = theoryDescription
    this.#baseColor = baseColor
    this.#colors = Object.freeze([...colors])
    this.#hexCodes = Object.freeze(colors.map((color) => color.hex))
  }

  get theoryId(): TheoryId {
    return this.#theoryId
  }

  get theoryName(): string {
    return this.#theoryName
  }

  get theoryDescription(): string {
    return this.#theoryDescription
  }

  get baseColor(): Color {
    return this.#baseColor
  }

  get colors(): readonly Color[] {
    return this.#colors
  }

  get hexCodes(): readonly string[] {
    return this.#hexCodes
  }

  /** The serialisable hex list used by copy and export actions. */
  get exportedHexCodes(): string[] {
    return [...this.#hexCodes]
  }

  get size(): number {
    return this.#colors.length
  }

  toJSON(): {
    theoryId: TheoryId
    theoryName: string
    baseColor: string
    hexCodes: string[]
  } {
    return {
      theoryId: this.#theoryId,
      theoryName: this.#theoryName,
      baseColor: this.#baseColor.hex,
      hexCodes: this.exportedHexCodes,
    }
  }
}
