# AttackChain API Contract (FROZEN)

This outlines the immutable response schema for the core deterministic backend. 

## GET `/api/v1/attack-chain/{id}`
**Response Shape:**
```json
{
  "status": "success",
  "data": {
    "incident": { "id": 1, "title": "...", "severity": "...", "confidence": 100 },
    "attack_chain": [
      { "timestamp": "...", "type": "...", "details": "...", "mitre": "...", "delta": "+5m" }
    ],
    "evidence": ["..."],
    "mitre": [
      { "technique_id": "...", "tactic": "...", "action": "..." }
    ],
    "reasoning_trace": [
      { "rule": "...", "matched": true, "weight": 10, "contribution": 10, "evidence": {} }
    ],
    "recommendations": {
      "priority": "Critical",
      "playbook": "...",
      "recommended_actions": ["..."]
    },
    "executive_summary": "...",
    "technical_summary": "...",
    "business_impact": "...",
    "report_mode": "ENGINE_ONLY"
  },
  "meta": {}
}
```

## GET `/api/v1/dashboard`
**Response Shape:**
```json
{
  "status": "success",
  "data": {
    "kpis": { "active_incidents": 12, "total_events": 84209, "alerts": 4112, "confidence": 98 }
  }
}
```

**Rule:** AI agents are forbidden from changing these contracts without explicit user approval.
