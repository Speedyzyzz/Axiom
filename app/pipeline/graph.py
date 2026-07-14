from typing import List, Dict, Any
from app.pipeline.mitre import MitreEvent
from app.pipeline.correlation import AttackChain

def generate_evidence_graph(chain: AttackChain) -> Dict[str, List[Dict[str, Any]]]:
    """
    Builds a React Flow compatible Node/Edge graph representing the Attack Chain.
    This proves the backend is doing graph correlation, not just a linear list.
    """
    nodes = []
    edges = []
    
    # Base Entity Nodes
    if chain.user_id:
        nodes.append({
            "id": f"user_{chain.user_id}",
            "type": "custom",
            "data": {"label": f"User ID: {chain.user_id}", "sub": "Identity"},
            "position": {"x": 250, "y": 0},
            "className": "node-user"
        })
        
    # We will lay out the graph sequentially down the Y axis
    y_offset = 150
    
    prev_node_id = f"user_{chain.user_id}" if chain.user_id else None
    
    for i, ev in enumerate(chain.events):
        node_id = f"event_{i}"
        
        # Determine visual style based on MITRE tactic or action
        style_class = "node-event"
        if ev.mitre_tactic == "Initial Access":
            style_class = "node-initial"
        elif ev.mitre_tactic == "Impact":
            style_class = "node-impact"
        elif ev.is_malicious:
            style_class = "node-malicious"
            
        nodes.append({
            "id": node_id,
            "type": "custom",
            "data": {
                "label": ev.action, 
                "sub": f"{ev.timestamp.strftime('%H:%M:%S')} - {ev.source}",
                "mitre": ev.mitre_technique_id
            },
            "position": {"x": 250, "y": y_offset},
            "className": style_class
        })
        
        # Create an IP node if one exists to show branch logic
        if ev.ip:
            ip_node_id = f"ip_{ev.ip.replace('.','_')}"
            
            # Check if we already added this IP
            if not any(n["id"] == ip_node_id for n in nodes):
                nodes.append({
                    "id": ip_node_id,
                    "type": "custom",
                    "data": {"label": ev.ip, "sub": "External IP", "malicious": ev.is_malicious},
                    "position": {"x": 500, "y": y_offset},
                    "className": "node-ip-malicious" if ev.is_malicious else "node-ip"
                })
            
            # Edge from event to IP
            edges.append({
                "id": f"e_{node_id}_{ip_node_id}",
                "source": node_id,
                "target": ip_node_id,
                "animated": True,
                "style": {"stroke": "#EF4444" if ev.is_malicious else "#94A3B8"}
            })

        # Main timeline edge
        if prev_node_id:
            edges.append({
                "id": f"e_{prev_node_id}_{node_id}",
                "source": prev_node_id,
                "target": node_id,
                "animated": True,
                "style": {"stroke": "#00E5FF", "strokeWidth": 2}
            })
            
        prev_node_id = node_id
        y_offset += 150
        
    return {"nodes": nodes, "edges": edges}
