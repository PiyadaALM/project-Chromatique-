import type { TheoryId } from '../core/theoryTypes'
import { THEORY_IDS } from '../core/theoryTypes'
import { AnalogousTheory } from './AnalogousTheory'
import type { BaseColorTheory } from './BaseColorTheory'
import { ComplementaryTheory } from './ComplementaryTheory'
import { MonochromaticTheory } from './MonochromaticTheory'
import { NeutralTheory } from './NeutralTheory'
import { SplitComplementaryTheory } from './SplitComplementaryTheory'
import { TriadicTheory } from './TriadicTheory'

export const theoryRegistry = {
  monochromatic: new MonochromaticTheory(),
  complementary: new ComplementaryTheory(),
  'split-complementary': new SplitComplementaryTheory(),
  analogous: new AnalogousTheory(),
  triadic: new TriadicTheory(),
  neutral: new NeutralTheory(),
} satisfies Record<TheoryId, BaseColorTheory>

/** Canonical order used by both the selector and the results. */
export const colorTheories: readonly BaseColorTheory[] = Object.freeze(
  THEORY_IDS.map((id) => theoryRegistry[id]),
)

export function theoryFor(id: TheoryId): BaseColorTheory {
  return theoryRegistry[id]
}
