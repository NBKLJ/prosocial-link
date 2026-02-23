import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
}

export function MetricCard({ title, value, change, positive, icon: Icon }: MetricCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground tracking-tight">{value}</p>
          <span className={cn(
            "inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full",
            positive
              ? "bg-primary/10 text-primary"
              : "bg-destructive/10 text-destructive"
          )}>
            {change}
          </span>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </div>
  );
}
