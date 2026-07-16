import dagre from 'dagre';
import json from './latest_incident.json' assert { type: "json" };

const nodes = json.data.graph.nodes;
const edges = json.data.graph.edges;

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'LR', ranksep: 220, nodesep: 100 });

nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 240, height: 90 });
});

edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
});

try {
    dagre.layout(dagreGraph);
    console.log("Dagre layout succeeded.");
} catch (e) {
    console.error("Dagre layout failed:", e);
}

nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (!nodeWithPosition) {
        console.error("Node without position:", node.id);
    }
});
