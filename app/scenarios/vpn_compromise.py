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

class VpnCompromiseScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        seq = get_random_timestamp_sequence(count=6, gap_minutes=(1, 15))
        
        user = get_random_user()
        country = get_random_country()
        malicious_ip = get_random_ip()
        internal_ip = get_random_internal_ip()
        target_asset = get_random_asset()
        
        exfil_gb = round(random.uniform(0.5, 50.0), 1)
        rows_exported = random.randint(5000, 250000)
        
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
                "source_ip": malicious_ip,
                "user_account": user,
                "event_type": "VPN Access",
                "action": "VPN Connection Established",
                "severity": "MEDIUM",
                "description": f"VPN connection established from foreign IP address in {country}.",
                "mitre_technique_id": "T1078",
                "mitre_tactic": "Initial Access"
            },
            {
                "timestamp": seq[2],
                "source_ip": malicious_ip,
                "user_account": user,
                "event_type": "Authentication",
                "action": "Kerberos Ticket Requested",
                "severity": "MEDIUM",
                "description": "Service ticket requested for domain controller.",
                "mitre_technique_id": "T1558",
                "mitre_tactic": "Credential Access"
            },
            {
                "timestamp": seq[3],
                "source_ip": malicious_ip,
                "user_account": "admin_svc",
                "event_type": "Privilege Escalation",
                "action": "Switch to Service Account",
                "severity": "HIGH",
                "description": "Attacker pivoted to highly privileged service account (admin_svc).",
                "mitre_technique_id": "T1078.003",
                "mitre_tactic": "Privilege Escalation"
            },
            {
                "timestamp": seq[4],
                "source_ip": get_random_internal_ip(),
                "user_account": "admin_svc",
                "event_type": "Database Access",
                "action": "SQL DB Bulk Export",
                "severity": "CRITICAL",
                "description": f"Massive SELECT query detected against {target_asset}. {rows_exported} rows exported.",
                "mitre_technique_id": "T1046",
                "mitre_tactic": "Collection"
            },
            {
                "timestamp": seq[5],
                "source_ip": malicious_ip,
                "user_account": "admin_svc",
                "event_type": "Exfiltration",
                "action": "Data Transfer over HTTPS",
                "severity": "CRITICAL",
                "description": f"{exfil_gb}GB of encrypted data transferred to external destination in {country}.",
                "mitre_technique_id": "T1048",
                "mitre_tactic": "Exfiltration"
            }
        ]
        
        evidence = [
            {
                "type": "Geo Mismatch",
                "title": "Impossible Travel",
                "description": f"Login from local IP ({internal_ip}) and foreign IP in {country} within a short timeframe.",
                "confidence": "High",
                "metadata_json": json.dumps({"local": internal_ip, "foreign": malicious_ip, "country": country})
            },
            {
                "type": "Volume Anomaly",
                "title": "Excessive Database Reads",
                "description": f"{rows_exported} rows exported from {target_asset} in a single transaction. Baseline is <100 rows.",
                "confidence": "Very High",
                "metadata_json": json.dumps({"rows": rows_exported, "asset": target_asset, "baseline": 100})
            }
        ]
        
        iocs = [
            {"type": "IP", "value": malicious_ip, "context": "VPN Ingress Node"},
            {"type": "User", "value": user, "context": "Compromised Employee"},
            {"type": "User", "value": "admin_svc", "context": "Pivoted Service Account"}
        ]
        
        # We attach AI summary generation here so it's deeply randomized and fits the context
        ai_context = {
            "country": country,
            "ip": malicious_ip,
            "user": user,
            "asset": target_asset
        }
        ai_summary = generate_ai_summary_variations("vpn", ai_context)
        
        return {
            "title": f"VPN Credential Compromise & Data Exfiltration ({country})",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": ai_summary # We will use this in endpoints.py
        }
