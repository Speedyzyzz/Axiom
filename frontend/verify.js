import fs from 'fs';
import dagre from 'dagre';
const data = JSON.parse(fs.readFileSync('latest_incident.json', 'utf8')).data;
const nodes = data.graph.nodes;
const edges = data.graph.edges;

let missing = false;
nodes.forEach(n => {
  if (!n.id || !n.position || !n.data?.label || !n.data?.type) {
    console.error("Missing fields on node", n.id);
    missing = true;
  }
});
if (!missing) console.log("All nodes have id, position, data.label, data.type");

const nodeIds = new Set(nodes.map(n => n.id));
let edgeMissing = false;
edges.forEach(e => {
  if (!nodeIds.has(e.source) || !nodeIds.has(e.target)) {
    console.error("Edge references missing node", e);
    edgeMissing = true;
  }
});
if (!edgeMissing) console.log("All edges reference valid node IDs");

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'LR', ranksep: 220, nodesep: 100 });
nodes.forEach(n => dagreGraph.setNode(n.id, { width: 240, height: 90 }));
edges.forEach(e => dagreGraph.setEdge(e.source, e.target));
dagre.layout(dagreGraph);
console.log("DAGRE POSITIONS:");
nodes.forEach(n => {
  const p = dagreGraph.node(n.id);
  console.log(n.id, {x: p.x, y: p.y});
});
