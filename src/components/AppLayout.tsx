import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export function AppLayout({ children, fullHeight }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className={cn(
        "transition-all duration-300 ease-in-out ml-[260px]",
        fullHeight ? "h-screen p-0" : "p-6 lg:p-8"
      )}>
        {children}
      </main>
    </div>
  );
}
