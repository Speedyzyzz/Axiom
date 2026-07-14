# Golden Rule

AttackChain AI is an Investigation Platform.

Everything must help answer one question:

"Why is this incident malicious?"

If a feature does not help answer that question,

do not build it.

---

# NEVER DO THESE

- Never rewrite working code.
- Never replace deterministic logic with AI.
- Never create duplicate components.
- Never create duplicate endpoints.
- Never create duplicate models.
- Never introduce new dependencies unless approved.
- Never break API contracts.
- Never rename public interfaces.
- Never overengineer.

Always ask:
"Does this reduce investigation time?"

---

# AttackChain AI — AI Agent Instructions

This project is an enterprise cybersecurity investigation platform built for the FinSpark Hackathon.

The objective is NOT to build another SIEM.

The objective is to reconstruct multi-stage cyber attacks into one explainable incident for SOC analysts.

Always optimize for:
- Explainability
- Enterprise UX
- Clean architecture
- Demo reliability
- Banking use cases

Never optimize for:
- Fancy AI demos
- Overengineering
- Microservices
- Unnecessary abstractions

---

# Skill 1 — Backend Architect

## Backend Architect

Responsibilities

- FastAPI
- SQLAlchemy
- API Design
- Database
- Performance
- Clean Architecture

Rules

- Never create duplicate endpoints.
- Every endpoint must use response models.
- Keep deterministic logic separate from LLM logic.
- Never place business logic inside routes.
- Services own business logic.
- Endpoints only orchestrate.
- Always prefer composition over duplication.
- Never break existing API contracts.
- Add tests whenever core logic changes.

---

# Skill 2 — Investigation Engine

## Investigation Engine

You own the security pipeline.

Pipeline

Ingestion
↓
Normalization
↓
Threat Intelligence
↓
MITRE Mapping
↓
Correlation
↓
Risk Scoring
↓
Timeline
↓
Recommendations
↓
Deterministic Report
↓
Optional LLM Rewrite

Never skip stages.
Never move scoring into the LLM.
The engine is the source of truth.

---

# Skill 3 — Security Researcher

## Security Research

Use

MITRE ATT&CK
OWASP
NIST
SOC best practices

Never invent attack techniques.
Always map to real MITRE IDs.
Evidence must always cite actual events.

---

# Skill 4 — Frontend Architect

## Frontend

Design philosophy

Enterprise
Minimal
Premium
Authoritative

Inspirations

Microsoft Sentinel
CrowdStrike Falcon
Azure Portal
Linear
Stripe
Palantir

Never

Glassmorphism
Neon
Cyberpunk
RGB everywhere
Huge gradients

Focus on whitespace.
Use motion intentionally.

---

# Skill 5 — Motion Designer

## Motion

Animations should communicate information.
Never animate for decoration.

Allowed

GSAP
Framer Motion
React Flow
ScrollTrigger
Count-up animations
Timeline replay
Evidence reveal
Loading sequences
Hover elevation

Forbidden

Infinite animations
Random bouncing
Spinning icons
Flashing lights

Everything should feel expensive.

---

# Skill 6 — UI Designer

## Design System

Typography

Inter
Geist
IBM Plex Sans

Colors

Slate
White
Neutral
Red only for danger
Amber for warning
Blue for information

Icons

Lucide

Spacing

8px grid
Rounded corners
Large whitespace
Enterprise cards

---

# Skill 7 — Demo Director

## Demo Flow

Always optimize the UI for storytelling.

Sequence

Landing
↓
Dashboard
↓
One Incident
↓
Timeline Replay
↓
Evidence
↓
Reasoning
↓
Recommendation
↓
Execute Playbook

Never overwhelm the user with data.
Reveal information progressively.

---

# Skill 8 — AI Engineer

## AI Layer

The LLM is optional.
The deterministic engine is mandatory.

LLM responsibilities

Rewrite
Summarize
Explain

Never

Score incidents
Compute risk
Invent evidence
Invent MITRE mappings
Hallucinate recommendations

---

# Skill 9 — QA Engineer

## Testing

Every backend change
↓
Run audit suite
↓
Run API tests
↓
Run Scenario 1
↓
Verify graph
↓
Verify timeline
↓
Verify recommendations
↓
Verify frontend

Never merge untested changes.

---

# Skill 10 — Performance Engineer

## Performance

API responses
<200ms preferred

Graph
<100ms

Timeline
Instant

Dashboard
<1 second

Never call the LLM synchronously during demo mode.
Cache expensive work.

---

# Skill 11 — Product Manager

## Product Rules

Every feature must answer

Does this help the SOC analyst investigate faster?

If not,
don't build it.

Keep the product focused.
This is an Investigation Platform,
not a SIEM,
not a dashboard,
not a chatbot.

---

# Skill 12 — Code Reviewer

## Review Checklist

Before every commit

✓ No dead code
✓ No duplicate logic
✓ Response models valid
✓ Naming consistent
✓ Types correct
✓ Tests pass
✓ Frontend builds
✓ Backend starts
✓ No console errors
✓ No TODOs
