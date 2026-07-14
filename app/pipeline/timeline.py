from typing import List, Dict, Any
from app.pipeline.correlation import AttackChain

def generate_timeline(chain: AttackChain) -> List[Dict[str, Any]]:
    """
    Timeline Service: Organizes events and highlights temporal anomalies (e.g. gaps).
    """
    timeline = []
    
    events = sorted(chain.events, key=lambda x: x.timestamp)
    
    for i, ev in enumerate(events):
        anomaly = None
        
        # Detect time gaps or rapid succession
        if i > 0:
            time_diff = (ev.timestamp - events[i-1].timestamp).total_seconds()
            if time_diff < 5:
                anomaly = "Rapid Succession (Automated?)"
            elif time_diff > 3600:
                anomaly = "Dormant Period"
                
        timeline.append({
            "timestamp": ev.timestamp.isoformat(),
            "time_str": ev.timestamp.strftime('%H:%M:%S'),
            "action": ev.action,
            "source": ev.source,
            "ip": ev.ip,
            "mitre": ev.mitre_technique_id,
            "is_malicious": ev.is_malicious,
            "anomaly": anomaly
        })
        
    return timeline
