import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MessagesChart } from "@/components/dashboard/MessagesChart";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { Send, MessageSquare, UserPlus, TrendingUp } from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral do seu Zap-Pro</p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Mensagens Enviadas"
            value="2.847"
            change="+12.5%"
            positive
            icon={Send}
            color="blue"
          />
          <MetricCard
            title="Mensagens Recebidas"
            value="1.923"
            change="+8.2%"
            positive
            icon={MessageSquare}
            color="teal"
          />
          <MetricCard
            title="Novos Leads"
            value="184"
            change="+23.1%"
            positive
            icon={UserPlus}
            color="violet"
          />
          <MetricCard
            title="Conversões"
            value="47"
            change="-3.2%"
            positive={false}
            icon={TrendingUp}
            color="emerald"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MessagesChart />
          <FunnelChart />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
