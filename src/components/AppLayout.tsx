import { AppSidebar } from "@/components/AppSidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className={cn(
        "transition-all duration-300 ease-in-out",
        "ml-[260px] p-6 lg:p-8"
      )}>
        {children}
      </main>
    </div>
  );
}
