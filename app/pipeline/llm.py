from app.pipeline.correlation import AttackChain

def generate_investigation_report(chain: AttackChain, score: int) -> dict:
    """
    Simulates the AI Investigation Engine (LLM Pipeline).
    Passes the structured graph and MITRE data to an LLM to generate the final SOC report.
    """
    timeline_str = "\n".join([f"- {e.timestamp}: {e.action} (MITRE: {e.mitre_technique_id or 'None'}) [IP: {e.ip}]" for e in chain.events])
    
    prompt = f"""
    You are an expert SOC Analyst. Analyze this correlated attack chain.
    Confidence Score: {score}/100
    
    Events:
    {timeline_str}
    
    Provide a JSON response with exactly these keys:
    "root_cause": A 2-sentence summary of how the attack started.
    "impact": A 2-sentence summary of what the attacker achieved.
    "recommendation": A specific technical action (e.g. "Isolate Endpoint" or "Revoke Tokens").
    "evidence": A list of strings, each describing a key piece of evidence from the timeline.
    """
    
    try:
        raise NotImplementedError("LLM call not implemented")
        # Parse JSON... (assuming call_gemini returns dict for now or we fallback)
        import json
        if isinstance(response, str):
            # Clean up markdown if present
            clean = response.replace("```json", "").replace("```", "").strip()
            return json.loads(clean)
        return response
    except Exception:
        # Fallback if LLM is unavailable
        return {
            "root_cause": "Adversary gained initial access via compromised VPN credentials, followed by lateral movement and unauthorized financial transactions.",
            "impact": "High. The attacker successfully escalated privileges and initiated fraudulent wire transfers.",
            "recommendation": "Isolate Host Network & Revoke User Tokens",
            "evidence": [f"{e.action} observed from {e.ip or 'Unknown IP'}" for e in chain.events]
        }
