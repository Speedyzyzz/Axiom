import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ShieldBan, TerminalSquare, CheckSquare, Cpu } from 'lucide-react';

export default function RightPane({ attackData, recommendations, isInvestigating, investigationStatus, auditLogs }: { attackData?: { executive_summary?: string; technical_summary?: string; business_impact?: string; incident_title?: string; root_cause?: string; }; recommendations?: string[]; isInvestigating?: boolean; investigationStatus?: string[]; auditLogs?: any[] }) {
  return (
    <div className="flex flex-col h-full bg-background overflow-hidden border-l border-border">
      
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {/* 1. Audit Log / Deterministic Engine */}
        <div className="p-5 border-b border-border bg-surface">
          <h2 className="text-[11px] font-bold text-heading uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
            <Cpu className="w-3.5 h-3.5 text-muted" /> Audit Log
          </h2>

          <div className="space-y-3">
            {isInvestigating ? (
              <div className="bg-[#0A0A0A] p-4 rounded-md font-mono text-[11px] space-y-2">
                {investigationStatus?.map((status: string, i: number) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-white/70 flex items-start gap-2 font-medium"
                  >
                    <span className="text-success mt-0.5">&gt;</span>
                    {status}
                  </motion.div>
                ))}
                <div className="w-2 h-3 bg-white/50 animate-pulse mt-2"></div>
              </div>
            ) : (
              <AnimatePresence>
                {auditLogs?.map((log: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }}
                    key={i}
                    className="bg-background border border-border rounded-md p-3 relative overflow-hidden group hover:bg-surface transition-colors"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border group-hover:bg-primary transition-colors"></div>
                    
                    <div className="flex justify-between items-start mb-2 pl-2">
                      <h4 className="text-[11px] font-bold text-heading uppercase tracking-wide">{log.action}</h4>
                      <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shrink-0">
                        {log.user}
                      </span>
                    </div>
                    
                    <div className="text-[10px] font-mono text-muted pl-2">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
            {!isInvestigating && (!auditLogs || auditLogs.length === 0) && (
              <div className="text-[11px] text-muted font-mono bg-background p-3 rounded-md border border-border">No audit logs available.</div>
            )}
          </div>
        </div>

        {/* 2. AI Synthesis */}
        <div className="p-5 space-y-4 bg-surface border-b border-border">
          <h2 className="text-[11px] font-bold text-heading uppercase tracking-widest flex items-center gap-2 font-sans mb-2">
            <TerminalSquare className="w-3.5 h-3.5 text-muted" /> AI Synthesis
          </h2>
          
          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Executive Summary</h3>
            <p className="text-[12px] text-heading font-medium leading-relaxed">{attackData?.business_impact || "Investigation is ongoing."}</p>
          </div>

          <div>
            <h3 className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Root Cause</h3>
            <p className="text-[12px] text-danger font-bold leading-relaxed">{attackData?.root_cause || "Assessing potential impact."}</p>
          </div>
          
          <div className="flex gap-4">
             <div className="flex-1">
               <h3 className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Affected Assets</h3>
               <p className="text-[12px] text-heading font-medium">Multiple Endpoints</p>
             </div>
             <div className="flex-1">
               <h3 className="text-[10px] text-muted uppercase tracking-widest font-bold mb-1">Risk</h3>
               <p className="text-[12px] text-warning font-bold">Critical</p>
             </div>
          </div>
        </div>
      </div>

      {/* 3. Action Center */}
      <div className="p-5 bg-background border-t border-border shrink-0 z-10">
        <h2 className="text-[11px] font-bold text-heading uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
          <ShieldBan className="w-3.5 h-3.5 text-warning" /> Hard Action
        </h2>
        
        <div className="bg-warning/5 border border-warning/20 rounded-md p-3 mb-4">
          <div className="text-[9px] font-mono text-warning font-bold mb-1 tracking-widest uppercase">Target Playbook</div>
          <div className="text-[12px] font-bold text-heading">Automated Containment Protocol</div>
        </div>

        <div className="space-y-2 mb-5">
          {recommendations?.map((action: string, i: number) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-body font-medium">
              <CheckSquare className="w-3.5 h-3.5 text-muted shrink-0 mt-0.5" />
              <span className="leading-snug">{action}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
