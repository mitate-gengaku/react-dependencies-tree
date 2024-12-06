import { MarkerType } from "@xyflow/react";

export interface Edge {
  id: string;
  source: string;
  target: string;
  sourceHandle: string;
  targetHandle: string;
  type?: string;
  markerEnd: {
    type: MarkerType;
  };
}
