import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function SectionHeader({
  icon: Icon,
  title,
  className = "",
}: SectionHeaderProps) {
  return (
    <h2
      className={`text-2xl font-semibold mb-6 flex items-center gap-2 ${className}`}
    >
      <Icon className="h-6 w-6 text-primary" />
      {title}
    </h2>
  );
}
