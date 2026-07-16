import random
import json
from typing import Dict, Any

from app.scenarios.base import BaseScenario
from app.scenarios.utils import (
    get_random_ip, get_random_internal_ip, get_random_user, 
    get_random_asset, get_random_timestamp_sequence,
    generate_ai_summary_variations, get_random_hash
)

class SupplyChainScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        seq = get_random_timestamp_sequence(count=5, gap_minutes=(30, 240))
        
        user = get_random_user()
        c2_ip = get_random_ip()
        build_server_ip = get_random_internal_ip()
        target_asset = get_random_asset()
        malicious_hash = get_random_hash()
        
        events = [
            {
                "timestamp": seq[0],
                "source_ip": build_server_ip,
                "user_account": "SYSTEM",
                "event_type": "Software Update",
                "action": "Vendor Package Installed",
                "severity": "LOW",
                "description": "Legitimate automated update of third-party monitoring agent.",
                "mitre_technique_id": "T1195.002",
                "mitre_tactic": "Initial Access"
            },
            {
                "timestamp": seq[1],
                "source_ip": build_server_ip,
                "user_account": "SYSTEM",
                "event_type": "C2 Communication",
                "action": "Malicious Beaconing",
                "severity": "HIGH",
                "description": f"Monitoring agent process initiated outbound beaconing to known C2 infrastructure ({c2_ip}).",
                "mitre_technique_id": "T1105",
                "mitre_tactic": "Command and Control"
            },
            {
                "timestamp": seq[2],
                "source_ip": build_server_ip,
                "user_account": "SYSTEM",
                "event_type": "Persistence",
                "action": "Scheduled Task Created",
                "severity": "HIGH",
                "description": "Attacker created a scheduled task masquerading as a legitimate service.",
                "mitre_technique_id": "T1053.005",
                "mitre_tactic": "Persistence"
            },
            {
                "timestamp": seq[3],
                "source_ip": build_server_ip,
                "user_account": user,
                "event_type": "Credential Dump",
                "action": "LSASS Memory Dump",
                "severity": "CRITICAL",
                "description": "Process injection used to dump LSASS memory and steal domain credentials.",
                "mitre_technique_id": "T1003.001",
                "mitre_tactic": "Credential Access"
            },
            {
                "timestamp": seq[4],
                "source_ip": build_server_ip,
                "user_account": user,
                "event_type": "Lateral Movement",
                "action": "Pass the Hash",
                "severity": "CRITICAL",
                "description": f"Stolen credentials used to authenticate to {target_asset} via SMB.",
                "mitre_technique_id": "T1550.002",
                "mitre_tactic": "Lateral Movement"
            }
        ]
        
        evidence = [
            {
                "type": "Network Anomaly",
                "title": "C2 Beaconing",
                "description": f"Consistent outbound connections over port 443 to {c2_ip} lacking standard TLS SNI.",
                "confidence": "Very High",
                "metadata_json": json.dumps({"destination_ip": c2_ip, "port": 443, "frequency": "Every 5 minutes"})
            },
            {
                "type": "Process Anomaly",
                "title": "Suspicious Memory Access",
                "description": "Monitoring agent executable requested SeDebugPrivilege and accessed lsass.exe.",
                "confidence": "High",
                "metadata_json": json.dumps({"source_process": "monitor_agent.exe", "target_process": "lsass.exe", "privilege": "SeDebugPrivilege"})
            }
        ]
        
        iocs = [
            {"type": "IP", "value": c2_ip, "context": "Command and Control Server"},
            {"type": "Hash", "value": malicious_hash, "context": "Backdoored DLL Component"}
        ]
        
        ai_context = {
            "asset": target_asset,
            "user": user
        }
        ai_summary = generate_ai_summary_variations("supply_chain", ai_context)
        
        return {
            "title": "Supply Chain Compromise & Lateral Movement",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": ai_summary
        }
