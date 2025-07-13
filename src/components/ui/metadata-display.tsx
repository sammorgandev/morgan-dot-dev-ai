import { Calendar, Clock, User, LucideIcon } from "lucide-react";

interface MetadataItem {
  icon: LucideIcon;
  value: string;
  label?: string;
}

interface MetadataDisplayProps {
  items: MetadataItem[];
  className?: string;
  size?: "sm" | "default";
}

export function MetadataDisplay({
  items,
  className = "",
  size = "default",
}: MetadataDisplayProps) {
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const iconSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";

  return (
    <div
      className={`flex items-center gap-3 ${textSize} text-muted-foreground ${className}`}
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1">
          <item.icon className={iconSize} />
          {item.value}
        </span>
      ))}
    </div>
  );
}

// Helper functions for common metadata
export const createDateMetadata = (date: string): MetadataItem => ({
  icon: Calendar,
  value: date,
});

export const createReadingTimeMetadata = (
  readingTime: number
): MetadataItem => ({
  icon: Clock,
  value: `${readingTime} min read`,
});

export const createAuthorMetadata = (author: string): MetadataItem => ({
  icon: User,
  value: author,
});

export const createDateRangeMetadata = (
  startDate: string,
  endDate?: string
): MetadataItem => ({
  icon: Calendar,
  value: `${startDate} - ${endDate || "Present"}`,
});
