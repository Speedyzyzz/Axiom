# AttackChain AI Roadmap

## Phase 1: Hackathon (Current)
- Deterministic correlation engine
- Single Scenario Demonstration (Credential Theft + Wire Fraud)
- High-fidelity SOC Dashboard UI
- LLM Rewrite integration (Optional)
- End-to-end read-only audit suite

## Phase 2: Post-Hackathon Stabilization
- **Automated Pytest Suite:** Convert `audit_suite.py` assertions into formal Pytest fixtures.
- **API Integration Tests:** Deeply fuzz the pipeline inputs.
- **Golden JSON Snapshots:** Save the exact Scenario 1 JSON output as a regression baseline.
- **CI/CD:** Enforce tests on every commit to prevent drift.

## Phase 3: Expansion
- **Live Ingestion:** Replace the seed script with an active Kafka or HTTP ingestion endpoint.
- **Graph Database:** Migrate the SQLite backend mock into Neo4j for actual relationship traversal.
- **Multiple Scenarios:** Build deterministic models for Insider Threat, Ransomware, and Data Exfiltration.
