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
import { CloudUploadIcon, FolderUpIcon } from "lucide-react";
import React, { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/utils/cn";
import { Label } from "../ui/label";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export const ComponentDependencies = () => {
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
              <Label
                htmlFor="file"
                className={cn(
                  "flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-card transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600",
                  // isActive && "border-gray-600 bg-gray-100 dark:border-gray-500 dark:bg-gray-600",
                )}
                // onDragEnter={onDragEnter}
                // onDragLeave={onDragLeave}
                // onDragOver={onDragOver}
                // onDrop={onDrop}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <CloudUploadIcon
                    className={cn(
                      "mb-4 size-8 text-gray-500 dark:text-gray-400 xl:size-12",
                    )}
                  />
                  <p
                    className={cn(
                      "mb-2 text-sm font-medium leading-none text-gray-500 dark:text-gray-400",
                    )}
                  >
                    <span className="font-semibold">選択</span>
                    ・ドラッグアンドドロップ
                  </p>
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".md"
                  className="sr-only"
                  // @ts-expect-error 
                  directory="true"
                  webkitdirectory="true" 
                  multiple={false}
                />
              </Label>
            </DialogContent>
          </Dialog>
        </Panel>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
