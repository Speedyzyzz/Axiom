import { motion } from 'framer-motion';
import { ShieldAlert, ShieldBan, GitMerge, CheckSquare } from 'lucide-react';

export default function RightPane({ attackData, recommendations }: { attackData?: { executive_summary?: string; technical_summary?: string; business_impact?: string }; recommendations?: { playbook?: string; recommended_actions?: string[] } }) {
  return (
    <div className="w-[30%] bg-surface flex flex-col overflow-hidden">
      
      {/* 1. Summaries */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <h2 className="text-[13px] font-bold font-mono text-heading uppercase tracking-widest flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-danger" /> 
          Executive Summary
        </h2>
        
        <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
          <p className="text-[14px] text-body leading-relaxed">{attackData?.executive_summary}</p>
        </div>

        <h3 className="text-[12px] font-bold font-mono text-muted uppercase tracking-widest mt-6">Technical Summary</h3>
        <div className="bg-background border border-border p-4 rounded-lg font-mono text-[12px] text-muted leading-relaxed">
          {attackData?.technical_summary}
        </div>

        <h3 className="text-[12px] font-bold font-mono text-muted uppercase tracking-widest mt-6">Business Impact</h3>
        <div className="bg-danger/10 border border-danger/20 p-4 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <p className="text-[13px] text-danger font-bold leading-relaxed">{attackData?.business_impact}</p>
        </div>
      </div>

      {/* 2. Action Center / Playbook */}
      <div className="p-6 bg-card border-t border-border shrink-0 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <h2 className="text-[13px] font-bold font-mono text-heading uppercase tracking-widest mb-4 flex items-center gap-2">
          <ShieldBan className="w-4 h-4 text-warning" />
          Action Center
        </h2>
        
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-3 mb-4">
          <div className="text-[11px] font-mono text-warning font-bold mb-1 tracking-widest">RECOMMENDED PLAYBOOK</div>
          <div className="text-[14px] font-bold text-heading">{recommendations?.playbook}</div>
        </div>

        <div className="space-y-3 mb-6">
          {recommendations?.recommended_actions?.map((action: string, i: number) => (
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + (i * 0.1) }}
              key={i} 
              className="flex items-center gap-3 text-[13px] text-body"
            >
              <CheckSquare className="w-4 h-4 text-muted shrink-0" />
              <span className="leading-tight">{action}</span>
            </motion.div>
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0,229,255,0.3)' }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-4 bg-primary text-background font-bold text-[13px] rounded-lg shadow-[0_5px_15px_rgba(0,229,255,0.2)] flex items-center justify-center gap-2 hover:bg-[#00c9e0] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary focus:outline-none"
        >
          <GitMerge className="w-5 h-5" />
          Execute Mitigation Playbook
        </motion.button>
      </div>

    </div>
  );
}
