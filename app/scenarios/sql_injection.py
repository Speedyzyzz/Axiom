import random
import json
from typing import Dict, Any

from app.scenarios.base import BaseScenario
from app.scenarios.utils import (
    get_random_ip, get_random_internal_ip, get_random_user, 
    get_random_asset, get_random_timestamp_sequence,
    generate_ai_summary_variations
)

class SqlInjectionScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        seq = get_random_timestamp_sequence(count=4, gap_minutes=(1, 5))
        
        malicious_ip = get_random_ip()
        web_server_ip = get_random_internal_ip()
        target_asset = get_random_asset()
        
        rows_exported = random.randint(50000, 500000)
        
        events = [
            {
                "timestamp": seq[0],
                "source_ip": malicious_ip,
                "user_account": "Anonymous",
                "event_type": "WAF Alert",
                "action": "Suspicious Payload Blocked",
                "severity": "LOW",
                "description": "WAF blocked initial basic SQL injection attempts.",
                "mitre_technique_id": "T1190",
                "mitre_tactic": "Initial Access"
            },
            {
                "timestamp": seq[1],
                "source_ip": malicious_ip,
                "user_account": "Anonymous",
                "event_type": "WAF Bypass",
                "action": "Encoded Payload Accepted",
                "severity": "HIGH",
                "description": "Attacker successfully bypassed WAF using hex-encoded SQLmap payload.",
                "mitre_technique_id": "T1562.001",
                "mitre_tactic": "Defense Evasion"
            },
            {
                "timestamp": seq[2],
                "source_ip": web_server_ip,
                "user_account": "svc_web",
                "event_type": "Database Access",
                "action": "Unauthorized Table Dump",
                "severity": "CRITICAL",
                "description": f"Backend web service account executed bulk SELECT on {target_asset}. {rows_exported} rows returned.",
                "mitre_technique_id": "T1046",
                "mitre_tactic": "Collection"
            },
            {
                "timestamp": seq[3],
                "source_ip": web_server_ip,
                "user_account": "svc_web",
                "event_type": "Exfiltration",
                "action": "DNS Tunneling Detected",
                "severity": "CRITICAL",
                "description": "Massive spike in TXT record DNS queries to attacker-controlled nameserver.",
                "mitre_technique_id": "T1048.003",
                "mitre_tactic": "Exfiltration"
            }
        ]
        
        evidence = [
            {
                "type": "Network Anomaly",
                "title": "DNS Tunneling",
                "description": "Unusually high volume of DNS TXT queries containing encoded data.",
                "confidence": "High",
                "metadata_json": json.dumps({"query_type": "TXT", "queries_per_sec": random.randint(150, 400)})
            },
            {
                "type": "Database Anomaly",
                "title": "Massive Data Read",
                "description": f"Service account svc_web read {rows_exported} rows from {target_asset}.",
                "confidence": "Very High",
                "metadata_json": json.dumps({"rows": rows_exported, "account": "svc_web"})
            }
        ]
        
        iocs = [
            {"type": "IP", "value": malicious_ip, "context": "Attacker Source IP"},
            {"type": "Domain", "value": "dns-tunnel.evil-domain.com", "context": "DNS Exfiltration Target"}
        ]
        
        ai_context = {
            "asset": target_asset,
            "volume": rows_exported
        }
        ai_summary = generate_ai_summary_variations("sqli", ai_context)
        
        return {
            "title": f"SQL Injection & DNS Exfiltration ({target_asset})",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": ai_summary
        }
