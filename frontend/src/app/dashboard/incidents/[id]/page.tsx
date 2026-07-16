'use client';

import { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Lock, ShieldAlert, Zap, Download, Crosshair } from 'lucide-react';
import { useNodesState, useEdgesState, Node, Edge } from '@xyflow/react';

import LeftPane from '@/components/investigation/LeftPane';
import CenterPane from '@/components/investigation/CenterPane';
import RightPane from '@/components/investigation/RightPane';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const fetchIncidentDto = async (id: string) => {
  const res = await fetch(`${API_URL}/api/v1/incidents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch incident");
  const json = await res.json();
  return json.data;
};

const containIncident = async (id: string) => {
  const res = await fetch(`${API_URL}/api/v1/incidents/${id}/contain`, { method: 'POST' });
  if (!res.ok) throw new Error("Failed to contain");
  return await res.json();
};

export default function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  const queryClient = useQueryClient();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [investigationStatus, setInvestigationStatus] = useState<string[]>([]);
  const [isInvestigating, setIsInvestigating] = useState(isDemo);

  const { data: dto, isLoading } = useQuery({
    queryKey: ['incident_dto', id],
    queryFn: () => fetchIncidentDto(id)
  });

  const containMutation = useMutation({
    mutationFn: () => containIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident_dto', id] });
    }
  });

  const startReplay = () => {
    if (!dto?.graph || dto.graph.nodes.length === 0) return;
    setIsInvestigating(true);
    setNodes([]);
    setEdges([]);
    setInvestigationStatus(["Executing deterministic correlation..."]);
    
    let step = 0;
    
    const interval = setInterval(() => {
      const node = dto.graph.nodes[step];
      if (node && node.data?.label) {
        setInvestigationStatus(prev => [...prev, `Mapped: ${node.data.label}`]);
      }
      
      const progress = step / (dto.graph.nodes.length - 1);
      const edgesToShow = Math.ceil(progress * dto.graph.edges.length);
      
      setNodes(dto.graph.nodes.slice(0, step + 1));
      setEdges(dto.graph.edges.slice(0, edgesToShow));
      
      step++;
      if (step >= dto.graph.nodes.length) {
        clearInterval(interval);
        setIsInvestigating(false);
        setInvestigationStatus(prev => [...prev, "Engine halt. Correlation verified."]);
        setNodes(dto.graph.nodes);
        setEdges(dto.graph.edges);
      }
    }, 400);
  };

  useEffect(() => {
    if (dto?.graph && !isInvestigating) {
      setNodes(dto.graph.nodes);
      setEdges(dto.graph.edges);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dto, isInvestigating]);

  useEffect(() => {
    if (isDemo && dto?.graph) {
      startReplay();
    }
  }, [isDemo, dto]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading || !dto) return (
    <div className="flex h-screen items-center justify-center bg-background text-primary">
      <Loader2 className="w-10 h-10 animate-spin opacity-50" />
    </div>
  );

  const incident = dto.incident;
  const mitreTactic = dto.events.find((e: any) => e.mitre_tactic)?.mitre_tactic || 'Multiple';
  const isContained = incident.status === 'contained';

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background text-body font-sans">
      
      <header className="px-6 py-4 bg-surface border-b border-border shrink-0 flex items-center justify-between z-10">
        <div className="flex items-center gap-6">
          <motion.button 
            whileHover={{ x: -2 }}
            onClick={() => router.push('/dashboard')}
            className="p-2 text-muted hover:text-heading bg-background rounded transition-all border border-border hover:border-muted"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded flex items-center gap-1 ${
                incident.severity === 'CRITICAL' ? 'bg-danger text-white' : 
                incident.severity === 'HIGH' ? 'bg-warning text-white' : 'bg-primary text-white'
              }`}>
                {incident.severity === 'CRITICAL' && <ShieldAlert className="w-3 h-3" />}
                {incident.severity}
              </span>
              <span className="text-[11px] font-mono text-muted font-bold uppercase tracking-widest">INC-{incident.id}</span>
              <span className="text-[10px] font-bold text-[#00E5FF] border border-[#00E5FF]/30 bg-[#00E5FF]/10 px-2 py-0.5 rounded flex items-center gap-1 uppercase tracking-widest">
                <Zap className="w-3 h-3" /> Auto-Correlated
              </span>
            </div>
            <h1 className="text-[18px] font-bold text-heading tracking-tight flex items-center gap-2">
              {incident.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-6 mr-4">
            <div className="flex flex-col items-end">
              <span className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">Status</span>
              <span className={`text-[14px] font-mono font-bold ${isContained ? 'text-success' : 'text-danger'}`}>
                {isContained ? 'CONTAINED' : 'OPEN'}
              </span>
            </div>
            
            <div className="h-8 w-px bg-border"></div>
            
            <div className="flex flex-col items-end">
              <span className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">MITRE Tactic</span>
              <span className="text-[14px] font-mono text-heading font-bold flex items-center gap-1"><Crosshair className="w-3.5 h-3.5 text-muted"/> {mitreTactic}</span>
            </div>
            
            <div className="h-8 w-px bg-border"></div>

            <div className="flex flex-col items-end">
              <span className="text-muted text-[10px] font-bold uppercase tracking-widest mb-0.5">Risk Score</span>
              <div className="flex items-baseline gap-0.5">
                <span className={`text-[24px] font-bold tracking-tighter leading-none ${incident.risk_score > 80 ? 'text-danger' : 'text-warning'}`}>
                  {Math.round(incident.risk_score)}
                </span>
                <span className="text-muted text-[12px] font-bold">/100</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 bg-background border border-border text-heading text-[12px] font-bold rounded hover:bg-surface flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export
            </motion.button>

            <motion.button 
              whileHover={isContained ? {} : { scale: 1.02 }}
              whileTap={isContained ? {} : { scale: 0.98 }}
              onClick={() => containMutation.mutate()}
              disabled={isContained || containMutation.isPending}
              className={`px-5 py-2 text-white text-[12px] font-bold rounded flex items-center gap-2 transition-colors ${
                isContained 
                ? 'bg-success/50 border border-success cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                : 'bg-danger hover:bg-red-700 shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              }`}
            >
              <Lock className="w-3.5 h-3.5" /> {isContained ? 'Host Isolated' : 'Isolate Host'}
            </motion.button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden p-0 gap-[1px] bg-border">
        <div className="w-[320px] shrink-0 bg-background overflow-hidden flex flex-col relative z-10 h-full">
          <LeftPane 
            evidenceList={dto.evidence}
            chain={dto.events.map((e: any) => {
              const date = new Date(e.timestamp);
              const timeString = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
              return { action: e.action, time: timeString };
            })}
            iocs={dto.iocs}
          />
        </div>
        
        <div className="flex-1 overflow-hidden relative z-0 h-full bg-surface">
          <CenterPane 
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            isInvestigating={isInvestigating}
            startReplay={startReplay}
          />
        </div>
        
        <div className="w-[360px] shrink-0 bg-background overflow-hidden flex flex-col relative z-10 h-full">
          <RightPane 
            attackData={{
              incident_title: incident.title,
              root_cause: dto.summary.root_cause,
              business_impact: dto.summary.executive_summary
            }}
            recommendations={[dto.summary.recommendation]}
            isInvestigating={isInvestigating}
            investigationStatus={investigationStatus}
            auditLogs={dto.audit_logs}
          />
        </div>
      </div>
    </div>
  );
}
