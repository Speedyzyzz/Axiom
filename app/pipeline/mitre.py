from app.pipeline.enrichment import EnrichedEvent
from pydantic import BaseModel

from typing import Optional

class MitreEvent(EnrichedEvent):
    mitre_technique_id: Optional[str] = None
    mitre_tactic: Optional[str] = None

def map_mitre_techniques(events: list[EnrichedEvent]) -> list[MitreEvent]:
    """
    Simulates a MITRE ATT&CK Mapping Engine.
    Correlates raw actions to specific adversary techniques.
    """
    mapped = []
    
    MITRE_MAP = {
        "VPN Tunnel Established": {"id": "T1133", "tactic": "Initial Access"},
        "New Device Fingerprinted": {"id": "T1082", "tactic": "Discovery"},
        "privilege_escalation": {"id": "T1068", "tactic": "Privilege Escalation"},
        "db_access": {"id": "T1530", "tactic": "Collection"},
        "Beneficiary Created": {"id": "T1136", "tactic": "Persistence"},
        "powershell_execution": {"id": "T1059.001", "tactic": "Execution"},
        "credential_dump": {"id": "T1003", "tactic": "Credential Access"},
        "Lateral Movement": {"id": "T1021", "tactic": "Lateral Movement"},
        "Wire Transfer Initiated": {"id": "TA0040", "tactic": "Impact"},
    }
    
    for ev in events:
        me = MitreEvent(**ev.model_dump())
        
        if ev.action in MITRE_MAP:
            me.mitre_technique_id = MITRE_MAP[ev.action]["id"]
            me.mitre_tactic = MITRE_MAP[ev.action]["tactic"]
            
        mapped.append(me)
        
    return mapped
