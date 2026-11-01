export const THEORY_IDS = [
  'monochromatic',
  'complementary',
  'split-complementary',
  'analogous',
  'triadic',
  'neutral',
] as const

export type TheoryId = (typeof THEORY_IDS)[number]
