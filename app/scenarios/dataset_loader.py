import json
import os
from datetime import datetime
from typing import Dict, Any

from app.scenarios.base import BaseScenario

class RealDatasetScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        dataset_path = os.path.join(os.path.dirname(__file__), '../../data/splunk_bots_sample.json')
        
        try:
            with open(dataset_path, 'r') as f:
                raw_logs = json.load(f)
        except FileNotFoundError:
            # Fallback if file isn't there
            raw_logs = []

        events = []
        iocs = []
        evidence = []
        
        malicious_ips = set()
        compromised_users = set()

        for log in raw_logs:
            # Extract standard fields
            timestamp = log.get("_time", datetime.now().isoformat())
            if timestamp.endswith("Z"):
                timestamp = timestamp.replace("Z", "+00:00")
            
            src_ip = log.get("src_ip", "")
            user = log.get("user", "")
            if user == "UNKNOWN":
                user = ""
                
            sourcetype = log.get("sourcetype", "")
            msg = log.get("msg", "")
            
            # Derived fields
            event_type = "Network"
            action = msg
            severity = "LOW"
            mitre_id = None
            mitre_tactic = None
            
            # Map based on specific telemetry signatures
            if "VPN" in msg:
                event_type = "VPN Access"
                mitre_id = "T1078"
                mitre_tactic = "Initial Access"
                severity = "MEDIUM"
                if src_ip: malicious_ips.add(src_ip)
                if user: compromised_users.add(user)
                
            elif log.get("EventCode") == "4624":
                event_type = "Authentication"
                action = f"Logon ({log.get('dest_host', 'Network')})"
                
            elif "Sysmon" in sourcetype:
                event_type = "Process Execution"
                action = f"Executed {log.get('Image', log.get('TargetImage', ''))}"
                if "powershell" in log.get("CommandLine", "").lower():
                    mitre_id = "T1059.001"
                    mitre_tactic = "Execution"
                    severity = "HIGH"
                if "lsass" in log.get("TargetImage", "").lower():
                    mitre_id = "T1003.001"
                    mitre_tactic = "Credential Access"
                    severity = "CRITICAL"
                    
            elif "Exfiltration" in msg or log.get("bytes_out"):
                event_type = "Exfiltration"
                mitre_id = "T1048"
                mitre_tactic = "Exfiltration"
                severity = "CRITICAL"
                
            elif "Database" in msg or "tds" in sourcetype:
                event_type = "Database Access"
                mitre_id = "T1046"
                mitre_tactic = "Collection"
                severity = "HIGH"
                if src_ip: malicious_ips.add(src_ip)
            
            events.append({
                "timestamp": datetime.fromisoformat(timestamp),
                "source_ip": src_ip,
                "user_account": user,
                "event_type": event_type,
                "action": action,
                "severity": severity,
                "description": f"[{sourcetype}] {msg}",
                "mitre_technique_id": mitre_id,
                "mitre_tactic": mitre_tactic
            })

        # Generate IOCs from extracted data
        for ip in malicious_ips:
            if ip and not ip.startswith("10."): # Basic heuristic to avoid tagging internal as IOC
                iocs.append({"type": "IP", "value": ip, "context": "Observed Malicious Origin"})
        for u in compromised_users:
            if u:
                iocs.append({"type": "User", "value": u, "context": "Compromised Identity"})
                
        # Generate some evidence based on the dataset
        evidence.append({
            "type": "Data Exfiltration",
            "title": "Large Outbound Transfer",
            "description": "Unusually large outbound SSH transfer detected to external IP.",
            "confidence": "High",
            "metadata_json": json.dumps({"bytes_out": "45089211", "protocol": "SSH"})
        })

        return {
            "title": "Dataset Recon & Exfiltration (Splunk BOTS)",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
        }
