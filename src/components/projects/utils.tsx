import { Star, Zap, Code } from "lucide-react";

export function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
    case "in_progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100";
    case "archived":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100";
  }
}

export function getStatusIcon(status: string): React.ReactNode {
  switch (status) {
    case "completed":
      return <Star className="h-3 w-3" />;
    case "in_progress":
      return <Zap className="h-3 w-3" />;
    case "archived":
      return <Code className="h-3 w-3" />;
    default:
      return <Code className="h-3 w-3" />;
  }
}
