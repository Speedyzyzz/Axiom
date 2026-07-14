from sqlalchemy.orm import Session
from app.models import models
from app.utils.logger import log
import json

from app.pipeline.ingestion import normalize_events
from app.pipeline.enrichment import enrich_events
from app.pipeline.mitre import map_mitre_techniques
from app.pipeline.correlation import build_attack_chains
from app.pipeline.scoring import calculate_risk_score
from app.pipeline.llm import generate_investigation_report

def build_incident_events(db: Session, incident_id: int, chain):
    """Link raw events to the generated incident."""
    for ev in chain.events:
        ie = models.IncidentEvent(incident_id=incident_id, source_table=ev.raw_table, source_id=ev.raw_id)
        db.add(ie)
    db.commit()

def run_investigation_pipeline(db: Session, user_id: int):
    """
    The main AI SOC Pipeline Orchestrator.
    Simulates: Data Ingest -> Normalize -> Enrich -> Correlate -> Score -> LLM Analyze.
    """
    log.info("Starting AI Investigation Pipeline...")
    
    # 1. Data Ingestion (Mock pulling from Kafka/Database)
    login_logs = db.query(models.LoginLog).filter(models.LoginLog.user_id == user_id).all()
    vpn_logs = db.query(models.VpnLog).filter(models.VpnLog.user_id == user_id).all()
    devices = db.query(models.Device).filter(models.Device.user_id == user_id).all()
    security_events = db.query(models.SecurityEvent).filter(models.SecurityEvent.user_id == user_id).all()
    
    beneficiaries = db.query(models.Beneficiary).filter(models.Beneficiary.added_by_user_id == user_id).all()
    beneficiary_ids = [b.id for b in beneficiaries]
    transactions = []
    if beneficiary_ids:
        transactions = db.query(models.Transaction).filter(models.Transaction.beneficiary_id.in_(beneficiary_ids)).all()

    raw_events = {
        "login_logs": login_logs,
        "vpn_logs": vpn_logs,
        "devices": devices,
        "security_events": security_events,
        "beneficiaries": beneficiaries,
        "transactions": transactions
    }

    # 2. Log Normalization
    normalized_events = normalize_events(raw_events)
    
    # 3. Threat Intelligence Enrichment
    enriched_events = enrich_events(normalized_events)
    
    # 4. MITRE ATT&CK Mapping
    mitre_events = map_mitre_techniques(enriched_events)
    
    # 5. Graph Correlation Engine (Attack Chain Builder)
    attack_chains = build_attack_chains(mitre_events)
    
    if not attack_chains:
        log.info("No critical attack chains detected.")
        return None

    # Focus on the most critical chain for the incident
    target_chain = attack_chains[0]
    
    # 6. Risk Scoring Engine
    confidence, reasoning_trace = calculate_risk_score(target_chain)
    
    # 7. Incident Creation
    existing = db.query(models.Incident).filter(models.Incident.status == "open").first()
    if not existing:
        incident = models.Incident(
            incident_title=f"Targeted Attack via {target_chain.events[0].source}",
            confidence_score=confidence,
            status="open",
            reasoning_trace_json=json.dumps(reasoning_trace),
            created_at=target_chain.events[-1].timestamp
        )
        db.add(incident)
        db.commit()
        db.refresh(incident)
        
        build_incident_events(db, incident.id, target_chain)
        
        # Precompute the report
        from app.ai.llm_service import generate_investigation_summary
        generate_investigation_summary(db, incident.id)
        
        log.info(f"Pipeline Complete: Generated Incident {incident.id} with score {confidence}")
        return incident
        
    return existing

def build_ordered_timeline(db: Session, incident_id: int):
    """Construct a chronologically ordered sequence of events for a given incident with MITRE data."""
    events = db.query(models.IncidentEvent).filter(models.IncidentEvent.incident_id == incident_id).all()
    timeline = []
    
    for ev in events:
        table = ev.source_table
        source_id = ev.source_id
        
        if table == "login_logs":
            l = db.query(models.LoginLog).filter(models.LoginLog.id == source_id).first()
            if l: timeline.append({"time": l.login_time, "type": "login", "details": f"IP: {l.ip_address}, {l.location_city}", "mitre": "T1078"})
        elif table == "vpn_logs":
            l = db.query(models.VpnLog).filter(models.VpnLog.id == source_id).first()
            if l: timeline.append({"time": l.vpn_login_time, "type": "vpn_login", "details": f"IP: {l.source_ip}, Country: {l.source_country}", "mitre": "T1133"})
        elif table == "devices":
            d = db.query(models.Device).filter(models.Device.id == source_id).first()
            if d: timeline.append({"time": d.first_seen_at, "type": "device_registration", "details": f"Type: {d.device_type}, Known: {d.is_known_device}", "mitre": None})
        elif table == "security_events":
            e = db.query(models.SecurityEvent).filter(models.SecurityEvent.id == source_id).first()
            if e: timeline.append({"time": e.event_time, "type": e.event_type, "details": f"Resource: {e.resource_accessed}", "mitre": "T1059.001"})
        elif table == "beneficiaries":
            b = db.query(models.Beneficiary).filter(models.Beneficiary.id == source_id).first()
            if b: timeline.append({"time": b.added_at, "type": "beneficiary_added", "details": f"Account: {b.beneficiary_account}", "mitre": None})
        elif table == "transactions":
            t = db.query(models.Transaction).filter(models.Transaction.id == source_id).first()
            if t: timeline.append({"time": t.transaction_time, "type": "transaction", "details": f"Amount: {t.amount}, Type: {t.transaction_type}", "mitre": "TA0040"})

    timeline.sort(key=lambda x: x["time"])
    return timeline
