"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useActionState, useEffect } from "react";
import { sendMessage } from "../actions";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface FileData {
  source: string;
  meta: {
    file?: string;
    [key: string]: unknown;
  };
  lang: string;
}

export default function Sandbox() {
  const [message, setMessage] = useState("");
  const [state, formAction, isPending] = useActionState(sendMessage, null);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);

  // Clear form after successful submission
  useEffect(() => {
    if (state?.success) {
      setMessage("");
    }
  }, [state?.success]);

  // Auto-select first file when data is loaded
  useEffect(() => {
    if (
      state?.success &&
      state.data?.files &&
      state.data.files.length > 0 &&
      !selectedFile
    ) {
      setSelectedFile(state.data.files[0]);
    }
  }, [state?.success, state?.data?.files, selectedFile]);

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
        return "javascript"; // Default to JavaScript for unknown extensions
    }
  };

  const getFileNameFromMeta = (file: FileData, index: number) => {
    // The filename is stored in meta.file based on the v0 SDK structure
    return file.meta?.file || `File ${index + 1}`;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header with form */}
      <div className="border-b p-4 bg-background">
        <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto">
          <form action={formAction}>
            <div className="flex gap-2">
              <Textarea
                className="flex-1"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                name="message"
                id="message"
                required
                rows={2}
              />
              <Button type="submit" disabled={isPending || !message.trim()}>
                {isPending ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
          {state?.error && (
            <div className="p-4 bg-red-100 text-red-700 rounded">
              Error: {state.error}
            </div>
          )}
          {state?.success && (
            <div className="p-4 bg-green-100 text-green-700 rounded">
              <p>
                Message sent successfully! {state.data?.files?.length || 0}{" "}
                files received.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      {state?.success && state.data?.files && (
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 border-r bg-muted/30">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-lg">Files</h3>
              <p className="text-sm text-muted-foreground">
                {state.data.files.length} file
                {state.data.files.length !== 1 ? "s" : ""} total
              </p>
            </div>
            <ScrollArea className="h-full">
              <div className="p-2">
                {state.data.files.map((file: FileData, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full p-3 text-left rounded-lg transition-colors hover:bg-muted/50 ${
                      selectedFile === file ? "bg-muted" : ""
                    }`}
                  >
                    <div className="font-medium truncate">
                      {getFileNameFromMeta(file, index)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {file.lang || "Unknown type"}
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
                  <h2 className="font-semibold text-lg">
                    {getFileNameFromMeta(
                      selectedFile,
                      state.data.files.indexOf(selectedFile)
                    )}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedFile.lang || "Unknown type"} •{" "}
                    {selectedFile.source.split("\n").length} lines
                  </p>
                </div>
                <div className="flex-1 overflow-auto">
                  <div className="p-4">
                    <SyntaxHighlighter
                      language={getLanguageFromFilename(
                        getFileNameFromMeta(
                          selectedFile,
                          state.data.files.indexOf(selectedFile)
                        )
                      )}
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
                      {selectedFile.source}
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
      )}

      {/* Empty state when no files */}
      {!state?.success && (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <p className="text-lg">No files to display</p>
            <p className="text-sm mt-2">Send a message to receive files</p>
          </div>
        </div>
      )}
    </div>
  );
}
