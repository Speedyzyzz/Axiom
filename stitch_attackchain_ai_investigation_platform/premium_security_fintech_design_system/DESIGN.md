---
name: Premium Security & Fintech Design System
colors:
  surface: '#16130b'
  surface-dim: '#16130b'
  surface-bright: '#3d392f'
  surface-container-lowest: '#110e07'
  surface-container-low: '#1f1b13'
  surface-container: '#231f17'
  surface-container-high: '#2e2a21'
  surface-container-highest: '#39342b'
  on-surface: '#eae1d4'
  on-surface-variant: '#d1c5af'
  inverse-surface: '#eae1d4'
  inverse-on-surface: '#343027'
  outline: '#99907b'
  outline-variant: '#4d4635'
  surface-tint: '#ecc246'
  primary: '#ecc246'
  on-primary: '#3d2e00'
  primary-container: '#c9a227'
  on-primary-container: '#4b3a00'
  inverse-primary: '#755b00'
  secondary: '#b7c6ee'
  on-secondary: '#213050'
  secondary-container: '#384668'
  on-secondary-container: '#a6b5dc'
  tertiary: '#ffb4aa'
  on-tertiary: '#690004'
  tertiary-container: '#ff8274'
  on-tertiary-container: '#7f0006'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08e'
  primary-fixed-dim: '#ecc246'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#d9e2ff'
  secondary-fixed-dim: '#b7c6ee'
  on-secondary-fixed: '#0a1a3a'
  on-secondary-fixed-variant: '#384668'
  tertiary-fixed: '#ffdad5'
  tertiary-fixed-dim: '#ffb4aa'
  on-tertiary-fixed: '#410001'
  on-tertiary-fixed-variant: '#8f100f'
  background: '#16130b'
  on-background: '#eae1d4'
  surface-variant: '#39342b'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  data-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0em
  data-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base-unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  container-max: 1440px
---

## Brand & Style
This design system targets high-stakes environments where security and financial intelligence converge. The brand personality is authoritative, vigilant, and prestigious, utilizing a **Modern-Corporate** aesthetic with **Glassmorphism** and **Tactile** accents to convey both technical depth and luxury. 

The visual strategy relies on a "Midnight-to-Gold" hierarchy. The high-contrast dark mode ensures that critical security alerts and financial trends are immediately legible, while the warm gold accents provide a sense of "elite" reliability. The core motif—a stylized node-and-link "attack chain"—functions as both a brand identifier and a structural navigation element, representing the correlation of complex datasets into actionable insights.

## Colors
The palette is engineered for professional endurance during long periods of monitoring. 
- **Base Surface:** Use `#0B0F14` for the primary background to maximize the depth of the dark mode.
- **Elevated Surface:** Use `#10161D` for dashboard cards and containers to create subtle separation.
- **Primary Accent:** Warm Gold is reserved for high-value actions (e.g., "Authorize," "Export Audit"), critical status indicators, and branding hero elements.
- **Secondary Accent:** Deep Sapphire is used for interactive states, hover glows, and subtle data grouping.
- **Functional Alerts:** Use the saturated Red-Orange (#D4453A) exclusively for security breaches and critical errors. Do not use this for decorative purposes.

## Typography
The typography system prioritizes the distinction between "Narrative" content and "Technical" data. 
- **Headings & Body:** Inter is the workhorse. Headlines must use Bold or Extra-bold weights with tight letter-spacing to create a dense, powerful presence.
- **Technical/Metric Data:** JetBrains Mono is mandatory for all dynamic values, timestamps, blockchain addresses, and system logs. This ensures that characters like '0' and 'O' are never confused in a security context.
- **Hierarchy:** Use `label-caps` for table headers and section metadata to provide a structured, utilitarian feel against the fluid Inter body text.

## Layout & Spacing
This design system utilizes a **Fluid Grid** with fixed-width gutter constraints. 
- **Dashboard Layout:** A 12-column grid. Sidebars are fixed at 280px, while the main stage expands fluidly.
- **Spacing Rhythm:** Based on a 4px baseline. Components should use 8px, 16px, 24px, and 32px increments for padding and margins. 
- **Mobile Adaptation:** At the 768px breakpoint, the 12-column grid collapses to a 4-column stack. Sidebars transform into a bottom-sheet navigation or a hamburger overlay. Padding is reduced to 20px on margins to maximize screen real estate for technical data.

## Elevation & Depth
Depth is created through a combination of **Tonal Layering** and **Subtle Glows**.
- **The Baseline:** The primary background is the lowest level.
- **The Container:** Dashboard widgets use a slightly lighter fill (#10161D) with a 1px solid border (#1B2A4A). No shadows are used here to maintain a crisp, "heads-up display" (HUD) feel.
- **The Global Elevation:** For modals and dropdowns, use a 12px blur backdrop-filter (Glassmorphism) with a 15% opacity primary gold glow shadow. This suggests the element is "floating" in a high-tech space.
- **Interactive Depth:** Buttons and active nodes in the attack chain motif use a 0px 0px 12px spread of Sapphire (#1B2A4A) to create a "pulsing" light effect.

## Shapes
The shape language is a hybrid of **Soft-Landing** and **Hard-Utility**.
- **Marketing/Landing Cards:** Use `rounded-xl` (24px) to create a welcoming, premium feel that softens the high-contrast color palette.
- **Dashboard/Utility Elements:** Use `rounded-sm` (4px to 8px) for input fields, buttons, and data cells. This sharper radius communicates precision and efficiency.
- **Nodes:** The "Attack Chain" nodes should be perfect circles to contrast against the rectangular grid of the dashboard.

## Components
- **Buttons:** Primary buttons are Solid Gold (#C9A227) with Black text. Secondary buttons are Ghost-style with a Sapphire border. All buttons use an 8px radius.
- **Attack Chain Timeline:** A custom component using thin lines (1px) and circular nodes. Red nodes indicate threat detected; Gold nodes indicate authorized transaction; Sapphire nodes indicate neutral event.
- **Input Fields:** Deep charcoal background with a 1px sapphire border. On focus, the border transitions to gold. Use JetBrains Mono for the input text.
- **Cards:** Dashboard cards have no shadow but feature a subtle gradient top-border (Sapphire to Transparent) to provide a "lit from above" effect.
- **Chips/Status:** Use Pill-shaped backgrounds with 10% opacity of the status color (Red, Gold, or Blue) and 100% opacity text for high readability.
- **Data Tables:** Row lines should be subtle (#1B2A4A at 50% opacity). Use "Zebra-striping" only on hover to keep the UI clean during passive monitoring.