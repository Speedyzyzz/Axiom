# Design System

AttackChain AI UI is designed for an authoritative, enterprise SOC audience. 

## Principles
- **Enterprise over Flashy:** We avoid cyber-punk neon and glassmorphism. We aim for Microsoft Sentinel, Palantir, and CrowdStrike Falcon vibes.
- **Explainable Space:** UI must focus heavily on whitespace and structured layouts. The user must not be overwhelmed.

## Colors
- **Surface & Backgrounds:** Slate, Neutral, White.
- **Accents:** 
  - Red (`danger`) for critical incidents and impact metrics.
  - Amber (`warning`) for anomalies.
  - Blue (`primary/info`) for data and baseline structure.

## Typography
- **Primary Fonts:** Inter, Geist, IBM Plex Sans.
- Use tight tracking on headers, wide monospace on data points.

## Motion
- **Tooling:** Framer Motion, GSAP, React Flow.
- **Philosophy:** Motion should *only* communicate information (e.g., timeline progression, confidence counting up). No infinite bouncing or spinning.
