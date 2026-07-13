# AttackChain AI — Backend Master Specification (v1.0)

> Master implementation specification for the backend MVP.
> Goal: Build one complete investigation workflow for a banking cybersecurity prototype.

---

# 1. Product Objective

AttackChain AI is an AI Security Investigator.

It **does not** attempt to replace a SIEM, fraud engine, or SOC.

Its only objective is:

> Reconstruct one cyber attack by correlating cybersecurity telemetry with banking transaction behaviour and produce one explainable investigation.

Success Criteria:
- One end-to-end investigation
- One attack scenario
- One incident created
- One AI explanation
- One recommended action

Non-goals:
- Authentication
- RBAC
- Real bank integrations
- Kafka
- Redis
- Microservices
- Training ML models
- Production scalability

---

# 2. Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy
- SQLite (MVP)
- Pydantic
- Alembic (optional)
- Anthropic/OpenAI via provider abstraction
- Uvicorn

Folder structure:

```
app/
  api/
  models/
  schemas/
  services/
  investigation/
  ai/
  database/
  seed/
  utils/
  prompts/
  tests/
  main.py
```

---

# 3. Architecture

```
Synthetic Events
        │
        ▼
SQLite Database
        │
        ▼
Investigation Engine
        │
        ├── Evidence Builder
        ├── Risk Scorer
        ├── Timeline Builder
        ▼
LLM Summary Service
        ▼
REST API
        ▼
React Dashboard
```

---

# 4. Database

Tables

1. users
2. devices
3. sessions
4. login_logs
5. vpn_logs
6. security_events
7. beneficiaries
8. transactions
9. incidents
10. incident_events

Use foreign keys everywhere.

Use timestamps on every event.

Incident_events links every event to an investigation instead of storing JSON arrays.

---

# 5. Synthetic Scenario

Single scenario only.

09:31 Employee login (Mumbai)

09:36 VPN login (Russia)

09:36 Unknown device

09:42 Privilege escalation

09:45 Bulk database access

09:48 Beneficiary added

09:50 ₹800000 transfer

Investigation result:

Credential Theft → Account Takeover

---

# 6. Investigation Engine

Pipeline:

1. Collect events for one session.
2. Detect:
   - impossible travel
   - new device
   - privilege escalation
   - unusual database access
   - beneficiary creation
   - abnormal transaction
3. Score evidence.
4. Create incident.
5. Build ordered timeline.
6. Request LLM explanation.
7. Return investigation.

Never allow LLM to invent evidence.

LLM explains only.

Rules determine incident creation.

---

# 7. Risk Scoring

Example weights

- Impossible travel = 20
- Unknown device = 15
- Privilege escalation = 25
- Database access = 15
- Beneficiary creation = 10
- High-value transfer = 20

80+ = Critical

60-79 = High

40-59 = Medium

---

# 8. AI Contract

Input:

Structured JSON events.

Output JSON:

```
{
  "incident_title":"",
  "root_cause":"",
  "confidence":94,
  "business_impact":"",
  "evidence":[...],
  "recommended_action":""
}
```

Fallback:

Return cached response if provider fails.

---

# 9. REST API

GET /api/v1/dashboard

Returns KPIs.

GET /api/v1/incidents

List investigations.

GET /api/v1/incidents/{id}

Full investigation.

GET /api/v1/incidents/{id}/timeline

Ordered events.

POST /api/v1/incidents/{id}/action

Update status.

POST /api/v1/demo/reset

Recreate seed data.

---

# 10. Response Format

```
{
  "status":"success",
  "data":{},
  "meta":{}
}
```

---

# 11. Coding Rules

- Thin routers.
- Business logic only in services.
- No duplicated SQL.
- Type hints everywhere.
- Environment variables only.
- Keep modules under ~300 lines where practical.

---

# 12. Logging

Log:

- incident creation
- AI failures
- seed execution
- endpoint errors

Do not log secrets.

---

# 13. Build Order

1. Scaffold project.
2. Database models.
3. Seed script.
4. Investigation engine.
5. Risk scoring.
6. API.
7. AI provider.
8. Demo reset.
9. Manual testing.
10. Frontend integration.

Never proceed until previous step works.

---

# 14. Demo Requirements

The backend must support a deterministic replay.

Every reset recreates the exact same incident.

Frontend should be able to animate the returned ordered timeline.

---

# 15. Future Scope

Deferred:

- PostgreSQL
- Redis
- Kafka
- Graph database
- SOAR integration
- Multi-agent reasoning
- Real-time streaming
- Multi-bank tenancy

Do not implement in MVP.

---

# 16. Definition of Done

Backend is complete when:

- Database seeds successfully.
- One incident is automatically created.
- Timeline endpoint works.
- AI summary endpoint works.
- Fallback works without internet.
- Demo reset works.
- Frontend can consume all endpoints.

End of Specification.
