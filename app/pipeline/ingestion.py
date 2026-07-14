from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class UniversalEvent(BaseModel):
    timestamp: datetime
    event_type: str
    source: str
    user_id: Optional[int] = None
    ip: Optional[str] = None
    action: str
    raw_id: int
    raw_table: str
    metadata: dict = {}

def normalize_events(events_dict: dict) -> list[UniversalEvent]:
    """
    Simulates a Log Normalization pipeline (e.g. from Kafka/Splunk).
    Takes disparate ORM models and flattens them into UniversalEvents.
    """
    normalized = []
    
    for l in events_dict.get("login_logs", []):
        normalized.append(UniversalEvent(
            timestamp=l.login_time,
            event_type="login",
            source="Azure AD" if "Azure" in (l.location_city or "") else "Okta",
            user_id=l.user_id,
            ip=l.ip_address,
            action="User Authentication",
            raw_id=l.id,
            raw_table="login_logs",
            metadata={"city": l.location_city, "country": l.location_country}
        ))
        
    for v in events_dict.get("vpn_logs", []):
        normalized.append(UniversalEvent(
            timestamp=v.vpn_login_time,
            event_type="vpn",
            source="Cisco AnyConnect",
            user_id=v.user_id,
            ip=v.source_ip,
            action="VPN Tunnel Established",
            raw_id=v.id,
            raw_table="vpn_logs",
            metadata={"country": v.source_country, "flagged": v.flagged_region}
        ))
        
    for d in events_dict.get("devices", []):
        normalized.append(UniversalEvent(
            timestamp=d.first_seen_at,
            event_type="device",
            source="Endpoint Directory",
            user_id=d.user_id,
            ip=None,
            action="New Device Fingerprinted" if not d.is_known_device else "Legitimate Device Login",
            raw_id=d.id,
            raw_table="devices",
            metadata={"device_type": d.device_type, "fingerprint": d.device_fingerprint, "known": d.is_known_device}
        ))
        
    for s in events_dict.get("security_events", []):
        normalized.append(UniversalEvent(
            timestamp=s.event_time,
            event_type="security",
            source="CrowdStrike Falcon",
            user_id=s.user_id,
            ip=None,
            action=s.event_type,
            raw_id=s.id,
            raw_table="security_events",
            metadata={"resource": s.resource_accessed, "risk_weight": s.risk_weight}
        ))
        
    for b in events_dict.get("beneficiaries", []):
        normalized.append(UniversalEvent(
            timestamp=b.added_at,
            event_type="banking",
            source="Core Banking API",
            user_id=b.added_by_user_id,
            ip=None,
            action="Beneficiary Created",
            raw_id=b.id,
            raw_table="beneficiaries",
            metadata={"name": b.beneficiary_name, "account": b.beneficiary_account}
        ))
        
    b_map = {b.id: b.added_by_user_id for b in events_dict.get("beneficiaries", [])}
    for t in events_dict.get("transactions", []):
        normalized.append(UniversalEvent(
            timestamp=t.transaction_time,
            event_type="banking",
            source="Core Banking API",
            user_id=b_map.get(t.beneficiary_id),
            ip=None,
            action="Wire Transfer Initiated",
            raw_id=t.id,
            raw_table="transactions",
            metadata={"amount": t.amount}
        ))
        
    # Sort chronologically to mimic a stream
    normalized.sort(key=lambda x: x.timestamp)
    return normalized
