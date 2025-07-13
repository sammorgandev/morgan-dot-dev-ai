import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";

interface TagsListProps {
  tags: string[];
  maxVisible?: number;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "default";
  showIcon?: boolean;
  className?: string;
}

export function TagsList({
  tags,
  maxVisible,
  variant = "secondary",
  size = "default",
  showIcon = false,
  className = "",
}: TagsListProps) {
  const visibleTags = maxVisible ? tags.slice(0, maxVisible) : tags;
  const remainingCount =
    maxVisible && tags.length > maxVisible ? tags.length - maxVisible : 0;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {visibleTags.map((tag, index) => (
        <Badge
          key={index}
          variant={variant}
          className={size === "sm" ? "text-xs" : ""}
        >
          {showIcon && <Tag className="h-3 w-3 mr-1" />}
          {tag}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge variant={variant} className={size === "sm" ? "text-xs" : ""}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}
