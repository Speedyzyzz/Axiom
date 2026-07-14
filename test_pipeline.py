from app.database.connection import SessionLocal
from app.seed.scenario import run_seed
from app.investigation.engine import run_investigation_pipeline

db = SessionLocal()
try:
    user_id = run_seed()
    print("----- RUNNING PIPELINE -----")
    run_investigation_pipeline(db, user_id)
    print("----- FINISHED -----")
finally:
    db.close()
