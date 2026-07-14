from datetime import datetime, timedelta
from app.models import models
from app.database.connection import engine, SessionLocal
from app.utils.logger import log

def run_seed():
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Create Users
        base_time = datetime(2024, 1, 1, 9, 0, 0)
        employee = models.User(name="David Chen", role="bank_employee", department="Customer Support", employee_or_customer="employee", created_at=base_time)
        customer = models.User(name="Sarah Jenkins", role="customer", department=None, employee_or_customer="customer", created_at=base_time)
        db.add_all([employee, customer])
        db.commit()

        # 09:31 Legitimate Login
        t1 = datetime(2024, 1, 1, 9, 31, 0)
        legit_session = models.Session(user_id=employee.id, session_token="tok_123", started_at=t1, ip_address="103.45.67.12", is_active=True)
        db.add(legit_session)
        db.commit()

        legit_login = models.LoginLog(user_id=employee.id, session_id=legit_session.id, login_time=t1, ip_address="103.45.67.12", location_city="Mumbai", location_country="India", login_method="password", success=True)
        db.add(legit_login)
        db.commit()

        # 09:36 VPN Login & Unknown Device
        t2 = datetime(2024, 1, 1, 9, 36, 0)
        vpn_device = models.Device(user_id=employee.id, device_fingerprint="win_chrome_unk_492", device_type="desktop", is_known_device=False, first_seen_at=t2)
        db.add(vpn_device)
        db.commit()

        vpn_session = models.Session(user_id=employee.id, device_id=vpn_device.id, session_token="tok_vpn_456", started_at=t2, ip_address="45.155.205.133", is_active=True)
        db.add(vpn_session)
        db.commit()

        vpn_log = models.VpnLog(user_id=employee.id, session_id=vpn_session.id, vpn_login_time=t2, source_ip="45.155.205.133", source_country="Russia (St. Petersburg)", flagged_region=True)
        db.add(vpn_log)
        db.commit()

        # 09:42 Privilege Escalation
        t3 = datetime(2024, 1, 1, 9, 42, 0)
        priv_esc = models.SecurityEvent(user_id=employee.id, session_id=vpn_session.id, event_type="privilege_escalation", event_time=t3, resource_accessed="admin_panel", risk_weight=80)
        db.add(priv_esc)
        db.commit()

        # 09:45 Bulk Database Access
        t4 = datetime(2024, 1, 1, 9, 45, 0)
        db_access = models.SecurityEvent(user_id=employee.id, session_id=vpn_session.id, event_type="db_access", event_time=t4, resource_accessed="bulk_customer_records", risk_weight=60)
        db.add(db_access)
        db.commit()

        # 09:48 Beneficiaries Added (3)
        t5 = datetime(2024, 1, 1, 9, 48, 0)
        b1 = models.Beneficiary(customer_account_id=customer.id, beneficiary_name="Alexander Volkov", beneficiary_account="ACC-RU-88910", added_by_user_id=employee.id, added_at=t5)
        b2 = models.Beneficiary(customer_account_id=customer.id, beneficiary_name="Dmitry Ivanov", beneficiary_account="ACC-RU-88911", added_by_user_id=employee.id, added_at=t5 + timedelta(seconds=10))
        b3 = models.Beneficiary(customer_account_id=customer.id, beneficiary_name="Sergei Petrov", beneficiary_account="ACC-RU-88912", added_by_user_id=employee.id, added_at=t5 + timedelta(seconds=20))
        db.add_all([b1, b2, b3])
        db.commit()

        # 09:50 Transfer
        t6 = datetime(2024, 1, 1, 9, 50, 0)
        txn = models.Transaction(customer_account_id=customer.id, beneficiary_id=b1.id, amount=800000.0, transaction_time=t6, transaction_type="Offshore Wire Transfer", status="completed")
        db.add(txn)
        db.commit()

        log.info("Scenario 1 successfully seeded.")
        return employee.id
    except Exception as e:
        log.error(f"Seeding failed: {e}")
        raise
    finally:
        db.close()
