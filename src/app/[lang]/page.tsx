"use client";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  Background,
  OnConnect,
  Connection,
  Panel,
} from "@xyflow/react";
import React, { useCallback } from "react";

import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";

import { FolderUpIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Panel position="top-right">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="bg-white">
                <FolderUpIcon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>a</DialogTitle>
              <DialogDescription>a</DialogDescription>
            </DialogContent>
          </Dialog>
        </Panel>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
