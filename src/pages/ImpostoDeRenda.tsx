import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isWithinInterval, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Download, Filter, FileSpreadsheet, Building2, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Movimentacao {
  tipo: "Distribuição de Lucros" | "Pró-labore";
  valor: number;
  data: string; // dd/MM/yyyy
}

interface Empresa {
  nome: string;
  cnpj: string;
  movimentacoes: Movimentacao[];
}

const mockEmpresas: Empresa[] = [
  {
    nome: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-01",
    movimentacoes: [
      { tipo: "Distribuição de Lucros", valor: 45000, data: "15/03/2025" },
      { tipo: "Pró-labore", valor: 12000, data: "05/01/2025" },
      { tipo: "Pró-labore", valor: 12000, data: "05/02/2025" },
      { tipo: "Distribuição de Lucros", valor: 30000, data: "10/06/2025" },
      { tipo: "Pró-labore", valor: 12000, data: "05/03/2025" },
    ],
  },
  {
    nome: "Construtora Horizonte S.A.",
    cnpj: "98.765.432/0001-02",
    movimentacoes: [
      { tipo: "Pró-labore", valor: 18000, data: "10/01/2025" },
      { tipo: "Pró-labore", valor: 18000, data: "10/02/2025" },
      { tipo: "Distribuição de Lucros", valor: 80000, data: "20/04/2025" },
      { tipo: "Pró-labore", valor: 18000, data: "10/03/2025" },
    ],
  },
  {
    nome: "Alimentos Naturais ME",
    cnpj: "11.222.333/0001-03",
    movimentacoes: [
      { tipo: "Pró-labore", valor: 8000, data: "01/01/2025" },
      { tipo: "Pró-labore", valor: 8000, data: "01/02/2025" },
      { tipo: "Distribuição de Lucros", valor: 15000, data: "30/06/2025" },
    ],
  },
  {
    nome: "Consultoria Global Eireli",
    cnpj: "44.555.666/0001-04",
    movimentacoes: [
      { tipo: "Distribuição de Lucros", valor: 60000, data: "01/07/2025" },
      { tipo: "Pró-labore", valor: 25000, data: "15/08/2025" },
      { tipo: "Pró-labore", valor: 25000, data: "15/09/2025" },
    ],
  },
  {
    nome: "Logística Express Ltda",
    cnpj: "77.888.999/0001-05",
    movimentacoes: [
      { tipo: "Pró-labore", valor: 10000, data: "05/11/2025" },
      { tipo: "Distribuição de Lucros", valor: 35000, data: "20/12/2025" },
      { tipo: "Pró-labore", valor: 10000, data: "05/01/2026" },
    ],
  },
  {
    nome: "Farmácia Saúde Total",
    cnpj: "22.333.444/0001-06",
    movimentacoes: [
      { tipo: "Pró-labore", valor: 7500, data: "10/02/2026" },
      { tipo: "Distribuição de Lucros", valor: 20000, data: "01/03/2026" },
    ],
  },
];

function parseDate(dateStr: string): Date {
  return parse(dateStr, "dd/MM/yyyy", new Date());
}

function formatCurrency(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ImpostoDeRenda() {
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const handleExport = () => {
    if (!startDate || !endDate) {
      toast.error("Informe a data inicial e a data final.");
      return;
    }
    if (startDate > endDate) {
      toast.error("A data inicial deve ser anterior à data final.");
      return;
    }

    const rows: string[][] = [];
    rows.push(["Empresa", "CNPJ", "Tipo", "Valor (R$)", "Data"]);

    let totalRows = 0;
    mockEmpresas.forEach((emp) => {
      const filtered = emp.movimentacoes.filter((m) => {
        const d = parseDate(m.data);
        return isWithinInterval(d, { start: startDate, end: endDate });
      });
      filtered.forEach((m) => {
        rows.push([emp.nome, emp.cnpj, m.tipo, m.valor.toFixed(2).replace(".", ","), m.data]);
        totalRows++;
      });
    });

    if (totalRows === 0) {
      toast.warning("Nenhuma movimentação encontrada no período selecionado.");
      return;
    }

    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(";")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `distribuicao-lucros-prolabore_${format(startDate, "ddMMyyyy")}_${format(endDate, "ddMMyyyy")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Planilha exportada com ${totalRows} registro(s).`);
  };

  // Preview data for the table
  const allMovs = mockEmpresas.flatMap((emp) =>
    emp.movimentacoes.map((m) => ({ empresa: emp.nome, cnpj: emp.cnpj, ...m }))
  ).sort((a, b) => parseDate(b.data).getTime() - parseDate(a.data).getTime());

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Imposto de Renda</h1>
          <p className="text-sm text-muted-foreground mt-1">Pastas → Imposto de Renda</p>
        </div>

        {/* Distribuição de Lucros e Pró-labore */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Distribuição de Lucros e Pró-labore</h2>
                <p className="text-xs text-muted-foreground">{mockEmpresas.length} empresas cadastradas</p>
              </div>
            </div>

            <Button
              onClick={() => setShowFilter(!showFilter)}
              className="gap-2"
              variant={showFilter ? "default" : "outline"}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar Planilha
              {showFilter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilter && (
            <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Filter className="w-4 h-4 text-primary" />
                Aplicar Filtro
              </div>

              <div className="flex flex-wrap items-end gap-4">
                {/* Data Inicial */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Data Inicial</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                        locale={ptBR}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Data Final */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Data Final</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[200px] justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        initialFocus
                        locale={ptBR}
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={handleExport} className="gap-2">
                  <Download className="w-4 h-4" />
                  Exportar
                </Button>
              </div>

              {startDate && endDate && (
                <p className="text-xs text-muted-foreground">
                  Período: {format(startDate, "dd/MM/yyyy")} até {format(endDate, "dd/MM/yyyy")}
                </p>
              )}
            </div>
          )}

          {/* Data Table */}
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Empresa</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">CNPJ</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Valor</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Data</th>
                </tr>
              </thead>
              <tbody>
                {allMovs.map((m, i) => (
                  <tr key={i} className="border-t border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{m.empresa}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{m.cnpj}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        m.tipo === "Distribuição de Lucros"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent text-accent-foreground"
                      )}>
                        {m.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">{formatCurrency(m.valor)}</td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{m.data}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
