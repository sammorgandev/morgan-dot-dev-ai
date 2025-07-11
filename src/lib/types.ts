export type ActionState = {
  error?: string;
  success?: boolean;
  loading?: boolean;
  data?: {
    id: string;
    demo?: string;
    projectId?: string;
    files?: Array<{
      source: string;
      meta: {
        file?: string;
        [key: string]: unknown;
      };
      lang: string;
    }>;
    messages?: ChatMessage[];
  };
} | null;

// Enhanced types for chat continuation and error handling
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    isError?: boolean;
    errorDetails?: string;
    originalPrompt?: string;
    processingTime?: number;
  };
};

export type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  currentChatId: string | null;
};

export type IframeError = {
  type: "load_error" | "runtime_error" | "network_error";
  message: string;
  url?: string;
  timestamp: Date;
};

export type ContinueChatActionState = {
  error?: string;
  success?: boolean;
  loading?: boolean;
  data?: {
    id: string;
    demo?: string;
    projectId?: string;
    files?: Array<{
      source: string;
      meta: {
        file?: string;
        [key: string]: unknown;
      };
      lang: string;
    }>;
    messages?: ChatMessage[];
  };
} | null;

export type ErrorRecoveryOptions = {
  includeOriginalPrompt?: boolean;
  includeErrorDetails?: boolean;
  autoRetry?: boolean;
};

// Enhanced project types for better file management
export type ProjectFile = {
  filename: string;
  content: string;
  language: string;
  lastModified?: Date;
};

export type ProjectData = {
  id: string;
  prompt: string;
  demoUrl: string;
  chatId: string;
  files: ProjectFile[];
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
};
