import { useMemo } from 'react';
import { ReactFlow, Controls, Background, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { LogIn, ShieldAlert, Smartphone, Repeat } from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'login':
    case 'vpn_login': return <LogIn className="w-4 h-4 text-blue-500" />
    case 'device_registration': return <Smartphone className="w-4 h-4 text-purple-500" />
    case 'transaction': return <Repeat className="w-4 h-4 text-amber-500" />
    default: return <ShieldAlert className="w-4 h-4 text-destructive" />
  }
}

const getBorderColor = (type) => {
  switch (type) {
    case 'login':
    case 'device_registration': return 'border-blue-200 shadow-blue-100'
    case 'vpn_login': return 'border-amber-300 shadow-amber-100'
    case 'privilege_escalation':
    case 'db_access':
    case 'transaction': return 'border-destructive shadow-destructive/20 ring-1 ring-destructive/50'
    default: return 'border-slate-200'
  }
}

const CustomNode = ({ data }) => {
  return (
    <div className={`px-4 py-3 shadow-md rounded-md bg-white border-2 w-[280px] ${getBorderColor(data.type)}`}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      <div className="flex items-center gap-2 mb-2">
        {getIcon(data.type)}
        <div className="font-bold text-sm text-slate-800">{data.type.replace('_', ' ').toUpperCase()}</div>
      </div>
      <div className="text-xs text-slate-500 mb-1">
        {new Date(data.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">{data.details}</div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
};

const nodeTypes = { custom: CustomNode };

export default function TimelineFlow({ events }) {
  const initialNodes = useMemo(() => {
    return events.map((ev, index) => ({
      id: `node-${index}`,
      type: 'custom',
      position: { x: 250, y: index * 150 + 50 },
      data: ev,
    }))
  }, [events]);

  const initialEdges = useMemo(() => {
    const edges = [];
    for (let i = 0; i < events.length - 1; i++) {
      edges.push({
        id: `edge-${i}-${i+1}`,
        source: `node-${i}`,
        target: `node-${i+1}`,
        animated: true,
        style: { stroke: '#94a3b8', strokeWidth: 2 }
      });
    }
    return edges;
  }, [events]);

  return (
    <div className="h-[600px] w-full bg-slate-50/50 rounded-xl border">
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#e2e8f0" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
