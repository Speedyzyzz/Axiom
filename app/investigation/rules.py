from typing import List, Dict, Any, Set

class RuleResult:
    def __init__(self, flag_name: str, score: int, linked_tables: Dict[str, List[int]]):
        self.flag_name = flag_name
        self.score = score
        self.linked_tables = linked_tables

class InvestigationRule:
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        raise NotImplementedError

class ImpossibleTravelRule(InvestigationRule):
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        results = []
        for ll in events.get("login_logs", []):
            for vl in events.get("vpn_logs", []):
                if abs((vl.vpn_login_time - ll.login_time).total_seconds()) <= 1800:
                    if ll.location_country != vl.source_country:
                        results.append(RuleResult(
                            flag_name="impossible travel",
                            score=40,
                            linked_tables={"login_logs": [ll.id], "vpn_logs": [vl.id]}
                        ))
        return results

class NewDeviceRule(InvestigationRule):
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        results = []
        for dev in events.get("devices", []):
            if not dev.is_known_device:
                results.append(RuleResult(
                    flag_name="new device",
                    score=20,
                    linked_tables={"devices": [dev.id]}
                ))
        return results

class PrivilegeEscalationRule(InvestigationRule):
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        results = []
        for se in events.get("security_events", []):
            if se.event_type == "privilege_escalation":
                results.append(RuleResult(
                    flag_name="privilege escalation",
                    score=30,
                    linked_tables={"security_events": [se.id]}
                ))
        return results

class DatabaseAccessRule(InvestigationRule):
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        results = []
        for se in events.get("security_events", []):
            if se.event_type == "db_access":
                results.append(RuleResult(
                    flag_name="unusual database access",
                    score=25,
                    linked_tables={"security_events": [se.id]}
                ))
        return results

class BeneficiaryCreationRule(InvestigationRule):
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        results = []
        for b in events.get("beneficiaries", []):
            results.append(RuleResult(
                flag_name="beneficiary creation",
                score=10,
                linked_tables={"beneficiaries": [b.id]}
            ))
        return results

class AbnormalTransactionRule(InvestigationRule):
    def evaluate(self, user_id: int, events: dict) -> List[RuleResult]:
        results = []
        for t in events.get("transactions", []):
            if t.amount > 100000:
                results.append(RuleResult(
                    flag_name="abnormal transaction",
                    score=40,
                    linked_tables={"transactions": [t.id]}
                ))
        return results

RULES_ENGINE = [
    ImpossibleTravelRule(),
    NewDeviceRule(),
    PrivilegeEscalationRule(),
    DatabaseAccessRule(),
    BeneficiaryCreationRule(),
    AbnormalTransactionRule()
]
