import { Pipeline } from "./types";
import brazilMap from "@/assets/brazil-map.png";
import {
  MessageSquare, Globe, Instagram, Facebook, Twitter, MapPin,
  Users, ArrowUpRight, Mail, Megaphone, UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
} from "recharts";

interface LeadOriginsPanelProps {
  pipelines: Pipeline[];
}

const CHANNEL_CONFIG: Record<string, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-emerald-500", bg: "bg-emerald-500" },
  site: { label: "Site", icon: Globe, color: "text-blue-500", bg: "bg-blue-500" },
  indicacao: { label: "Indicação", icon: UserCheck, color: "text-violet-500", bg: "bg-violet-500" },
  anuncio: { label: "Anúncio", icon: Megaphone, color: "text-amber-500", bg: "bg-amber-500" },
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-500", bg: "bg-pink-500" },
  facebook: { label: "Facebook", icon: Facebook, color: "text-blue-600", bg: "bg-blue-600" },
  twitter: { label: "Twitter / X", icon: Twitter, color: "text-sky-500", bg: "bg-sky-500" },
  email: { label: "E-mail", icon: Mail, color: "text-orange-500", bg: "bg-orange-500" },
};

const PIE_COLORS = [
  "hsl(152, 69%, 40%)", "hsl(205, 85%, 52%)", "hsl(262, 83%, 58%)",
  "hsl(38, 92%, 50%)", "hsl(340, 82%, 52%)", "hsl(215, 76%, 52%)",
  "hsl(195, 85%, 52%)", "hsl(25, 92%, 50%)",
];

// Mock geographic data for Brazil regions
const REGIONS: { id: string; name: string; leads: number; revenue: number; x: number; y: number }[] = [
  { id: "norte", name: "Norte", leads: 12, revenue: 28000, x: 38, y: 22 },
  { id: "nordeste", name: "Nordeste", leads: 28, revenue: 64000, x: 75, y: 30 },
  { id: "centro-oeste", name: "Centro-Oeste", leads: 18, revenue: 42000, x: 48, y: 52 },
  { id: "sudeste", name: "Sudeste", leads: 52, revenue: 148000, x: 68, y: 65 },
  { id: "sul", name: "Sul", leads: 22, revenue: 58000, x: 55, y: 82 },
];

// Mock leads with origin + location for the table
const MOCK_ORIGIN_LEADS = [
  { name: "Maria Silva", origin: "whatsapp", region: "Sudeste", city: "São Paulo - SP", value: 8500 },
  { name: "João Santos", origin: "instagram", region: "Nordeste", city: "Salvador - BA", value: 4200 },
  { name: "Ana Oliveira", origin: "site", region: "Sul", city: "Curitiba - PR", value: 12000 },
  { name: "Pedro Costa", origin: "facebook", region: "Sudeste", city: "Rio de Janeiro - RJ", value: 6800 },
  { name: "Carla Mendes", origin: "indicacao", region: "Centro-Oeste", city: "Brasília - DF", value: 15000 },
  { name: "Lucas Ferreira", origin: "whatsapp", region: "Nordeste", city: "Recife - PE", value: 3200 },
  { name: "Fernanda Lima", origin: "anuncio", region: "Sudeste", city: "Belo Horizonte - MG", value: 9100 },
  { name: "Roberto Alves", origin: "twitter", region: "Norte", city: "Manaus - AM", value: 5400 },
  { name: "Juliana Rocha", origin: "email", region: "Sul", city: "Porto Alegre - RS", value: 7200 },
  { name: "Thiago Barbosa", origin: "instagram", region: "Nordeste", city: "Fortaleza - CE", value: 4800 },
  { name: "Camila Nunes", origin: "whatsapp", region: "Sudeste", city: "Campinas - SP", value: 11000 },
  { name: "Diego Martins", origin: "site", region: "Centro-Oeste", city: "Goiânia - GO", value: 6300 },
];

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

