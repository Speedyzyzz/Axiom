import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Building2, Landmark, Zap } from 'lucide-react';
import ShaderCanvas from '../components/landing/ShaderCanvas';
import HeroMotif from '../components/landing/HeroMotif';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const navigate = useNavigate();
  const headlineRef = useRef(null);
  const fadeUpRefs = useRef([]);
  const cardRefs = useRef([]);
  const glowRef1 = useRef(null);
  const glowRef2 = useRef(null);

  useEffect(() => {
    // Prevent ScrollTrigger from firing on hot reloads improperly
    ScrollTrigger.getAll().forEach(t => t.kill());

    const ctx = gsap.context(() => {
      // 1. Headline Split Text Simulation & Reveal
      if (headlineRef.current) {
        const text = headlineRef.current.innerText;
        headlineRef.current.innerHTML = '';
        
        const words = text.split(' ');
        words.forEach(word => {
          const wrapper = document.createElement('span');
          wrapper.className = 'overflow-hidden block';
          
          const inner = document.createElement('span');
          inner.className = 'inline-block translate-y-[100%] opacity-0 split-word';
          inner.innerText = word + ' ';
          
          wrapper.appendChild(inner);
          headlineRef.current.appendChild(wrapper);
        });
        
        const tl = gsap.timeline();
        tl.to('.split-word', {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.2
        })
        .to(fadeUpRefs.current, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }, "-=0.4");
        
        gsap.set(fadeUpRefs.current, { y: 30, opacity: 0 });
      }
      
      // Background Glow Pulses
      if (glowRef1.current) {
        gsap.to(glowRef1.current, {
          scale: 1.2,
          opacity: 0.2,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });
      }
      
      if (glowRef2.current) {
        gsap.to(glowRef2.current, {
          scale: 1.3,
          opacity: 0.25,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 2
        });
      }
      
      // Feature Cards ScrollTrigger
      if (cardRefs.current.length > 0) {
        gsap.set(cardRefs.current, { y: 50, opacity: 0 });
        
        ScrollTrigger.batch(cardRefs.current, {
          onEnter: batch => gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
          }),
          start: "top 85%"
        });
      }
    });

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const handleLaunch = () => {
    navigate('/transition');
  };

  return (
    <>
      <div aria-hidden="true" className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <ShaderCanvas />
        {/* Ambient Pulses */}
        <div ref={glowRef1} className="absolute rounded-full blur-[100px] opacity-15 pointer-events-none z-0 bg-primary w-[600px] h-[600px] top-[20%] left-[10%]"></div>
        <div ref={glowRef2} className="absolute rounded-full blur-[100px] opacity-15 pointer-events-none z-0 bg-secondary-container w-[800px] h-[800px] bottom-[-10%] right-[-10%]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex-grow flex flex-col items-center justify-center px-6 md:px-16 py-24 min-h-[80vh]">
        <div className="text-center max-w-4xl mx-auto">
          <h1 
            ref={headlineRef} 
            className="text-on-surface mb-6 font-display-lg tracking-[-0.04em] font-extrabold"
            style={{ fontSize: 'clamp(4rem, 8vw, 7rem)', lineHeight: '1.1' }}
          >
            Build your SOC
          </h1>
          
          <p 
            ref={el => fadeUpRefs.current[0] = el}
            className="text-on-surface-variant font-body-main text-xl md:text-2xl mb-12 max-w-2xl mx-auto"
          >
            AttackChain AI correlates banking telemetry into one evidence-backed investigation.
          </p>
          
          <div ref={el => fadeUpRefs.current[1] = el}>
            <button 
              onClick={handleLaunch}
              className="bg-primary text-on-primary px-8 py-4 rounded-full font-headline-md font-bold text-lg hover:bg-primary-container hover:shadow-[0_0_24px_rgba(201,162,39,0.4)] transition-all duration-300 active:scale-95 group flex items-center justify-center gap-2 mx-auto"
            >
              Launch Investigation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Abstract Motif Graphic */}
        <HeroMotif />
      </section>

      {/* Features Row */}
      <section className="relative z-10 pb-24 px-6 md:px-16 w-full max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div 
            ref={el => cardRefs.current[0] = el}
            className="rounded-xl p-8 flex flex-col h-full border border-outline-variant/30 border-t-primary/20 hover:border-t-primary/60 hover:shadow-[0_-4px_24px_rgba(201,162,39,0.1)] transition-all duration-300"
            style={{ background: 'linear-gradient(180deg, rgba(31,27,19,0.7) 0%, rgba(22,19,11,0.9) 100%)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-6 text-primary">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Enterprise Infrastructure</h3>
            <p className="font-body-main text-body-main text-on-surface-variant flex-grow">
              Robust telemetry ingestion designed for scale, securely mapping millions of endpoints into a unified view.
            </p>
          </div>

          {/* Card 2 */}
          <div 
            ref={el => cardRefs.current[1] = el}
            className="rounded-xl p-8 flex flex-col h-full border border-outline-variant/30 border-t-primary/20 hover:border-t-primary/60 hover:shadow-[0_-4px_24px_rgba(201,162,39,0.1)] transition-all duration-300"
            style={{ background: 'linear-gradient(180deg, rgba(31,27,19,0.7) 0%, rgba(22,19,11,0.9) 100%)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-6 text-primary">
              <Landmark className="w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Smart Banking APIs</h3>
            <p className="font-body-main text-body-main text-on-surface-variant flex-grow">
              Direct integrations with core financial ledgers to correlate network activity with transaction metadata instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div 
            ref={el => cardRefs.current[2] = el}
            className="rounded-xl p-8 flex flex-col h-full border border-outline-variant/30 border-t-primary/20 hover:border-t-primary/60 hover:shadow-[0_-4px_24px_rgba(201,162,39,0.1)] transition-all duration-300"
            style={{ background: 'linear-gradient(180deg, rgba(31,27,19,0.7) 0%, rgba(22,19,11,0.9) 100%)', backdropFilter: 'blur(12px)' }}
          >
            <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-6 text-primary">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Real-Time Payment Solutions</h3>
            <p className="font-body-main text-body-main text-on-surface-variant flex-grow">
              Sub-second analysis of payment flows to detect and isolate fraudulent attack chains before settlement.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
