# Chromatique — AZAZIIN

An interactive colour theory study built as a single-page React application. Choose one of twelve hues, compose up to six harmony theories, copy hex codes, and export any palette block as a high-resolution PNG.

## Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- `lucide-react` for interface icons
- `html-to-image` for PNG export
- Self-hosted Cormorant Garamond + Manrope via Fontsource

## Run locally

Requirements: Node.js 20+ and npm, pnpm, or yarn.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

```bash
npm run build      # type-check and create a production build in /dist
npm run preview    # preview the production build
npm run typecheck  # TypeScript only
```

With pnpm:

```bash
pnpm install
pnpm dev
```

## Project structure

```text
.
├── index.html
├── src
│   ├── App.tsx                      # Page composition and hero/studio layout
│   ├── main.tsx                     # React root + font imports
│   ├── index.css                    # Tailwind layers, wheel states, base styles
│   ├── core
│   │   ├── Color.ts                 # Immutable colour value object, HSL/RGB/HEX
│   │   ├── ColorWheel.ts            # 12-segment wheel domain object
│   │   ├── Palette.ts               # Colour composition + theory metadata
│   │   └── theoryTypes.ts           # Shared theory id union
│   ├── theories
│   │   ├── BaseColorTheory.ts       # Abstract class + template method
│   │   ├── MonochromaticTheory.ts
│   │   ├── ComplementaryTheory.ts
│   │   ├── SplitComplementaryTheory.ts
│   │   ├── AnalogousTheory.ts
│   │   ├── TriadicTheory.ts
│   │   ├── NeutralTheory.ts
│   │   └── index.ts                 # Registry in canonical UI order
│   ├── components
│   │   ├── Header.tsx
│   │   ├── ColorWheelPicker.tsx     # Accessible SVG wheel interaction
│   │   ├── TheorySelector.tsx
│   │   ├── PaletteResults.tsx
│   │   ├── PaletteCard.tsx          # Swatches, copy, download, export block
│   │   └── Toast.tsx
│   ├── hooks
│   │   ├── usePaletteStudio.ts      # Selection state, 3s debounce, one-time scroll
│   │   └── useToast.ts
│   └── lib
│       ├── clipboard.ts             # Clipboard API + legacy fallback
│       └── exportPalette.ts         # html-to-image PNG download
├── docs
│   ├── chromatique-class-diagram.drawio  # Editable draw.io class diagram
│   ├── chromatique-class-diagram.xml     # Raw XML version
│   └── chromatique-class-diagram-preview.png
├── tailwind.config.js
├── vercel.json
└── README.md
```

## Class diagram

The editable UML class diagram is available in [docs/chromatique-class-diagram.drawio](docs/chromatique-class-diagram.drawio). Open it with [draw.io](https://app.diagrams.net) via **File → Open From → Device**. A raw XML copy is in [docs/chromatique-class-diagram.xml](docs/chromatique-class-diagram.xml), and a rendered preview is in [docs/chromatique-class-diagram-preview.png](docs/chromatique-class-diagram-preview.png).

## OOP architecture

The colour engine is deliberately separated from the React layer.

| Principle | Implementation |
| --- | --- |
| Constructor | `Color`, `Palette`, `ColorWheel`, and every theory initialise their own state in constructors. |
| Encapsulation | `Color` keeps HSL, RGB, and HEX in ECMAScript `#private` fields. `Palette` exposes read-only getters only. |
| Abstract class | `BaseColorTheory` stores shared metadata and declares `generatePalette(baseColor: Color): Palette`. |
| Inheritance | Six concrete theories extend `BaseColorTheory`. |
| Polymorphism | Every subclass overrides `generatePalette()` with its own colour maths. |
| Composition | A `Palette` is composed from multiple `Color` objects; the wheel is composed of 12 colour segments. |

`BaseColorTheory.composePalette()` is a protected template method that validates the colour count (minimum four), removes duplicates, and builds the immutable `Palette` snapshot.

## Interaction behaviour

- The SVG colour wheel has 12 selectable segments. Unselected segments lose saturation and opacity; the chosen colour becomes the centre of the wheel.
- The six theory checkboxes allow any number of active theories. The default is three, and all six can be active at once.
- There is no submit button. Every selection change immediately starts a subtle composing indicator beside the result heading.
- The palette update uses a 3000ms debounce. When it completes, the result section scrolls smoothly into view **only on the first interaction of the page session**. Later changes refresh the palettes in place without moving the page. Reduced-motion users receive an instant scroll on that first interaction.
- Each palette contains five or six colours. Hex codes copy to the clipboard on click.
- “Download palette” exports the corresponding composition at 2× pixel density using `html-to-image`; interactive controls are filtered out of the image.

## Deploy to Vercel

1. Push the project to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com) and choose **Add New → Project**.
3. Import the repository.
4. Vercel detects Vite automatically. Confirm these settings:
   - **Framework preset:** Vite
   - **Root directory:** `./`
   - **Build command:** `pnpm run build` (or `npm run build` if using npm)
   - **Output directory:** `dist`
   - **Install command:** leave on automatic (Vercel detects the lockfile)
5. Add environment variables only if you introduce a backend later. This app is fully static and has none.
6. Click **Deploy**.
7. After the first deployment, every push to the production branch redeploys automatically. Use **Settings → Domains** to attach a custom domain.

CLI alternative:

```bash
npm i -g vercel
vercel
vercel --prod
```

The included `vercel.json` sets the Vite framework, build command, and `dist` output directory.

## Notes

- No API keys, server, or database are required.
- All fonts are bundled locally, so the visual design does not depend on Google Fonts at runtime.
- The app is keyboard accessible: radio-style arrow key navigation on the wheel, native checkboxes for theories, focus-visible states, and live status messages.
