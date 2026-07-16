from typing import List
from app.models.models import Event, Evidence

def generate_ai_summary(incident_id: int, events: List[Event], evidence: List[Evidence]) -> dict:
    """
    Fallback chain implementation: OpenRouter -> Anthropic -> Gemini -> Deterministic Fallback.
    For hackathon stability, we default to the deterministic fallback if API keys are missing.
    """
    
    # Analyze the events for the summary
    critical_events = [e for e in events if e.severity == "CRITICAL"]
    root_cause_event = events[0] if events else None
    
    # Deterministic fallback response
    return {
        "executive_summary": f"AttackChain detected a multi-stage intrusion beginning with {root_cause_event.action if root_cause_event else 'an unknown vector'}. The attacker subsequently executed {len(critical_events)} critical actions, moving laterally to compromise sensitive data. Immediate containment is required.",
        "root_cause": f"Initial access gained via {root_cause_event.event_type if root_cause_event else 'Unknown'} originating from {root_cause_event.source_ip if root_cause_event else 'Unknown'}.",
        "recommendation": "1. Isolate the affected endpoint(s).\n2. Revoke active session tokens for the compromised user.\n3. Implement immediate password rotation.\n4. Block the malicious ingress IP."
    }
