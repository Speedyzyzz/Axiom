import json
from app.models.models import Event
from app.engines.correlation import build_attack_graph

with open("data/splunk_bots_official_subset.json") as f:
    raw = json.load(f)

# Mocking Event creation
events = []
for r in raw:
    severity = "HIGH" if r.get("action") == "allowed" else "CRITICAL"
    e = Event(
        id=r.get("_serial", 1),
        incident_id=1,
        timestamp=r.get("_time", ""),
        event_type=r.get("sourcetype") or "unknown",
        action=r.get("action") or r.get("EventCode") or "unknown",
        source_ip=r.get("src_ip"),
        user_account=r.get("user") or r.get("Account_Name"),
        severity=severity,
        mitre_tactic="Execution",
        mitre_technique_id="T1059"
    )
    events.append(e)

events = sorted(events, key=lambda x: x.timestamp)
nodes, edges = build_attack_graph(1, events)
for n in nodes:
    print("NODE:", n.label, n.type)
for e in edges:
    print("EDGE:", e.source_node_id, "->", e.target_node_id, e.label)

