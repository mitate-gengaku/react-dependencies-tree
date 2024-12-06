"use client";

import "@xyflow/react/dist/style.css";

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
import { FolderUpIcon } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const dirs = {
  directory: "",
  workingDirectory: "",
};

export default function App() {
  const onDrop = useCallback((files: File[]) => {
    console.log(files);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
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
            <DialogContent className="font-noto-sans">
              <DialogTitle>フォルダーをアップロード</DialogTitle>
              <DialogDescription>
                視覚化したいフォルダーを選択・アップロードしてください。
              </DialogDescription>
              <div
                {...getRootProps()}
                className={cn(
                  "flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-card p-4 text-center transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600",
                  isDragActive &&
                    "border-gray-600 bg-gray-100 dark:border-gray-500 dark:bg-gray-600",
                )}
              >
                <input {...getInputProps()} {...dirs} />
                {isDragActive ? (
                  <p>ドロップしてください</p>
                ) : (
                  <p className="text-sm">ドラッグ・アンド・ドロップ・選択</p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </Panel>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
