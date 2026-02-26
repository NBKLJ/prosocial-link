import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

interface ProBadgeProps {
  className?: string;
  size?: "sm" | "md";
}

export function ProBadge({ className, size = "sm" }: ProBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-bold uppercase tracking-wider rounded-md bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20",
        size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-[10px] px-2 py-1",
        className
      )}
    >
      <Crown className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
      PRO
    </span>
  );
}
