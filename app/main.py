from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
import time
import uuid
from app.utils.logger import log
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import router
from app.exceptions.custom_exceptions import IncidentNotFound, LLMUnavailable, TimelineCorrupted, SeedFailed
from fastapi.responses import JSONResponse
from app.database.connection import engine
from app.models import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AttackChain AI Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.middleware("http")
async def log_requests(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start_time = time.time()
    response = await call_next(request)
    latency = time.time() - start_time
    
    extra = {
        "request_id": request_id,
        "endpoint": request.url.path,
        "latency": round(latency, 4),
        "status": response.status_code
    }
    log.info(f"Handled {request.method} {request.url.path}", extra=extra)
    return response

@app.exception_handler(IncidentNotFound)
async def incident_not_found_handler(request: Request, exc: IncidentNotFound):
    return JSONResponse(status_code=404, content={"status": "error", "message": str(exc)})

@app.exception_handler(LLMUnavailable)
async def llm_unavailable_handler(request: Request, exc: LLMUnavailable):
    return JSONResponse(status_code=503, content={"status": "error", "message": str(exc)})

@app.exception_handler(TimelineCorrupted)
async def timeline_corrupted_handler(request: Request, exc: TimelineCorrupted):
    return JSONResponse(status_code=500, content={"status": "error", "message": str(exc)})

@app.exception_handler(SeedFailed)
async def seed_failed_handler(request: Request, exc: SeedFailed):
    return JSONResponse(status_code=500, content={"status": "error", "message": str(exc)})

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"status": "error", "message": "Invalid request payload", "details": exc.errors()}
    )
