import random
import json
from datetime import datetime, timedelta
from typing import Dict, Any

from app.scenarios.base import BaseScenario
from app.scenarios.utils import (
    get_random_ip, get_random_internal_ip, get_random_user, 
    get_random_ransomware, get_random_hash, get_random_timestamp_sequence,
    generate_ai_summary_variations, get_random_asset
)

class RansomwareScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        seq = get_random_timestamp_sequence(count=5, gap_minutes=(2, 10))
        
        user = get_random_user()
        ransomware_family = get_random_ransomware()
        malware_hash = get_random_hash()
        
        subjects = ["Urgent: Overdue Invoice", "Payroll Update Q3", "Action Required: Account Suspension", "FedEx Delivery Failure"]
        subject = random.choice(subjects)
        extensions = [".locked", ".crypt", ".enc", f".{ransomware_family.lower()[:4]}"]
        ext = random.choice(extensions)
        files_encrypted = random.randint(2500, 45000)
        
        workstation_ip = get_random_internal_ip()
        target_asset = get_random_asset()
        malicious_domain = f"http://{get_random_hash()[:8]}.com/payload.exe"
        
        events = [
            {
                "timestamp": seq[0],
                "source_ip": workstation_ip,
                "user_account": user,
                "event_type": "Email Link Clicked",
                "action": "Phishing URL Visited",
                "severity": "LOW",
                "description": f"User {user} clicked on a link in an external email with subject '{subject}'.",
                "mitre_technique_id": "T1566.002",
                "mitre_tactic": "Initial Access"
            },
            {
                "timestamp": seq[1],
                "source_ip": workstation_ip,
                "user_account": user,
                "event_type": "File Download",
                "action": "Executable Downloaded",
                "severity": "MEDIUM",
                "description": f"Downloaded executable payload from {malicious_domain}.",
                "mitre_technique_id": "T1204.002",
                "mitre_tactic": "Execution"
            },
            {
                "timestamp": seq[2],
                "source_ip": workstation_ip,
                "user_account": "SYSTEM",
                "event_type": "Process Execution",
                "action": "vssadmin.exe Delete Shadows",
                "severity": "HIGH",
                "description": "Shadow volume copies deleted to prevent recovery.",
                "mitre_technique_id": "T1490",
                "mitre_tactic": "Impact"
            },
            {
                "timestamp": seq[3],
                "source_ip": workstation_ip,
                "user_account": "SYSTEM",
                "event_type": "Lateral Movement",
                "action": "SMB Scanning",
                "severity": "HIGH",
                "description": f"Host scanning local subnet for open SMB shares, targeting {target_asset}.",
                "mitre_technique_id": "T1046",
                "mitre_tactic": "Discovery"
            },
            {
                "timestamp": seq[4],
                "source_ip": workstation_ip,
                "user_account": "SYSTEM",
                "event_type": "File Modification",
                "action": "Mass File Encryption",
                "severity": "CRITICAL",
                "description": f"Rapid encryption of {files_encrypted} files on {target_asset} with {ext} extension.",
                "mitre_technique_id": "T1486",
                "mitre_tactic": "Impact"
            }
        ]
        
        evidence = [
            {
                "type": "Process Creation",
                "title": "Shadow Copy Deletion",
                "description": "Command line: vssadmin.exe Delete Shadows /All /Quiet",
                "confidence": "Very High",
                "metadata_json": json.dumps({"cmd": "vssadmin.exe Delete Shadows /All /Quiet"})
            },
            {
                "type": "File IO Anomaly",
                "title": "High Entropy Files Created",
                "description": f"Creation of many files with {ext} extension and high entropy matching {ransomware_family} behavior.",
                "confidence": "High",
                "metadata_json": json.dumps({"extension": ext, "count": files_encrypted})
            }
        ]
        
        iocs = [
            {"type": "Hash", "value": malware_hash, "context": f"{ransomware_family} Payload"},
            {"type": "URL", "value": malicious_domain, "context": "Malware Host"}
        ]
        
        ai_context = {
            "ransomware": ransomware_family,
            "asset": target_asset,
            "user": user,
            "files_count": files_encrypted
        }
        ai_summary = generate_ai_summary_variations("ransomware", ai_context)
        
        return {
            "title": f"Ransomware Execution ({ransomware_family})",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": ai_summary
        }
