# AttackChain AI — Deterministic Cyber Attack Investigation Platform

Modern Security Operations Centers (SOCs) receive thousands of disconnected alerts every day. Analysts spend valuable time manually correlating VPN logs, authentication events, firewall telemetry, and endpoint alerts into a single investigation. AttackChain AI automates this process by reconstructing explainable attack chains from enterprise security telemetry.

## Business Impact

- Reduces investigation time from manual log analysis to seconds.
- Reduces alert fatigue through deterministic event correlation.
- Produces explainable AI-generated investigation reports.
- Maps attacks to the MITRE ATT&CK framework.
- Integrates with existing SIEM platforms rather than replacing them.

## Why AttackChain AI?

Unlike many AI-first security tools, AttackChain AI does **not** rely on an LLM to determine what happened. The investigation is first reconstructed deterministically using correlation rules, entity extraction, and MITRE ATT&CK mapping. AI is then used only to summarize and explain the verified findings, making investigations reproducible, auditable, and explainable.

---

## Features

- **Deterministic Correlation Engine:** Ingests and links disparate telemetry (e.g., logins, VPN, queries) into cohesive attack timelines without relying on hallucinatory AI for truth.
- **Evidence Graph Visualization** – Automatically reconstructs the attack path, enabling analysts to identify root cause and blast radius within seconds.
- **Explainable Risk Scoring:** 100-point transparent confidence score for every incident.
- **MITRE ATT&CK Mapping** – Maps correlated events to industry-standard attacker tactics and techniques, improving investigation consistency.
- **Optional AI Enhancements:** Claude 3 Opus integration for executive summaries and narrative generation (strictly isolated from the determinist core).
- **Mitigation Playbooks:** Actionable response plans integrated directly into the workspace.

---

## Dataset

The prototype demonstrates the investigation engine using a curated subset of the public **Splunk Boss of the SOC (BOTS) v1** dataset containing Windows Event Logs, Sysmon telemetry, and firewall events.

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

Once both servers are running, click **"Start Demo Investigation"** from the Dashboard to immediately generate an investigation using a curated subset of the Splunk Boss of the SOC (BOTS) v1 dataset, or use demo scenarios for development and testing. This runs the deterministic correlation engine and renders the final report.

---

## Future Roadmap

- Live Splunk Enterprise Integration
- Microsoft Sentinel Integration
- Banking Transaction Correlation
- Fraud Detection Engine
- SOAR Integration
- Neo4j Graph Database
- Real-time Streaming Analytics

---

## API Overview

The backend exposes a strictly versioned REST API.
- `GET /api/v1/dashboard` - Retrieve SOC KPIs.
- `GET /api/v1/incidents` - List all correlated incidents.
- `GET /api/v1/attack-chain/{id}` - Retrieve the complete narrative and evidence trace for a specific incident.
- `GET /api/v1/graph/{id}` - Retrieve pre-formatted React Flow nodes and edges.
- `POST /api/v1/demo/seed` - Generate synthetic attack data.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
