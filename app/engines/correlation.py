from typing import List, Tuple
from app.models.models import Event, GraphNode, GraphEdge
import uuid
import re

def build_attack_graph(incident_id: int, events: List[Event]) -> Tuple[List[GraphNode], List[GraphEdge]]:
    
    NOISE = ["svchost", "dns", "system idle", "conhost", "telegraf", "allowed"]
    ATTACK_KEYWORDS = ["powershell", "cmd", "mimikatz", "lsass", "rdp", "smb", "psexec", "wmi", "vssadmin", "ransomware", "login", "auth", "exfil", "upload", "download", "database access", "lateral movement", "privilege escalation", "external connection"]

    filtered_events = []
    for e in events:
        # Strictly ignore noise unless it's explicitly malicious
        text = f"{e.event_type} {e.action} {e.process_name} {e.user_account}".lower()
        
        if e.severity in ["CRITICAL", "HIGH"] and not any(n in text for n in NOISE):
            filtered_events.append(e)
            continue
            
        if any(k in text for k in ATTACK_KEYWORDS) and not any(n in text for n in NOISE):
            filtered_events.append(e)
            continue
            
    # If the filter was too aggressive, fallback to original logic
    if len(filtered_events) < 3:
        filtered_events = [e for e in events if e.severity in ["HIGH", "CRITICAL"] or e.mitre_technique_id or "exfil" in (e.action or "").lower() or "login" in (e.action or "").lower()]
        filtered_events = filtered_events if filtered_events else events[:10]
        
    events = sorted(filtered_events, key=lambda x: x.timestamp)
    
    nodes = []
    edges = []
    node_map = {}
    
    last_node_id = None
    
    def add_node_chain(label: str, ntype: str, status: str, edge_label: str):
        nonlocal last_node_id
        
        if label in node_map:
            node_id = node_map[label]
        else:
            node_id = str(uuid.uuid4())
            nodes.append(GraphNode(
                id=node_id, incident_id=incident_id, label=label, type=ntype, status=status
            ))
            node_map[label] = node_id
            
        if last_node_id and last_node_id != node_id:
            # Avoid duplicate consecutive edges
            if not any(e.source_node_id == last_node_id and e.target_node_id == node_id for e in edges):
                edges.append(GraphEdge(
                    id=str(uuid.uuid4()), incident_id=incident_id,
                    source_node_id=last_node_id, target_node_id=node_id, label=edge_label
                ))
                
        last_node_id = node_id
        return node_id

    for event in events:
        is_malicious = event.severity in ["CRITICAL", "HIGH"]
        status = "malicious" if is_malicious else "suspicious"
        
        action_lower = (event.action or "").lower()
        event_type = (event.event_type or "").lower()
        
        # Determine the primary entity of this event to advance the chain
        if "external connection" in action_lower:
            is_ext = "." in (event.source_ip or "") and not (event.source_ip or "").startswith("10.")
            add_node_chain(f"External IP {event.source_ip}", "attacker", status, "established connection to")
            if event.user_account:
                add_node_chain(f"Host ({event.user_account})", "host", status, "compromised")
                
        elif "privilege escalation" in action_lower:
            if event.user_account:
                add_node_chain(f"User ({event.user_account})", "user", status, "escalated privileges")
                
        elif event.source_ip and ("login" in action_lower or "auth" in action_lower):
            is_ext = "." in event.source_ip and not event.source_ip.startswith("10.") and not event.source_ip.startswith("192.168.")
            add_node_chain(f"Attacker ({event.source_ip})" if is_ext else event.source_ip, "attacker" if is_ext else "host", status, "originated from")
            if event.user_account:
                add_node_chain(event.user_account, "user", status, "authenticated as")
                
        elif "process" in event_type or ".exe" in action_lower or "powershell" in action_lower or "mimikatz" in action_lower:
            match = re.search(r'([a-zA-Z0-9_\-\.]+\.exe)', action_lower)
            proc = match.group(1) if match else "Malicious Process"
            if "powershell" in action_lower: proc = "powershell.exe"
            if "mimi" in action_lower: proc = "mimikatz"
            add_node_chain(proc, "process", status, "executed")
            
        elif "lateral movement" in action_lower or "smb" in action_lower:
            add_node_chain("Lateral Movement", "mitre", status, "performed")
            
        elif "credential dumping" in action_lower or "lsass" in action_lower:
            add_node_chain("Credential Dumping", "mitre", status, "performed")
            
        elif "database" in event_type or "sql" in action_lower or "database access" in action_lower:
            add_node_chain("Database Server", "database", status, "accessed")
            
        elif "file" in event_type or "zip" in action_lower or "repo" in action_lower or "exfil" in action_lower:
            add_node_chain("Data Exfiltration", "data", status, "attempted")
            
        elif event.mitre_technique_id:
            label = f"{event.mitre_technique_id}: {event.mitre_tactic}"
            add_node_chain(label, "mitre", status, "performed")
            
        else:
            if event.process_name:
                add_node_chain(event.process_name, "process", status, "executed")
            elif event.destination_ip:
                add_node_chain(event.destination_ip, "host", status, "connected to")
            elif event.user_account:
                add_node_chain(event.user_account, "user", status, "interacted as")

    return nodes, edges

