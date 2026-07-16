import { motion } from 'framer-motion';
import { FileCode2, Clock, Crosshair, AlertTriangle } from 'lucide-react';

export default function LeftPane({ evidenceList, chain, iocs }: { evidenceList: any[]; chain: { action: string, time: string }[]; iocs?: any[] }) {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto hide-scrollbar font-mono">
      
      {/* 1. Forensics Timeline */}
      <div className="p-5 border-b border-border bg-surface">
        <h2 className="text-[11px] font-bold text-heading uppercase tracking-widest mb-6 flex items-center gap-2 font-sans">
          <Clock className="w-3.5 h-3.5 text-muted" /> Attack Vector Timeline
        </h2>
        
        <div className="relative pl-3 border-l border-border ml-1.5 space-y-6">
          {chain?.map((item: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              key={i} 
              className="relative group flex flex-col"
            >
              <div className="absolute -left-[15px] top-1.5 w-1.5 h-1.5 rounded-full border border-border bg-muted group-hover:bg-primary transition-all"></div>
              <div className="text-[10px] text-muted font-bold tracking-widest">{item.time}</div>
              <div className="text-[12px] font-bold text-heading mb-3">{item.action}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. IOCs */}
      {iocs && iocs.length > 0 && (
        <div className="p-5 border-b border-border bg-surface">
          <h2 className="text-[11px] font-bold text-heading uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
            <AlertTriangle className="w-3.5 h-3.5 text-danger" /> Indicators of Compromise
          </h2>
          <div className="space-y-3">
            {iocs.map((ioc: any, i: number) => (
              <div key={i} className="bg-surface border border-border p-3 rounded-md">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-muted uppercase">{ioc.type}</span>
                  <span className="text-[10px] text-primary bg-primary/10 px-1.5 rounded">{ioc.context}</span>
                </div>
                <div className="text-[12px] font-mono text-heading break-all font-bold">{ioc.value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Raw Evidence Log */}
      <div className="p-5 flex-1 bg-background text-body">
        <h2 className="text-[11px] font-bold text-muted uppercase tracking-widest mb-4 flex items-center gap-2 font-sans">
          <FileCode2 className="w-3.5 h-3.5" /> Raw Telemetry Fragments
        </h2>
        <div className="space-y-3">
          {evidenceList?.map((ev: any, i: number) => (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              key={i} 
              className="bg-surface border border-border p-3 rounded-md hover:border-muted transition-colors group relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-0.5 h-full bg-border group-hover:bg-primary transition-colors"></div>
              <div className="flex flex-col gap-1.5 pl-2">
                <div className="flex justify-between items-center">
                  <div className="text-[11px] font-bold text-heading">{ev.title}</div>
                  <div className="text-[9px] text-muted uppercase bg-background px-1 rounded border border-border">{ev.confidence}</div>
                </div>
                <div className="text-[10px] text-muted leading-relaxed mb-1">{ev.description}</div>
                {ev.metadata_json && Object.keys(ev.metadata_json).length > 0 && (
                  <pre className="text-[9px] text-muted bg-background p-2 rounded border border-border overflow-x-auto">
                    {JSON.stringify(ev.metadata_json, null, 2)}
                  </pre>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
