# Architecture

AttackChain AI uses a deterministic, pipeline-based backend that processes raw security telemetry and emits a structured investigation report.

## Data Flow

```text
Telemetry
      │
      ▼
Normalization
      │
      ▼
Threat Intelligence
      │
      ▼
MITRE Mapping
      │
      ▼
Correlation Engine
      │
      ▼
Risk Scoring
      │
      ▼
Reasoning Trace
      │
      ▼
Recommendations
      │
      ▼
Deterministic Report  ← Source of truth
      │
      ├──────────────► Frontend
      │
      ▼
(Optional LLM Rewrite)
```

## Core Principles
1. **Explainable AI:** The intelligence comes from the deterministic correlation engine. The LLM is strictly an optional presentation layer.
2. **Auditability:** Every incident score must be traced back to exact weighted rules (Reasoning Trace).
3. **Resilience:** If the LLM goes down, or the API key is missing, the system silently falls back to `ENGINE_ONLY` mode, preserving 100% of the facts.
