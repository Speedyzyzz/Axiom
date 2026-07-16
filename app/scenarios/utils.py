import random
from datetime import datetime, timedelta

def get_random_ip():
    return f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"

def get_random_internal_ip():
    return f"10.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(1, 254)}"

def get_random_user():
    users = ["jsmith", "a.chen", "kumar.r", "admin-temp", "svc-api-01", "m.williams", "j.doe", "e.taylor", "root", "db_admin"]
    return random.choice(users)

def get_random_country():
    countries = ["Russia", "China", "Romania", "Singapore", "North Korea", "Iran", "Brazil", "Netherlands"]
    return random.choice(countries)

def get_random_asset():
    assets = ["Finance DB", "Payroll Server", "HR Portal", "VPN Gateway", "Domain Controller", "Backup Server", "Email Server", "Customer Records DB"]
    return random.choice(assets)

def get_random_ransomware():
    families = ["LockBit 3.0", "BlackCat", "Conti", "Ryuk", "REvil", "Clop", "Phobos"]
    return random.choice(families)

def get_random_hash():
    import hashlib
    import uuid
    return hashlib.sha256(uuid.uuid4().bytes).hexdigest()

def get_random_timestamp_sequence(start_time=None, count=5, gap_minutes=(1, 30)):
    if not start_time:
        start_time = datetime.now() - timedelta(hours=random.randint(1, 48))
    
    sequence = []
    current_time = start_time
    for _ in range(count):
        current_time += timedelta(minutes=random.randint(gap_minutes[0], gap_minutes[1]))
        sequence.append(current_time)
        
    return sequence

def generate_ai_summary_variations(scenario_type: str, context: dict) -> dict:
    if scenario_type == "vpn":
        templates = [
            f"An external attacker from {context.get('country')} compromised the VPN gateway using {context.get('user')}'s credentials, originating from {context.get('ip')}. They accessed the {context.get('asset')}.",
            f"Unauthorized VPN access detected for account {context.get('user')}. The connection mapped to an IP in {context.get('country')} ({context.get('ip')}) and immediately pivoted to the {context.get('asset')}.",
            f"VPN credential theft identified. Actor ({context.get('ip')}, {context.get('country')}) successfully authenticated as {context.get('user')} and targeted the {context.get('asset')}."
        ]
        rc = [
            "Compromised VPN credentials due to lack of MFA.",
            "Credential stuffing attack successful against VPN portal.",
            "Stolen session token reused on VPN gateway."
        ]
    elif scenario_type == "ransomware":
        templates = [
            f"The {context.get('ransomware')} ransomware family infected {context.get('asset')} via {context.get('user')}'s endpoint. {context.get('files_count')} files were encrypted.",
            f"Mass encryption event detected on {context.get('asset')}. Signature matches {context.get('ransomware')}. Approximately {context.get('files_count')} files impacted.",
            f"A ransomware deployment ({context.get('ransomware')}) was executed on the {context.get('asset')}, encrypting {context.get('files_count')} files."
        ]
        rc = [
            "Malicious payload delivered via targeted spear-phishing.",
            "Exploitation of unpatched vulnerability (CVE-2023-XXXX) on edge device.",
            "Drive-by download from compromised website."
        ]
    elif scenario_type == "insider":
        templates = [
            f"Insider threat detected: {context.get('user')} performed bulk data exfiltration ({context.get('volume')}GB) from the {context.get('asset')} to {context.get('domain')}.",
            f"Anomalous data transfer of {context.get('volume')}GB by {context.get('user')} from {context.get('asset')} to unauthorized external domain ({context.get('domain')}).",
            f"Employee {context.get('user')} downloaded an unusually large volume of data ({context.get('volume')}GB) from {context.get('asset')} and uploaded it to {context.get('domain')}."
        ]
        rc = [
            "Disgruntled employee preparing to leave the company.",
            "Corporate espionage by recruited insider.",
            "Account takeover of privileged internal user."
        ]
    elif scenario_type == "sqli":
        templates = [
            f"A Web Application Firewall (WAF) bypass led to an SQL injection attack on the {context.get('asset')}. {context.get('volume')} records were extracted via DNS tunneling.",
            f"Blind SQLi attack successful against {context.get('asset')}. Attacker bypassed WAF and exfiltrated {context.get('volume')} customer records.",
            f"Database {context.get('asset')} compromised via automated SQLmap scan. {context.get('volume')} records dumped to external infrastructure."
        ]
        rc = [
            "Improper input validation on public-facing web form.",
            "Legacy API endpoint lacking parameterized queries.",
            "WAF rule misconfiguration allowing encoded payloads."
        ]
    elif scenario_type == "phishing":
        templates = [
            f"User {context.get('user')} fell victim to an OAuth consent phishing attack. A malicious app gained access to {context.get('asset')} and created {context.get('rules')} hidden inbox rules.",
            f"OAuth token theft detected for {context.get('user')}. Threat actor established persistence via {context.get('rules')} forwarding rules and accessed {context.get('asset')}.",
            f"Phishing campaign led to illicit OAuth grant by {context.get('user')}. Attacker compromised {context.get('asset')} and configured {context.get('rules')} malicious inbox rules."
        ]
        rc = [
            "Lack of strict application consent policies in Azure AD / Google Workspace.",
            "Sophisticated AiTM (Adversary-in-the-Middle) phishing site.",
            "User approved excessive permissions for unverified third-party app."
        ]
    elif scenario_type == "supply_chain":
        templates = [
            f"A compromised third-party dependency beaconed to a known C2 server. Attackers moved laterally to {context.get('asset')} using {context.get('user')}'s privileges.",
            f"Supply chain compromise detected in build pipeline. Malicious code executed, contacting C2 and targeting the {context.get('asset')}.",
            f"Vendor software update contained a backdoor. C2 communication established, followed by lateral movement to {context.get('asset')}."
        ]
        rc = [
            "Compromised code repository of trusted third-party vendor.",
            "Dependency confusion attack pulling malicious public package.",
            "Compromised developer credentials leading to malicious code commit."
        ]
    else:
        templates = ["Suspicious activity detected."]
        rc = ["Unknown"]

    return {
        "executive_summary": random.choice(templates),
        "root_cause": random.choice(rc),
        "recommendation": "Isolate affected hosts immediately, revoke compromised credentials, and initiate full forensic imaging of the impacted assets."
    }
