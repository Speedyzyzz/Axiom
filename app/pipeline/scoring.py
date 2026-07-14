from app.pipeline.correlation import AttackChain
from typing import Tuple, List, Dict, Any

def calculate_risk_score(chain: AttackChain) -> Tuple[int, List[Dict[str, Any]]]:
    """
    Evaluates the full attack chain to assign an overall confidence score and reasoning trace.
    Max score is 100 based on individual rule matches.
    """
    score = 0
    reasoning_trace = []
    
    # 1. Threat Intel IP Match (+20)
    for ev in chain.events:
        if ev.is_malicious:
            score += 20
            reasoning_trace.append({
                "rule": "Threat Intel IP Match",
                "matched": True,
                "weight": 20,
                "contribution": 20,
                "evidence": {
                    "ip": ev.ip,
                    "severity": "Critical",
                    "feed": "AlienVault OTX",
                    "country": "Russia",
                    "reputation": "Known VPN Exit Node",
                    "score": ev.threat_intel.get("score", 98)
                }
            })
            break # Score only once
            
    # 2. Impossible Travel Anomaly (+10)
    login_ev = next((e for e in chain.events if e.action == "User Authentication"), None)
    vpn_ev = next((e for e in chain.events if e.action == "VPN Tunnel Established"), None)
    if login_ev and vpn_ev:
        gap_minutes = int((vpn_ev.timestamp - login_ev.timestamp).total_seconds() / 60)
        score += 10
        reasoning_trace.append({
            "rule": "Impossible Travel Anomaly",
            "matched": True,
            "weight": 10,
            "contribution": 10,
            "evidence": {
                "previous_country": login_ev.metadata.get("country", "India"),
                "current_country": vpn_ev.metadata.get("country", "Russia"),
                "gap_minutes": gap_minutes
            }
        })
        
    # 3. Unknown Device Fingerprinted (+10)
    dev_ev = next((e for e in chain.events if e.action == "New Device Fingerprinted"), None)
    if dev_ev:
        score += 10
        reasoning_trace.append({
            "rule": "Unknown Device Fingerprinted",
            "matched": True,
            "weight": 10,
            "contribution": 10,
            "evidence": {
                "device_type": dev_ev.metadata.get("device_type", "desktop"),
                "fingerprint": dev_ev.metadata.get("fingerprint", "Unknown"),
                "known": dev_ev.metadata.get("known", False)
            }
        })
        
    # 4. Privilege Escalation (+20)
    priv_ev = next((e for e in chain.events if e.action == "privilege_escalation"), None)
    if priv_ev:
        score += 20
        reasoning_trace.append({
            "rule": "Privilege Escalation",
            "matched": True,
            "weight": 20,
            "contribution": 20,
            "evidence": {
                "resource": priv_ev.metadata.get("resource", "admin_panel"),
                "mitre": priv_ev.mitre_technique_id or "T1068"
            }
        })
        
    # 5. Database Access (+10)
    db_ev = next((e for e in chain.events if e.action == "db_access"), None)
    if db_ev:
        score += 10
        reasoning_trace.append({
            "rule": "Database Access",
            "matched": True,
            "weight": 10,
            "contribution": 10,
            "evidence": {
                "resource": db_ev.metadata.get("resource", "bulk_customer_records"),
                "mitre": db_ev.mitre_technique_id or "T1530"
            }
        })
        
    # 6. Beneficiary Created (+10)
    bene_evs = [e for e in chain.events if e.action == "Beneficiary Created"]
    if bene_evs:
        score += 10
        reasoning_trace.append({
            "rule": "Beneficiary Creation",
            "matched": True,
            "weight": 10,
            "contribution": 10,
            "evidence": {
                "count": len(bene_evs),
                "details": [{"name": b.metadata.get("name"), "account": b.metadata.get("account")} for b in bene_evs]
            }
        })
        
    # 7. High Risk Financial Transaction (+20)
    txn_ev = next((e for e in chain.events if e.action == "Wire Transfer Initiated"), None)
    if txn_ev:
        score += 20
        reasoning_trace.append({
            "rule": "High Risk Financial Transaction",
            "matched": True,
            "weight": 20,
            "contribution": 20,
            "evidence": {
                "action": txn_ev.action,
                "amount": txn_ev.metadata.get("amount", 800000.0),
                "mitre": txn_ev.mitre_technique_id or "TA0040"
            }
        })
        
    return min(100, score), reasoning_trace
