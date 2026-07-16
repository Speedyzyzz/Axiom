'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, ShieldAlert, Clock, ArrowRight, Database, Terminal, Shield, MoreHorizontal, User, Server, Lock, Play, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const fetchIncidents = async () => {
  const res = await fetch(`${API_URL}/api/v1/incidents`);
  if (!res.ok) throw new Error("Failed to fetch incidents");
  const json = await res.json();
  return json.data || [];
};

const fetchDashboardStats = async () => {
  const res = await fetch(`${API_URL}/api/v1/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  const json = await res.json();
  return json.data.stats;
};

const fetchMitreCoverage = async () => {
  const res = await fetch(`${API_URL}/api/v1/mitre-coverage`);
  if (!res.ok) throw new Error("Failed to fetch MITRE stats");
  const json = await res.json();
  return json.data.coverage;
};

const runPipelineSeed = async (scenario: string) => {
  const res = await fetch(`${API_URL}/api/v1/investigate`, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ scenario })
  });
  if (!res.ok) throw new Error("Failed to run investigation engine");
  return await res.json();
};

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [scenario, setScenario] = useState('random');
  
  const { data: incidents = [], isLoading: isLoadingIncidents } = useQuery({ queryKey: ['incidents'], queryFn: fetchIncidents, refetchInterval: 5000, retry: 5, retryDelay: 2000 });
  const { data: stats, isLoading: isLoadingStats } = useQuery({ queryKey: ['dashboard_stats'], queryFn: fetchDashboardStats, refetchInterval: 5000, retry: 5 });
  const { data: mitreCoverage } = useQuery({ queryKey: ['mitre_coverage'], queryFn: fetchMitreCoverage, retry: 5 });

  const seedMutation = useMutation({
    mutationFn: runPipelineSeed,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard_stats'] });
      setIsSeeding(false);
    },
    onError: () => setIsSeeding(false)
  });

  const handleSeed = () => {
    setIsSeeding(true);
    seedMutation.mutate(scenario);
  };

  useGSAP(() => {
    if (!isLoadingIncidents && !isLoadingStats && containerRef.current) {
      gsap.fromTo(".fade-in-up", 
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.6, ease: "power3.out" }
      );
    }
  }, { scope: containerRef, dependencies: [incidents, stats, isLoadingIncidents, isLoadingStats] });

  // Convert object to array for mapping
  const mitreVolumes = mitreCoverage ? Object.entries(mitreCoverage).map(([tactic, count]) => ({ tactic, count: count as number })) : [];
  const maxMitreCount = mitreVolumes.length > 0 ? Math.max(...mitreVolumes.map(v => v.count)) : 100;

  const totalEvents = stats?.total_events || 0;
  const activeIncidentsCount = stats?.active_incidents || 0;
  
  const latestIncident = incidents.length > 0 ? incidents[0] : null;

  if (isLoadingIncidents || isLoadingStats) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full bg-background text-heading fade-in-up">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-6" />
        <h2 className="text-[18px] font-bold tracking-tight mb-2">Initializing Investigation Engine...</h2>
        <p className="text-[13px] text-muted font-medium max-w-sm text-center">
          Establishing connection to Threat Intelligence Service. This might take up to 40 seconds on cold start.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 flex flex-col h-full overflow-y-auto px-8 lg:px-12 py-10 bg-background text-body scroll-smooth">
      
      {/* Welcome Header */}
      <div className="flex justify-between items-end mb-10 fade-in-up">
        <div>
          <h1 className="text-[28px] font-bold text-heading tracking-tight mb-2">SOC Operations Console</h1>
          <p className="text-[14px] text-muted font-medium">Monitoring global telemetry and MITRE ATT&CK coverage.</p>
        </div>
        <div className="flex items-center gap-3">
          {latestIncident && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(`/dashboard/incidents/${latestIncident.id}?demo=true`)}
              className="px-5 py-2.5 bg-primary text-white text-[13px] font-bold rounded shadow-sm hover:shadow-md transition-all flex items-center gap-2"
            >
              Investigate Latest <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
          <div className="flex items-center bg-surface border border-border rounded shadow-sm">
            <select 
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              disabled={isSeeding}
              className="bg-transparent text-heading text-[13px] font-bold py-2.5 px-4 outline-none border-r border-border cursor-pointer disabled:opacity-50"
            >
              <option value="random">Random Scenario</option>
              <option value="vpn">VPN Compromise</option>
              <option value="ransomware">Ransomware Execution</option>
              <option value="insider">Insider Threat</option>
              <option value="sqli">SQL Injection & Data Theft</option>
              <option value="phishing">OAuth Consent Phishing</option>
              <option value="supply_chain">Supply Chain Compromise</option>
            </select>
            <motion.button
              whileHover={{ backgroundColor: 'var(--color-heading)', color: 'var(--color-background)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-5 py-2.5 bg-background text-heading text-[13px] font-bold transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSeeding ? 'Generating...' : <><Play className="w-4 h-4" /> Launch Investigation</>}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Linear-style Variable Weight Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
        
        {/* Large Outlined Card: MITRE Threat Volume Chart */}
        <div className="md:col-span-8 bg-transparent border-2 border-dashed border-border rounded-lg p-6 flex flex-col fade-in-up group relative">
          <div className="flex justify-between items-start mb-12">
            <div>
              <h2 className="text-[14px] font-bold text-heading mb-1 uppercase tracking-widest">Threat Volume by Tactic</h2>
              <p className="text-[12px] text-muted font-mono">Last 24 Hours</p>
            </div>
            <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded text-[11px] font-bold text-heading">
              <Database className="w-3.5 h-3.5 text-muted" /> {totalEvents.toLocaleString()} Events Processed
            </div>
          </div>
          
          {/* Custom Bar Chart */}
          <div className="flex-1 flex items-end gap-4 md:gap-8 pt-4 h-[160px] border-b border-border pb-2 relative">
            {/* Y Axis labels */}
            <div className="absolute -left-2 top-0 bottom-0 flex flex-col justify-between text-[10px] font-mono text-muted py-2 text-right">
              <span>{maxMitreCount}</span>
              <span>{Math.round(maxMitreCount/2)}</span>
              <span>0</span>
            </div>
            
            <div className="flex-1 flex items-end justify-between pl-8 h-full">
              {mitreVolumes.map((item, i) => (
                <div key={i} className="flex flex-col items-center group/bar h-full justify-end relative">
                  <div 
                    className="w-6 md:w-10 bg-primary/20 hover:bg-primary transition-colors rounded-t-sm relative shrink-0" 
                    style={{ height: `${Math.max((item.count / maxMitreCount) * 100, 5)}%` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-heading text-background text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-lg">
                      {item.count} events
                    </div>
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                    <span className="text-[9px] font-bold uppercase text-muted tracking-wider rotate-[-45deg] origin-top-left inline-block whitespace-nowrap">
                      {item.tactic}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medium Dark Card: Active Incidents */}
        <div className="md:col-span-4 linear-card-dark p-6 flex flex-col fade-in-up relative overflow-hidden">
          {/* Subtle noise/grid in dark card */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <h2 className="text-[13px] font-bold text-white/70 uppercase tracking-widest">Active Incidents</h2>
            {activeIncidentsCount > 0 && <div className="w-2 h-2 rounded-full bg-danger shadow-[0_0_8px_rgba(225,29,72,1)] animate-pulse"></div>}
          </div>
          <div className="flex-1 flex flex-col justify-end relative z-10">
            <div className="text-[72px] font-extrabold leading-none tracking-tighter text-white mb-4">{activeIncidentsCount}</div>
            {activeIncidentsCount > 0 ? (
              <div className="bg-danger/20 border border-danger/30 text-danger text-[12px] font-bold px-3 py-2 rounded">
                Critical priority triage required.
              </div>
            ) : (
              <div className="bg-success/20 border border-success/30 text-success text-[12px] font-bold px-3 py-2 rounded">
                All queues clear.
              </div>
            )}
          </div>
        </div>

        {/* Small Solid Colored Card */}
        <div className={`md:col-span-3 linear-card p-6 flex flex-col fade-in-up border-t-4 ${activeIncidentsCount > 0 ? 'border-t-danger' : 'border-t-primary'}`}>
          <h2 className="text-[12px] font-bold uppercase tracking-widest text-muted mb-4">System Status</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              {activeIncidentsCount > 0 ? (
                <>
                  <ShieldAlert className="w-10 h-10 mx-auto mb-3 text-danger opacity-90 animate-pulse" />
                  <div className="text-[16px] font-bold text-heading">{activeIncidentsCount} Critical Alert{activeIncidentsCount !== 1 ? 's' : ''}</div>
                </>
              ) : (
                <>
                  <Shield className="w-10 h-10 mx-auto mb-3 text-primary opacity-90" />
                  <div className="text-[16px] font-bold text-heading">All nodes healthy</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Investigation Queue (Dense Table with Avatars & Badges) */}
        <div className="md:col-span-9 linear-card flex flex-col fade-in-up overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-background/50">
            <h2 className="text-[13px] font-bold text-heading uppercase tracking-widest flex items-center gap-2">
              <Terminal className="w-4 h-4 text-muted" /> Investigation Queue
            </h2>
            <button className="text-[12px] font-bold text-muted hover:text-heading transition-colors"><MoreHorizontal className="w-4 h-4"/></button>
          </div>
          
          <div className="overflow-x-auto min-h-[200px]">
            <table className="w-full text-left text-[13px]">
              <thead className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border">
                <tr>
                  <th className="px-5 py-3">Incident Name</th>
                  <th className="px-5 py-3">Severity</th>
                  <th className="px-5 py-3">Affected Entity</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <AnimatePresence>
                  {incidents.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center text-muted">
                          <ShieldAlert className="w-8 h-8 mb-3 opacity-50" />
                          <p className="text-[13px] font-medium">No active incidents found.</p>
                          <p className="text-[11px] mt-1">Run the pipeline engine to seed data.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    incidents.map((inc: { id: number; title: string; severity: string; stage?: string; affected_account?: string; last_event?: string }, i: number) => (
                      <motion.tr 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        key={inc.id}
                        onClick={() => router.push(`/dashboard/incidents/${inc.id}`)}
                        className="hover:bg-background cursor-pointer group transition-colors"
                      >
                        {/* Name Col */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-8 rounded-full ${inc.severity === 'Critical' ? 'bg-danger' : 'bg-warning'}`}></div>
                            <div>
                              <div className="font-bold text-heading mb-0.5 truncate max-w-[220px]">{inc.title}</div>
                              <div className="text-[11px] text-muted font-mono flex items-center gap-2">
                                <span className="bg-border/50 text-body px-1.5 rounded">{inc.stage || 'Lateral Movement'}</span>
                                INC-{inc.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Severity Pill */}
                        <td className="px-5 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                            inc.severity === 'Critical' ? 'bg-danger/10 text-danger border-danger/20' : 'bg-warning/10 text-warning border-warning/20'
                          }`}>
                            {inc.severity?.toUpperCase() || 'CRITICAL'}
                          </span>
                        </td>
                        
                        {/* Affected Avatar */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded bg-background border border-border flex items-center justify-center text-muted">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <span className="font-mono text-[11px] text-heading font-bold">{inc.affected_account || 'SVC-API-002'}</span>
                          </div>
                        </td>
                        
                        {/* Timestamp */}
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-1.5 text-muted text-[12px] font-medium">
                            <Clock className="w-3.5 h-3.5" /> {inc.last_event || 'Just now'}
                          </div>
                        </td>
                        
                        {/* Row Action */}
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex items-center gap-1 bg-heading text-white px-3 py-1.5 rounded text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-200">
                            Review <ArrowRight className="w-3 h-3" />
                          </span>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
