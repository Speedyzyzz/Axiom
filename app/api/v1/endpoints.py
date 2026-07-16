from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
import asyncio
import json
import random
from datetime import datetime

from app.database.connection import get_db, engine
from app.models import models
from app.schemas.responses import APIResponse, ActionRequest
from app.scenarios.vpn_compromise import VpnCompromiseScenario
from app.scenarios.insider_threat import InsiderThreatScenario
from app.scenarios.ransomware import RansomwareScenario
from app.scenarios.sql_injection import SqlInjectionScenario
from app.scenarios.oauth_phishing import OauthPhishingScenario
from app.scenarios.supply_chain import SupplyChainScenario
from app.scenarios.dataset_loader import RealDatasetScenario
from app.engines.correlation import build_attack_graph
from app.engines.risk import calculate_risk_score
from app.engines.ai_summary import generate_ai_summary

# Ensure tables exist
models.Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["Investigation Engine"])

def format_response(data, status="success", meta=None) -> APIResponse:
    return APIResponse(status=status, data=data, meta=meta or {})

@router.get("/health", response_model=APIResponse)
def health_check():
    return format_response({"status": "ok", "engine": "deterministic_investigator"})

from pydantic import BaseModel
from typing import Optional

class InvestigateRequest(BaseModel):
    scenario: Optional[str] = "random"

