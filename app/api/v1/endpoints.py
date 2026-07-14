from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import time
import json
import asyncio

from app.database.connection import get_db
from app.schemas.responses import APIResponse, ActionRequest
from app.seed.scenario import run_seed
from app.investigation.engine import run_investigation_pipeline
from app.services import incident_service
from app.utils.logger import log
from app.models import models
from app.pipeline.graph import generate_evidence_graph
from app.pipeline.graph import generate_evidence_graph
router = APIRouter(tags=["Incident Response & SOC"])

def format_response(data, status="success", meta=None) -> APIResponse:
    return APIResponse(status=status, data=data, meta=meta or {})

@router.get("/health", response_model=APIResponse)
def health_check():
    return format_response({
        "status": "ok",
        "pipeline": "active",
        "modules": ["ingestion", "enrichment", "correlation", "mitre", "scoring", "llm_investigation"],
        "version": "2.0.0-enterprise"
    })

@router.get("/dashboard", response_model=APIResponse)
def get_dashboard(db: Session = Depends(get_db)):
    try:
        stats = incident_service.get_dashboard_stats(db)
        return format_response({"kpis": stats})
    except Exception as e:
        log.error(f"Dashboard endpoint error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/incidents", response_model=APIResponse)
def list_incidents(db: Session = Depends(get_db)):
    try:
        data = incident_service.get_all_incidents(db)
        return format_response(data)
    except Exception as e:
        log.error(f"List incidents error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/incidents/{id}", response_model=APIResponse)
def get_incident(id: int, db: Session = Depends(get_db)):
    try:
        data = incident_service.get_incident_with_timeline(db, id)
        return format_response(data)
    except Exception as e:
        if type(e).__name__ == "IncidentNotFound":
            raise HTTPException(status_code=404, detail="Incident not found")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/timeline/{id}", response_model=APIResponse)
def get_timeline(id: int, db: Session = Depends(get_db)):
    try:
        report = incident_service.get_incident_with_timeline(db, id)
        return format_response(report["attack_chain"])
    except Exception as e:
        if type(e).__name__ == "IncidentNotFound":
            raise HTTPException(status_code=404, detail="Incident not found")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/attack-chain/{id}", response_model=APIResponse)
def get_attack_chain_report(id: int, db: Session = Depends(get_db)):
    try:
        report = incident_service.get_incident_with_timeline(db, id)
        return format_response(report)
    except Exception as e:
        if type(e).__name__ == "IncidentNotFound":
            raise HTTPException(status_code=404, detail="Incident not found")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.post("/incidents/{id}/action", response_model=APIResponse)
def take_action(id: int, req: ActionRequest, db: Session = Depends(get_db)):
    try:
        incident = incident_service.take_action_on_incident(db, id, req.action)
        return format_response({"message": f"Action '{req.action}' recorded", "status": incident.status})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/demo/reset", response_model=APIResponse)
def reset_demo(db: Session = Depends(get_db)):
    try:
        user_id = run_seed()
        run_investigation_pipeline(db, user_id)
        
        incidents = incident_service.get_all_incidents(db)
        if not incidents:
            return format_response({"message": "Pipeline ran but no incidents crossed threshold"})
            
        incident = incidents[0]
        timeline = incident_service.get_incident_with_timeline(db, incident["id"])["attack_chain"]
        
        return format_response({
            "incident_created": True,
            "pipeline_stages_executed": 6,
            "timeline_events": len(timeline),
            "confidence": incident["confidence_score"]
        })
    except Exception as e:
        log.error(f"Demo reset error: {e}")
        raise HTTPException(status_code=500, detail="Failed to run AI Pipeline")

