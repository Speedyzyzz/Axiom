'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import SplitType from 'split-type';
import { Shield, ArrowRight, Play, Server, Lock, Activity, Users, Database, ArrowUpRight, Search, FileText, Box, Zap } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Lenis Initialization
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);

    // Nav Blur effect
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: '+=200',
      onUpdate: (self) => {
        gsap.to('.nav-bg', { 
          backgroundColor: `rgba(11, 13, 18, ${self.progress * 0.8})`, 
          backdropFilter: `blur(${self.progress * 20}px)`, 
          duration: 0.2 
        });
      }
    });

    // Vertical Scroll Progress Indicator
    gsap.to('.scroll-progress', {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0,
      }
    });

    // 2. SplitType & Hero Reveal
    const headline = new SplitType('.hero-headline', { types: 'lines,words,chars' });
    
    // Set initial state for clipping mask reveal
    gsap.set(headline.words, { y: 50, opacity: 0 });
    gsap.set('.hero-ui-card', { y: 100, opacity: 0, scale: 0.95 });
    
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.6 } });
    
    heroTl.to(headline.words, { 
      y: 0, 
      opacity: 1, 
      stagger: 0.08, 
    }, 0.2)
    .to('.hero-desc', { y: 0, opacity: 1, duration: 1.2 }, 0.8)
    .to('.hero-ui-card', { y: 0, opacity: 1, scale: 1, duration: 1.5 }, 1.2);

    // Hero Pin & Parallax
    gsap.to('.hero-grid', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });

    ScrollTrigger.create({
      trigger: '.hero-section',
      start: 'top top',
      end: '+=800',
      pin: true,
      scrub: true,
      animation: gsap.timeline().to('.hero-content', { opacity: 0, y: -50, scale: 0.95 })
    });

    // 3. Scroll Storytelling (Thousands of alerts...)
    const storyTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.story-sequence',
        start: 'top top',
        end: '+=4000',
        pin: true,
        scrub: 1,
      }
    });

    const storyTexts = ['.story-1', '.story-2', '.story-3', '.story-4', '.story-5'];
    
    // Make sure they start hidden and blurred
    gsap.set(storyTexts, { opacity: 0, y: 50, position: 'absolute', filter: 'blur(20px)' });
    
    storyTexts.forEach((text, i) => {
      // Fade in, move up, and remove blur
      storyTl.to(text, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 });
      
      // If it's not the last text, fade it out, move it up more, and blur it again
      if (i !== storyTexts.length - 1) {
        storyTl.to(text, { opacity: 0, y: -50, filter: 'blur(20px)', duration: 1 }, "+=0.5");
      } else {
        // Last text stays a bit longer
        storyTl.to(text, { opacity: 1 }, "+=2");
      }
    });

    // 4. Attack Graph Reveal
    const graphTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.graph-section',
        start: 'top top',
        end: '+=2500',
        pin: true,
        scrub: 1,
      }
    });

    gsap.set('.graph-node', { scale: 0, opacity: 0 });
    gsap.set('.graph-edge', { strokeDasharray: 1000, strokeDashoffset: 1000 });
    
    // Draw edges and pop nodes
    graphTl.to('.graph-edge-1', { strokeDashoffset: 0, duration: 1 }, 0)
           .to('.graph-node-1', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 0.5)
           .to('.graph-edge-2', { strokeDashoffset: 0, duration: 1 }, 1)
           .to('.graph-node-2', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 1.5)
           .to('.graph-edge-3', { strokeDashoffset: 0, duration: 1 }, 2)
           .to('.graph-node-3', { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' }, 2.5);

    // Update UI elements in sync
    graphTl.to('.graph-ui-1', { opacity: 1, x: 0, duration: 0.5 }, 1.5)
           .to('.graph-ui-2', { opacity: 1, x: 0, duration: 0.5 }, 2.5)
           .to('.graph-ui-3', { opacity: 1, x: 0, duration: 0.5 }, 3.5);
           
    // Threat score counter
    graphTl.to({ value: 0 }, { 
      value: 98, 
      duration: 3, 
      ease: 'none',
      onUpdate: function() {
         const scoreEl = document.querySelector('.threat-score');
         if (scoreEl) scoreEl.textContent = Math.round(this.targets()[0].value).toString();
      }
    }, 0);

    // 5. Horizontal Scroll Section
    const horizontalPanels = gsap.utils.toArray<HTMLElement>('.horizontal-panel');
    gsap.to(horizontalPanels, {
      xPercent: -100 * (horizontalPanels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.horizontal-container',
        pin: true,
        scrub: 1,
        end: () => `+=${document.querySelector('.horizontal-container')?.scrollWidth}`,
      }
    });

    // Cleanup
    return () => lenis.destroy();
  }, { scope: containerRef });

  // 3D Card Mouse Tracking Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
    
    // Calculate rotation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg tilt
    const rotateY = ((x - centerX) / centerX) * 5;
    
    gsap.to(card, {
      rotateX,
      rotateY,
      duration: 0.5,
      ease: 'power2.out',
      transformPerspective: 1000
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'power3.out'
    });
  };

  return (
    <div ref={containerRef} className="bg-background text-heading font-sans min-h-screen relative">
      
      {/* Vertical Scroll Progress Indicator */}
      <div className="fixed top-0 right-0 w-1 h-full bg-border z-50 mix-blend-difference hidden md:block">
         <div className="scroll-progress w-full h-full bg-white scale-y-0 origin-top"></div>
      </div>

      {/* Navigation */}
      <nav className="nav-bg fixed top-0 left-0 w-full px-8 md:px-16 py-6 flex items-center justify-between z-[100] transition-colors border-b border-transparent">
        <div className="flex items-center gap-4">
          <span className="text-[14px] font-sans font-bold tracking-[0.1em] text-heading">ATTACKCHAIN</span>
        </div>
        <Link 
          href="/dashboard"
          className="px-6 py-2.5 bg-dark text-white font-medium text-sm rounded-full hover:bg-primary transition-colors hover:shadow-[0_0_20px_rgba(6,78,59,0.4)]"
        >
          Console
        </Link>
      </nav>

      {/* 1. Cinematic Hero */}
      <section className="hero-section relative w-full h-screen flex flex-col items-center justify-center px-6 md:px-12 bg-dark overflow-hidden">
        
        {/* Background Parallax Grid */}
        <div className="hero-grid absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none scale-125"></div>
        
        {/* Subtle light leak */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none"></div>

        <div className="hero-content relative z-10 w-full max-w-[1400px] flex flex-col items-center text-center mt-20">
          
          <h1 className="hero-headline text-6xl md:text-8xl lg:text-[130px] font-display font-bold leading-[0.9] tracking-[-0.04em] text-white mb-10 max-w-6xl [clip-path:inset(0)]">
             Institutional grade security.
          </h1>

          <p className="hero-desc opacity-0 text-xl md:text-2xl text-white/50 max-w-2xl leading-relaxed mb-16 font-light">
            Architecting deterministic investigation pipelines for the world's most demanding financial institutions. Zero noise. Absolute clarity.
          </p>

          <div className="hero-ui-card opacity-0 relative z-10 w-full max-w-[1200px] h-[400px] rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-xl p-8 overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
             <div className="flex flex-col justify-between text-left">
                <div>
                   <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Monitored Assets</div>
                   <div className="text-5xl font-mono font-medium text-white tracking-tight">$4.2T</div>
                </div>
                <div className="w-full h-32 relative flex items-end gap-1 opacity-50">
                   {[40, 60, 45, 80, 55, 90, 70, 100].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
                   ))}
                </div>
             </div>
             
             <div className="flex flex-col justify-between md:border-l md:border-r border-white/5 px-8 text-left">
                <div>
                   <div className="text-xs font-mono text-primary uppercase tracking-widest mb-2 flex items-center gap-2"><Activity className="w-3 h-3" /> Uptime</div>
                   <div className="text-5xl font-mono font-medium text-white tracking-tight">99.998%</div>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs text-white/40">
                      <span>Inference Speed</span>
                      <span className="text-white font-mono">15ms</span>
                   </div>
                   <div className="w-full h-[1px] bg-white/5"></div>
                   <div className="flex justify-between items-center text-xs text-white/40">
                      <span>Data Ingestion</span>
                      <span className="text-white font-mono">20TB/day</span>
                   </div>
                </div>
             </div>

             <div className="flex flex-col justify-between relative overflow-hidden text-left">
                <div className="relative z-10">
                   <div className="text-xs font-mono text-white/40 uppercase tracking-widest mb-2">Active Threats</div>
                   <div className="text-5xl font-mono font-medium text-white tracking-tight">0</div>
                </div>
                <div className="relative z-10 text-xs text-success flex items-center gap-2 bg-success/10 border border-success/20 w-max px-3 py-1.5 rounded-full">
                   <Shield className="w-3 h-3" /> Network Secure
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. Scroll Storytelling */}
      <section className="story-sequence relative w-full h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
         <div className="relative w-full max-w-5xl h-full flex items-center justify-center text-center">
            <h2 className="story-1 text-5xl md:text-8xl font-display font-bold tracking-tight text-heading">
               Thousands of alerts.
            </h2>
            <h2 className="story-2 text-5xl md:text-8xl font-display font-bold tracking-tight text-heading">
               Millions of logs.
            </h2>
            <h2 className="story-3 text-5xl md:text-8xl font-display font-bold tracking-tight text-muted">
               Disconnected events.
            </h2>
            <h2 className="story-4 text-5xl md:text-8xl font-display font-bold tracking-tight text-muted/50">
               Zero context.
            </h2>
            <div className="story-5 w-full">
               <h2 className="text-5xl md:text-8xl font-display font-bold tracking-tight text-primary mb-6">
                  AttackChain reconstructs everything.
               </h2>
               <p className="text-xl text-body font-light max-w-2xl mx-auto">
                  By deterministically connecting every fragmented piece of telemetry, we render the exact causal chain of any attack in milliseconds.
               </p>
            </div>
         </div>
      </section>

      {/* 3. Attack Graph Reveal (Pinned) */}
      <section className="graph-section relative w-full h-screen bg-dark flex flex-col md:flex-row overflow-hidden text-white">
         <div className="w-full md:w-1/3 h-full flex flex-col justify-center px-12 z-20 border-r border-white/10 bg-dark/50 backdrop-blur-md">
            <div className="text-xs font-mono text-primary uppercase tracking-widest mb-8">Reconstruction Engine</div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight mb-8">
               Watch the narrative build itself.
            </h2>
            
            <div className="space-y-6">
               <div className="graph-ui-1 opacity-0 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20"><Users className="w-4 h-4 text-white/50" /></div>
                  <div>
                     <div className="text-sm font-semibold">Credential Compromise</div>
                     <div className="text-xs text-white/50">Initial access via VPN gateway</div>
                  </div>
               </div>
               <div className="graph-ui-2 opacity-0 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-danger/20 flex items-center justify-center shrink-0 border border-danger/30"><Database className="w-4 h-4 text-danger" /></div>
                  <div>
                     <div className="text-sm font-semibold text-danger">Lateral Movement</div>
                     <div className="text-xs text-white/50">Admin DB queried maliciously</div>
                  </div>
               </div>
               <div className="graph-ui-3 opacity-0 flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center shrink-0 border border-success/30"><Lock className="w-4 h-4 text-success" /></div>
                  <div>
                     <div className="text-sm font-semibold text-success">Automated Containment</div>
                     <div className="text-xs text-white/50">Endpoint isolated instantly</div>
                  </div>
               </div>
            </div>

            <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
               <div className="text-xs text-white/50 uppercase tracking-widest mb-2">Calculated Threat Score</div>
               <div className="text-6xl font-mono font-bold text-danger"><span className="threat-score">0</span>/100</div>
            </div>
         </div>

         <div className="w-full md:w-2/3 h-full relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(6,78,59,0.1)_0%,transparent_70%)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="relative w-full max-w-3xl h-[600px]">
               <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 600">
                  <path className="graph-edge graph-edge-1" d="M 100,300 C 200,300 250,200 350,200" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
                  <path className="graph-edge graph-edge-2" d="M 350,200 C 450,200 500,400 600,400" fill="none" stroke="rgba(220,38,38,0.5)" strokeWidth="2" />
                  <path className="graph-edge graph-edge-3" d="M 600,400 C 650,400 700,300 750,300" fill="none" stroke="rgba(22,163,74,0.5)" strokeWidth="2" />
               </svg>
               
               <div className="graph-node graph-node-1 absolute top-[284px] left-[84px] w-8 h-8 rounded-full bg-dark border-2 border-white/50 flex items-center justify-center"><Server className="w-3 h-3 text-white" /></div>
               <div className="graph-node graph-node-2 absolute top-[184px] left-[334px] w-8 h-8 rounded-full bg-dark border-2 border-white/50 flex items-center justify-center"><Users className="w-3 h-3 text-white" /></div>
               <div className="graph-node graph-node-3 absolute top-[384px] left-[584px] w-8 h-8 rounded-full bg-danger/20 border-2 border-danger flex items-center justify-center"><Activity className="w-3 h-3 text-danger" /></div>
               <div className="graph-node graph-node-3 absolute top-[284px] left-[734px] w-8 h-8 rounded-full bg-success/20 border-2 border-success flex items-center justify-center"><Lock className="w-3 h-3 text-success" /></div>
            </div>
         </div>
      </section>

      {/* 4. Horizontal Scroll Section */}
      <section className="horizontal-container w-full h-screen bg-background overflow-hidden flex flex-nowrap">
         {[
            { step: '01', title: 'Collect.', desc: 'High-speed ingestion across endpoints, cloud, and identity providers.', icon: <Database className="w-12 h-12 text-muted" /> },
            { step: '02', title: 'Correlate.', desc: 'Temporal alignment and cryptographic hashing link isolated events.', icon: <Box className="w-12 h-12 text-muted" /> },
            { step: '03', title: 'Investigate.', desc: 'Deterministic graphing engine maps the precise attack vector.', icon: <Search className="w-12 h-12 text-primary" /> },
            { step: '04', title: 'Explain.', desc: 'Human-readable narratives generated automatically for audit readiness.', icon: <FileText className="w-12 h-12 text-muted" /> },
            { step: '05', title: 'Contain.', desc: 'Zero-trust enforcement executed instantly across the infrastructure.', icon: <Shield className="w-12 h-12 text-success" /> },
         ].map((panel, i) => (
            <div key={i} className="horizontal-panel w-screen h-screen shrink-0 flex flex-col justify-center px-12 md:px-32 border-r border-border relative">
               <div className="text-[120px] md:text-[200px] font-mono font-bold text-black/[0.03] absolute top-1/2 -translate-y-1/2 left-12 md:left-32 pointer-events-none -z-10">{panel.step}</div>
               <div className="mb-8">{panel.icon}</div>
               <h2 className="text-6xl md:text-8xl font-display font-bold tracking-tight text-heading mb-8">{panel.title}</h2>
               <p className="text-2xl text-body max-w-2xl font-light leading-relaxed">{panel.desc}</p>
            </div>
         ))}
      </section>

      {/* 5. Interactive Cards & Features */}
      <section className="w-full py-32 bg-surface">
         <div className="max-w-[1400px] mx-auto px-6 md:px-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-20">Premium Engineering.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               
               {[1, 2, 3, 4].map((i) => (
                  <div 
                     key={i}
                     onMouseMove={handleMouseMove}
                     onMouseLeave={handleMouseLeave}
                     className="relative p-[1px] rounded-3xl overflow-hidden bg-border group cursor-crosshair"
                     style={{ '--mouse-x': '50%', '--mouse-y': '50%' } as React.CSSProperties}
                  >
                     {/* Moving radial glow border effect */}
                     <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
                          style={{ background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(6,78,59,0.4), transparent 40%)' }}></div>
                     
                     <div className="relative h-[400px] bg-card rounded-3xl p-12 flex flex-col justify-between border border-transparent z-10 transition-transform duration-200">
                        <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-8 shadow-sm">
                           {i % 2 === 0 ? <Zap className="w-5 h-5 text-primary" /> : <Lock className="w-5 h-5 text-heading" />}
                        </div>
                        <div>
                           <h3 className="text-3xl font-display font-bold mb-4">Feature Architecture {i}</h3>
                           <p className="text-body font-light leading-relaxed">Built with extreme precision. Data is handled with zero-trust methodology, ensuring every interaction is cryptographically verified and immutable.</p>
                        </div>
                     </div>
                  </div>
               ))}

            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-16 px-12 bg-dark text-white flex flex-col md:flex-row items-center justify-between border-t border-white/10">
         <div className="flex items-center gap-3">
            <span className="text-[13px] font-sans font-semibold tracking-[0.2em] uppercase">AttackChain</span>
         </div>
         <div className="text-sm font-mono text-white/50 uppercase tracking-widest mt-8 md:mt-0">
            © 2026 AttackChain AI. Institutional Authority.
         </div>
      </footer>

    </div>
  );
}
