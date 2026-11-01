import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download, LoaderCircle } from 'lucide-react'
import type { Palette } from '../core/Palette'
import type { ToastTone } from '../hooks/useToast'
import { copyText } from '../lib/clipboard'
import { exportPaletteAsPng } from '../lib/exportPalette'

interface PaletteCardProps {
  palette: Palette
  index: number
  onNotify: (message: string, tone?: ToastTone) => void
}

export function PaletteCard({ palette, index, onNotify }: PaletteCardProps) {
  const exportRef = useRef<HTMLDivElement>(null)
  const copyTimer = useRef<number | null>(null)
  const [copiedHex, setCopiedHex] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(
    () => () => {
      if (copyTimer.current !== null) {
        window.clearTimeout(copyTimer.current)
      }
    },
    [],
  )

  const handleCopy = async (hex: string) => {
    const copied = await copyText(hex)

    if (!copied) {
      onNotify('Copy is unavailable in this browser', 'error')
      return
    }

    setCopiedHex(hex)
    onNotify(`${hex} copied`)
    window.clearTimeout(copyTimer.current ?? undefined)
    copyTimer.current = window.setTimeout(() => setCopiedHex(null), 1800)
  }

  const handleDownload = async () => {
    if (!exportRef.current || isDownloading) {
      return
    }

    setIsDownloading(true)

    try {
      await exportPaletteAsPng(exportRef.current, palette)
      onNotify('Palette image downloaded')
    } catch (error) {
      console.error('Unable to export palette', error)
      onNotify('Export failed — please try again', 'error')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <article className="border-t border-line">
      <div
        ref={exportRef}
        className="-mx-4 grid gap-7 px-4 py-9 sm:-mx-6 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_94px_minmax(190px,0.68fr)] lg:items-stretch lg:gap-8 lg:py-10"
      >
        <div className="min-w-0 lg:col-start-1">
          <div className="mb-3 flex items-center justify-between text-[8px] font-medium uppercase tracking-[0.19em] text-muted">
            <span className="text-ink">
              No. {String(index + 1).padStart(2, '0')}
            </span>
            <span className="lg:hidden">Chromatique · Azaziin</span>
            <span>{palette.size} colours</span>
          </div>

          <div className="flex h-[158px] gap-[2px] sm:h-[192px] lg:h-[212px]">
            {palette.colors.map((color, colorIndex) => (
              <div
                key={`${color.hex}-${colorIndex}`}
                className="relative min-w-0 flex-1 overflow-hidden"
                style={{ backgroundColor: color.hex }}
                title={`${color.name} — ${color.hex}`}
              >
                <div
                  className="flex h-full flex-col justify-between p-2.5 sm:p-3"
                  style={{ color: color.readableTextColor }}
                >
                  <span className="text-[7px] font-medium uppercase tracking-[0.15em] opacity-55 sm:text-[8px]">
                    {String(colorIndex + 1).padStart(2, '0')}
                  </span>
                  <span className="hidden truncate text-[7.5px] uppercase tracking-[0.14em] opacity-60 md:block">
                    {color.name}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 hidden items-center justify-between text-[8px] uppercase tracking-[0.17em] text-muted lg:flex">
            <span>Chromatique · Azaziin</span>
            <span>{palette.baseColor.name} · {palette.baseColor.hex}</span>
          </div>
        </div>

        <div className="order-last flex items-center gap-4 border-t border-line/70 pt-5 lg:order-none lg:col-start-2 lg:row-start-1 lg:flex-col lg:justify-center lg:border-t-0 lg:pt-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            data-export-ignore="true"
            aria-label={`Download the ${palette.theoryName} palette as a PNG`}
            className="group/download flex items-center gap-3 lg:flex-col lg:gap-2.5"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 group-hover/download:border-ink group-hover/download:bg-ink group-hover/download:text-canvas disabled:cursor-wait">
              {isDownloading ? (
                <LoaderCircle
                  size={14}
                  strokeWidth={1.5}
                  className="animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <Download size={14} strokeWidth={1.5} aria-hidden="true" />
              )}
            </span>
            <span className="text-[8px] font-medium uppercase leading-[1.5] tracking-[0.16em] text-muted transition-colors group-hover/download:text-ink lg:text-center">
              {isDownloading ? 'Preparing' : 'Download'}
              <span className="lg:block"> palette</span>
            </span>
          </button>
        </div>

        <div className="min-w-0 lg:col-start-3 lg:row-start-1">
          <p className="text-[8px] font-medium uppercase tracking-[0.19em] text-muted">
            Theory {String(index + 1).padStart(2, '0')}
          </p>
          <h3 className="mt-3 font-serif text-[35px] leading-[0.92] tracking-[-0.035em] sm:text-[38px]">
            {palette.theoryName}
          </h3>
          <p className="mt-2.5 max-w-[240px] text-[10.5px] leading-[1.7] text-muted">
            {palette.theoryDescription}
          </p>

          <div className="mt-5 border-t border-line/80">
            {palette.hexCodes.map((hex, hexIndex) => {
              const isCopied = copiedHex === hex

              return (
                <button
                  key={hex}
                  type="button"
                  onClick={() => handleCopy(hex)}
                  aria-label={`Copy ${hex} from the ${palette.theoryName} palette`}
                  className="group/copy flex w-full items-center justify-between gap-3 border-b border-line/60 py-[7px] text-left"
                >
                  <span className="flex items-baseline gap-2.5">
                    <span className="text-[7px] uppercase tracking-[0.1em] text-muted/55">
                      {String(hexIndex + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={[
                        'font-sans text-[9px] font-medium uppercase tracking-[0.1em] transition-colors',
                        isCopied
                          ? 'text-ink'
                          : 'text-muted group-hover/copy:text-ink',
                      ].join(' ')}
                    >
                      {hex}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-muted transition-colors group-hover/copy:text-ink"
                    data-export-ignore="true"
                    aria-hidden="true"
                  >
                    {isCopied ? (
                      <Check size={11} strokeWidth={2} />
                    ) : (
                      <Copy
                        size={11}
                        strokeWidth={1.5}
                        className="opacity-0 transition-opacity group-hover/copy:opacity-100"
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </article>
  )
}
