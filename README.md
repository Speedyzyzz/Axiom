# AttackChain AI

**AI-powered cyber attack investigation platform that reconstructs multi-stage security incidents using deterministic correlation, evidence graphs, MITRE ATT&CK mapping, explainable risk scoring, and AI-assisted investigation summaries.**

---

## Features

- **Deterministic Correlation Engine:** Ingests and links disparate telemetry (e.g., logins, VPN, queries) into cohesive attack timelines without relying on hallucinatory AI for truth.
- **Evidence Graph Visualization:** Interactive React Flow workspace for SOC analysts to trace the root cause and blast radius.
- **Explainable Risk Scoring:** 100-point transparent confidence score for every incident.
- **MITRE ATT&CK Mapping:** Automatically maps techniques like T1136 (Create Account) or T1078 (Valid Accounts).
- **Optional AI Enhancements:** Claude 3 Opus integration for executive summaries and narrative generation (strictly isolated from the determinist core).
- **Mitigation Playbooks:** Actionable response plans integrated directly into the workspace.

---

## Architecture Diagram

*(Placeholder for Architecture Diagram screenshot)*

The system is designed with a strict boundary between deterministic security logic and AI generation. 
`Telemetry -> Normalization -> Correlation -> Risk Scoring -> Report Engine -> (Optional) LLM Rewrite -> Dashboard`.

---

## Technology Stack

**Backend**
- **FastAPI**: High-performance REST API.
- **SQLAlchemy & SQLite**: ORM and local database for hackathon portability.
- **Anthropic API (Claude 3 Opus)**: For AI-assisted narrative rewriting.

**Frontend**
- **React 19 + Next.js (App Router)**: Enterprise-grade framework.
- **Tailwind CSS v3**: For strict 8px-grid styling.
- **@xyflow/react (React Flow)**: Timeline and node graph visualization.
- **Framer Motion**: State-driven micro-animations.

---

## Project Structure

```text
├── app/                  # FastAPI Backend
│   ├── api/v1/           # REST Endpoints
│   ├── pipeline/         # Deterministic Security Engine
│   ├── models/           # SQLAlchemy Models
│   ├── services/         # Business Logic
│   └── seed/             # Demo Data Generators
├── frontend/             # Next.js Frontend
│   ├── src/app/          # Routes & Pages
│   └── src/components/   # UI Components (Landing, Investigation)
```

---

## Screenshots

*(Placeholder for Landing Page screenshot)*
*(Placeholder for Dashboard screenshot)*
*(Placeholder for Investigation Workspace screenshot)*

---

## Getting Started

### 1. Backend Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Optional: Add your Anthropic API key to .env for AI-enhanced summaries

# Run the server
uvicorn app.main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
nvm use 20 # or your preferred Node manager
npm install

# Run the frontend
npm run dev
```

### 3. Demo Data

Once both servers are running, click **"Start Demo Investigation"** from the Dashboard to immediately generate a synthetic attack chain, run the deterministic correlation engine, and render the final report.

---

## API Overview

The backend exposes a strictly versioned REST API.
- `GET /api/v1/dashboard` - Retrieve SOC KPIs.
- `GET /api/v1/incidents` - List all correlated incidents.
- `GET /api/v1/attack-chain/{id}` - Retrieve the complete narrative and evidence trace for a specific incident.
- `GET /api/v1/graph/{id}` - Retrieve pre-formatted React Flow nodes and edges.
- `POST /api/v1/demo/seed` - Generate synthetic attack data.

---

## Future Roadmap

- **PostgreSQL Migration**: Move from SQLite to a distributed SQL database for horizontal scaling.
- **Azure AD / OAuth Integration**: Enterprise SSO and role-based access control (RBAC).
- **Streaming Telemetry**: Kafka integration for real-time ingestion instead of batch processing.
- **Automated Remediation**: Direct integration with firewall and IAM APIs to execute playbooks automatically.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
