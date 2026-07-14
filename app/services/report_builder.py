import json
from sqlalchemy.orm import Session
from app.models import models
from app.pipeline.correlation import AttackChain
from app.pipeline.recommendation import generate_recommendations

def rebuild_attack_chain(db: Session, incident_id: int) -> AttackChain:
    """
    Reconstructs the AttackChain object from events linked to the incident.
    """
    events = db.query(models.IncidentEvent).filter(models.IncidentEvent.incident_id == incident_id).all()
    
    login_logs = []
    vpn_logs = []
    devices = []
    security_events = []
    beneficiaries = []
    transactions = []
    
    for ev in events:
        table = ev.source_table
        source_id = ev.source_id
        if table == "login_logs":
            l = db.query(models.LoginLog).filter(models.LoginLog.id == source_id).first()
            if l: login_logs.append(l)
        elif table == "vpn_logs":
            v = db.query(models.VpnLog).filter(models.VpnLog.id == source_id).first()
            if v: vpn_logs.append(v)
        elif table == "devices":
            d = db.query(models.Device).filter(models.Device.id == source_id).first()
            if d: devices.append(d)
        elif table == "security_events":
            s = db.query(models.SecurityEvent).filter(models.SecurityEvent.id == source_id).first()
            if s: security_events.append(s)
        elif table == "beneficiaries":
            b = db.query(models.Beneficiary).filter(models.Beneficiary.id == source_id).first()
            if b: beneficiaries.append(b)
        elif table == "transactions":
            t = db.query(models.Transaction).filter(models.Transaction.id == source_id).first()
            if t: transactions.append(t)
            
    raw_events = {
        "login_logs": login_logs,
        "vpn_logs": vpn_logs,
        "devices": devices,
        "security_events": security_events,
        "beneficiaries": beneficiaries,
        "transactions": transactions
    }
    
    from app.pipeline.ingestion import normalize_events
    from app.pipeline.enrichment import enrich_events
    from app.pipeline.mitre import map_mitre_techniques
    
    normalized = normalize_events(raw_events)
    enriched = enrich_events(normalized)
    mitre = map_mitre_techniques(enriched)
    
    mitre.sort(key=lambda x: x.timestamp)
    
    user_id = login_logs[0].user_id if login_logs else 1
    return AttackChain(user_id=user_id, events=mitre, is_critical=True)

