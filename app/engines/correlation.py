from typing import List, Tuple
from app.models.models import Event, GraphNode, GraphEdge
import uuid
import re

def build_attack_graph(incident_id: int, events: List[Event]) -> Tuple[List[GraphNode], List[GraphEdge]]:
    nodes = []
    edges = []
    
    # Track node IDs by key to avoid duplicates
    node_map = {}
    
    def add_node(key: str, label: str, ntype: str, status: str):
        if key not in node_map:
            node_id = str(uuid.uuid4())
            nodes.append(GraphNode(
                id=node_id,
                incident_id=incident_id,
                label=label,
                type=ntype,
                status=status
            ))
            node_map[key] = node_id
        return node_map[key]

    def extract_relationship(event_type: str, action: str) -> str:
        """Heuristics to convert event descriptions into relationship verbs."""
        text = f"{event_type.lower()} {action.lower()}"
        if "login" in text or "auth" in text: return "logged into"
        if "access" in text: return "accessed"
        if "execute" in text or "process" in text or "run" in text: return "executed"
        if "download" in text or "upload" in text or "exfil" in text or "transfer" in text: return "transferred"
        if "connect" in text or "beacon" in text: return "connected to"
        if "escalat" in text or "privilege" in text: return "escalated to"
        if "encrypt" in text or "delete" in text or "modif" in text: return "modified"
        if "scan" in text or "discover" in text or "enum" in text: return "scanned"
        return "interacted with"

    for event in events:
        is_malicious = event.severity in ["CRITICAL", "HIGH"]
        status = "malicious" if is_malicious else "suspicious"
        
        # 1. Attacker / IP Entity
        ip_node_id = None
        if event.source_ip:
            is_external = "." in event.source_ip and not event.source_ip.startswith("10.") and not event.source_ip.startswith("192.168.")
            node_type = "attacker" if is_external else "host"
            label = f"Attacker ({event.source_ip})" if is_external else event.source_ip
            ip_node_id = add_node(f"ip_{event.source_ip}", label, node_type, status)
            
        # 2. User Entity
        user_node_id = None
        if event.user_account and event.user_account != "Anonymous":
            user_node_id = add_node(f"user_{event.user_account}", event.user_account, "user", status)
            
        # 3. Target Asset / Process Entity
        # We try to extract what the action was targeting from the event.
        target_node_id = None
        action_lower = event.action.lower()
        
        if "database" in event.event_type.lower() or "sql" in action_lower:
            target_node_id = add_node(f"db_{incident_id}", "Database Server", "database", status)
        elif ".exe" in action_lower or "process" in event.event_type.lower():
            # Try to extract process name
            match = re.search(r'([a-zA-Z0-9_\-\.]+\.exe)', action_lower)
            proc = match.group(1) if match else "Malicious Process"
            target_node_id = add_node(f"proc_{proc}", proc, "process", status)
        elif "cloud" in action_lower or "dropbox" in action_lower or "domain" in action_lower or "url" in action_lower:
            target_node_id = add_node(f"ext_{incident_id}", "External Infrastructure", "external", status)
        elif "file" in event.event_type.lower() or "zip" in action_lower or "repo" in action_lower:
            target_node_id = add_node(f"data_{incident_id}", "Sensitive Data", "data", status)
        
        # 4. MITRE Entity
        mitre_node_id = None
        if event.mitre_technique_id:
            label = f"{event.mitre_technique_id}: {event.mitre_tactic}"
            mitre_node_id = add_node(f"mitre_{event.mitre_technique_id}", label, "mitre", status)

        # 5. Build Relationships (Edges)
        relationship = extract_relationship(event.event_type, event.action)
        
        # IP -> User
        if ip_node_id and user_node_id:
            edges.append(GraphEdge(
                id=str(uuid.uuid4()), incident_id=incident_id,
                source_node_id=ip_node_id, target_node_id=user_node_id, label="authenticated as"
            ))
            
        # User -> Target OR IP -> Target
        source = user_node_id if user_node_id else ip_node_id
        if source and target_node_id:
            edges.append(GraphEdge(
                id=str(uuid.uuid4()), incident_id=incident_id,
                source_node_id=source, target_node_id=target_node_id, label=relationship
            ))
            
        # Target -> MITRE OR User -> MITRE
        if mitre_node_id:
            mapping_source = target_node_id if target_node_id else source
            if mapping_source:
                edges.append(GraphEdge(
                    id=str(uuid.uuid4()), incident_id=incident_id,
                    source_node_id=mapping_source, target_node_id=mitre_node_id, label="mapped to"
                ))
            
    # Deduplicate edges conceptually
    unique_edges = []
    seen_edges = set()
    for e in edges:
        key = f"{e.source_node_id}-{e.target_node_id}-{e.label}"
        if key not in seen_edges:
            seen_edges.add(key)
            unique_edges.append(e)
            
    return nodes, unique_edges
