from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from app.database.connection import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    role = Column(String)
    department = Column(String)
    employee_or_customer = Column(String)
    created_at = Column(DateTime)

class Device(Base):
    __tablename__ = "devices"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_fingerprint = Column(String)
    device_type = Column(String)
    is_known_device = Column(Boolean)
    first_seen_at = Column(DateTime)

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    device_id = Column(Integer, ForeignKey("devices.id"))
    session_token = Column(String)
    started_at = Column(DateTime)
    ip_address = Column(String)
    is_active = Column(Boolean)

class LoginLog(Base):
    __tablename__ = "login_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    login_time = Column(DateTime)
    ip_address = Column(String)
    location_city = Column(String)
    location_country = Column(String)
    login_method = Column(String)
    success = Column(Boolean)

class VpnLog(Base):
    __tablename__ = "vpn_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    vpn_login_time = Column(DateTime)
    source_ip = Column(String)
    source_country = Column(String)
    flagged_region = Column(Boolean)

class SecurityEvent(Base):
    __tablename__ = "security_events"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("sessions.id"))
    event_type = Column(String)
    event_time = Column(DateTime)
    resource_accessed = Column(String)
    risk_weight = Column(Integer)

class Beneficiary(Base):
    __tablename__ = "beneficiaries"
    id = Column(Integer, primary_key=True, index=True)
    customer_account_id = Column(Integer, ForeignKey("users.id"))
    beneficiary_name = Column(String)
    beneficiary_account = Column(String)
    added_by_user_id = Column(Integer, ForeignKey("users.id"))
    added_at = Column(DateTime)

class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    customer_account_id = Column(Integer, ForeignKey("users.id"))
    beneficiary_id = Column(Integer, ForeignKey("beneficiaries.id"))
    amount = Column(Float)
    transaction_time = Column(DateTime)
    transaction_type = Column(String)
    status = Column(String)

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    incident_title = Column(String)
    confidence_score = Column(Float)
    status = Column(String)
    summary_json = Column(String) # For caching LLM output
    reasoning_trace_json = Column(String)
    created_at = Column(DateTime)


class IncidentEvent(Base):
    __tablename__ = "incident_events"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    source_table = Column(String) # e.g. 'login_logs', 'vpn_logs'
    source_id = Column(Integer)   # ID in the source table
