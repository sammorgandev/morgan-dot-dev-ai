export type ActionState = {
  error?: string;
  success?: boolean;
  loading?: boolean;
  data?: {
    id: string;
    demo?: string;
    files?: Array<{
      source: string;
      meta: {
        file?: string;
        [key: string]: unknown;
      };
      lang: string;
    }>;
  };
} | null;
