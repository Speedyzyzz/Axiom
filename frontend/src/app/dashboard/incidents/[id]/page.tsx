'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2, Lock } from 'lucide-react';
import { useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';

import LeftPane from '@/components/investigation/LeftPane';
import CenterPane from '@/components/investigation/CenterPane';
import RightPane from '@/components/investigation/RightPane';

const fetchAttackChain = async (id: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/attack-chain/${id}`);
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
};

const fetchGraph = async (id: string) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/v1/graph/${id}`);
    const json = await res.json();
    return json.data;
  } catch {
    return { nodes: [], edges: [] };
  }
};

export default function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [investigationStatus, setInvestigationStatus] = useState<string[]>([]);
  const [isInvestigating, setIsInvestigating] = useState(isDemo);

  const { data: attackData } = useQuery({
    queryKey: ['attack_chain', id],
    queryFn: () => fetchAttackChain(id)
  });

  const { data: graphData } = useQuery({
    queryKey: ['graph', id],
    queryFn: () => fetchGraph(id)
  });

  const startReplay = () => {
    if (!graphData || graphData.nodes.length === 0) return;
    setIsInvestigating(true);
    setNodes([]);
    setEdges([]);
    setInvestigationStatus(["Reconstructing Timeline..."]);
    
    let step = 0;
    
    const interval = setInterval(() => {
      const node = graphData.nodes[step];
      if (node && node.data?.label) {
        setInvestigationStatus(prev => [...prev, `Found: ${node.data.label}`]);
      }
      
      const progress = step / (graphData.nodes.length - 1);
      const edgesToShow = Math.ceil(progress * graphData.edges.length);
      
      setNodes(graphData.nodes.slice(0, step + 1));
      setEdges(graphData.edges.slice(0, edgesToShow));
      
      step++;
      if (step >= graphData.nodes.length) {
        clearInterval(interval);
        setIsInvestigating(false);
        setInvestigationStatus(prev => [...prev, "Investigation Complete."]);
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
      }
    }, 400);
  };

  useEffect(() => {
    if (!isDemo) {
      if (graphData) {
        setNodes(graphData.nodes);
        setEdges(graphData.edges);
      }
      return;
    }

    const eventSource = new EventSource('http://127.0.0.1:8000/api/v1/demo/stream');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setInvestigationStatus(prev => [...prev, data.message]);
      
      if (graphData && graphData.nodes.length > 0) {
        const progress = investigationStatus.length / 8;
        const nodesToShow = Math.ceil(progress * graphData.nodes.length);
        const edgesToShow = Math.ceil(progress * graphData.edges.length);
        
        setNodes(graphData.nodes.slice(0, nodesToShow));
        setEdges(graphData.edges.slice(0, edgesToShow));
      }

      if (data.message === "Investigation Complete.") {
        eventSource.close();
        setIsInvestigating(false);
        if (graphData) {
          setNodes(graphData.nodes);
          setEdges(graphData.edges);
        }
      }
    };

    return () => eventSource.close();
  }, [isDemo, graphData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (!isInvestigating) startReplay();
      } else if (e.code === 'Escape' || e.code === 'Backspace') {
        e.preventDefault();
        router.push('/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, isInvestigating, graphData]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!attackData) return (
    <div className="flex h-screen items-center justify-center bg-[#050816] text-primary">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  const incident = attackData.incident;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#050816] text-body">
      {/* Header */}
      <header className="px-8 py-4 border-b border-border bg-surface shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ x: -2 }}
            onClick={() => router.push('/dashboard')}
            className="p-2 text-muted hover:text-primary bg-card rounded-md transition-colors border border-border hover:border-primary/50 focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded bg-danger/10 text-danger border border-danger/20 tracking-wider">
                {incident.severity?.toUpperCase() || 'CRITICAL'} ALERT
              </span>
              <span className="text-[12px] font-bold font-mono text-muted tracking-widest">INC-{incident.id}</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-card border border-border text-primary tracking-widest">
                {attackData.report_mode === 'ENGINE_PLUS_LLM' ? 'AI ENHANCED' : 'DETERMINISTIC'}
              </span>
            </div>
            <h1 className="text-[20px] font-bold text-heading tracking-tight">{incident.title}</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center mr-6 gap-2">
            <span className="text-muted text-[13px] font-mono tracking-widest">SCORE:</span>
            <span className={`text-[20px] font-bold font-mono ${incident.confidence > 80 ? 'text-danger' : 'text-warning'}`}>{incident.confidence}</span>
            <span className="text-muted text-[13px] font-mono">/ 100</span>
          </div>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 border border-border text-heading text-[13px] font-bold rounded-lg hover:bg-card flex items-center gap-2 transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <CheckCircle2 className="w-4 h-4" />
            Acknowledge
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2 bg-danger text-white text-[13px] font-bold rounded-lg hover:bg-red-600 flex items-center gap-2 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] focus:ring-2 focus:ring-danger focus:ring-offset-2 focus:ring-offset-background focus:outline-none"
          >
            <Lock className="w-4 h-4" />
            Isolate Host
          </motion.button>
        </div>
      </header>

      {/* 3-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
        <LeftPane 
          evidenceList={attackData.evidence}
          chain={attackData.attack_chain}
          reasoning={attackData.reasoning_trace}
          isInvestigating={isInvestigating}
          investigationStatus={investigationStatus}
        />
        
        <CenterPane 
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          isInvestigating={isInvestigating}
          startReplay={startReplay}
        />
        
        <RightPane 
          attackData={attackData}
          recommendations={attackData.recommendations}
        />
      </div>
    </div>
  );
}