export function LeadOriginsPanel({ pipelines }: LeadOriginsPanelProps) {
  // Count leads by origin from real pipeline data
  const allLeads = pipelines.flatMap(p => p.leads);
  const originCounts: Record<string, number> = {};
  const originValues: Record<string, number> = {};
  allLeads.forEach(l => {
    const origin = l.origin || "whatsapp";
    originCounts[origin] = (originCounts[origin] || 0) + 1;
    originValues[origin] = (originValues[origin] || 0) + l.value;
  });

  // Add mock data for channels not in pipeline
  ["instagram", "facebook", "twitter", "email"].forEach(ch => {
    if (!originCounts[ch]) {
      originCounts[ch] = Math.floor(Math.random() * 15) + 3;
      originValues[ch] = Math.floor(Math.random() * 40000) + 5000;
    }
  });

  const totalByOrigin = Object.values(originCounts).reduce((a, b) => a + b, 0);

  const pieData = Object.entries(originCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value], i) => ({
      name: CHANNEL_CONFIG[key]?.label || key,
      value,
      color: PIE_COLORS[i % PIE_COLORS.length],
    }));

  const barData = Object.entries(originCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([key, value]) => ({
      channel: CHANNEL_CONFIG[key]?.label || key,
      leads: value,
      revenue: originValues[key] || 0,
    }));

  const totalRegionLeads = REGIONS.reduce((s, r) => s + r.leads, 0);

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Origem de Leads</h2>
          <p className="text-xs text-muted-foreground mt-0.5">De onde seus leads estão vindo — canal e localização geográfica</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="font-bold text-foreground text-base">{totalByOrigin}</span> leads rastreados
        </div>
      </div>

      {/* Top: Pie + Channel Cards */}
      <div className="grid grid-cols-12 gap-4">
        {/* Pie Chart */}
        <div className="col-span-4 bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Distribuição por Canal</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} leads (${((v / totalByOrigin) * 100).toFixed(1)}%)`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center">
            {pieData.map(o => (
              <span key={o.name} className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: o.color }} />{o.name}
              </span>
            ))}
          </div>
        </div>

        {/* Channel Cards */}
        <div className="col-span-8 grid grid-cols-4 gap-3">
          {Object.entries(originCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([key, count]) => {
              const config = CHANNEL_CONFIG[key];
              if (!config) return null;
              const pct = ((count / totalByOrigin) * 100).toFixed(1);
              return (
                <div key={key} className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", `${config.bg}/10`)}>
                      <config.icon className={cn("w-4 h-4", config.color)} />
                    </div>
                    <div className="flex items-center gap-0.5 text-[11px] font-semibold text-emerald-500">
                      <ArrowUpRight className="w-3 h-3" />
                      +{Math.floor(Math.random() * 20 + 5)}%
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-foreground">{count}</p>
                    <p className="text-[11px] text-muted-foreground">{config.label}</p>
                  </div>
                  <div className="w-full bg-muted/30 rounded-full h-1.5">
                    <div className={cn("h-1.5 rounded-full", config.bg)} style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{pct}% do total • {formatCurrency(originValues[key] || 0)}</p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Revenue by Channel Bar Chart */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-foreground">Leads e Receita por Canal</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="channel" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number, name: string) => [name === "revenue" ? formatCurrency(v) : v, name === "revenue" ? "Receita" : "Leads"]} />
            <Bar yAxisId="left" dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Leads" />
            <Bar yAxisId="right" dataKey="revenue" fill="hsl(var(--primary) / 0.3)" radius={[4, 4, 0, 0]} name="Receita" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Geographic Section: Map + Table */}
      <div className="grid grid-cols-12 gap-4">
        {/* Brazil Map */}
        <div className="col-span-5 bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Mapa de Leads — Brasil</h3>
          </div>
          <div className="relative w-full rounded-xl bg-muted/10 border border-border/30 overflow-hidden p-4">
            <img src={brazilMap} alt="Mapa do Brasil" className="w-full h-auto opacity-80" />
            {/* Region dots overlaid on the map */}
            {REGIONS.map(r => {
              const size = Math.max(28, (r.leads / totalRegionLeads) * 56);
              return (
                <div
                  key={r.id}
                  className="absolute flex flex-col items-center gap-0.5"
                  style={{ left: `${r.x}%`, top: `${r.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className="rounded-full bg-primary/20 flex items-center justify-center"
                    style={{ width: size + 8, height: size + 8 }}
                  >
                    <div
                      className="rounded-full bg-primary flex items-center justify-center shadow-lg"
                      style={{ width: size, height: size, opacity: 0.85 }}
                    >
                      <span className="text-[10px] font-bold text-primary-foreground">{r.leads}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-semibold text-muted-foreground bg-card/80 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
                    {r.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Region Stats + Lead Table */}
        <div className="col-span-7 space-y-4">
          {/* Region Stats */}
          <div className="grid grid-cols-5 gap-2">
            {REGIONS.map(r => (
              <div key={r.id} className="bg-card border border-border/50 rounded-xl p-3 text-center space-y-1">
                <p className="text-xs font-bold text-foreground">{r.leads}</p>
                <p className="text-[10px] text-muted-foreground">{r.name}</p>
                <p className="text-[10px] font-medium text-primary">{formatCurrency(r.revenue)}</p>
              </div>
            ))}
          </div>

          {/* Detailed Lead Origins Table */}
          <div className="bg-card border border-border/50 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Detalhamento por Contato</h3>
              <span className="text-[10px] text-muted-foreground">{MOCK_ORIGIN_LEADS.length} contatos rastreados</span>
            </div>
            <div className="max-h-[320px] overflow-y-auto space-y-1">
              {/* Header */}
              <div className="grid grid-cols-12 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground font-medium py-2 border-b border-border/30 sticky top-0 bg-card">
                <span className="col-span-3">Contato</span>
                <span className="col-span-2">Canal</span>
                <span className="col-span-3">Cidade / Estado</span>
                <span className="col-span-2">Região</span>
                <span className="col-span-2 text-right">Valor</span>
              </div>
              {MOCK_ORIGIN_LEADS.map((lead, i) => {
                const config = CHANNEL_CONFIG[lead.origin];
                return (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center py-2.5 border-b border-border/20 last:border-0 hover:bg-muted/20 rounded-lg px-1 transition-colors">
                    <div className="col-span-3 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-primary">
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground truncate">{lead.name}</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5">
                      {config && <config.icon className={cn("w-3.5 h-3.5", config.color)} />}
                      <span className="text-xs text-muted-foreground">{config?.label || lead.origin}</span>
                    </div>
                    <div className="col-span-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground truncate">{lead.city}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">{lead.region}</span>
                    </div>
                    <div className="col-span-2 text-right">
                      <span className="text-sm font-semibold text-foreground">{formatCurrency(lead.value)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
