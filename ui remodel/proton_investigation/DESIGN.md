---
name: AttackChain Forensic
colors:
  surface: '#fcf8ff'
  surface-dim: '#dcd9e1'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fb'
  surface-container: '#f0ecf5'
  surface-container-high: '#eae7f0'
  surface-container-highest: '#e4e1ea'
  on-surface: '#1b1b21'
  on-surface-variant: '#464652'
  inverse-surface: '#303036'
  inverse-on-surface: '#f2eff8'
  outline: '#777683'
  outline-variant: '#c7c5d4'
  surface-tint: '#5053b4'
  primary: '#030057'
  on-primary: '#ffffff'
  primary-container: '#15157d'
  on-primary-container: '#8286ea'
  inverse-primary: '#c0c1ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d4e3ff'
  on-secondary-container: '#56657c'
  tertiary: '#2f0400'
  on-tertiary: '#ffffff'
  tertiary-container: '#540d00'
  on-tertiary-container: '#db7258'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#04006d'
  on-primary-fixed-variant: '#373a9b'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#b8c7e2'
  on-secondary-fixed: '#0c1c30'
  on-secondary-fixed-variant: '#39485e'
  tertiary-fixed: '#ffdad2'
  tertiary-fixed-dim: '#ffb4a2'
  on-tertiary-fixed: '#3c0700'
  on-tertiary-fixed-variant: '#7e2b17'
  background: '#fcf8ff'
  on-background: '#1b1b21'
  surface-variant: '#e4e1ea'
  background-alt: '#F7F8FA'
  surface-glass: rgba(255, 255, 255, 0.65)
  error-alert: '#BA1A1A'
  warning-container: '#FFDAD6'
  success-accent: '#4F54B4'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '400'
    lineHeight: '1.6'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  code-base:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 0.5rem
  sm: 1rem
  base: 1.5rem
  md: 2rem
  lg: 4rem
  section: 8rem
  gutter: 1.5rem
---

## Brand & Style
The brand identity is rooted in **Forensic Clarity** and **Institutional Trust**. It targets elite cybersecurity units that require high-density information without the "hacker-noir" tropes typical of the industry. 

The design style is **Glass-Modernism**: a fusion of clean corporate structures with sophisticated translucent layering. It utilizes heavy backdrop blurs, pristine white surfaces, and deep indigo accents to evoke a sense of precision and calm under pressure. The aesthetic is clinical, venture-backed SaaS—prioritizing readability and the logical reconstruction of complex events.

## Colors
The palette is dominated by **Deep Indigo (#15157D)**, used for primary actions and brand presence to signify authority. The background architecture uses a very light off-white **(#F7F8FA)** to reduce eye strain during long investigations. 

Functional colors are critical: **Error Red (#BA1A1A)** is used sparingly for high-severity alerts, while **Surface Glass** (semi-transparent white) is the primary vehicle for high-level UI containers. Use neutral slates and grays for secondary metadata to maintain a clear visual hierarchy.

## Typography
The system uses **Inter** for all UI and marketing copy, relying on its systematic, neutral character to handle complex layouts. For technical data—such as IP addresses, machine names, and timestamps—**JetBrains Mono** is used to provide a distinct "data" feel that is highly legible.

**Scalability Notes:**
- **Desktop:** Use `display-lg` for hero impact.
- **Mobile:** Replace `display-lg` with `headline-md` (24px) for better fit.
- **Data Densities:** Use `body-sm` for sidebar navigation and secondary table content.

## Layout & Spacing
The layout follows a **Fixed-Width Grid** model for landing pages (max-width 1280px) and a **Fluid Sidebar** model for the application interface.

- **Application View:** Features a 256px (16rem) fixed sidebar with a flexible main content area.
- **Grid System:** A 12-column grid with 1.5rem gutters.
- **Vertical Rhythm:** Sections are separated by `section` (8rem) on desktop, scaling down to `lg` (4rem) on mobile devices.
- **Margins:** Standard page margins are 2rem, providing significant breathing room to offset the density of forensic data.

## Elevation & Depth
Depth is created through **Atmospheric Layering** rather than traditional drop shadows.

- **Level 1 (Base):** The #F7F8FA background.
- **Level 2 (Panels):** Semi-transparent white (`rgba(255,255,255,0.65)`) with a 24px backdrop blur and a subtle 1px white border.
- **Level 3 (Popovers/Active Elements):** "Ambient-LG" shadows (extra-diffused, 0.05 opacity) are used only for high-priority floating elements.
- **Graph Nodes:** Use crisp white fills with a primary-tinted stroke to stand out against the blurred backgrounds.

## Shapes
The shape language is **Refined-Rounded**. 

- **Primary Cards/Containers:** 1.5rem (`3xl`) or 1rem (`2xl`) corner radius to soften the technical nature of the content.
- **Buttons & Inputs:** 0.5rem (`lg`) radius for a professional, modern feel.
- **Badges/Chips:** Full pill-shaped (`full`) for status indicators to distinguish them clearly from interactive buttons.
- **Visual Nodes:** Perfectly circular for graph visualizations to imply connection points.

## Components
- **Buttons:** Primary buttons use a solid Indigo fill with White text. Secondary buttons use the "Glass-Panel" style with an icon prefix. 
- **Status Chips:** Use a high-contrast background (e.g., #FFDAD6 for Critical) with a leading icon. Typography must be bold and 12px.
- **Timeline:** A vertical 2px line in `surface-variant` color, with circular markers. The active/most recent event should use the Primary color.
- **Navigation Sidebar:** Uses transparent backgrounds for inactive states and `primary-container` (soft indigo) with semi-bold text for the active state.
- **Cards:** Glass-panel styling with a white 1px border. Internal padding should be `base` (1.5rem).
- **Code Snippets:** Use a `surface-container-low` background with `code-base` typography for any forensic strings or URLs.