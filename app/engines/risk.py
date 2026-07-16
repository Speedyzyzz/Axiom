from typing import List
from app.models.models import Event

def calculate_risk_score(events: List[Event]) -> float:
    base_score = 0.0
    
    severity_weights = {
        "CRITICAL": 30,
        "HIGH": 20,
        "MEDIUM": 10,
        "LOW": 2
    }
    
    for event in events:
        base_score += severity_weights.get(event.severity, 0)
        
        # MITRE weights
        if event.mitre_tactic == "Exfiltration":
            base_score += 25
        elif event.mitre_tactic == "Lateral Movement":
            base_score += 15
        elif event.mitre_tactic == "Privilege Escalation":
            base_score += 20
            
    # Cap at 99.9
    return min(99.9, base_score)
