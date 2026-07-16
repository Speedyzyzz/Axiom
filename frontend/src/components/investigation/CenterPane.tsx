import React, { memo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Database, User, Server, Terminal, ShieldAlert, FileSearch, Globe, Shield } from 'lucide-react';
import { ReactFlow, Background, Controls, Node, Edge, OnNodesChange, OnEdgesChange, Handle, Position, useReactFlow, ReactFlowProvider, MiniMap, EdgeLabelRenderer, getBezierPath, BaseEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';

const nodeWidth = 240;
const nodeHeight = 90;



const getEntityIcon = (type: string | undefined, isMalicious: boolean) => {
  const t = (type || '').toLowerCase();
  const colorClass = isMalicious ? "text-danger" : "text-primary";
  
  if (t === 'attacker' || t === 'external_ip') return <ShieldAlert className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'user') return <User className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'database') return <Database className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'server' || t === 'host') return <Server className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'process') return <Terminal className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'data' || t === 'file') return <FileSearch className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'external' || t === 'cloud') return <Globe className={`w-5 h-5 ${colorClass}`} />;
  if (t === 'mitre') return <Shield className={`w-5 h-5 ${colorClass}`} />;
  
  return <Server className={`w-5 h-5 ${colorClass}`} />;
};

const CustomNode = memo(({ data }: { data: { malicious?: boolean; mitre?: string; label?: string; sub?: string; status?: string; type?: string } }) => {
  const isMalicious = data.status === 'malicious';
  
  return (
    <div 
      className={`rounded-lg bg-surface min-w-[220px] relative transition-all duration-200 border-2 overflow-hidden group shadow-sm ${
        isMalicious ? 'border-danger/30' : 'border-border'
      }`}
    >
      <Handle type="target" position={Position.Left} className="w-2 h-4 rounded-sm bg-border border-none -ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex items-center p-3 gap-3">
        <div className={`p-2 rounded bg-background border ${isMalicious ? 'border-danger/20' : 'border-border'}`}>
          {getEntityIcon(data.type, isMalicious)}
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase font-bold truncate">
            {data.type}
          </span>
          <span className={`text-[14px] font-bold tracking-tight leading-snug truncate ${isMalicious ? 'text-danger' : 'text-heading'}`}>
            {data.label}
          </span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} className="w-2 h-4 rounded-sm bg-border border-none -mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
});

CustomNode.displayName = 'CustomNode';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  animated
}: any) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan bg-surface px-2 py-1 rounded border border-border text-[10px] font-mono font-bold text-muted uppercase tracking-wider shadow-sm z-20"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

const nodeTypes = { custom: CustomNode };
const edgeTypes = { custom: CustomEdge };

const LayoutFlow = ({ nodes, edges, onNodesChange, onEdgesChange, isInvestigating, startReplay }: any) => {
  const { fitView } = useReactFlow();

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges.map((e: any) => ({ 
        ...e, 
        type: 'custom',
        style: { 
          stroke: isInvestigating ? '#ef4444' : '#1C232D', 
          strokeWidth: isInvestigating ? 2.5 : 1.5,
          opacity: isInvestigating ? 1 : 0.6
        }, 
        animated: isInvestigating 
      }))}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.25, duration: 800, maxZoom: 1.1, minZoom: 0.9 }}
      className="z-10"
      colorMode="dark"
      minZoom={0.1}
      maxZoom={2}
    >
      <Background color="#1C232D" gap={20} size={2} />
      <Controls className="bg-surface border-border fill-muted mb-4 mr-4 shadow-sm rounded-md" showInteractive={false} />
      <MiniMap 
        nodeColor={(n) => {
          return n.data?.status === 'malicious' ? '#f43f5e' : '#C9A227';
        }}
        maskColor="rgba(11, 15, 20, 0.7)"
        className="bg-surface border border-border shadow-sm rounded-md mb-4 ml-4" 
      />
    </ReactFlow>
  );
};

export default function CenterPane({ nodes, edges, onNodesChange, onEdgesChange, isInvestigating, startReplay }: { nodes: Node[]; edges: Edge[]; onNodesChange: OnNodesChange<Node>; onEdgesChange: OnEdgesChange<Edge>; isInvestigating: boolean; startReplay: () => void }) {
  
  return (
    <div className="flex-1 h-full relative overflow-hidden flex flex-col bg-background">
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={startReplay}
          disabled={isInvestigating}
          className="px-4 py-2 bg-surface text-heading font-bold text-[11px] uppercase tracking-widest rounded hover:bg-border flex items-center gap-2 transition-all disabled:opacity-50 shadow-md border border-border"
        >
          <Play className="w-3.5 h-3.5" /> Replay Matrix
        </button>
      </div>

      <div className="flex-1 w-full h-full">
        {nodes.length > 0 && (
          <ReactFlowProvider>
            <LayoutFlow 
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              isInvestigating={isInvestigating}
            />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
