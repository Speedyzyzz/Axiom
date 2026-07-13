# Interaction Specs: Timeline Replay

The Timeline Replay is the "hero moment" of the AttackChain AI demo. Instead of immediately dumping all evidence onto the screen, the UI incrementally reveals the attacker's progression. This builds tension and clearly demonstrates the value of the correlation engine.

## The State Machine

The Investigation Screen maintains a `replayState` index, initialized to `-1` (or `0` if we show the first node immediately).

### States
- **State 0:** Only the initial legitimate login is visible.
- **State 1:** VPN Login appears.
- **State 2:** Unknown Device registration appears.
- **State 3:** Privilege Escalation appears.
- **State 4:** Database Access appears.
- **State 5:** Transaction (Transfer) appears.
- **State 6 (Final):** The AI Summary, Confidence Score, and Recommended Action panels fade in.

## Animation Choreography

We use `framer-motion` to orchestrate this sequence.

1. **Trigger:** The user clicks a primary "Replay Investigation" button located at the top of the timeline.
2. **Interval:** A `setInterval` or Framer Motion `useAnimate` sequence increments the `replayState` every `800ms`.
3. **Node Entrance:**
   - Initial state: `opacity: 0, y: 20`
   - Animate to: `opacity: 1, y: 0`
   - Transition: `spring, stiffness: 300, damping: 24`
4. **Edge (Line) Entrance:**
   - The connecting SVG line between node $N-1$ and node $N$ animates its `stroke-dashoffset` from total length to `0` over `400ms` just *before* node $N$ drops in.
5. **Auto-Scroll:**
   - As new nodes appear off-screen (since the timeline grows vertically), the React Flow viewport smoothly pans (`fitBounds` or `setCenter`) to keep the newest node in focus.
6. **Climax (The AI Reveal):**
   - Once all nodes are rendered, a `1200ms` pause occurs.
   - The right-side panels (Root Cause, Impact, Recommendation) fade in simultaneously with a slight upward drift (`y: 10 -> 0`) over `600ms`.

## Micro-interactions

- **Hover on Node:** Node slightly elevates (`y: -2`, `shadow-lg`), and the connecting edges glow slightly brighter.
- **Pulsing Indicator:** The *Active* node (the latest one revealed during replay) has a subtle radial pulse behind it to draw the eye. Once the next node appears, the pulse moves.
