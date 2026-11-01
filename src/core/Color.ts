export interface HslColor {
  readonly h: number
  readonly s: number
  readonly l: number
}

export interface RgbColor {
  readonly r: number
  readonly g: number
  readonly b: number
}

export interface ColorAdjustments {
  hue?: number
  saturation?: number
  lightness?: number
  name?: string
}

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value))

/**
 * An immutable colour value object.
 *
 * HSL is the source of truth. RGB and HEX are derived once in the constructor
 * and kept inside ECMAScript private fields so callers can only read them
 * through getters.
 */
export class Color {
  readonly #hsl: HslColor
  readonly #rgb: RgbColor
  readonly #hex: string
  readonly #name: string

  constructor(hue: number, saturation: number, lightness: number, name = 'Untitled') {
    const h = Color.normalizeHue(hue)
    const s = clamp(saturation)
    const l = clamp(lightness)

    this.#hsl = Object.freeze({ h, s, l })
    this.#rgb = Object.freeze(Color.hslToRgb(h, s, l))
    this.#hex = Color.rgbToHex(this.#rgb)
    this.#name = name
  }

  get name(): string {
    return this.#name
  }

  get hex(): string {
    return this.#hex
  }

  get hsl(): HslColor {
    return this.#hsl
  }

  get rgb(): RgbColor {
    return this.#rgb
  }

  get hue(): number {
    return this.#hsl.h
  }

  get saturation(): number {
    return this.#hsl.s
  }

  get lightness(): number {
    return this.#hsl.l
  }

  /** WCAG relative luminance, used to pick legible text on a swatch. */
  get relativeLuminance(): number {
    const { r, g, b } = this.#rgb
    const channels = [r, g, b].map((channel) => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })

    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }

  /** Returns the higher-contrast ink or canvas tone for this colour. */
  get readableTextColor(): '#F7F5F0' | '#1C1B18' {
    const luminance = this.relativeLuminance
    const lightContrast = (0.91 + 0.05) / (luminance + 0.05)
    const darkContrast = (luminance + 0.05) / (0.011 + 0.05)

    return darkContrast >= lightContrast ? '#1C1B18' : '#F7F5F0'
  }

  /** Returns a new Color without mutating this value object. */
  withAdjustments({
    hue = 0,
    saturation = 0,
    lightness = 0,
    name = this.#name,
  }: ColorAdjustments = {}): Color {
    return new Color(
      this.#hsl.h + hue,
      this.#hsl.s + saturation,
      this.#hsl.l + lightness,
      name,
    )
  }

  toJSON(): { name: string; hex: string; hsl: HslColor; rgb: RgbColor } {
    return {
      name: this.#name,
      hex: this.#hex,
      hsl: this.#hsl,
      rgb: this.#rgb,
    }
  }

  toString(): string {
    return this.#hex
  }

  private static normalizeHue(hue: number): number {
    return ((hue % 360) + 360) % 360
  }

  private static hslToRgb(h: number, s: number, l: number): RgbColor {
    const saturation = s / 100
    const lightness = l / 100

    if (saturation === 0) {
      const channel = Math.round(lightness * 255)
      return { r: channel, g: channel, b: channel }
    }

    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
    const hueSector = h / 60
    const secondary = chroma * (1 - Math.abs((hueSector % 2) - 1))
    const match = lightness - chroma / 2

    let red = 0
    let green = 0
    let blue = 0

    if (hueSector < 1) {
      red = chroma
      green = secondary
    } else if (hueSector < 2) {
      red = secondary
      green = chroma
    } else if (hueSector < 3) {
      green = chroma
      blue = secondary
    } else if (hueSector < 4) {
      green = secondary
      blue = chroma
    } else if (hueSector < 5) {
      red = secondary
      blue = chroma
    } else {
      red = chroma
      blue = secondary
    }

    return {
      r: Math.round((red + match) * 255),
      g: Math.round((green + match) * 255),
      b: Math.round((blue + match) * 255),
    }
  }

  private static rgbToHex({ r, g, b }: RgbColor): string {
    return `#${[r, g, b]
      .map((channel) => channel.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`
  }
}
