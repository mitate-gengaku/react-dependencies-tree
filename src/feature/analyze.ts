import * as path from "path";

import { ELKLayoutCalculator } from "@/feature/elk-layout-calculator";
import { Edge } from "@/types/edge";
import { FileAnalysis } from "@/types/file";
import { Import } from "@/types/import";
import { Node } from "@/types/node";

class ImportExportAnalyzer {
  private nodes: Node[] = [];
  private edges: Edge[] = [];
  private componentMap = new Map<
    string,
    { nodeId: string; imports: Import[]; exports: string[] }
  >();

  constructor() {}

  private filterJSFiles(files: File[]): File[] {
    return files.filter((file) =>
      [".js", ".jsx", ".ts", ".tsx"].includes(path.extname(file.name)),
    );
  }

  private readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target?.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  }

  private async analyzeFile(file: File): Promise<FileAnalysis> {
    const content = await this.readFileContent(file);
    const fileName = path.basename(file.name, path.extname(file.name));

    const imports = this.extractImports(content);
    const exports = this.extractExports(content);

    return {
      fileName,
      imports,
      exports,
      filePath: file.name,
    };
  }

  private extractImports(content: string): Import[] {
    const importRegex =
      /import\s+(?:(?:\*\s+as\s+(\w+))|(?:{([^}]+)})|(?:(\w+)))\s+from\s+['"]([^'"]+)['"]/g;
    const imports: Import[] = [];
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(content)) !== null) {
      const [, namespace, namedImports, defaultImport, source] = match;

      const specifiers: string[] = [];
      if (namespace) specifiers.push(namespace);
      if (namedImports) {
        specifiers.push(...namedImports.split(",").map((s) => s.trim()));
      }
      if (defaultImport) specifiers.push(defaultImport);

      imports.push({
        source,
        specifiers,
      });
    }

    return imports;
  }

  private extractExports(content: string): string[] {
    const namedExportRegex =
      /export\s+(?:const|let|var|function|class)\s+(\w+)/g;
    const defaultExportRegex =
      /export\s+default\s+(?:const|let|var|function|class)?\s*(\w+)?/;
    const namedExportFromRegex = /export\s+{([^}]+)}\s+from\s+['"]([^'"]+)['"]/;

    const exports: string[] = [];
    let match: RegExpMatchArray | null;

    let namedMatch: RegExpExecArray | null;
    while ((namedMatch = namedExportRegex.exec(content)) !== null) {
      exports.push(namedMatch[1]);
    }

    const defaultMatch = content.match(defaultExportRegex);
    if (defaultMatch) {
      exports.push("default");
    }

    const namedFromMatch = content.match(namedExportFromRegex);
    if (namedFromMatch) {
      const namedExports = namedFromMatch[1].split(",").map((s) => s.trim());
      exports.push(...namedExports);
    }

    return exports;
  }

  async generateComponentGraph(
    files: File[],
  ): Promise<{ nodes: Node[]; edges: Edge[] }> {
    const jsFiles = this.filterJSFiles(files);

    const fileAnalyses = await Promise.all(
      jsFiles.map((file) => this.analyzeFile(file)),
    );

    fileAnalyses.forEach((analysis, index) => {
      const nodeId = `node_${index}`;
      const node: Node = {
        id: nodeId,
        data: {
          label: analysis.fileName,
          name: analysis.fileName,
          color: this.getRandomColor(),
        },
        position: { x: 0, y: 0 },
      };

      this.nodes.push(node);
      this.componentMap.set(analysis.fileName, {
        nodeId,
        imports: analysis.imports,
        exports: analysis.exports,
      });
    });

    this.nodes.forEach((node) => {
      const sourceComponent = this.componentMap.get(node.data.name);
      if (sourceComponent) {
        sourceComponent.imports.forEach((importItem) => {
          const targetComponentName = path.basename(
            importItem.source,
            path.extname(importItem.source),
          );
          const targetComponent = Array.from(this.componentMap.entries()).find(
            ([name]) => name === targetComponentName,
          );

          if (targetComponent) {
            this.edges.push({
              id: `edge_${node.id}_${targetComponent[1].nodeId}`,
              source: targetComponent[1].nodeId,
              target: node.id,
            });
          }
        });
      }
    });

    const layoutCalculator = new ELKLayoutCalculator(this.nodes, this.edges);
    const graphWithLayout = await layoutCalculator.calculateLayout();

    return graphWithLayout;
  }

  private getRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}

export default ImportExportAnalyzer;
