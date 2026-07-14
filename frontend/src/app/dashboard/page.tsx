'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import gsap from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

const fetchDashboardStats = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/dashboard');
    const json = await res.json();
    return json.data.kpis;
  } catch {
    return { active_incidents: 0, total_events: 0, alerts: 0, confidence: 0 };
  }
};

const fetchIncidents = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/v1/incidents');
    const json = await res.json();
    return json.data;
  } catch {
    return [];
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: fetchDashboardStats });
  const { data: incidents } = useQuery({ queryKey: ['incidents'], queryFn: fetchIncidents });

  useEffect(() => {
    if (!stats || !incidents) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      tl.fromTo(".kpi-card", 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
      )
      .fromTo(".dashboard-panel",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" },
        "-=0.4"
      );

      countersRef.current.forEach((el) => {
        if (!el) return;
        const targetValue = parseInt(el.getAttribute('data-value') || '0', 10);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: targetValue,
          duration: 0.5,
          ease: "expo.out",
          onUpdate: () => {
            el.innerText = Math.round(obj.val).toLocaleString();
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [stats, incidents]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen p-8 gap-8 relative bg-[#050816] text-body">
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-[28px] font-bold text-heading tracking-tight mb-1">Security Operations</h1>
          <p className="text-muted text-[14px]">Real-time threat investigation and telemetry correlation.</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,229,255,0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push(`/dashboard/incidents/1?demo=true`)}
          className="px-6 py-3 bg-primary text-background font-bold text-[13px] rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.2)] transition-colors flex items-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#050816] focus:ring-primary focus:outline-none"
        >
          <ShieldAlert className="w-4 h-4" /> Start Demo Investigation
        </motion.button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0 relative z-10">
        {[
          { label: 'Events Today', value: stats?.total_events || 0, color: 'text-heading' },
          { label: 'Critical Alerts', value: stats?.alerts || 0, color: 'text-danger' },
          { label: 'Active Investigations', value: stats?.active_incidents || 0, color: 'text-primary' },
          { label: 'Threat Confidence', value: stats?.confidence || 0, suffix: '%', color: 'text-heading' }
        ].map((kpi, i) => (
          <div key={i} className="kpi-card bg-surface/50 border border-border p-6 rounded-xl relative overflow-hidden group">
            <div className="text-[13px] font-mono text-muted mb-2 uppercase tracking-widest">{kpi.label}</div>
            <div className={`text-[36px] font-bold tracking-[-0.03em] ${kpi.color}`}>
              <span ref={el => { countersRef.current[i] = el }} data-value={kpi.value}>0</span>
              {kpi.suffix}
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary to-transparent w-full scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </div>
        ))}
      </div>

        <div className="dashboard-panel bg-surface/30 border border-border rounded-xl flex flex-col overflow-hidden w-full">
          <div className="px-6 py-5 border-b border-border bg-surface/50 flex justify-between items-center">
            <h2 className="text-[16px] font-bold text-heading flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Prioritized Incidents
            </h2>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-surface/30 text-[11px] font-mono text-muted uppercase tracking-widest border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-normal">ID</th>
                  <th className="px-6 py-4 font-normal">Title</th>
                  <th className="px-6 py-4 font-normal">Severity</th>
                  <th className="px-6 py-4 font-normal">Confidence</th>
                  <th className="px-6 py-4 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <AnimatePresence>
                  {incidents?.map((inc: { id: string; title: string; severity: string; confidence_score: number }, i: number) => (
                    <motion.tr 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={inc.id}
                      onClick={() => router.push(`/dashboard/incidents/${inc.id}`)}
                      className="hover:bg-primary/5 cursor-pointer group transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-muted group-hover:text-primary transition-colors">INC-{inc.id}</td>
                      <td className="px-6 py-4 font-semibold text-heading">{inc.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[11px] font-bold font-mono ${inc.severity === 'Critical' ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-warning/10 text-warning border border-warning/20'}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-background rounded-full overflow-hidden">
                            <div className={`h-full ${inc.confidence_score === 100 ? 'bg-danger' : 'bg-warning'}`} style={{ width: `${inc.confidence_score}%` }}></div>
                          </div>
                          <span className="font-mono">{inc.confidence_score}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity font-mono text-[12px]">INVESTIGATE &rarr;</span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
    </div>
  );
}
