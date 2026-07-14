'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Architecture() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".arch-node",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1, 
          scale: 1,
          y: 0,
          stagger: 0.1, 
          duration: 0.6, 
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const stages = [
    { num: "01", name: "Telemetry Ingestion" },
    { num: "02", name: "Schema Normalization" },
    { num: "03", name: "Threat Intel Enrichment" },
    { num: "04", name: "MITRE Mapping" },
    { num: "05", name: "Deterministic Correlation" },
    { num: "06", name: "Risk Scoring" }
  ];

  return (
    <section ref={containerRef} className="py-24 bg-[#050816]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-bold text-heading tracking-tight mb-4">Enterprise Architecture</h2>
          <p className="text-[18px] text-muted max-w-2xl mx-auto">
            A 6-stage deterministic pipeline built for auditability and speed. We don&apos;t rely on black-box AI to score incidents.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {stages.map((stage, i) => (
            <div key={i} className="arch-node bg-surface border border-border p-6 rounded-lg relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-border group-hover:bg-primary transition-colors"></div>
              <div className="text-[12px] font-mono text-primary mb-2 opacity-70">STAGE {stage.num}</div>
              <h3 className="text-[16px] font-bold text-heading">{stage.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
