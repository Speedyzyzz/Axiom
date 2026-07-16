from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseScenario(ABC):
    @abstractmethod
    def generate(self) -> Dict[str, Any]:
        """
        Returns a dictionary containing:
        - title: str
        - events: List of dicts matching the Event schema
        - evidence: List of dicts matching the Evidence schema
        - iocs: List of dicts matching the IOC schema
        """
        pass
