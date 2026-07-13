class IncidentNotFound(Exception):
    def __init__(self, incident_id: int):
        self.incident_id = incident_id
        super().__init__(f"Incident with ID {incident_id} not found.")

class LLMUnavailable(Exception):
    def __init__(self, message: str = "LLM service is currently unavailable."):
        super().__init__(message)

class TimelineCorrupted(Exception):
    def __init__(self, incident_id: int):
        self.incident_id = incident_id
        super().__init__(f"Timeline data for incident {incident_id} is corrupted.")

class SeedFailed(Exception):
    def __init__(self, message: str = "Database seed failed."):
        super().__init__(message)
