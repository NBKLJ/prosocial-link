import { isPro } from "@/lib/planAccess";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Pipeline } from "./types";

const ORIGIN_COLORS: Record<string, string> = {
  whatsapp: "hsl(205, 85%, 52%)",
  site: "hsl(262, 83%, 58%)",
  indicacao: "hsl(160, 84%, 39%)",
  anuncio: "hsl(38, 92%, 50%)",
};

const ORIGIN_LABELS: Record<string, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
  anuncio: "Anúncio",
};

interface LeadOriginChartProps {
  pipelines: Pipeline[];
}

export function LeadOriginChart({ pipelines }: LeadOriginChartProps) {
  if (!isPro()) return null;

  const originCounts: Record<string, number> = {};
  pipelines.forEach(p => p.leads.forEach(l => {
    const origin = (l as any).origin || "whatsapp";
    originCounts[origin] = (originCounts[origin] || 0) + 1;
  }));

  const data = Object.entries(originCounts).map(([key, value]) => ({
    name: ORIGIN_LABELS[key] || key,
    value,
    color: ORIGIN_COLORS[key] || "hsl(215, 15%, 46%)",
  }));

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-foreground">Leads por Origem</h3>
        <ProBadge />
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} leads`, ""]} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
