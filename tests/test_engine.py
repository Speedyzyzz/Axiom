import pytest
from app.investigation.rules import (
    ImpossibleTravelRule,
    NewDeviceRule,
    PrivilegeEscalationRule,
    DatabaseAccessRule,
    BeneficiaryCreationRule,
    AbnormalTransactionRule,
    RuleResult
)

class MockModel:
    def __init__(self, **kwargs):
        for k, v in kwargs.items():
            setattr(self, k, v)

def test_impossible_travel_rule():
    from datetime import datetime
    
    t1 = datetime(2024, 1, 1, 9, 0, 0)
    t2 = datetime(2024, 1, 1, 9, 5, 0) # 5 mins later
    
    events = {
        "login_logs": [MockModel(id=1, login_time=t1, location_country="India")],
        "vpn_logs": [MockModel(id=2, vpn_login_time=t2, source_country="Russia")]
    }
    
    rule = ImpossibleTravelRule()
    results = rule.evaluate(user_id=1, events=events)
    
    assert len(results) == 1
    assert results[0].flag_name == "impossible travel"
    assert results[0].score == 40
    assert 1 in results[0].linked_tables["login_logs"]
    assert 2 in results[0].linked_tables["vpn_logs"]

def test_new_device_rule():
    events = {
        "devices": [MockModel(id=1, is_known_device=False)]
    }
    rule = NewDeviceRule()
    results = rule.evaluate(user_id=1, events=events)
    assert len(results) == 1
    assert results[0].score == 20

def test_abnormal_transaction_rule():
    events = {
        "transactions": [MockModel(id=1, amount=50000), MockModel(id=2, amount=800000)]
    }
    rule = AbnormalTransactionRule()
    results = rule.evaluate(user_id=1, events=events)
    assert len(results) == 1
    assert results[0].linked_tables["transactions"] == [2]