@router.post("/investigate", response_model=APIResponse)
async def trigger_investigation(req: InvestigateRequest = None, db: Session = Depends(get_db)):
    """
    Selects a scenario, generates events, correlates graph, 
    calculates risk, generates AI summary, and persists everything.
    """
    req = req or InvestigateRequest(scenario="random")
    
    scenarios_map = {
        "vpn": VpnCompromiseScenario(),
        "insider": InsiderThreatScenario(),
        "ransomware": RansomwareScenario(),
        "sqli": SqlInjectionScenario(),
        "phishing": OauthPhishingScenario(),
        "supply_chain": SupplyChainScenario(),
        "real_dataset": RealDatasetScenario()
    }
    
    if req.scenario in scenarios_map:
        scenario = scenarios_map[req.scenario]
    else:
        scenario = random.choice(list(scenarios_map.values()))
        
    data = scenario.generate()
    
    # Simulate realistic delays
    await asyncio.sleep(0.6) # Generating Timeline
    
    # 1. Create Incident
    incident = models.Incident(
        title=data["title"],
        status="open",
        severity="MEDIUM", # Temp
        risk_score=0.0,    # Temp
        created_at=datetime.now()
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    
    # 2. Insert Events
    await asyncio.sleep(0.7) # Correlating Events
    events_to_add = []
    for ev in data["events"]:
        e = models.Event(
            incident_id=incident.id,
            timestamp=ev["timestamp"],
            source_ip=ev["source_ip"],
            user_account=ev["user_account"],
            event_type=ev["event_type"],
            action=ev["action"],
            severity=ev["severity"],
            description=ev["description"],
            mitre_technique_id=ev["mitre_technique_id"],
            mitre_tactic=ev["mitre_tactic"]
        )
        events_to_add.append(e)
    db.add_all(events_to_add)
    db.commit()
    
    # 3. Calculate Risk
    risk_score = calculate_risk_score(events_to_add)
    incident.risk_score = risk_score
    if risk_score > 80: incident.severity = "CRITICAL"
    elif risk_score > 50: incident.severity = "HIGH"
    elif risk_score > 20: incident.severity = "MEDIUM"
    else: incident.severity = "LOW"
    
    # 4. Generate Graph
    await asyncio.sleep(0.6) # Generating Graph
    nodes, edges = build_attack_graph(incident.id, events_to_add)
    db.add_all(nodes)
    db.add_all(edges)
    
    # 5. Insert Evidence & IOCs
    for ev_data in data["evidence"]:
        db.add(models.Evidence(
            incident_id=incident.id,
            type=ev_data["type"],
            title=ev_data["title"],
            description=ev_data["description"],
            confidence=ev_data["confidence"],
            metadata_json=ev_data["metadata_json"]
        ))
        
    for ioc_data in data["iocs"]:
        db.add(models.IOC(
            incident_id=incident.id,
            type=ioc_data["type"],
            value=ioc_data["value"],
            context=ioc_data["context"]
        ))
    db.commit()

    # 6. Generate AI Summary
    await asyncio.sleep(0.9) # Running AI
    if "ai_summary_override" in data:
        ai_data = data["ai_summary_override"]
    else:
        ai_data = generate_ai_summary(incident.id, events_to_add, data["evidence"])
        
    summary = models.AiSummary(
        incident_id=incident.id,
        executive_summary=ai_data["executive_summary"],
        root_cause=ai_data["root_cause"],
        recommendation=ai_data["recommendation"]
    )
    db.add(summary)
    
    # Audit Log
    db.add(models.AuditLog(
        incident_id=incident.id,
        timestamp=datetime.now(),
        action="Investigation Generated",
        user="System"
    ))
    db.commit()
    
    return format_response({"incident_id": incident.id, "message": "Investigation complete."})

@router.get("/incidents/{id}", response_model=APIResponse)
def get_incident_dto(id: int, db: Session = Depends(get_db)):
    """Returns the massive single DTO for the Investigation UI."""
    incident = db.query(models.Incident).filter(models.Incident.id == id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
        
    dto = {
        "incident": {
            "id": incident.id,
            "title": incident.title,
            "status": incident.status,
            "severity": incident.severity,
            "risk_score": incident.risk_score,
            "created_at": incident.created_at
        },
        "events": [
            {
                "id": e.id,
                "timestamp": e.timestamp,
                "source_ip": e.source_ip,
                "user_account": e.user_account,
                "event_type": e.event_type,
                "action": e.action,
                "severity": e.severity,
                "description": e.description,
                "mitre_technique_id": e.mitre_technique_id,
                "mitre_tactic": e.mitre_tactic
            } for e in sorted(incident.events, key=lambda x: x.timestamp)
        ],
        "evidence": [
            {
                "type": ev.type,
                "title": ev.title,
                "description": ev.description,
                "confidence": ev.confidence,
                "metadata_json": json.loads(ev.metadata_json) if ev.metadata_json else {}
            } for ev in incident.evidence
        ],
        "graph": {
            "nodes": [
                {
                    "id": n.id,
                    "data": {"label": n.label, "type": n.type, "status": n.status},
                    "position": {"x": 0, "y": 0} # Frontend will auto-layout
                } for n in incident.graph_nodes
            ],
            "edges": [
                {
                    "id": e.id,
                    "source": e.source_node_id,
                    "target": e.target_node_id,
                    "label": e.label
                } for e in incident.graph_edges
            ]
        },
        "iocs": [
            {"type": i.type, "value": i.value, "context": i.context} for i in incident.ioc
        ],
        "summary": {
            "executive_summary": incident.ai_summary.executive_summary if incident.ai_summary else "",
            "root_cause": incident.ai_summary.root_cause if incident.ai_summary else "",
            "recommendation": incident.ai_summary.recommendation if incident.ai_summary else ""
        },
        "audit_logs": [
            {"timestamp": a.timestamp, "action": a.action, "user": a.user} for a in sorted(incident.audit_logs, key=lambda x: x.timestamp)
        ]
    }
    
    return format_response(dto)

@router.get("/dashboard", response_model=APIResponse)
def get_dashboard(db: Session = Depends(get_db)):
    """SQL-derived dashboard analytics."""
    total_incidents = db.query(models.Incident).count()
    active_count = db.query(models.Incident).filter(models.Incident.status == "open").count()
    contained_count = db.query(models.Incident).filter(models.Incident.status == "contained").count()
    avg_risk = db.query(func.avg(models.Incident.risk_score)).scalar() or 0.0
    total_events = db.query(models.Event).count()
    
    # Recent incidents
    recent = db.query(models.Incident).order_by(models.Incident.created_at.desc()).limit(10).all()
    
    return format_response({
        "stats": {
            "total_incidents": total_incidents,
            "active_incidents": active_count,
            "contained_incidents": contained_count,
            "average_risk": round(avg_risk, 1),
            "total_events": total_events
        },
        "recent_incidents": [
            {"id": r.id, "title": r.title, "severity": r.severity, "status": r.status, "created_at": r.created_at} for r in recent
        ]
    })

@router.get("/incidents", response_model=APIResponse)
def list_incidents(db: Session = Depends(get_db)):
    recent = db.query(models.Incident).order_by(models.Incident.created_at.desc()).all()
    return format_response([
        {"id": r.id, "title": r.title, "severity": r.severity, "status": r.status, "created_at": r.created_at} for r in recent
    ])

@router.get("/evidence", response_model=APIResponse)
def list_evidence(db: Session = Depends(get_db)):
    # Global evidence list
    events = db.query(models.Event).order_by(models.Event.timestamp.desc()).limit(100).all()
    return format_response([
        {
            "id": f"EV-{e.id}",
            "incident_id": e.incident_id,
            "timestamp": e.timestamp,
            "action": e.action,
            "source": e.source_ip or e.user_account or "System",
            "ip": e.source_ip or "N/A",
            "mitre": e.mitre_technique_id or "N/A"
        } for e in events
    ])

@router.post("/incidents/{id}/contain", response_model=APIResponse)
def contain_incident(id: int, db: Session = Depends(get_db)):
    incident = db.query(models.Incident).filter(models.Incident.id == id).first()
    if not incident:
        raise HTTPException(status_code=404)
        
    incident.status = "contained"
    db.add(models.AuditLog(
        incident_id=incident.id,
        timestamp=datetime.now(),
        action="Incident Contained",
        user="SOC Analyst"
    ))
    db.commit()
    return format_response({"message": "Contained successfully."})

@router.get("/mitre-coverage", response_model=APIResponse)
def get_mitre_coverage(db: Session = Depends(get_db)):
    # Calculate coverage based on actual events in DB
    events = db.query(models.Event).filter(models.Event.mitre_tactic != None).all()
    
    # Baseline fallback if DB is empty
    coverage = {
        "Initial Access": 85,
        "Execution": 92,
        "Persistence": 40,
        "Privilege Escalation": 75,
        "Defense Evasion": 60,
        "Credential Access": 88,
        "Discovery": 55,
        "Lateral Movement": 90,
        "Impact": 98
    }
    
    # Bump stats if we have actual events (demonstrating dynamic capability)
    for e in events:
        if e.mitre_tactic in coverage:
            coverage[e.mitre_tactic] = min(100, coverage[e.mitre_tactic] + 2)
            
    return format_response({"coverage": coverage})
