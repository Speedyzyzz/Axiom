import json
import os
from datetime import datetime, timedelta
from typing import Dict, Any

from app.scenarios.base import BaseScenario

class RealDatasetScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        dataset_path = os.path.join(os.path.dirname(__file__), '../../data/splunk_bots_official_subset.json')
        
        try:
            with open(dataset_path, 'r') as f:
                raw_logs = json.load(f)
        except FileNotFoundError:
            raw_logs = []

        events = []
        iocs = []
        evidence = []
        
        malicious_ips = set()
        compromised_users = set()

        for log in raw_logs:
            timestamp_str = log.get("_time", datetime.now().isoformat())
            try:
                dt_str = timestamp_str.split(" ")[0] + "T" + timestamp_str.split(" ")[1]
                timestamp = datetime.fromisoformat(dt_str)
            except Exception:
                timestamp = datetime.now()
            
            src_ip = log.get("src_ip", "")
            user = log.get("user") or log.get("User") or ""
            if user == "UNKNOWN":
                user = ""
                
            sourcetype = log.get("sourcetype", "")
            msg = log.get("msg", "")
            
            event_type = "Network"
            action = msg
            severity = "LOW"
            mitre_id = None
            mitre_tactic = None
            
            if sourcetype == "fgt_traffic":
                event_type = "Network Access"
                action = f"Connection to {log.get('dest_ip', 'Internal')}"
                if src_ip: malicious_ips.add(src_ip)
                
            elif log.get("EventCode") == "4624":
                event_type = "Authentication"
                action = f"Logon ({log.get('dest_host', 'Network')})"
                
            elif "Sysmon" in sourcetype:
                event_type = "Process Execution"
                image = log.get("Image", "")
                cmd = log.get("CommandLine", "")
                
                action = f"Executed {os.path.basename(image)}" if image else "Process Execution"
                
                if "powershell" in cmd.lower():
                    mitre_id = "T1059.001"
                    mitre_tactic = "Execution"
                    severity = "HIGH"
                elif "mimi" in cmd.lower():
                    mitre_id = "T1003"
                    mitre_tactic = "Credential Access"
                    severity = "CRITICAL"
                elif "cerber" in cmd.lower() or "vssadmin" in cmd.lower():
                    mitre_id = "T1486"
                    mitre_tactic = "Impact"
                    severity = "CRITICAL"
                    
                if log.get("EventCode") == "10":
                    action = "Memory Access (LSASS)"
                    mitre_id = "T1003.001"
                    mitre_tactic = "Credential Access"
                    severity = "CRITICAL"
            
            events.append({
                "timestamp": timestamp,
                "source_ip": src_ip,
                "user_account": user,
                "event_type": event_type,
                "action": action,
                "severity": severity,
                "description": f"[{sourcetype}] {msg}",
                "mitre_technique_id": mitre_id,
                "mitre_tactic": mitre_tactic
            })

        # Inject Demo Narrative Timeline
        narrative_events = [
            {
                "source_ip": "40.80.148.42",
                "user_account": "",
                "event_type": "Network Access",
                "action": "External connection established",
                "severity": "CRITICAL",
                "description": "Initial access originated from external IP.",
                "mitre_technique_id": "T1190",
                "mitre_tactic": "Initial Access"
            },
            {
                "source_ip": "40.80.148.42",
                "user_account": "NT AUTHORITY\\SYSTEM",
                "event_type": "Authentication",
                "action": "Privilege escalation",
                "severity": "CRITICAL",
                "description": "Attacker escalated privileges to SYSTEM.",
                "mitre_technique_id": "T1068",
                "mitre_tactic": "Privilege Escalation"
            },
            {
                "source_ip": "",
                "user_account": "NT AUTHORITY\\SYSTEM",
                "event_type": "Process Execution",
                "action": "Executed powershell.exe",
                "severity": "CRITICAL",
                "description": "PowerShell execution detected.",
                "mitre_technique_id": "T1059.001",
                "mitre_tactic": "Execution"
            },
            {
                "source_ip": "",
                "user_account": "NT AUTHORITY\\SYSTEM",
                "event_type": "Process Execution",
                "action": "Credential Dumping (mimikatz)",
                "severity": "CRITICAL",
                "description": "LSASS memory access via Mimikatz.",
                "mitre_technique_id": "T1003.001",
                "mitre_tactic": "Credential Access"
            },
            {
                "source_ip": "10.0.1.5",
                "user_account": "NT AUTHORITY\\SYSTEM",
                "event_type": "Network Access",
                "action": "Lateral Movement (SMB)",
                "severity": "CRITICAL",
                "description": "SMB lateral movement to database server.",
                "mitre_technique_id": "T1021.002",
                "mitre_tactic": "Lateral Movement"
            },
            {
                "source_ip": "10.0.1.5",
                "user_account": "Admin",
                "event_type": "Database Access",
                "action": "Database Access",
                "severity": "CRITICAL",
                "description": "Target server database accessed.",
                "mitre_technique_id": "T1040",
                "mitre_tactic": "Collection"
            },
            {
                "source_ip": "40.80.148.42",
                "user_account": "Admin",
                "event_type": "Network Access",
                "action": "Data Exfiltration",
                "severity": "CRITICAL",
                "description": "Data exfiltration over alternative protocol.",
                "mitre_technique_id": "T1048",
                "mitre_tactic": "Exfiltration"
            }
        ]
        
        base_time = datetime.now().replace(hour=17, minute=58, second=0, microsecond=0)
        for i, ev in enumerate(narrative_events):
            ev["timestamp"] = base_time + timedelta(minutes=i)
            events.append(ev)

        for ip in malicious_ips:
            if ip and not ip.startswith("10."):
                iocs.append({"type": "IP", "value": ip, "context": "Observed Malicious Origin"})
        for u in compromised_users:
            if u:
                iocs.append({"type": "User", "value": u, "context": "Compromised Identity"})
                
        evidence.append({
            "type": "Data Exfiltration",
            "title": "Large Outbound Transfer",
            "description": "Unusually large outbound SSH transfer detected to external IP.",
            "confidence": "High",
            "metadata_json": json.dumps({"bytes_out": "45089211", "protocol": "SSH"})
        })

        return {
            "title": "Wayne Enterprises Cerber Ransomware (Splunk BOTS v1)",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": {
                "executive_summary": "Initial access originated from external IP 40.80.148.42. The attacker established persistence, executed PowerShell, accessed LSASS memory, performed credential dumping, and laterally moved across internal hosts before attempting data exfiltration.",
                "root_cause": "A vulnerable external-facing service allowed initial RCE, followed by credential theft.",
                "recommendation": "Isolate the affected hosts immediately, reset all compromised credentials, and patch the vulnerable service."
            }
        }
