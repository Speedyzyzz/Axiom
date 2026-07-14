from typing import List
from app.pipeline.correlation import AttackChain

def generate_recommendations(chain: AttackChain) -> List[str]:
    """
    Recommendation Engine: Deterministic response actions based on observed MITRE tactics.
    """
    actions = set()
    
    for ev in chain.events:
        if ev.is_malicious:
            actions.add(f"Block IP {ev.ip} at Perimeter Firewall")
            
        if ev.mitre_tactic == "Execution":
            actions.add("Isolate Endpoint & Collect Memory Dump")
        
        if ev.mitre_tactic == "Credential Access" or ev.mitre_tactic == "Initial Access":
            actions.add("Force Password Reset & Revoke Active Sessions")
            
        if ev.mitre_tactic == "Impact":
            actions.add("Freeze Associated Bank Accounts")
            actions.add("Notify Fraud Department")
            
    # Default fallback if nothing specific hit
    if not actions:
        actions.add("Increase Monitoring on Associated Entity")
        
    return list(actions)
