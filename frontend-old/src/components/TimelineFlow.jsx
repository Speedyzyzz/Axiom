import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function TimelineFlow({ events }) {
  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  nodeRefs.current = [];

  const addToRefs = (el) => {
    if (el && !nodeRefs.current.includes(el)) {
      nodeRefs.current.push(el);
    }
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !events || events.length === 0) return;

    const ctx = gsap.context(() => {
      // 3. Timeline nodes: Fast stagger 60ms between nodes, 150ms fade+8px slide each.
      gsap.fromTo(nodeRefs.current,
        { opacity: 0, y: -8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.15,
          stagger: 0.06,
          ease: "power2.out",
          onComplete: () => {
            // 5. Critical node pulse: scale 1 to 1.04, opacity 0.9 to 1, 1.8s loop, sine.inOut
            const criticalNode = nodeRefs.current[nodeRefs.current.length - 1];
            if (criticalNode) {
              gsap.fromTo(criticalNode,
                { scale: 1, opacity: 0.9 },
                {
                  scale: 1.04,
                  opacity: 1,
                  duration: 1.8,
                  repeat: -1,
                  yoyo: true,
                  ease: "sine.inOut"
                }
              );
            }
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [events]);

  if (!events || events.length === 0) return null;

  return (
    <div className="relative pl-6 border-l border-system space-y-6" ref={containerRef}>
      {events.map((ev, index) => {
        const isCritical = index === events.length - 1;
        const timeFormatted = new Date(ev.time).toLocaleTimeString(undefined, {
          hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });

        // Use the type for title, capitalizing words
        const title = ev.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div 
            key={index} 
            ref={addToRefs}
            className={`relative ${isCritical ? 'mt-8' : ''}`}
            style={{ transformOrigin: 'left center' }} // Ensure scale pulses nicely from the timeline axis
          >
            {isCritical ? (
              <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-[#D4453A] shadow-[0_0_10px_#D4453A]"></div>
            ) : (
              <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-[#1C232D] border border-system"></div>
            )}
            
            <div className="flex items-baseline gap-4 mb-1">
              <span className={`font-data-mono-sm text-data-mono-sm w-20 shrink-0 ${isCritical ? 'text-system-critical' : 'text-system-muted'}`}>
                {timeFormatted}
              </span>
              <span className={`font-body-md font-semibold ${isCritical ? 'text-system-critical text-[16px] font-bold' : 'text-system-light'}`}>
                {title}
              </span>
            </div>
            <div className="font-data-mono-sm text-data-mono-sm text-system-muted ml-24">
              {ev.details}
            </div>
          </div>
        );
      })}
    </div>
  );
}
