# AttackChain AI

AttackChain AI is an enterprise-grade Security Operations Center (SOC) investigation platform. It ingests thousands of raw security and telemetry events, correlates them using an advanced risk scoring engine, and leverages Large Language Models (LLMs) to automatically generate human-readable attack narratives, root cause analyses, and timeline visualizations.

## 🏗 Architecture

The system is designed with clear separation of concerns, avoiding typical hackathon spaghetti.

1. **Telemetry**: Raw events (logins, VPN sessions, database queries, transactions) are continuously logged.
2. **Correlation Engine**: A deterministic Python engine correlates disparate events (e.g., impossible travel + new device + privilege escalation).
3. **Risk Scoring**: High-risk correlations create an Incident.
4. **LLM Analysis**: The incident timeline is passed to Claude (or a fallback engine), generating a structured JSON summary of the attack.
5. **Dashboard**: An instant-loading React frontend consumes the pre-computed JSON.

*See `docs/architecture.md` and `docs/api.md` for detailed Mermaid diagrams.*

## 🛠 Tech Stack

**Backend**
- FastAPI (REST API, strictly versioned under `/api/v1`)
- SQLAlchemy (ORM)
- SQLite (Local DB for portability)
- Anthropic API (Claude 3 Opus)

**Frontend**
- React 19 + Vite
- Tailwind CSS v3
- `@xyflow/react` (React Flow for timeline visualization)
- Framer Motion (Micro-animations)

## 🚀 Run Locally

### 1. Backend Setup
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env # Add your Anthropic key if desired

# Run the server
uvicorn app.main:app --reload
```

### 2. Frontend Setup
```bash
cd frontend
nvm use 20
npm install

# Run the frontend
npm run dev
```

### 3. Demo Data
Once both servers are running, click the **"Seed Demo Data"** button on the `/incidents` page to instantly correlate events and generate the `summary_json`.
