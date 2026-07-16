from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database.connection import Base

class Incident(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    status = Column(String) # 'OPEN', 'CONTAINED'
    severity = Column(String) # 'CRITICAL', 'HIGH', 'MEDIUM'
    risk_score = Column(Float)
    created_at = Column(DateTime)
    
    events = relationship("Event", back_populates="incident", cascade="all, delete-orphan")
    evidence = relationship("Evidence", back_populates="incident", cascade="all, delete-orphan")
    graph_nodes = relationship("GraphNode", back_populates="incident", cascade="all, delete-orphan")
    graph_edges = relationship("GraphEdge", back_populates="incident", cascade="all, delete-orphan")
    ioc = relationship("IOC", back_populates="incident", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="incident", cascade="all, delete-orphan")
    ai_summary = relationship("AiSummary", back_populates="incident", uselist=False, cascade="all, delete-orphan")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    timestamp = Column(DateTime)
    source_ip = Column(String)
    user_account = Column(String)
    event_type = Column(String)
    action = Column(String)
    severity = Column(String)
    description = Column(String)
    mitre_technique_id = Column(String)
    mitre_tactic = Column(String)

    incident = relationship("Incident", back_populates="events")

class Evidence(Base):
    __tablename__ = "evidence"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    type = Column(String)
    title = Column(String)
    description = Column(String)
    confidence = Column(String)
    metadata_json = Column(String)
    
    incident = relationship("Incident", back_populates="evidence")

class GraphNode(Base):
    __tablename__ = "graph_nodes"
    id = Column(String, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    label = Column(String)
    type = Column(String)
    status = Column(String)

    incident = relationship("Incident", back_populates="graph_nodes")

class GraphEdge(Base):
    __tablename__ = "graph_edges"
    id = Column(String, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    source_node_id = Column(String)
    target_node_id = Column(String)
    label = Column(String)

    incident = relationship("Incident", back_populates="graph_edges")

class IOC(Base):
    __tablename__ = "iocs"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    type = Column(String)
    value = Column(String)
    context = Column(String)

    incident = relationship("Incident", back_populates="ioc")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    timestamp = Column(DateTime)
    action = Column(String)
    user = Column(String)

    incident = relationship("Incident", back_populates="audit_logs")

class AiSummary(Base):
    __tablename__ = "ai_summaries"
    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"))
    executive_summary = Column(String)
    root_cause = Column(String)
    recommendation = Column(String)
    
    incident = relationship("Incident", back_populates="ai_summary")
