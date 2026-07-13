# AttackChain AI - Enterprise Design System

This document outlines the visual and component language for AttackChain AI, moving the project from a standard hackathon UI to a premium, startup-grade enterprise security product.

## 1. Design Principles
1. **Data Density without Clutter:** Security analysts need a lot of information on screen, but it must be easily scannable. Use generous whitespace between distinct blocks, but tight padding within related data groups.
2. **Narrative Flow:** The UI should guide the user from macro (Total Events) to micro (Specific Evidence) naturally.
3. **Trust & Authority:** The aesthetic must evoke stability and enterprise security. We avoid playful colors and bouncy animations in favor of precision, high contrast, and smooth, deliberate transitions.

## 2. Color Palette (Light Mode Focus)

We use a highly customized, desaturated palette that feels expensive and modern.

### Core Backgrounds
- **App Background:** `#F8FAFC` (Slate 50) - A very subtle cool gray.
- **Card/Surface:** `#FFFFFF` (White) - For pristine contrast against the app background.
- **Subtle Surface:** `#F1F5F9` (Slate 100) - For secondary panels (e.g., Timeline background).

### Text & Typography
- **Primary Text:** `#0F172A` (Slate 900) - Almost black for maximum readability.
- **Secondary Text:** `#64748B` (Slate 500) - For metadata, timestamps, and subtle labels.
- **Accent Text:** `#334155` (Slate 700) - For subheadings.

### Severity Indicators (The most important colors in the app)
- **Critical/Destructive (Red):** `#EF4444` (Red 500) | *Background Tint:* `#FEF2F2` (Red 50) | *Border:* `#FCA5A5` (Red 300)
- **High/Warning (Amber):** `#F59E0B` (Amber 500) | *Background Tint:* `#FFFBEB` (Amber 50) | *Border:* `#FCD34D` (Amber 300)
- **Medium/Info (Blue):** `#3B82F6` (Blue 500) | *Background Tint:* `#EFF6FF` (Blue 50) | *Border:* `#93C5FD` (Blue 300)
- **Low/Success (Green):** `#10B981` (Emerald 500) | *Background Tint:* `#ECFDF5` (Emerald 50) | *Border:* `#6EE7B7` (Emerald 300)

## 3. Typography

**Primary Font:** `Inter` (Sans-serif)
- Clean, highly legible at small sizes, standard for enterprise SaaS.

**Monospace Font:** `Roboto Mono` or `JetBrains Mono`
- Used strictly for IP addresses, Event IDs, hashes, and raw code snippets.

**Hierarchy:**
- **H1 (Page Titles):** 24px (text-2xl), Font Weight: 700, Tracking: tight
- **H2 (Card Titles):** 14px (text-sm), Font Weight: 600, Text Color: Slate 900
- **Body:** 14px (text-sm), Font Weight: 400
- **Metadata (Timestamps, Labels):** 12px (text-xs), Font Weight: 500, Text Color: Slate 500
- **Monospace Data:** 12px (text-xs), Font Weight: 400

## 4. Component Library Spec

### Cards
- **Border:** `1px solid #E2E8F0` (Slate 200)
- **Shadow:** `box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` (Tailwind `shadow-sm`)
- **Border Radius:** `8px` (rounded-md) or `12px` (rounded-xl) for main containers.
- **Header Padding:** `pb-2` to separate title from content tightly.

### Buttons
- **Primary (Destructive action e.g. Freeze):** Solid Red background, white text. Hover: slightly darker red.
- **Secondary (Escalate):** Slate 900 background, white text.
- **Outline (Export/Reset):** Transparent background, Slate 200 border, Slate 900 text. Hover: Slate 50 background.
- **Border Radius:** `6px` (rounded-md).

### Timeline Nodes
- Nodes are specialized cards that must immediately communicate the risk of that specific event.
- **Layout:** Icon + Title horizontally aligned at top. Timestamp below. Evidence snippet below that.
- **Styling:** Nodes inherit the border and very subtle background tint of their severity indicator (e.g., a Privilege Escalation node has a red border and a faint red shadow/ring).
- **Edges (Connecting Lines):** `#94A3B8` (Slate 400), 2px stroke width, animated SVG path.

### Badges
- Used for Confidence Scores or Statuses.
- **Style:** Small padding (`px-2.5 py-0.5`), pill shape (`rounded-full`), `text-xs font-semibold`.
- Colors inherited from Severity Indicators (e.g., 98/100 gets a red background tint and red text).
