# AttackChain AI Demo Script

## The Hook (Problem & Solution)
> "A SOC analyst receives thousands of disconnected alerts every day. They have to manually correlate VPN logs, endpoint alerts, firewall events, cloud activity, and database access. That investigation can take 30 to 40 minutes."
> 
> "AttackChain AI reduces security investigation time by automatically reconstructing an attack from thousands of isolated events into one explainable investigation."

## Triggering the Investigation
*(Click 'Launch Investigation')*
> "Today, our Investigation Engine generates realistic attack scenarios for the demo."
*(Show Dashboard)*
> "The dashboard immediately reflects a new incident."

## The Workspace
*(Open Incident)*
> "Instead of reading raw logs, the analyst sees the chronological attack progression on the timeline."

## The Graph (Killer Feature)
*(Point to the Center Graph)*
> "This is where AttackChain is different. Instead of just connecting events, we extract entities like users, hosts, processes, databases, and attacker infrastructure. We then infer the relationships between them to reconstruct the actual attack path."

## MITRE & Context
*(Point to the MITRE nodes)*
> "Every behavior you see is automatically mapped to the MITRE ATT&CK framework, so the analyst instantly understands the adversary's intent."

## AI & Determinism
*(Point to AI Summary)*
> "Notice the summary on the right. The AI doesn't decide whether something is malicious—our deterministic investigation engine does. The AI sits on top purely to translate those technical findings into executive-friendly language."

## Containment
*(Click Containment Action)*
> "With one action, the analyst executes containment based on the generated playbook, and the investigation state updates."

---

## Anticipated Q&A

**Q: Why didn't you just use ChatGPT?**
> "Large language models are excellent at summarizing investigations, but they shouldn't be the source of truth. Our correlation engine is deterministic and explainable. AI sits on top to translate technical findings into analyst-friendly and executive-friendly summaries."

**Q: How would this work with real data?**
> "Today our Investigation Engine generates realistic attack scenarios. In production, the event generation stage would be replaced by connectors to SIEMs, EDRs, identity providers, cloud audit logs, and firewall telemetry. The rest of the pipeline—correlation, graph construction, MITRE mapping, AI summarization, and containment—remains unchanged."
