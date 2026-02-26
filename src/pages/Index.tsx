import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MessagesChart } from "@/components/dashboard/MessagesChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { ConversionChart } from "@/components/dashboard/ConversionChart";
import { AttendantPerformanceChart } from "@/components/dashboard/AttendantPerformanceChart";
import { LeadOriginPieChart } from "@/components/dashboard/LeadOriginPieChart";
import { Send, MessageSquare, UserPlus, TrendingUp, Timer, BarChart3 } from "lucide-react";
import { isPro } from "@/lib/planAccess";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const pro = isPro();

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu ZapProBR</p>
        </div>

        {/* Metrics */}
        <div className={cn("grid grid-cols-1 gap-4", pro ? "sm:grid-cols-2 lg:grid-cols-6" : "sm:grid-cols-2 lg:grid-cols-4")}>
          <MetricCard title="Mensagens Enviadas" value="2.847" change="+12.5%" positive icon={Send} color="blue" />
          <MetricCard title="Mensagens Recebidas" value="1.923" change="+8.2%" positive icon={MessageSquare} color="teal" />
          <MetricCard title="Novos Leads" value="184" change="+23.1%" positive icon={UserPlus} color="violet" />
          <MetricCard title="Conversões" value="47" change="-3.2%" positive={false} icon={TrendingUp} color="emerald" />
          {pro && (
            <>
              <MetricCard title="Taxa de Conversão" value="25.5%" change="+4.1%" positive icon={BarChart3} color="blue" />
              <MetricCard title="Tempo Médio Resp." value="3min" change="-12%" positive icon={Timer} color="teal" />
            </>
          )}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessagesChart />
          <FunnelChart />
        </div>

        {/* Pro Charts */}
        <ProGate title="Painel Analítico Avançado" description="Gráficos de conversão, desempenho por atendente e origem de leads. Disponível no Plano Pro.">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">Análises Avançadas</h2>
              <ProBadge size="md" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ConversionChart />
              <AttendantPerformanceChart />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LeadOriginPieChart />
            </div>
          </div>
        </ProGate>
      </div>
    </AppLayout>
  );
};


export default Dashboard;
