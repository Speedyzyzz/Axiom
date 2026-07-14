'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-element",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.1 }
      );
      
      gsap.fromTo(".hero-line",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.5, ease: "power2.inOut", delay: 0.5, transformOrigin: "top" }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      </div>

      {/* Decorative Line */}
      <div className="absolute left-1/2 top-0 bottom-1/2 w-[1px] bg-border hero-line hidden md:block"></div>

      <div className="max-w-5xl mx-auto px-6 text-center z-10">
        <div className="hero-element inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface border border-border text-[12px] font-mono text-muted mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          AttackChain AI Enterprise OS
        </div>
        
        <h1 className="hero-element text-[56px] md:text-[80px] font-extrabold text-heading tracking-tighter leading-[1.05] mb-8">
          Investigate Attacks.<br/>
          <span className="text-muted">Not Alerts.</span>
        </h1>
        
        <p className="hero-element text-[18px] md:text-[22px] text-muted max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
          The operating system for modern security teams. We reconstruct multi-stage cyber attacks into single, explainable incidents in seconds.
        </p>
        
        <div className="hero-element flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-4 bg-heading text-background font-bold text-[13px] rounded-lg hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-xl focus:ring-2 focus:ring-primary focus:outline-none"
          >
            Launch Investigation <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
