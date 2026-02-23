import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type MetricColor = "blue" | "teal" | "violet" | "emerald" | "amber" | "rose";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  color?: MetricColor;
}

const colorMap: Record<MetricColor, { bg: string; text: string }> = {
  blue: { bg: "bg-primary/10", text: "text-primary" },
  teal: { bg: "bg-accent-teal/10", text: "text-accent-teal" },
  violet: { bg: "bg-accent-violet/10", text: "text-accent-violet" },
  emerald: { bg: "bg-success/10", text: "text-success" },
  amber: { bg: "bg-warning/10", text: "text-warning" },
  rose: { bg: "bg-destructive/10", text: "text-destructive" },
};

export function MetricCard({ title, value, change, positive, icon: Icon, color = "blue" }: MetricCardProps) {
  const colors = colorMap[color];

  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          <span className={cn(
            "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
            positive
              ? `${colors.bg} ${colors.text}`
              : "bg-destructive/10 text-destructive"
          )}>
            {change}
          </span>
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.bg)}>
          <Icon className={cn("w-5 h-5", colors.text)} />
        </div>
      </div>
    </div>
  );
}
