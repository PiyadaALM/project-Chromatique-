import { Color } from './Color'

export interface WheelSegment {
  readonly name: string
  readonly color: Color
  readonly angle: number
}

/**
 * Composition-based domain object for the 12-hue wheel. It owns and validates
 * the segment set, while the React component only handles presentation.
 */
export class ColorWheel {
  readonly #segments: readonly WheelSegment[]

  constructor(segments: readonly WheelSegment[]) {
    if (segments.length !== 12) {
      throw new Error('A colour wheel must contain exactly 12 segments.')
    }

    this.#segments = Object.freeze(
      segments.map((segment) =>
        Object.freeze({
          ...segment,
          angle: ((segment.angle % 360) + 360) % 360,
        }),
      ),
    )
  }

  get segments(): readonly WheelSegment[] {
    return this.#segments
  }

  get length(): number {
    return this.#segments.length
  }

  colorAt(index: number): Color {
    return this.#segments[index].color
  }
}

export const chromatiqueWheel = new ColorWheel([
  { name: 'Rouge', color: new Color(352, 54, 52, 'Rouge'), angle: 0 },
  { name: 'Ember', color: new Color(22, 61, 53, 'Ember'), angle: 30 },
  { name: 'Ochre', color: new Color(42, 62, 49, 'Ochre'), angle: 60 },
  { name: 'Citron', color: new Color(64, 42, 43, 'Citron'), angle: 90 },
  { name: 'Fern', color: new Color(102, 34, 39, 'Fern'), angle: 120 },
  { name: 'Jade', color: new Color(151, 33, 37, 'Jade'), angle: 150 },
  { name: 'Lagoon', color: new Color(183, 42, 37, 'Lagoon'), angle: 180 },
  { name: 'Azure', color: new Color(209, 48, 45, 'Azure'), angle: 210 },
  { name: 'Indigo', color: new Color(235, 37, 48, 'Indigo'), angle: 240 },
  { name: 'Violet', color: new Color(265, 35, 54, 'Violet'), angle: 270 },
  { name: 'Orchid', color: new Color(302, 31, 55, 'Orchid'), angle: 300 },
  { name: 'Rose', color: new Color(330, 46, 56, 'Rose'), angle: 330 },
])
