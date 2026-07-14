import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroMotif() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Motif Float & Parallax
      gsap.to(containerRef.current, {
        y: -15,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div aria-hidden="true" className="relative w-full max-w-3xl h-64 mt-16 md:mt-24" ref={containerRef}>
      <svg className="w-full h-full overflow-visible" viewBox="0 0 800 300">
        {/* Links */}
        <path className="link-flow" d="M 100 150 Q 250 50, 400 150 T 700 150" fill="none" stroke="rgba(201,162,39,0.3)" strokeWidth="2"></path>
        <path d="M 100 150 L 300 220 L 500 80 L 700 150" fill="none" stroke="rgba(56,70,104,0.4)" strokeWidth="1"></path>
        <path d="M 250 100 L 400 150 L 550 200" fill="none" stroke="rgba(201,162,39,0.2)" strokeDasharray="4,4" strokeWidth="1.5"></path>
        
        {/* Nodes */}
        {/* Node 1: Neutral */}
        <g transform="translate(100, 150)">
          <circle fill="#16130b" r="24" stroke="#384668" strokeWidth="2"></circle>
          <circle className="node-pulse" fill="#b7c6ee" r="6"></circle>
          <text fill="#eae1d4" fontFamily="JetBrains Mono" fontSize="10" opacity="0.6" textAnchor="middle" y="40">INGEST</text>
        </g>
        
        {/* Node 2: Gold/Transaction */}
        <g transform="translate(250, 100)">
          <circle fill="#16130b" r="32" stroke="#c9a227" strokeWidth="2"></circle>
          <circle className="node-pulse" fill="#ecc246" r="8"></circle>
          <text fill="#c9a227" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" y="-45">AUTH_TXN</text>
        </g>
        
        {/* Node 3: Center Correlation */}
        <g transform="translate(400, 150)">
          <circle fill="rgba(201,162,39,0.1)" r="40" stroke="#ecc246" strokeWidth="2" style={{ filter: 'drop-shadow(0 0 12px rgba(201,162,39,0.4))' }}></circle>
          <circle fill="#ecc246" r="12"></circle>
          <circle fill="#16130b" r="4"></circle>
          <text fill="#ecc246" fontFamily="Inter" fontSize="12" fontWeight="700" letterSpacing="2" textAnchor="middle" y="60">CORRELATE</text>
        </g>
        
        {/* Node 4: Threat */}
        <g transform="translate(550, 200)">
          <circle fill="#16130b" r="28" stroke="#ffb4ab" strokeWidth="2"></circle>
          <circle className="node-pulse" fill="#ffb4ab" r="8" style={{ animationDelay: '1s' }}></circle>
          <text fill="#ffb4ab" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle" y="45">ANOMALY</text>
        </g>
        
        {/* Node 5: Output */}
        <g transform="translate(700, 150)">
          <circle fill="#16130b" r="24" stroke="#384668" strokeWidth="2"></circle>
          <circle className="node-pulse" fill="#b7c6ee" r="6" style={{ animationDelay: '0.5s' }}></circle>
          <text fill="#eae1d4" fontFamily="JetBrains Mono" fontSize="10" opacity="0.6" textAnchor="middle" y="40">REPORT</text>
        </g>
      </svg>
    </div>
  );
}
