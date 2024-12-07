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
  Panel,
  MiniMap,
} from "@xyflow/react";
import { CloudUploadIcon, FolderUpIcon } from "lucide-react";
import React, { DragEvent, useCallback, useState } from "react";
import { toast } from "sonner";

import { Spinner } from "@/components/loading/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { initialEdges } from "@/const/edge";
import { initialNodes } from "@/const/node";
import ImportExportAnalyzer from "@/feature/analyze";
import { useTranslation } from "@/i18n/client";
import { Edge } from "@/types/edge";
import { cn } from "@/utils/cn";

interface Props {
  lang?: string;
}

export const ComponentDependencies = ({ lang }: Props) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isActive, setActive] = useState<boolean>(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const analyzer = new ImportExportAnalyzer();
  const { t } = useTranslation(lang ?? "ja");

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const files = e.target.files;

    if (files && files.length > 500) {
      toast.error(t("toast:exsessive"));
      return;
    }

    await parseFiles(files);
  };

  const onDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    setLoading(true);
    const files = e.dataTransfer.files;

    if (files && files.length > 500) {
      toast.error(t("toast:exsessive"));
      return;
    }

    await parseFiles(files);
  };

  const parseFiles = async (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);

      try {
        const componentGraph = await analyzer.generateComponentGraph(fileArray);
        setNodes(componentGraph.nodes);
        setEdges(componentGraph.edges);

        toast.success(t("toast:success"));
        setOpen(false);
        setLoading(false);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(t("toast:error") + error.message);
          setLoading(false);
        }
        return error;
      }
    }
  };

  const onConnect: OnConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge<Edge>(
          {
            ...params,
            type: "floating",
          },
          eds,
        ),
      ),
    [setEdges],
  );

  const onDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setActive(true);
  };

  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setActive(false);
  };

  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();

    setActive(true);
  };

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Panel position="top-right">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant={"outline"} size={"icon"} className="bg-white">
                <FolderUpIcon />
              </Button>
            </DialogTrigger>
            <DialogContent className="font-noto-sans">
              <DialogTitle>{t("upload:title")}</DialogTitle>
              <DialogDescription>{t("upload:description")}</DialogDescription>
              <Label
                htmlFor="file"
                className={cn(
                  "flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-card transition-all hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600",
                  isActive &&
                    "border-gray-600 bg-gray-100 dark:border-gray-500 dark:bg-gray-600",
                )}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
                onDragOver={onDragOver}
                onDrop={onDrop}
              >
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  {isLoading ? (
                    <Spinner />
                  ) : (
                    <>
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
                        {t("upload:label")}
                      </p>
                    </>
                  )}
                </div>
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".md"
                  className="sr-only"
                  value={""}
                  onChange={handleFolderChange}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
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
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
};
