from typing import Any
from app.pipeline.ingestion import UniversalEvent

class EnrichedEvent(UniversalEvent):
    threat_intel: dict[str, Any] = {}
    is_malicious: bool = False

def enrich_events(events: list[UniversalEvent]) -> list[EnrichedEvent]:
    """
    Simulates Threat Intelligence Engine (e.g. VirusTotal, AlienVault).
    Looks up IPs and tags known malicious actors.
    """
    enriched = []
    
    # Mock Threat Intel Database
    KNOWN_BAD_IPS = {
        "185.15.59.224": {"country": "RU", "asn": "AS49505", "score": 95, "tags": ["vpn_node", "tor_exit"]},
        "193.106.191.87": {"country": "RU", "asn": "AS49505", "score": 90, "tags": ["botnet"]},
        "45.155.205.133": {"country": "RU", "asn": "AS49505", "score": 98, "tags": ["vpn_node"]},
    }
    
    for ev in events:
        ee = EnrichedEvent(**ev.model_dump())
        
        if ev.ip and ev.ip in KNOWN_BAD_IPS:
            ee.threat_intel = KNOWN_BAD_IPS[ev.ip]
            ee.is_malicious = True
            
        enriched.append(ee)
        
    return enriched
