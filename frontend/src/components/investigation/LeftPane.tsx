import { motion, AnimatePresence } from 'framer-motion';
import { FileWarning, Cpu, CheckCircle2 } from 'lucide-react';

export default function LeftPane({ evidenceList, chain, reasoning, isInvestigating, investigationStatus }: { evidenceList: string[]; chain: Array<{ timestamp: string; delta?: string; type: string; details: string; mitre?: string }>; reasoning: Array<{ rule: string; contribution: number; evidence: Record<string, unknown> }>; isInvestigating: boolean; investigationStatus: string[] }) {
  return (
    <div className="w-[30%] border-r border-border bg-surface/50 overflow-y-auto flex flex-col hide-scrollbar">
      {/* 1. Evidence */}
      <div className="p-6 border-b border-border bg-card/30">
        <h2 className="text-[13px] font-bold font-mono text-heading uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_#00E5FF]"></span>
          Correlated Evidence
        </h2>
        <div className="space-y-3">
          {evidenceList?.map((ev: string, i: number) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={i} 
              className="flex items-start gap-3 group p-2 rounded hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20"
            >
              <FileWarning className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-[13px] text-body group-hover:text-heading transition-colors leading-relaxed whitespace-pre-wrap">{ev}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. Timeline */}
      <div className="p-6 border-b border-border bg-background/50">
        <h2 className="text-[13px] font-bold font-mono text-muted uppercase tracking-widest mb-6">Attack Timeline</h2>
        <div className="relative pl-4 space-y-6 border-l border-border/50 ml-2">
          {chain?.map((ev: { timestamp: string; delta?: string; type: string; details: string; mitre?: string }, i: number) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="relative group"
            >
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border border-surface bg-muted group-hover:bg-primary transition-all"></div>
              
              <div className="flex items-center justify-between mb-1">
                <div className="text-[11px] font-mono text-muted group-hover:text-primary transition-colors">
                  {ev.timestamp.split('T')[1] || ev.timestamp}
                </div>
                {ev.delta && ev.delta !== 'Start' && (
                  <div className="text-[10px] font-mono text-warning bg-warning/10 px-1.5 rounded border border-warning/20">
                    {ev.delta}
                  </div>
                )}
              </div>
              
              <div className="text-[14px] font-bold text-heading leading-tight mb-1">{ev.type.replace(/_/g, ' ').toUpperCase()}</div>
              <div className="text-[12px] text-muted mb-2 leading-tight">{ev.details}</div>
              
              {ev.mitre && (
                <div className="text-[10px] font-mono text-primary mt-1 border border-primary/20 bg-primary/5 inline-block px-1.5 py-0.5 rounded">
                  MITRE: {ev.mitre}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Reasoning Trace */}
      <div className="p-6 flex-1 bg-card/30">
        <h2 className="text-[13px] font-bold font-mono text-heading uppercase tracking-widest mb-4 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-primary" />
          Correlation Engine
        </h2>

        {isInvestigating ? (
          <div className="space-y-4 font-mono text-[12px]">
            {investigationStatus.map((status: string, i: number) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-muted flex items-center gap-2"
              >
                <CheckCircle2 className="w-3 h-3 text-success" />
                {status}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {reasoning?.map((trace: { rule: string; contribution: number; evidence: Record<string, unknown> }, i: number) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.15, type: 'spring', bounce: 0.3 }}
                  key={i}
                  className="bg-surface border border-border rounded-lg p-3 relative overflow-hidden group hover:border-primary/40 transition-colors"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 group-hover:bg-primary transition-colors"></div>
                  <div className="flex justify-between items-start mb-2 pl-2">
                    <h4 className="text-[13px] font-bold text-heading tracking-tight">{trace.rule}</h4>
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded border border-primary/20 shrink-0">
                      +{trace.contribution} pts
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-muted pl-2 space-y-1">
                    {Object.entries(trace.evidence).map(([k, v]: [string, unknown], idx) => (
                      <div key={idx} className="flex">
                        <span className="opacity-60 w-24 shrink-0">{k}:</span>
                        <span className="text-body truncate">{typeof v === 'object' ? JSON.stringify(v) : String(v)}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
