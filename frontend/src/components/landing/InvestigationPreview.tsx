'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Terminal } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function InvestigationPreview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [terminalStep, setTerminalStep] = useState(0);
  const terminalLines = [
    "~ $ attackchain analyze --target incident-4029",
    "Initializing Deterministic Investigation Engine...",
    "✓ Ingesting 1.2M raw telemetry events",
    "✓ Normalizing across 14 vendor schemas",
    "✓ Correlating Neo4j entity graph",
    "✓ Mapping 12 actions to MITRE ATT&CK",
    "✓ Executing Correlation Rules (Impossible Travel, Privilege Escalation)",
    "Report generated in 0.04s. Confidence: 100%"
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".terminal-container",
        { opacity: 0, y: 30 },
        {
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
    }, containerRef);
    
    const interval = setInterval(() => {
      setTerminalStep(prev => (prev < terminalLines.length ? prev + 1 : prev));
    }, 800);

    return () => {
      ctx.revert();
      clearInterval(interval);
    };
  }, [terminalLines.length]);

  return (
    <section ref={containerRef} className="py-24 relative bg-[#050816]">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-[32px] md:text-[40px] font-bold text-heading tracking-tight mb-4">Investigation at the speed of thought.</h2>
          <p className="text-[18px] text-muted max-w-2xl">Stop manually querying Splunk. AttackChain ingests your telemetry and automatically builds the evidence graph.</p>
        </div>

        <div className="terminal-container w-full max-w-3xl mx-auto rounded-xl overflow-hidden border border-border shadow-2xl bg-card font-mono text-[13px]">
          <div className="px-4 py-3 border-b border-border bg-surface flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-danger/50"></div>
            <div className="w-3 h-3 rounded-full bg-warning/50"></div>
            <div className="w-3 h-3 rounded-full bg-success/50"></div>
            <span className="ml-4 text-muted text-[12px]">bash - attackchain-core</span>
          </div>
          <div className="p-6 text-body min-h-[300px] flex flex-col gap-3">
            {terminalLines.map((line, i) => (
              <div key={i} className={`transition-opacity duration-300 ${i < terminalStep ? 'opacity-100' : 'opacity-0 hidden'}`}>
                {line.startsWith('~ $') ? (
                  <span className="text-primary">{line}</span>
                ) : line.startsWith('✓') ? (
                  <span className="text-success">{line}</span>
                ) : line.startsWith('Report') ? (
                  <span className="text-heading font-bold bg-primary/10 px-2 py-1 inline-block mt-4 border border-primary/20 rounded">{line}</span>
                ) : (
                  <span className="text-muted">{line}</span>
                )}
              </div>
            ))}
            {terminalStep >= 1 && terminalStep < terminalLines.length && (
              <div className="flex items-center gap-2 text-primary mt-2">
                <Terminal className="w-4 h-4 animate-pulse" /> Processing...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
