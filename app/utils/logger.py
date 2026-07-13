import logging
import sys
import json
from datetime import datetime

class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_obj = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "name": record.name
        }
        if hasattr(record, "request_id"): log_obj["request_id"] = record.request_id
        if hasattr(record, "endpoint"): log_obj["endpoint"] = record.endpoint
        if hasattr(record, "latency"): log_obj["latency"] = record.latency
        if hasattr(record, "status"): log_obj["status"] = record.status
        return json.dumps(log_obj)

def setup_logger():
    logger = logging.getLogger("attackchain")
    logger.setLevel(logging.INFO)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
    return logger

log = setup_logger()
