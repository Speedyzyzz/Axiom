'use client';

import { Fingerprint, Settings2, Crosshair, Waypoints, TerminalSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const features = [
    {
      icon: <Settings2 className="w-5 h-5 text-primary" />,
      title: "Deterministic AI Pipeline",
      description: "Unlike traditional SIEMs that rely on rules, AttackChain uses a deterministic engine combined with LLMs to correlate disparate events into a single, explainable incident timeline."
    },
    {
      icon: <Crosshair className="w-5 h-5 text-warning" />,
      title: "MITRE ATT&CK Mapping",
      description: "Every telemetry event is automatically mapped to the MITRE Enterprise Matrix, allowing analysts to understand adversary tactics and techniques instantly."
    },
    {
      icon: <Waypoints className="w-5 h-5 text-success" />,
      title: "Graph Correlation",
      description: "Events are not viewed in isolation. Our engine builds a connected graph of Hosts, Users, IPs, and Services to visualize the complete blast radius of an attack."
    }
  ];

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto px-8 lg:px-12 py-10 bg-background text-body">
      
      <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-16">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(201,162,39,0.3)]"
        >
          <Fingerprint className="w-8 h-8 text-white" />
        </motion.div>
        <h1 className="text-[32px] md:text-[40px] font-bold text-heading tracking-tight mb-4">
          Built for the FinSpark Hackathon
        </h1>
        <p className="text-[16px] text-muted font-medium leading-relaxed">
          AttackChain is an enterprise cybersecurity investigation platform designed to reconstruct multi-stage cyber attacks into one explainable incident for SOC analysts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
        {features.map((feature, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="linear-card p-6 rounded-2xl hover:-translate-y-1 transition-transform"
          >
            <div className="w-10 h-10 rounded-lg bg-surface border border-border flex items-center justify-center mb-4">
              {feature.icon}
            </div>
            <h3 className="text-[16px] font-bold text-heading mb-2">{feature.title}</h3>
            <p className="text-[13px] text-muted leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto w-full linear-card p-8 md:p-12 rounded-[24px]">
        <div className="flex items-center gap-3 mb-6">
          <TerminalSquare className="w-6 h-6 text-primary" />
          <h2 className="text-[24px] font-bold text-heading">The Tech Stack</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-[12px] font-bold text-muted uppercase tracking-widest mb-4">Frontend</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                <div>
                  <span className="text-[14px] font-bold text-heading block">Next.js & React</span>
                  <span className="text-[13px] text-muted">App router, Server Components, and React Query for state management.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                <div>
                  <span className="text-[14px] font-bold text-heading block">GSAP & Framer Motion</span>
                  <span className="text-[13px] text-muted">High-performance scroll-triggered animations and fluid micro-interactions.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-primary" />
                <div>
                  <span className="text-[14px] font-bold text-heading block">React Flow</span>
                  <span className="text-[13px] text-muted">Node-based attack graph visualization.</span>
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-[12px] font-bold text-muted uppercase tracking-widest mb-4">Backend</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-warning" />
                <div>
                  <span className="text-[14px] font-bold text-heading block">FastAPI & Python</span>
                  <span className="text-[13px] text-muted">High-performance async REST APIs powering the dashboard.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-warning" />
                <div>
                  <span className="text-[14px] font-bold text-heading block">SQLAlchemy & SQLite</span>
                  <span className="text-[13px] text-muted">Relational database storing the deterministic security event models.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 w-1.5 h-1.5 rounded-full bg-warning" />
                <div>
                  <span className="text-[14px] font-bold text-heading block">Anthropic / OpenRouter LLM</span>
                  <span className="text-[13px] text-muted">Synthesizes deterministic JSON timelines into executive summaries.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  );
}
