'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, Clock, Database } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Problem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".problem-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, 
          y: 0, 
          stagger: 0.2, 
          duration: 0.8, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="py-24 bg-surface/30 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16 problem-card">
          <h2 className="text-[32px] md:text-[40px] font-bold text-heading tracking-tight mb-4">The SIEM Era is Over.</h2>
          <p className="text-[18px] text-muted max-w-2xl mx-auto">
            Analysts spend 40 minutes per incident manually correlating logs across disconnected systems. The attacker moves in 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="problem-card bg-card border border-border p-8 rounded-xl shadow-sm">
            <Clock className="w-8 h-8 text-danger mb-6" />
            <h3 className="text-[18px] font-bold text-heading mb-3">Too Slow</h3>
            <p className="text-[14px] text-muted leading-relaxed">
              Manual queries across Splunk, EDR, and Identity providers take hours. Context is lost between browser tabs.
            </p>
          </div>
          
          <div className="problem-card bg-card border border-border p-8 rounded-xl shadow-sm">
            <AlertCircle className="w-8 h-8 text-warning mb-6" />
            <h3 className="text-[18px] font-bold text-heading mb-3">Alert Fatigue</h3>
            <p className="text-[14px] text-muted leading-relaxed">
              SOCs are drowning in isolated alerts. True attacks are buried in thousands of false positives and benign events.
            </p>
          </div>
          
          <div className="problem-card bg-card border border-border p-8 rounded-xl shadow-sm">
            <Database className="w-8 h-8 text-primary mb-6" />
            <h3 className="text-[18px] font-bold text-heading mb-3">Siloed Data</h3>
            <p className="text-[14px] text-muted leading-relaxed">
              Network telemetry doesn&apos;t talk to Identity. Endpoint data doesn&apos;t talk to Cloud. Attackers exploit the gaps.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
