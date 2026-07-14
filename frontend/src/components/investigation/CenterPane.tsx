import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { ReactFlow, Background, Controls, Node, Edge, OnNodesChange, OnEdgesChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Reusing the CustomNode
const CustomNode = memo(({ data }: { data: { malicious?: boolean; mitre?: string; label?: string; sub?: string } }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
      className={`px-4 py-3 rounded-lg border shadow-[0_0_20px_rgba(0,0,0,0.5)] ${data.malicious ? 'bg-danger/10 border-danger/50 text-danger shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'bg-surface border-border text-heading hover:border-primary/50 transition-colors'} min-w-[200px] relative overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="flex flex-col relative z-10">
        {data.mitre && <span className="text-[10px] font-mono text-primary mb-1 tracking-wider">{data.mitre}</span>}
        <span className="text-[14px] font-bold tracking-tight">{data.label}</span>
        {data.sub && <span className="text-[11px] font-mono text-muted mt-1">{data.sub}</span>}
      </div>
    </motion.div>
  );
});

CustomNode.displayName = 'CustomNode';

const nodeTypes = { custom: CustomNode };

export default function CenterPane({ nodes, edges, onNodesChange, onEdgesChange, isInvestigating, startReplay }: { nodes: Node[]; edges: Edge[]; onNodesChange: OnNodesChange<Node>; onEdgesChange: OnEdgesChange<Edge>; isInvestigating: boolean; startReplay: () => void }) {
  return (
    <div className="flex-1 bg-background relative overflow-hidden flex flex-col border-r border-border">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none z-0"></div>
      
      {/* Replay Button overlay */}
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={startReplay}
          disabled={isInvestigating}
          className="px-4 py-2 bg-surface border border-border text-heading font-bold text-[13px] rounded-lg hover:bg-card flex items-center gap-2 transition-colors disabled:opacity-50 shadow-lg focus:ring-2 focus:ring-primary focus:outline-none"
        >
          <Play className="w-4 h-4" /> Replay Timeline
        </button>
      </div>

      <div className="flex-1">
        {nodes.length > 0 && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={{ type: 'smoothstep' }}
            fitView
            className="z-10 bg-transparent"
            colorMode="dark"
          >
            <Background color="#1E293B" gap={20} />
            <Controls className="bg-card border-border fill-muted mb-4 mr-4" />
          </ReactFlow>
        )}
      </div>
    </div>
  );
}
