import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Shield } from 'lucide-react';

const MESSAGES = [
  "Initializing Investigation Engine...",
  "Loading Telemetry...",
  "Correlating Events...",
  "Generating AI Narrative..."
];

export default function TransitionLoader() {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Progress bar animation
    gsap.to('.progress-fill', {
      width: '100%',
      duration: 1.5,
      ease: "power2.inOut",
      onComplete: () => {
        // Fade out and navigate
        gsap.to('.loader-container', {
          opacity: 0,
          duration: 0.3,
          onComplete: () => navigate('/dashboard')
        });
      }
    });

    // Message rotation (4 messages over 1.5 seconds)
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        if (prev < MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1500 / MESSAGES.length);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="loader-container min-h-screen bg-[#0B0F14] text-[#eae1d4] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* Logo / Icon */}
        <div className="w-16 h-16 rounded-2xl bg-surface-container border border-primary/20 flex items-center justify-center mb-8 relative">
          <Shield className="w-8 h-8 text-primary relative z-10" />
          <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse"></div>
        </div>

        {/* Text */}
        <div className="font-display-lg text-2xl font-bold tracking-tighter text-on-surface mb-2">
          AttackChain AI
        </div>
        <div className="font-data-mono text-sm text-primary mb-8 h-5 flex items-center justify-center">
          {MESSAGES[messageIndex]}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
          <div className="progress-fill h-full bg-primary w-0 shadow-[0_0_12px_rgba(201,162,39,0.8)]"></div>
        </div>
      </div>
    </div>
  );
}
