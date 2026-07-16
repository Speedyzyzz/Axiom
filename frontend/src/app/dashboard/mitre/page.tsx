'use client';

import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Target, Activity, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const fetchMitreCoverage = async () => {
  const res = await fetch(`${API_URL}/api/v1/mitre-coverage`);
  if (!res.ok) throw new Error("Failed to fetch mitre coverage");
  const json = await res.json();
  return json.data?.coverage || {};
};

const MITRE_TACTICS = [
  { id: 'TA0001', name: 'Initial Access', description: 'Techniques that use various entry vectors to gain their initial foothold within a network.' },
  { id: 'TA0002', name: 'Execution', description: 'Techniques that result in adversary-controlled code running on a local or remote system.' },
  { id: 'TA0003', name: 'Persistence', description: 'Techniques that adversaries use to keep access to systems across restarts, changed credentials, etc.' },
  { id: 'TA0004', name: 'Privilege Escalation', description: 'Techniques that adversaries use to gain higher-level permissions on a system or network.' },
  { id: 'TA0005', name: 'Defense Evasion', description: 'Techniques that adversaries use to avoid detection throughout their compromise.' },
  { id: 'TA0006', name: 'Credential Access', description: 'Techniques for stealing credentials like account names and passwords.' },
  { id: 'TA0007', name: 'Discovery', description: 'Techniques an adversary may use to gain knowledge about the system and internal network.' },
  { id: 'TA0008', name: 'Lateral Movement', description: 'Techniques that adversaries use to enter and control remote systems on a network.' },
  { id: 'TA0040', name: 'Impact', description: 'Techniques that adversaries use to disrupt availability or compromise integrity.' }
];

export default function MitrePage() {
  const { data: coverage, isLoading } = useQuery({ 
    queryKey: ['mitre_heatmap'], 
    queryFn: fetchMitreCoverage,
    retry: 3
  });

  const getHeatmapColor = (score: number) => {
    if (score >= 90) return 'bg-success/20 border-success/30 text-success shadow-[0_0_15px_rgba(34,197,94,0.15)]';
    if (score >= 70) return 'bg-warning/20 border-warning/30 text-warning shadow-[0_0_15px_rgba(245,158,11,0.15)]';
    if (score >= 40) return 'bg-primary/20 border-primary/30 text-primary shadow-[0_0_15px_rgba(59,130,246,0.15)]';
    return 'bg-danger/20 border-danger/30 text-danger shadow-[0_0_15px_rgba(239,68,68,0.15)]';
  };

  const getIconForScore = (score: number) => {
    if (score >= 90) return <Target className="w-5 h-5 mb-3" />;
    if (score >= 70) return <Activity className="w-5 h-5 mb-3" />;
    if (score >= 40) return <ShieldAlert className="w-5 h-5 mb-3" />;
    return <AlertCircle className="w-5 h-5 mb-3" />;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-8 lg:px-12 py-10 bg-background text-body">
      
      <div className="flex justify-between items-end mb-10">
        <div className="max-w-2xl">
          <h1 className="text-[28px] font-bold text-heading tracking-tight mb-2 flex items-center gap-3">
            <Shield className="w-7 h-7 text-primary" />
            MITRE ATT&CK Coverage
          </h1>
          <p className="text-[14px] text-muted font-medium leading-relaxed">
            Real-time mapping of detected events against the MITRE ATT&CK Enterprise Matrix. Coverage percentages indicate the correlation engine's confidence and detection capability for each tactical pillar based on ingested telemetry.
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-4 bg-surface border border-border px-4 py-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-success/20 border border-success/30"></div><span className="text-[11px] font-bold text-muted uppercase">High Coverage</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-warning/20 border border-warning/30"></div><span className="text-[11px] font-bold text-muted uppercase">Medium</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30"></div><span className="text-[11px] font-bold text-muted uppercase">Partial</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-danger/20 border border-danger/30"></div><span className="text-[11px] font-bold text-muted uppercase">Blind Spot</span></div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {MITRE_TACTICS.map((tactic, i) => {
              const score = coverage?.[tactic.name] || 0;
              const colorClass = getHeatmapColor(score);
              
              return (
                <motion.div 
                  key={tactic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="linear-card group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-[10px] font-bold text-muted font-mono mb-1">{tactic.id}</div>
                      <h3 className="text-[16px] font-bold text-heading">{tactic.name}</h3>
                    </div>
                    <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl border ${colorClass} transition-colors`}>
                      <span className="text-[16px] font-bold">{score}%</span>
                    </div>
                  </div>
                  
                  <p className="text-[13px] text-muted leading-relaxed mb-6">
                    {tactic.description}
                  </p>
                  
                  <div className="w-full bg-surface border border-border h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ duration: 1, delay: 0.2 + (i * 0.05), ease: "easeOut" }}
                      className={`h-full ${score >= 90 ? 'bg-success' : score >= 70 ? 'bg-warning' : score >= 40 ? 'bg-primary' : 'bg-danger'}`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
