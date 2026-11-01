import type { KeyboardEvent } from 'react'
import type { Color } from '../core/Color'
import type { WheelSegment } from '../core/ColorWheel'

const CENTER = 280
const OUTER_RADIUS = 214
const INNER_RADIUS = 128
const LABEL_RADIUS = 241
const SLICE_GAP = 1.5

interface Point {
  x: number
  y: number
}

function polarPoint(radius: number, angle: number): Point {
  const radians = ((angle - 90) * Math.PI) / 180
  return {
    x: CENTER + radius * Math.cos(radians),
    y: CENTER + radius * Math.sin(radians),
  }
}

function donutSegment(startAngle: number, endAngle: number): string {
  const outerStart = polarPoint(OUTER_RADIUS, startAngle)
  const outerEnd = polarPoint(OUTER_RADIUS, endAngle)
  const innerEnd = polarPoint(INNER_RADIUS, endAngle)
  const innerStart = polarPoint(INNER_RADIUS, startAngle)
  const largeArc = endAngle - startAngle > 180 ? 1 : 0

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

interface ColorWheelPickerProps {
  segments: readonly WheelSegment[]
  selectedIndex: number
  baseColor: Color
  onSelect: (index: number) => void
}

export function ColorWheelPicker({
  segments,
  selectedIndex,
  baseColor,
  onSelect,
}: ColorWheelPickerProps) {
  const selectAndFocus = (
    event: KeyboardEvent<SVGGElement>,
    targetIndex: number,
  ) => {
    onSelect(targetIndex)

    const options =
      event.currentTarget.ownerSVGElement?.querySelectorAll<SVGGElement>(
        '[role="radio"]',
      )

    window.requestAnimationFrame(() => options?.[targetIndex]?.focus())
  }

  const handleKeyDown = (
    event: KeyboardEvent<SVGGElement>,
    index: number,
  ) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(index)
      return
    }

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      selectAndFocus(event, (index + 1) % segments.length)
      return
    }

    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      selectAndFocus(event, (index - 1 + segments.length) % segments.length)
    }
  }

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      role="radiogroup"
      aria-label="Choose a base hue"
    >
      <svg
        viewBox="0 0 560 560"
        className="h-full w-full overflow-visible"
      >
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS + 12}
          fill="none"
          stroke="#DED8CC"
          strokeWidth="0.7"
          opacity="0.65"
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS - 5}
          fill="none"
          stroke="#DED8CC"
          strokeWidth="0.7"
          opacity="0.7"
        />

        {segments.map((segment, index) => {
          const midpoint = index * 30 - 90
          const startAngle = midpoint - 15 + SLICE_GAP / 2
          const endAngle = midpoint + 15 - SLICE_GAP / 2
          const labelPoint = polarPoint(LABEL_RADIUS, midpoint)
          const isSelected = selectedIndex === index

          return (
            <g
              key={segment.name}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${segment.name}, ${segment.color.hex}, ${index + 1} of ${segments.length}`}
              data-selected={isSelected}
              tabIndex={0}
              className="wheel-option"
              onClick={() => onSelect(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              <title>{`${segment.name} — ${segment.color.hex}`}</title>
              <path
                d={donutSegment(startAngle, endAngle)}
                fill={segment.color.hex}
                className="wheel-slice"
              />
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="wheel-label"
              >
                {segment.name}
              </text>
            </g>
          )
        })}
      </svg>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="flex aspect-square w-[42.5%] flex-col items-center justify-center rounded-full text-center transition-colors duration-500"
          style={{
            backgroundColor: baseColor.hex,
            color: baseColor.readableTextColor,
          }}
        >
          <span className="text-[7px] font-medium uppercase tracking-[0.28em] opacity-60 sm:text-[8px]">
            Selected hue
          </span>
          <span className="mt-1.5 font-serif text-[28px] leading-none tracking-[-0.03em] sm:text-[36px]">
            {baseColor.name}
          </span>
          <span className="mt-2 text-[8px] font-medium uppercase tracking-[0.18em] opacity-80 sm:text-[9px]">
            {baseColor.hex}
          </span>
        </div>
      </div>
    </div>
  )
}
