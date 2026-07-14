import { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import gsap from "gsap"
import TimelineFlow from "../components/TimelineFlow"

// GSAP CountUp Helper
function GsapCountUp({ to, format = (v) => v, suffix = "" }) {
  const nodeRef = useRef(null)
  
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (prefersReducedMotion) {
      if (nodeRef.current) nodeRef.current.textContent = format(to) + suffix
      return
    }

    const obj = { val: 0 }
    const tween = gsap.to(obj, {
      val: to,
      duration: 0.4,
      ease: "power1.out",
      onUpdate: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = format(Math.round(obj.val)) + suffix
        }
      }
    })
    return () => tween.kill()
  }, [to, format, suffix])

  return <span ref={nodeRef}>{format(to) + suffix}</span>
}

export default function UnifiedDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({ total_events: 84209, alerts: 4112, active_incidents: 1, confidence: 98 })
  const [incidents, setIncidents] = useState([])
  const [investigationData, setInvestigationData] = useState(null)

  // Initial load
  useEffect(() => {
    Promise.all([
      axios.get("http://127.0.0.1:8000/api/v1/dashboard").catch(() => ({ data: { data: { kpis: { active_incidents: 1 } } } })),
      axios.get("http://127.0.0.1:8000/api/v1/incidents").catch(() => ({ data: { data: [] } }))
    ]).then(([dashboardRes, incidentsRes]) => {
      if (dashboardRes.data?.data?.kpis) {
        setStats(prev => ({ ...prev, active_incidents: dashboardRes.data.data.kpis.active_incidents || prev.active_incidents }))
      }
      if (incidentsRes.data?.data) {
        const loadedIncidents = incidentsRes.data.data;
        setIncidents(loadedIncidents)
        
        // If no ID in URL but we have incidents, redirect to the first one
        if (!id && loadedIncidents.length > 0) {
          navigate(`/dashboard/incidents/${loadedIncidents[0].id}`, { replace: true });
        }
      }
    })
  }, [id, navigate])

  // Fetch investigation data when ID changes
  useEffect(() => {
    if (id) {
      axios.get(`http://127.0.0.1:8000/api/v1/incidents/${id}`)
        .then(res => setInvestigationData(res.data.data))
        .catch(err => console.error(err))
    }
  }, [id])

  const handleSelectIncident = (incidentId) => {
    if (id === incidentId.toString()) return;
    navigate(`/dashboard/incidents/${incidentId}`);
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Metrics Row */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-system shrink-0">
        <div className="p-4 border border-system rounded bg-system-surface flex flex-col justify-between">
          <div className="text-system-muted font-label-caps text-label-caps mb-2">Telemetry Events Today</div>
          <div className="font-data-mono-lg text-data-mono-lg text-system-light">
            <GsapCountUp to={stats.total_events} format={(v) => v.toLocaleString()} />
          </div>
        </div>
        <div className="p-4 border border-system rounded bg-system-surface flex flex-col justify-between">
          <div className="text-system-muted font-label-caps text-label-caps mb-2">Critical Alerts</div>
          <div className="font-data-mono-lg text-data-mono-lg text-system-critical">
            <GsapCountUp to={stats.alerts} format={(v) => v.toLocaleString()} />
          </div>
        </div>
        <div className="p-4 border border-system rounded bg-system-surface flex flex-col justify-between">
          <div className="text-system-muted font-label-caps text-label-caps mb-2">Open Investigations</div>
          <div className="font-data-mono-lg text-data-mono-lg text-primary">
            <GsapCountUp to={stats.active_incidents} />
          </div>
        </div>
        <div className="p-4 border border-system rounded bg-system-surface flex flex-col justify-between">
          <div className="text-system-muted font-label-caps text-label-caps mb-2">AI Confidence</div>
          <div className="font-data-mono-lg text-data-mono-lg text-system-light">
            <GsapCountUp to={stats.confidence} suffix="%" />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Incident Queue */}
        <div className="w-1/3 border-r border-system bg-system-surface overflow-y-auto flex flex-col">
          <div className="p-4 border-b border-system font-label-caps text-label-caps text-system-muted sticky top-0 bg-system-surface z-10">
            Incident Queue
          </div>
          {incidents.length === 0 ? (
            <div className="p-8 text-center text-system-muted text-sm">No incidents found.</div>
          ) : (
            incidents.map((inc) => (
              <div 
                key={inc.id}
                onClick={() => handleSelectIncident(inc.id)}
                style={{ animation: 'slideInAlert 0.2s cubic-bezier(0, 0, 0.2, 1) forwards, flashBackground 0.6s ease-out forwards' }}
                className={`p-4 border-b border-system border-l-2 cursor-pointer hover:bg-surface-variant transition-colors ${
                  id === inc.id.toString() ? "border-l-primary bg-[#1C232D]" : "border-l-transparent"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-block px-2 py-0.5 border text-[10px] uppercase font-bold rounded ${
                    inc.confidence_score > 70 
                      ? "bg-system-critical text-system-light" 
                      : "border-system text-system-muted"
                  }`}>
                    {inc.confidence_score > 70 ? 'Critical' : 'Medium'}
                  </span>
                  <span className={`font-data-mono-sm text-data-mono-sm ${
                    inc.confidence_score > 70 ? "text-primary" : "text-system-muted"
                  }`}>
                    {inc.confidence_score}% conf
                  </span>
                </div>
                <div className="font-body-md text-system-light font-semibold mb-1 truncate">{inc.title}</div>
                <div className="font-data-mono-sm text-data-mono-sm text-system-muted">INC-{inc.id}</div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Investigation Workspace */}
        <div className="flex-1 flex flex-col bg-[#0B0F14] overflow-y-auto">
          {investigationData ? (
            <div 
              key={investigationData.id} 
              className="flex flex-col h-full"
              style={{ animation: 'crossFade 0.15s ease-in-out forwards' }}
            >
              {/* Workspace Header */}
              <div className="p-6 border-b border-system shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-block px-2 py-1 border border-[#D4453A] bg-[rgba(212,69,58,0.1)] text-[#F5F3EE] font-label-caps text-label-caps rounded">
                      CRITICAL
                    </span>
                    <span className="font-data-mono-sm text-data-mono-sm text-system-muted">INC-{investigationData.id}</span>
                  </div>
                </div>
                <h1 className="font-headline-md text-headline-md text-system-light mb-2">{investigationData.incident_title}</h1>
              </div>

              <div className="p-6 flex-1 flex flex-col gap-8">
                {/* Evidence Panel */}
                <div className="border border-system rounded p-4 bg-system-surface shrink-0">
                  <h2 className="font-label-caps text-label-caps text-system-muted mb-3 border-b border-system pb-2">Root Cause Analysis</h2>
                  <p className="font-body-md mb-4 text-[#dde3ed]">{investigationData.root_cause}</p>
                  <ul className="list-disc pl-5 font-data-mono-sm text-data-mono-sm text-[#8A8F98] space-y-2">
                    {investigationData.evidence?.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Timeline */}
                <div className="flex-1">
                  <h2 className="font-label-caps text-label-caps text-system-muted mb-6">Attack Chain Timeline</h2>
                  <TimelineFlow events={investigationData.timeline} />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-system bg-system-surface flex items-center justify-between sticky bottom-0 z-10 shrink-0">
                <div className="flex gap-4">
                  <button className="font-body-md text-system-muted hover:text-system-light transition-colors">Export Report</button>
                  <button className="font-body-md text-system-muted hover:text-system-light transition-colors">Dismiss</button>
                </div>
                <div className="flex gap-4">
                  <button className="px-4 py-2 border border-system text-[#F5F3EE] font-bold rounded hover:bg-surface-variant active:scale-[0.97] transition-all">
                    Escalate to Fraud Team
                  </button>
                  <button className="px-4 py-2 bg-primary-container text-[#0B0F14] font-bold rounded hover:opacity-90 active:scale-[0.97] transition-all">
                    {investigationData.recommended_action || "Freeze Transaction"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-system-muted text-sm font-data-mono-sm">Select an incident to view summary</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