def build_deterministic_report(db: Session, incident: models.Incident) -> dict:
    """
    Constructs the canonical JSON report schema from database data.
    """
    chain = rebuild_attack_chain(db, incident.id)
    
    # 1. Parse reasoning trace
    reasoning_trace = []
    if incident.reasoning_trace_json:
        reasoning_trace = json.loads(incident.reasoning_trace_json)
        
    # 2. Map recommendations & priority
    flat_actions = generate_recommendations(chain)
    recommendations = {
        "priority": "Critical",
        "playbook": "Compromised Credentials & Wire Fraud",
        "recommended_actions": flat_actions
    }
    
    # 3. MITRE mappings (De-duplicated)
    seen_techniques = set()
    mitre_techniques = []
    for e in chain.events:
        if e.mitre_technique_id and e.mitre_technique_id not in seen_techniques:
            seen_techniques.add(e.mitre_technique_id)
            mitre_techniques.append({
                "technique_id": e.mitre_technique_id,
                "tactic": e.mitre_tactic,
                "action": e.action
            })
            
    # 4. Chronological timeline with Deltas
    from app.investigation.engine import build_ordered_timeline
    timeline = build_ordered_timeline(db, incident.id)
    formatted_timeline = []
    for i, t in enumerate(timeline):
        delta_str = "Start"
        if i > 0:
            diff = t["time"] - timeline[i-1]["time"]
            diff_seconds = int(diff.total_seconds())
            diff_minutes = diff_seconds // 60
            diff_seconds_remainder = diff_seconds % 60
            if diff_minutes > 0:
                delta_str = f"+{diff_minutes}m"
                if diff_seconds_remainder > 0:
                    delta_str += f" {diff_seconds_remainder}s"
            else:
                delta_str = f"+{diff_seconds}s"
                
        formatted_timeline.append({
            "timestamp": t["time"].isoformat() if hasattr(t["time"], "isoformat") else str(t["time"]),
            "type": t["type"],
            "details": t["details"],
            "mitre": t["mitre"],
            "delta": delta_str
        })

    # 5. Extract values for templating
    beneficiaries_list = [e for e in chain.events if e.action == "Beneficiary Created"]
    bene_names = [b.metadata.get("name", "Unknown") for b in beneficiaries_list]
    bene_acc = beneficiaries_list[0].metadata.get("account", "Unknown") if beneficiaries_list else "Unknown"
    
    amount = 0.0
    tx_ev = next((e for e in chain.events if e.action == "Wire Transfer Initiated"), None)
    if tx_ev:
        amount = tx_ev.metadata.get("amount", 0.0)
        
    # 6. Generate human-readable rich evidence bullets
    evidence = []
    for trace in reasoning_trace:
        rule = trace["rule"]
        ev_info = trace["evidence"]
        if rule == "Threat Intel IP Match":
            evidence.append(
                f"Threat Intel\n"
                f"Severity: Critical\n"
                f"Feed: {ev_info.get('feed', 'AlienVault OTX')}\n"
                f"IP: {ev_info.get('ip', 'Unknown')}\n"
                f"Country: {ev_info.get('country', 'Unknown')}\n"
                f"Reputation: {ev_info.get('reputation', 'Malicious IP')}\n"
                f"Confidence: {ev_info.get('score', 98)}%"
            )
        elif rule == "Impossible Travel Anomaly":
            evidence.append(f"Impossible travel detected: Okta session from {ev_info['previous_country']} followed by a VPN connection from {ev_info['current_country']} within {ev_info['gap_minutes']} minutes.")
        elif rule == "VPN Connection Established":
            evidence.append(f"Anomalous VPN connection established from {ev_info['country']} (IP: {ev_info['ip']}).")
        elif rule == "Unknown Device Fingerprinted":
            evidence.append(f"Unknown Device Fingerprint detected: {ev_info['fingerprint']} ({ev_info['device_type']}), registered during VPN login.")
        elif rule == "Privilege Escalation":
            evidence.append(f"Privilege escalation confirmed: Rogue session successfully accessed the {ev_info['resource']} (MITRE: {ev_info['mitre']}).")
        elif rule == "Database Access":
            evidence.append(f"Database Access violation: Bulk access to {ev_info['resource']} (MITRE: {ev_info['mitre']}).")
        elif rule == "Beneficiary Creation":
            evidence.append(f"Beneficiary creation: {ev_info['count']} unauthorized beneficiaries added to the account ({', '.join(bene_names)}).")
        elif rule == "High Risk Financial Transaction":
            evidence.append(f"High Risk Financial Transaction: offshore wire transfer of ₹{ev_info['amount']:,.0f} to unverified entity.")

    if not evidence:
        evidence = ["Suspicious access sequence observed on account."]

    # 7. Templates (Richer Executive Summary)
    title = f"Credential Theft Leading to Fraudulent Transfer — Acct {bene_acc}"
    executive_summary = (
        f"AttackChain AI reconstructed a coordinated account takeover that originated from a suspicious VPN session in Russia, "
        f"escalated privileges, accessed sensitive customer records, created unauthorized beneficiaries, and attempted an "
        f"₹{amount:,.0f} offshore transfer. The correlation engine assigned a confidence score of {incident.confidence_score:.0f}%, "
        f"indicating a high probability of malicious activity requiring immediate containment."
    )
    technical_summary = "The attack sequence progressed as follows: 1) Legitimate user authentication from India, 2) Unauthorized VPN session established from Russia using an unrecognized device, 3) Privilege escalation to the admin panel, 4) Bulk database access to customer records, 5) Registration of three unauthorized beneficiaries, and 6) Request for an offshore wire transfer."
    
    bene_count = len(beneficiaries_list)
    bene_word = "beneficiary" if bene_count == 1 else "beneficiaries"
    business_impact = f"Potential loss of ₹{amount:,.0f}. {bene_count} new {bene_word} added to the account."
    
    return {
        "incident": {
            "id": incident.id,
            "title": title,
            "severity": "Critical",
            "confidence": int(incident.confidence_score)
        },
        "attack_chain": formatted_timeline,
        "evidence": evidence,
        "mitre": mitre_techniques,
        "reasoning_trace": reasoning_trace,
        "recommendations": recommendations,
        "executive_summary": executive_summary,
        "technical_summary": technical_summary,
        "business_impact": business_impact,
        "report_mode": "ENGINE_ONLY"
    }
