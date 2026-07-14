# FAQ (Judge Q&A Prep)

**Why not use a graph database?**
> "For the hackathon, SQLite provided the fastest deployment with zero friction. However, our architecture is designed so the correlation engine can be swapped with Neo4j in Phase 2 for true relationship traversal at scale."

**Why deterministic instead of AI?**
> "Banking security requires 100% auditability. A black-box LLM calculating risk scores is a compliance nightmare. Our deterministic engine ensures that every score is fully explainable via the Reasoning Trace."

**Why FastAPI?**
> "FastAPI gives us asynchronous performance, automatic Swagger documentation, and strict Pydantic schema validation out of the box. It allowed us to lock down our API contracts early."

**What if the LLM fails?**
> "Our architecture is built for resilience. The LLM is an optional rewrite layer. If Anthropic's API fails or rate-limits us, the system silently falls back to `ENGINE_ONLY` mode, preserving 100% of the facts and the entire UX."

**How do you reduce false positives?**
> "By combining Threat Intelligence with multi-stage correlation (Impossible Travel + Privilege Escalation + High Value Transfer), we don't alert on isolated events. We alert on the *chain*."

**How would you integrate with Splunk?**
> "In a production environment, our ingestion pipeline would act as a webhook receiver or Kafka consumer, pulling raw SIEM alerts from Splunk and normalizing them before pushing them into our correlation engine."
