import random
import json
from typing import Dict, Any

from app.scenarios.base import BaseScenario
from app.scenarios.utils import (
    get_random_ip, get_random_user, get_random_timestamp_sequence,
    generate_ai_summary_variations, get_random_asset
)

class OauthPhishingScenario(BaseScenario):
    def generate(self) -> Dict[str, Any]:
        seq = get_random_timestamp_sequence(count=5, gap_minutes=(5, 60))
        
        user = get_random_user()
        malicious_ip = get_random_ip()
        target_asset = get_random_asset()
        
        inbox_rules_count = random.randint(2, 7)
        
        events = [
            {
                "timestamp": seq[0],
                "source_ip": malicious_ip,
                "user_account": user,
                "event_type": "Email Link Clicked",
                "action": "AiTM Phishing Page Visited",
                "severity": "MEDIUM",
                "description": f"User {user} visited a known Adversary-in-the-Middle phishing domain.",
                "mitre_technique_id": "T1566.002",
                "mitre_tactic": "Initial Access"
            },
            {
                "timestamp": seq[1],
                "source_ip": malicious_ip,
                "user_account": user,
                "event_type": "OAuth Grant",
                "action": "Malicious App Consent",
                "severity": "HIGH",
                "description": "User granted read/write permissions to unverified third-party application.",
                "mitre_technique_id": "T1528",
                "mitre_tactic": "Credential Access"
            },
            {
                "timestamp": seq[2],
                "source_ip": malicious_ip,
                "user_account": "OAuth_App_Service",
                "event_type": "Persistence",
                "action": "Inbox Rule Created",
                "severity": "HIGH",
                "description": f"Malicious app created {inbox_rules_count} hidden forwarding rules in user's mailbox.",
                "mitre_technique_id": "T1114.003",
                "mitre_tactic": "Persistence"
            },
            {
                "timestamp": seq[3],
                "source_ip": malicious_ip,
                "user_account": "OAuth_App_Service",
                "event_type": "Access",
                "action": "SharePoint Enumeration",
                "severity": "MEDIUM",
                "description": f"OAuth token used to enumerate sensitive files on {target_asset}.",
                "mitre_technique_id": "T1083",
                "mitre_tactic": "Discovery"
            },
            {
                "timestamp": seq[4],
                "source_ip": malicious_ip,
                "user_account": "OAuth_App_Service",
                "event_type": "Exfiltration",
                "action": "Graph API Data Download",
                "severity": "CRITICAL",
                "description": "High volume of confidential documents downloaded via Microsoft Graph API.",
                "mitre_technique_id": "T1048",
                "mitre_tactic": "Exfiltration"
            }
        ]
        
        evidence = [
            {
                "type": "OAuth Anomaly",
                "title": "Illicit Consent Grant",
                "description": "Application requested high-privilege scopes: Mail.ReadWrite, Files.Read.All",
                "confidence": "High",
                "metadata_json": json.dumps({"app_name": "Productivity Booster Plus", "scopes": ["Mail.ReadWrite", "Files.Read.All"]})
            },
            {
                "type": "Configuration Anomaly",
                "title": "Hidden Inbox Rules",
                "description": f"Creation of {inbox_rules_count} rules moving incoming security alerts to RSS Subscriptions folder.",
                "confidence": "Very High",
                "metadata_json": json.dumps({"rules_count": inbox_rules_count, "target_folder": "RSS Subscriptions"})
            }
        ]
        
        iocs = [
            {"type": "Domain", "value": "login.microsoftonline-verify.com", "context": "AiTM Phishing Domain"},
            {"type": "App ID", "value": "a4b5c6d7-1234-abcd-9876-ef1234567890", "context": "Malicious OAuth Client"}
        ]
        
        ai_context = {
            "user": user,
            "asset": target_asset,
            "rules": inbox_rules_count
        }
        ai_summary = generate_ai_summary_variations("phishing", ai_context)
        
        return {
            "title": f"OAuth Consent Phishing & Token Theft ({user})",
            "events": events,
            "evidence": evidence,
            "iocs": iocs,
            "ai_summary_override": ai_summary
        }