@router.get("/demo/stream")
async def stream_investigation(request: Request):
    """
    Simulates a live streaming investigation via Server-Sent Events (SSE).
    Hardcoded for a flawless, deterministic 5-minute hackathon presentation.
    """
    async def event_generator():
        stages = [
            {"step": "Initializing Investigation Engine...", "delay": 1.0},
            {"step": "Normalizing 1,248 security events...", "delay": 1.5},
            {"step": "Found 14 authentication anomalies...", "delay": 1.2},
            {"step": "Detected impossible travel (VPN connection).", "delay": 1.5},
            {"step": "Correlating VPN session to Endpoint...", "delay": 2.0},
            {"step": "Graph expanded to 8 connected entities.", "delay": 1.5},
            {"step": "Mapping to MITRE ATT&CK Framework...", "delay": 1.5},
            {"step": "Privilege escalation confirmed via PowerShell.", "delay": 1.8},
            {"step": "Threat confidence increased to 91%.", "delay": 1.2},
            {"step": "Generating executive summary...", "delay": 2.5},
            {"step": "Investigation Complete.", "delay": 0.5}
        ]
        
        for stage in stages:
            if await request.is_disconnected():
                break
            await asyncio.sleep(stage["delay"])
            yield f"data: {json.dumps({'message': stage['step']})}\n\n"
            
    return StreamingResponse(event_generator(), media_type="text/event-stream")

@router.get("/graph/{id}", response_model=APIResponse)
def get_attack_chain_graph(id: int, db: Session = Depends(get_db)):
    """
    Returns the React Flow formatted nodes and edges for the Evidence Graph.
    (Mocked wrapper since the DB currently doesn't store the full AttackChain object).
    """
    incident = incident_service.get_incident_with_timeline(db, id)
    
    # We rebuild a mock AttackChain just to pass to our graph generator
    from app.pipeline.correlation import AttackChain
    from app.pipeline.mitre import MitreEvent
    from datetime import datetime
    
    mock_events = []
    for ev in incident["attack_chain"]:
        me = MitreEvent(
            timestamp=datetime.fromisoformat(ev["timestamp"]) if "timestamp" in ev else datetime.now(),
            event_type="security",
            source=ev.get("source", "Unknown"),
            user_id=1,
            ip=ev.get("ip"),
            action=ev.get("action", "Unknown"),
            raw_id=0,
            raw_table="mock",
            is_malicious=ev.get("is_malicious", False),
            mitre_technique_id=ev.get("mitre")
        )
        # Mock tactic based on technique
        if me.mitre_technique_id == "T1059.001": me.mitre_tactic = "Execution"
        elif me.mitre_technique_id == "T1133": me.mitre_tactic = "Initial Access"
        elif me.mitre_technique_id == "TA0040": me.mitre_tactic = "Impact"
        
        mock_events.append(me)
        
    chain = AttackChain(user_id=1, events=mock_events, is_critical=True)
    graph_data = generate_evidence_graph(chain)
    
    return format_response(graph_data)

from pydantic import BaseModel
class ChatRequest(BaseModel):
    query: str
    incident_id: int

@router.post("/chat")
def ai_chat(req: ChatRequest, db: Session = Depends(get_db)):
    """
    RAG Endpoint: Uses the incident JSON as context for the LLM to answer questions.
    """
    try:
        incident = incident_service.get_incident_with_timeline(db, req.incident_id)
        
        prompt = f"""
        You are an AI SOC Analyst responding to a human analyst's question.
        Use the following structured incident data as context to answer the question.
        
        CONTEXT (JSON):
        {json.dumps(incident, default=str)}
        
        QUESTION: {req.query}
        
        Answer professionally, concisely, and exclusively based on the provided context.
        """
        
        raise NotImplementedError("LLM call not implemented")
        return format_response({"answer": answer})
    except Exception as e:
        log.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to query AI")

@router.get("/mitre-coverage", response_model=APIResponse)
def get_mitre_coverage(db: Session = Depends(get_db)):
    """Simulates retrieving global MITRE ATT&CK coverage stats"""
    return format_response({
        "coverage": {
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
    })

@router.get("/analytics/risk", response_model=APIResponse)
def get_risk_distribution(db: Session = Depends(get_db)):
    """Simulates Dashboard Analytics"""
    return format_response({
        "distribution": {
            "Critical": 12,
            "High": 45,
            "Medium": 128,
            "Low": 340
        }
    })
