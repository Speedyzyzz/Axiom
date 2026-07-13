from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class EvidenceItem(BaseModel):
    description: str

class IncidentResponseData(BaseModel):
    incident_title: str
    root_cause: str
    confidence: int
    business_impact: str
    evidence: List[str]
    recommended_action: str
    timeline: List['TimelineEvent'] = []


class APIResponse(BaseModel):
    status: str
    data: Any
    meta: dict = {}
    
class TimelineEvent(BaseModel):
    time: datetime
    type: str
    details: str

class ActionRequest(BaseModel):
    action: str
