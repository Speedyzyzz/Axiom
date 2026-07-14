from app.pipeline.mitre import MitreEvent
from pydantic import BaseModel
from typing import Optional

class AttackChain(BaseModel):
    user_id: Optional[int]
    events: list[MitreEvent]
    is_critical: bool = False

def build_attack_chains(events: list[MitreEvent]) -> list[AttackChain]:
    """
    Simulates the Graph Database (Neo4j) Correlation Engine.
    Groups events by user/entity and links them sequentially.
    """
    chains = {}
    
    for ev in events:
        uid = ev.user_id
        if uid not in chains:
            chains[uid] = []
        chains[uid].append(ev)
        
    attack_chains = []
    
    for uid, chain_events in chains.items():
        chain_events.sort(key=lambda x: x.timestamp)
        
        # Determine if it's an attack chain (e.g., contains malicious IPs or high impact)
        is_critical = any([e.is_malicious or e.mitre_tactic == "Impact" for e in chain_events])
        print(f"Chain for uid {uid}: length={len(chain_events)}, is_critical={is_critical}")
        for e in chain_events:
             print(f"  Event: action={e.action}, is_malicious={e.is_malicious}, tactic={e.mitre_tactic}")
        
        # Only return chains that look suspicious (for demo purposes, return critical ones)
        if is_critical and len(chain_events) >= 2:
            print(f"  -> Added chain to attack_chains!")
            attack_chains.append(AttackChain(user_id=uid, events=chain_events, is_critical=True))
            
    return attack_chains
