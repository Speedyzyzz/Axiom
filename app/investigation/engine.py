from sqlalchemy.orm import Session
from app.models import models
from app.investigation.risk_scorer import score_evidence
from app.utils.logger import log
from app.ai.llm_service import generate_investigation_summary

def build_incident_events(db: Session, incident_id: int, linked_event_ids: dict):
    """Link raw events to the generated incident."""
    for table, ids in linked_event_ids.items():
        for source_id in ids:
            ie = models.IncidentEvent(incident_id=incident_id, source_table=table, source_id=source_id)
            db.add(ie)
    db.commit()

from app.investigation.rules import RULES_ENGINE

def run_investigation_pipeline(db: Session, user_id: int):
    """Correlate disparate logs and events to detect high-risk scenarios and generate incidents."""
    # 1. Collect events
    login_logs = db.query(models.LoginLog).filter(models.LoginLog.user_id == user_id).order_by(models.LoginLog.login_time).all()
    vpn_logs = db.query(models.VpnLog).filter(models.VpnLog.user_id == user_id).order_by(models.VpnLog.vpn_login_time).all()
    devices = db.query(models.Device).filter(models.Device.user_id == user_id).all()
    security_events = db.query(models.SecurityEvent).filter(models.SecurityEvent.user_id == user_id).order_by(models.SecurityEvent.event_time).all()
    beneficiaries = db.query(models.Beneficiary).filter(models.Beneficiary.added_by_user_id == user_id).order_by(models.Beneficiary.added_at).all()
    
    beneficiary_ids = [b.id for b in beneficiaries]
    transactions = []
    if beneficiary_ids:
        transactions = db.query(models.Transaction).filter(models.Transaction.beneficiary_id.in_(beneficiary_ids)).order_by(models.Transaction.transaction_time).all()

    events_dict = {
        "login_logs": login_logs,
        "vpn_logs": vpn_logs,
        "devices": devices,
        "security_events": security_events,
        "beneficiaries": beneficiaries,
        "transactions": transactions
    }

    # 2. Evaluate modular rules
    flags = set()
    linked_event_ids = {k: [] for k in events_dict.keys()}
    total_score = 0
    
    for rule in RULES_ENGINE:
        results = rule.evaluate(user_id, events_dict)
        for res in results:
            flags.add(res.flag_name)
            total_score += res.score
            for table, ids in res.linked_tables.items():
                linked_event_ids[table].extend(ids)

    for k in linked_event_ids:
        linked_event_ids[k] = list(set(linked_event_ids[k]))

    # 3. Score evidence threshold
    if len(flags) >= 3 and total_score >= 70:
        score = score_evidence(list(flags))
        
        # 4. Create incident
        existing = db.query(models.Incident).filter(models.Incident.status == "open").first()
        if not existing:
            incident = models.Incident(
                incident_title="Pending Analysis...",
                confidence_score=score,
                status="open",
                created_at=transactions[-1].transaction_time if transactions else (login_logs[-1].login_time if login_logs else None)
            )
            db.add(incident)
            db.commit()
            db.refresh(incident)
            
            build_incident_events(db, incident.id, linked_event_ids)
            log.info(f"Incident {incident.id} created with score {score}.")
            # Pre-compute the LLM summary and store in DB
            generate_investigation_summary(db, incident.id)
            return incident
        return existing
    return None

def build_ordered_timeline(db: Session, incident_id: int):
    """Construct a chronologically ordered sequence of events for a given incident."""
    events = db.query(models.IncidentEvent).filter(models.IncidentEvent.incident_id == incident_id).all()
    timeline = []
    
    for ev in events:
        table = ev.source_table
        source_id = ev.source_id
        
        if table == "login_logs":
            l = db.query(models.LoginLog).filter(models.LoginLog.id == source_id).first()
            if l: timeline.append({"time": l.login_time, "type": "login", "details": f"IP: {l.ip_address}, {l.location_city}"})
        elif table == "vpn_logs":
            l = db.query(models.VpnLog).filter(models.VpnLog.id == source_id).first()
            if l: timeline.append({"time": l.vpn_login_time, "type": "vpn_login", "details": f"IP: {l.source_ip}, Country: {l.source_country}"})
        elif table == "devices":
            d = db.query(models.Device).filter(models.Device.id == source_id).first()
            if d: timeline.append({"time": d.first_seen_at, "type": "device_registration", "details": f"Type: {d.device_type}, Known: {d.is_known_device}"})
        elif table == "security_events":
            e = db.query(models.SecurityEvent).filter(models.SecurityEvent.id == source_id).first()
            if e: timeline.append({"time": e.event_time, "type": e.event_type, "details": f"Resource: {e.resource_accessed}"})
        elif table == "beneficiaries":
            b = db.query(models.Beneficiary).filter(models.Beneficiary.id == source_id).first()
            if b: timeline.append({"time": b.added_at, "type": "beneficiary_added", "details": f"Account: {b.beneficiary_account}"})
        elif table == "transactions":
            t = db.query(models.Transaction).filter(models.Transaction.id == source_id).first()
            if t: timeline.append({"time": t.transaction_time, "type": "transaction", "details": f"Amount: {t.amount}, Type: {t.transaction_type}"})

    timeline.sort(key=lambda x: x["time"])
    return timeline
