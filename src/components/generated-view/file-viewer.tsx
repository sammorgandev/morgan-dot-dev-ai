"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import React from "react";

interface FileViewerProps {
  projectId: string;
}

export function FileViewer({ projectId }: FileViewerProps) {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const projectData = useQuery(api.projects.getProjectWithFiles, {
    projectId: projectId as Id<"projects">,
  });

  // Derive selected file from data - no useEffect needed!
  const selectedFile = React.useMemo(() => {
    if (!projectData?.files || projectData.files.length === 0) return null;

    if (selectedFileId) {
      return (
        projectData.files.find((file) => file._id === selectedFileId) || null
      );
    }

    // Auto-select first file if none selected
    return projectData.files[0];
  }, [projectData?.files, selectedFileId]);

  const getLanguageFromFilename = (filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "css":
        return "css";
      case "html":
        return "html";
      case "json":
        return "json";
      case "md":
        return "markdown";
      case "py":
        return "python";
      case "java":
        return "java";
      case "cpp":
      case "c":
        return "cpp";
      default:
        return "javascript";
    }
  };

  if (!projectData) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading project files...</div>
      </div>
    );
  }

  if (!projectData.files || projectData.files.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">No files found</p>
          <p className="text-sm text-muted-foreground mt-2">
            This project doesn&apos;t have any files to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        <div className="p-4 border-b">
          <h3 className="font-semibold text-lg">Files</h3>
          <p className="text-sm text-muted-foreground">
            {projectData.files.length} file
            {projectData.files.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <ScrollArea className="h-full">
          <div className="p-2">
            {projectData.files.map((file) => (
              <button
                key={file._id}
                onClick={() => setSelectedFileId(file._id)}
                className={`w-full p-3 text-left rounded-lg transition-colors hover:bg-muted/50 ${
                  selectedFile?._id === file._id ? "bg-muted" : ""
                }`}
              >
                <div className="font-medium truncate">{file.filename}</div>
                <div className="text-sm text-muted-foreground">
                  {file.language || "Unknown type"}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {selectedFile ? (
          <>
            <div className="p-4 border-b bg-background">
              <h2 className="font-semibold text-lg">{selectedFile.filename}</h2>
              <p className="text-sm text-muted-foreground">
                {selectedFile.language || "Unknown type"} •{" "}
                {selectedFile.content.split("\n").length} lines
              </p>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="p-4">
                <SyntaxHighlighter
                  language={getLanguageFromFilename(selectedFile.filename)}
                  style={oneDark}
                  customStyle={{
                    margin: 0,
                    borderRadius: "6px",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                  wrapLongLines={true}
                >
                  {selectedFile.content}
                </SyntaxHighlighter>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg">Select a file to view its contents</p>
              <p className="text-sm mt-2">
                Choose a file from the sidebar to see its source code
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
