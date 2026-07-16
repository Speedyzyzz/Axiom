import random
import json
from datetime import datetime, timedelta
from typing import Dict, Any

from app.scenarios.base import BaseScenario
from app.scenarios.utils import (
    get_random_ip, get_random_internal_ip, get_random_user, 
    get_random_country, get_random_asset, get_random_timestamp_sequence,
    generate_ai_summary_variations
)

class InsiderThreatScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        seq = get_random_timestamp_sequence(count=4, gap_minutes=(5, 30))
        
        user = get_random_user()
        internal_ip = get_random_internal_ip()
        roles = ["Marketing", "HR", "Sales", "Finance", "Customer Support"]
        role = random.choice(roles)
        domains = ["dropbox.com", "drive.google.com", "onedrive.live.com", "mega.nz", "box.com", "we.tl"]
        domain = random.choice(domains)
        target_asset = get_random_asset()
        data_gb = round(random.uniform(2.5, 85.0), 1)
        
        events = [
            {
                "timestamp": seq[0],
                "source_ip": internal_ip,
                "user_account": user,
                "event_type": "Login",
                "action": "Successful local AD login",
                "severity": "LOW",
                "description": f"Standard start of day authentication for {user}.",
                "mitre_technique_id": None,
                "mitre_tactic": None
            },
            {
                "timestamp": seq[1],
                "source_ip": internal_ip,
                "user_account": user,
                "event_type": "Access",
                "action": "Accessed Restricted Asset",
                "severity": "MEDIUM",
                "description": f"User accessed {target_asset} outside of standard {role} role.",
                "mitre_technique_id": "T1083",
                "mitre_tactic": "Discovery"
            },
            {
                "timestamp": seq[2],
                "source_ip": internal_ip,
                "user_account": user,
                "event_type": "Data Staging",
                "action": "Created ZIP Archive",
                "severity": "HIGH",
                "description": f"Archived {data_gb}GB of sensitive data into a local temp directory.",
                "mitre_technique_id": "T1074.001",
                "mitre_tactic": "Collection"
            },
            {
                "timestamp": seq[3],
                "source_ip": internal_ip,
                "user_account": user,
                "event_type": "Exfiltration",
                "action": "Upload to Personal Cloud",
                "severity": "CRITICAL",
                "description": f"Data transfer to unauthorized {domain} detected. Volume: {data_gb}GB.",
                "mitre_technique_id": "T1567.002",
                "mitre_tactic": "Exfiltration"
            }
        ]
        
        evidence = [
            {
                "type": "Policy Violation",
                "title": "Unauthorized Asset Access",
                "description": f"User is in {role} but accessed {target_asset}.",
                "confidence": "High",
                "metadata_json": json.dumps({"role": role, "asset": target_asset})
            },
            {
                "type": "Network Anomaly",
                "title": "Cloud Upload",
                "description": f"{data_gb}GB uploaded to {domain} which violates DLP policy.",
                "confidence": "High",
                "metadata_json": json.dumps({"bytes_up": int(data_gb * 1000000000), "domain": domain})
            }
        ]
        
        iocs = [
            {"type": "Domain", "value": f"api.{domain}", "context": "Exfiltration Destination"},
            {"type": "User", "value": user, "context": "Insider Threat Actor"}
        ]
        
        ai_context = {
            "user": user,
            "volume": data_gb,
            "asset": target_asset,
            "domain": domain
        }
        ai_summary = generate_ai_summary_variations("insider", ai_context)
        
        return {
            "title": f"Insider Threat: Data Exfiltration ({role})",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": ai_summary
        }
