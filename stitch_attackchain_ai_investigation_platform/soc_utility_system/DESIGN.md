---
name: SOC Utility System
colors:
  surface: '#0e141b'
  surface-dim: '#0e141b'
  surface-bright: '#343a42'
  surface-container-lowest: '#090f15'
  surface-container-low: '#161c23'
  surface-container: '#1a2027'
  surface-container-high: '#242a32'
  surface-container-highest: '#2f353d'
  on-surface: '#dde3ed'
  on-surface-variant: '#d1c5af'
  inverse-surface: '#dde3ed'
  inverse-on-surface: '#2b3139'
  outline: '#99907b'
  outline-variant: '#4d4635'
  surface-tint: '#ecc246'
  primary: '#ecc246'
  on-primary: '#3d2e00'
  primary-container: '#c9a227'
  on-primary-container: '#4b3a00'
  inverse-primary: '#755b00'
  secondary: '#ffb4aa'
  on-secondary: '#690004'
  secondary-container: '#8f100f'
  on-secondary-container: '#ff9a8d'
  tertiary: '#b5c4ff'
  on-tertiary: '#01297a'
  tertiary-container: '#89a3f9'
  on-tertiary-container: '#163686'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08e'
  primary-fixed-dim: '#ecc246'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#ffdad5'
  secondary-fixed-dim: '#ffb4aa'
  on-secondary-fixed: '#410001'
  on-secondary-fixed-variant: '#8f100f'
  tertiary-fixed: '#dbe1ff'
  tertiary-fixed-dim: '#b5c4ff'
  on-tertiary-fixed: '#00174d'
  on-tertiary-fixed-variant: '#244191'
  background: '#0e141b'
  on-background: '#dde3ed'
  surface-variant: '#2f353d'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  data-mono-lg:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  data-mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is engineered for high-stakes Security Operations Centers (SOC) and fintech infrastructure where data density and cognitive clarity are paramount. The aesthetic is strictly **Functional Minimalism** with a **Technical/SaaS** lean. 

The emotional response is one of controlled authority and surgical precision. By removing all decorative flair, "glows," and non-functional motion, the interface prioritizes the rapid identification of anomalies. The visual language utilizes a "dark-room" philosophy to reduce eye strain during long shifts, using high-contrast typography and specific accent placement to direct user attention only where action is required.

## Colors
The palette is hyper-restricted to ensure that color always conveys meaning. 

- **Background & Surfaces:** The foundation is a flat `#0B0F14`. Secondary surfaces for cards, sidebars, and modals use `#10161D` to create subtle separation without depth effects. 
- **Borders:** All UI segmentation is handled by structural borders at `#1C232D`.
- **Primary Accent (Gold):** Reserved exclusively for "Critical Actions" (e.g., Authorize, Deploy, Execute).
- **Severity Accent (Red-Orange):** Reserved for "Critical Alerts" and destructive states. 
- **Greyscale:** Primary content uses an off-white `#F5F3EE` to maximize readability against the dark background, while metadata and labels use `#8A8F98`.

## Typography
The typographic system utilizes a dual-font strategy to separate intent:

1.  **Inter (Sans Serif):** Used for structural navigation, page titles, and interface labels. It provides an authoritative, clean baseline.
2.  **JetBrains Mono (Monospace):** Used for all dynamic data, including timestamps, transaction IDs, IP addresses, and log outputs. 

**Usage Rules:**
- All numeric data must be Monospace to ensure vertical alignment in tables.
- Use `label-caps` for table headers and section grouping.
- Headings should be kept tight with minimal letter spacing to maintain a "technical" feel.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy for density. Information is organized into modular "blades" or panels.

- **Grid:** A 12-column grid is used for primary dashboard views, with elements typically spanning 3, 4, 6, or 12 columns.
- **Rhythm:** An 8px linear scale is the standard, though 4px is permitted for tight data tables.
- **Density:** High density is preferred. Vertical white space should be minimized in favor of information throughput.
- **Breakpoints:**
  - Desktop (1440px+): 24px margins.
  - Tablet (768px - 1439px): 16px margins, sidebars collapse to icons.
  - Mobile: Content reflows into a single column; Monospace data font size remains at 12px for legibility.

## Elevation & Depth
This design system avoids all shadows and traditional depth metaphors. Hierarchy is achieved through **Tonal Layering** and **Low-contrast Outlines**.

- **Level 0 (Background):** `#0B0F14` for the application canvas.
- **Level 1 (Surfaces):** `#10161D` for cards, table headers, and containers.
- **Borders:** Every surface must be defined by a 1px solid border of `#1C232D`.
- **Active State:** Active or hovered items use a slightly lighter border (`#2C3542`) or a subtle 2px left-accent bar in the Primary Gold color.

## Shapes
The shape language is strictly **Soft (0.25rem)**. 

Large radiuses and pill shapes are prohibited as they waste screen real estate and conflict with the technical nature of the data. Buttons, input fields, and containers all share the same 4px (`0.25rem`) corner radius to maintain a modular, "stacked" appearance.

## Components

- **Buttons:**
  - *Critical Action:* Background `#C9A227`, Text `#0B0F14`, Bold weight.
  - *Standard:* Border `#1C232D`, Background transparent, Text `#F5F3EE`.
  - *Ghost:* No border, Text `#8A8F98`.
- **Data Tables:** Use `#10161D` for the header row. All cell data must use `data-mono-sm`. Borders between rows are mandatory.
- **Status Chips:** 
  - *Critical:* Background `#D4453A` (low opacity), Border `#D4453A`, Text `#F5F3EE`.
  - *Normal:* Border `#1C232D`, Text `#8A8F98`.
- **Input Fields:** Background `#0B0F14`, Border `#1C232D`. On focus, the border changes to `#C9A227` (Gold) with no outer glow.
- **Cards:** No shadows. 1px solid border `#1C232D`. Titles in Inter, content in JetBrains Mono.
- **Terminal/Log Views:** Background `#05070A` (darker than page background) with a 1px solid border. 100% JetBrains Mono.