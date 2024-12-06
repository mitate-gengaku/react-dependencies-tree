import ELK from "elkjs/lib/elk.bundled.js";

import { Edge } from "@/types/edge";
import { ElkGraph } from "@/types/elk-graph";
import { Node } from "@/types/node";

export class ELKLayoutCalculator {
  private nodes: Node[];
  private edges: Edge[];
  private elk: any;

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.elk = new ELK();
  }

  private convertToElkGraph(): ElkGraph {
    return {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.spacing.nodeNode": "50",
        "elk.direction": "RIGHT",
        "elk.layered.spacing.nodeNodeBetweenLayers": "50",
        "elk.layered.mergeEdges": "true",
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
      },
      children: this.nodes.map((node) => ({
        id: node.id,
        width: 150,
        height: 50,
        labels: [{ text: node.data.name }],
      })),
      edges: this.edges.map((edge) => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };
  }

  async calculateLayout(): Promise<{ nodes: Node[]; edges: Edge[] }> {
    try {
      const elkGraph = this.convertToElkGraph();
      const graph = await this.elk.layout(elkGraph);

      const updatedNodes = this.nodes.map((node) => {
        /* @ts-expect-error */
        const elkNode = graph.children.find((child) => child.id === node.id);
        return {
          ...node,
          position: {
            x: elkNode?.x || 0,
            y: elkNode?.y || 0,
          },
        };
      });

      return {
        nodes: updatedNodes,
        edges: this.edges,
      };
    } catch (error) {
      console.error("ELK Layout Calculation Error:", error);
      return { nodes: this.nodes, edges: this.edges };
    }
  }
}
