import json
from sqlalchemy.orm import Session
from app.models import models
from app.schemas.responses import IncidentResponseData
from app.exceptions.custom_exceptions import IncidentNotFound
from app.investigation.engine import build_ordered_timeline
from app.ai.llm_service import generate_investigation_summary

def get_dashboard_stats(db: Session):
    """Fetch high-level dashboard KPIs including total and active incidents."""
    total_incidents = db.query(models.Incident).count()
    active_incidents = db.query(models.Incident).filter(models.Incident.status == "open").count()
    return {
        "total_incidents": total_incidents,
        "active_incidents": active_incidents
    }

def get_all_incidents(db: Session):
    """Retrieve all incidents from the database."""
    alerts = db.query(models.Incident).all()
    return [{"id": a.id, "title": a.incident_title, "confidence_score": a.confidence_score, "status": a.status, "created_at": a.created_at} for a in alerts]

def get_incident_with_timeline(db: Session, incident_id: int) -> dict:
    """Fetch incident details along with its embedded timeline and pre-computed LLM summary."""
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise IncidentNotFound(incident_id)
        
    # If summary is not pre-computed, compute it now and save (e.g., for legacy incidents)
    if not incident.summary_json:
        generate_investigation_summary(db, incident.id)
        incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()

    summary_data = json.loads(incident.summary_json) if incident.summary_json else {}
    
    # Fetch timeline
    timeline_events = build_ordered_timeline(db, incident.id)
    
    # Embed timeline
    summary_data["timeline"] = timeline_events
    return summary_data

def take_action_on_incident(db: Session, incident_id: int, action: str):
    """Update the status of an incident."""
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise IncidentNotFound(incident_id)
        
    incident.status = action
    db.commit()
    return incident
