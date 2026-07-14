'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Metrics() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".metric-card",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1, 
          scale: 1,
          stagger: 0.1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const metrics = [
    { num: "< 3m", label: "Investigation Time" },
    { num: "100%", label: "Explainability" },
    { num: "1.2M", label: "Events Correlated" },
    { num: "14", label: "MITRE Techniques" }
  ];

  return (
    <section ref={containerRef} className="py-24 bg-surface/30 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {metrics.map((metric, i) => (
            <div key={i} className="metric-card">
              <div className="text-[40px] md:text-[56px] font-extrabold text-heading tracking-tight mb-2">{metric.num}</div>
              <div className="text-[12px] font-mono text-primary uppercase tracking-widest">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
