# Architecture Decision Records (ADRs)

## ADR-001
**Decision:** Deterministic engine is the source of truth.
**Reason:** Banking systems require explainability.
**Rejected:** LLM-only scoring, End-to-end AI reasoning.
**Status:** Accepted

## ADR-002
**Decision:** SQLite for hackathon backend database.
**Future:** Postgres.
**Reason:** Zero deployment friction.
**Status:** Accepted

## ADR-003
**Decision:** No authentication.
**Future:** Azure AD / OAuth.
**Reason:** Not required for judging.
**Status:** Accepted

## ADR-004
**Decision:** Claude 3 Opus strictly handles readability rewrite (Optional).
**Future:** Bring-Your-Own-LLM support via abstraction layer.
**Reason:** Prevents hallucinations of facts.
**Status:** Accepted
