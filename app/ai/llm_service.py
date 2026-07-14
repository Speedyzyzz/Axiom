import json
import os
import anthropic
from sqlalchemy.orm import Session
from app.models import models
from app.utils.logger import log
from app.services.report_builder import build_deterministic_report

def generate_investigation_summary(db: Session, incident_id: int) -> dict:
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        return None
        
    # 1. Build base deterministic report
    report = build_deterministic_report(db, incident)
    
    # 2. Check for Anthropic API Key
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if api_key:
        try:
            client = anthropic.Anthropic(api_key=api_key)
            
            payload = {
                "executive_summary": report["executive_summary"],
                "technical_summary": report["technical_summary"],
                "business_impact": report["business_impact"]
            }
            
            response = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1000,
                timeout=5.0,
                system="You are rewriting a security incident report for readability. You may only improve grammar, sentence flow, and clarity. You are NOT permitted to infer, invent, omit, modify, or reorder any facts — timestamps, countries, IP addresses, device fingerprints, usernames, transaction amounts, beneficiary counts, confidence scores, MITRE techniques, or recommendations must remain exactly as given. Return only the three rewritten fields as JSON, in the same structure you received.",
                messages=[
                    {"role": "user", "content": json.dumps(payload)}
                ]
            )
            
            text = response.content[0].text
            import re
            json_str = re.search(r'\{.*\}', text, re.DOTALL)
            if json_str:
                rewritten = json.loads(json_str.group())
                report["executive_summary"] = rewritten.get("executive_summary", report["executive_summary"])
                report["technical_summary"] = rewritten.get("technical_summary", report["technical_summary"])
                report["business_impact"] = rewritten.get("business_impact", report["business_impact"])
                report["report_mode"] = "ENGINE_PLUS_LLM"
        except Exception as e:
            log.error(f"LLM API failed or timed out: {e}")
            
    # 3. Cache the summary back to database
    incident.summary_json = json.dumps(report)
    db.commit()
    
    return report
