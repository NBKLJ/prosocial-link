import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PenLine, Zap, DollarSign, Link, Percent } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProcessoFormData {
  // Partes
  cliente: string;
  parteAdversa: string;
  // Personalização
  etiquetas: string;
  // Detalhes
  responsaveis: string;
  numeroProcesso: string;
  processoAdministrativo: boolean;
  numeroProtocolo: string;
  tribunal: string;
  processoOriginario: string;
  instancia: string;
  grauRisco: string;
  grupoAcao: string;
  tipoAcao: string;
  status: string;
  etapaAtendimento: string;
  dataRequerimento: string;
  valorCausa: string;
  valorHonorarios: string;
  percentualHonorarios: string;
  link: string;
  juizo: string;
  numerosPrecatorio: string;
  autor: string;
  reu: string;
  resultadoPericia: string;
  nomePerito: string;
  tipoPerito: string;
  valorCondenacao: string;
  honorariosPerito: string;
  valorHonorariosSucessao: string;
  peticao: string;
  valorPeticao: string;
  parceiro: string;
  codigo: string;
  anotacoes: string;
}

const emptyForm: ProcessoFormData = {
  cliente: "", parteAdversa: "", etiquetas: "", responsaveis: "", numeroProcesso: "",
  processoAdministrativo: false, numeroProtocolo: "", tribunal: "", processoOriginario: "",
  instancia: "", grauRisco: "", grupoAcao: "", tipoAcao: "", status: "", etapaAtendimento: "",
  dataRequerimento: "", valorCausa: "", valorHonorarios: "", percentualHonorarios: "", link: "",
  juizo: "", numerosPrecatorio: "", autor: "", reu: "", resultadoPericia: "", nomePerito: "",
  tipoPerito: "", valorCondenacao: "", honorariosPerito: "", valorHonorariosSucessao: "",
  peticao: "", valorPeticao: "", parceiro: "", codigo: "", anotacoes: "",
};

interface AddProcessoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProcessoFormData) => void;
}

export function AddProcessoDialog({ open, onOpenChange, onSave }: AddProcessoDialogProps) {
  const [mode, setMode] = useState<"select" | "manual" | "auto">("select");
  const [form, setForm] = useState<ProcessoFormData>(emptyForm);

  const updateField = (field: keyof ProcessoFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) setMode("select");
    onOpenChange(val);
  };

  const handleSave = (monitor: boolean = false) => {
    onSave(form);
    setForm(emptyForm);
    setMode("select");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={mode === "manual" ? "max-w-2xl max-h-[90vh] overflow-y-auto" : "max-w-md"}>
        <DialogHeader>
          <DialogTitle>Adicionar Processo</DialogTitle>
          <DialogDescription>
            {mode === "select" ? "Escolha como deseja adicionar o processo." : mode === "manual" ? "Preencha os dados do processo manualmente." : "Busca automática por número do processo."}
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Step 1: Select mode */}
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-2 gap-4 py-4"
            >
              <button
                onClick={() => setMode("manual")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <PenLine className="w-7 h-7 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Manual</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Preencher todos os dados do processo manualmente</p>
                </div>
              </button>
              <button
                onClick={() => setMode("auto")}
                className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border/50 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <Zap className="w-7 h-7 text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-foreground">Automático</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Buscar dados automaticamente pelo número do processo</p>
                </div>
              </button>
            </motion.div>
          )}

          {/* Mode: Auto */}
          {mode === "auto" && (
            <motion.div
              key="auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4 py-4"
            >
              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center space-y-2">
                <Zap className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="text-sm font-medium text-foreground">Busca automática</p>
                <p className="text-xs text-muted-foreground">Informe o número do processo e buscaremos os dados automaticamente nos tribunais.</p>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Número do Processo</Label>
                <Input placeholder="0000000-00.0000.0.00.0000" value={form.numeroProcesso} onChange={(e) => updateField("numeroProcesso", e.target.value)} />
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setMode("select")}>Voltar</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Buscar Processo</Button>
              </DialogFooter>
            </motion.div>
          )}

          {/* Mode: Manual - Full form */}
          {mode === "manual" && (
            <motion.div
              key="manual"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6 py-2"
            >
              {/* Partes */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Partes</h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Cliente (Opcional)</Label>
                    <Select value={form.cliente} onValueChange={(v) => updateField("cliente", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente1">João Silva</SelectItem>
                        <SelectItem value="cliente2">Maria Souza</SelectItem>
                        <SelectItem value="cliente3">Empresa ABC Ltda</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">Parte Adversa (Opcional)</Label>
                    <Select value={form.parteAdversa} onValueChange={(v) => updateField("parteAdversa", v)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="adv1">Pedro Oliveira</SelectItem>
                        <SelectItem value="adv2">Tech Solutions S.A.</SelectItem>
                        <SelectItem value="adv3">Fornecedora Beta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Personalização */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Personalização</h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Etiquetas (Opcional)</Label>
                  <Select value={form.etiquetas} onValueChange={(v) => updateField("etiquetas", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="civel">Cível</SelectItem>
                      <SelectItem value="trabalhista">Trabalhista</SelectItem>
                      <SelectItem value="familia">Família</SelectItem>
                      <SelectItem value="tributario">Tributário</SelectItem>
                      <SelectItem value="prioritario">Prioritário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Detalhes */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Detalhes</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Responsáveis</Label>
                      <Input value={form.responsaveis} onChange={(e) => updateField("responsaveis", e.target.value)} placeholder="Nome do responsável" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Número do processo (Opcional)</Label>
                      <Input value={form.numeroProcesso} onChange={(e) => updateField("numeroProcesso", e.target.value)} placeholder="Informe o número do processo" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={form.processoAdministrativo} onCheckedChange={(v) => updateField("processoAdministrativo", v)} />
                    <span className="text-xs text-muted-foreground">Processo administrativo</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Número do protocolo (Opcional)</Label>
                      <Input value={form.numeroProtocolo} onChange={(e) => updateField("numeroProtocolo", e.target.value)} placeholder="Informe o número do protocolo/requerimento" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Tribunal (Opcional)</Label>
                      <Input value={form.tribunal} onChange={(e) => updateField("tribunal", e.target.value)} placeholder="Informe o tribunal" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Processo originário (Opcional)</Label>
                      <Input value={form.processoOriginario} onChange={(e) => updateField("processoOriginario", e.target.value)} placeholder="Informe o processo originário" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Instância</Label>
                      <Select value={form.instancia} onValueChange={(v) => updateField("instancia", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1ª Instância</SelectItem>
                          <SelectItem value="2">2ª Instância</SelectItem>
                          <SelectItem value="superior">Tribunais Superiores</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Grau de Risco (Opcional)</Label>
                      <Select value={form.grauRisco} onValueChange={(v) => updateField("grauRisco", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="baixo">Baixo</SelectItem>
                          <SelectItem value="medio">Médio</SelectItem>
                          <SelectItem value="alto">Alto</SelectItem>
                          <SelectItem value="muito_alto">Muito Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Grupo de ação (Opcional)</Label>
                      <Select value={form.grupoAcao} onValueChange={(v) => updateField("grupoAcao", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contencioso">Contencioso</SelectItem>
                          <SelectItem value="consultivo">Consultivo</SelectItem>
                          <SelectItem value="preventivo">Preventivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Tipo de ação (Opcional)</Label>
                      <Select value={form.tipoAcao} onValueChange={(v) => updateField("tipoAcao", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ordinaria">Ação Ordinária</SelectItem>
                          <SelectItem value="execucao">Execução</SelectItem>
                          <SelectItem value="mandado">Mandado de Segurança</SelectItem>
                          <SelectItem value="cautelar">Ação Cautelar</SelectItem>
                          <SelectItem value="monitoria">Ação Monitória</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="em_andamento">Em andamento</SelectItem>
                          <SelectItem value="urgente">Urgente</SelectItem>
                          <SelectItem value="aguardando">Aguardando</SelectItem>
                          <SelectItem value="concluido">Concluído</SelectItem>
                          <SelectItem value="arquivado">Arquivado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Etapa de atendimento (Opcional)</Label>
                      <Select value={form.etapaAtendimento} onValueChange={(v) => updateField("etapaAtendimento", v)}>
                        <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inicial">Inicial</SelectItem>
                          <SelectItem value="instrucao">Instrução</SelectItem>
                          <SelectItem value="sentenca">Sentença</SelectItem>
                          <SelectItem value="recursal">Recursal</SelectItem>
                          <SelectItem value="execucao">Execução</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Data do requerimento (Opcional)</Label>
                      <Input type="date" value={form.dataRequerimento} onChange={(e) => updateField("dataRequerimento", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Valor da causa (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.valorCausa} onChange={(e) => updateField("valorCausa", e.target.value)} placeholder="Informe o valor" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Valor dos honorários (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.valorHonorarios} onChange={(e) => updateField("valorHonorarios", e.target.value)} placeholder="Informe o valor" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Percentual de honorários % (Opcional)</Label>
                      <div className="relative">
                        <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.percentualHonorarios} onChange={(e) => updateField("percentualHonorarios", e.target.value)} placeholder="Informe o percentual" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Link (Opcional)</Label>
                      <div className="relative">
                        <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.link} onChange={(e) => updateField("link", e.target.value)} placeholder="Informe o link do processo" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Juízo (Opcional)</Label>
                      <Input value={form.juizo} onChange={(e) => updateField("juizo", e.target.value)} placeholder="Informe o juízo do processo" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Números do Precatório (Opcional)</Label>
                      <Input value={form.numerosPrecatorio} onChange={(e) => updateField("numerosPrecatorio", e.target.value)} placeholder="Exemplo: 201, 202, 812, 1039" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Autor (Opcional)</Label>
                      <Input value={form.autor} onChange={(e) => updateField("autor", e.target.value)} placeholder="Informe o autor" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Réu (Opcional)</Label>
                      <Input value={form.reu} onChange={(e) => updateField("reu", e.target.value)} placeholder="Informe o réu" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Resultado da Perícia (Opcional)</Label>
                      <Input value={form.resultadoPericia} onChange={(e) => updateField("resultadoPericia", e.target.value)} placeholder="Informe o resultado da perícia" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Nome do Perito (Opcional)</Label>
                      <Input value={form.nomePerito} onChange={(e) => updateField("nomePerito", e.target.value)} placeholder="Informe o nome do perito" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Tipo de Perito (Opcional)</Label>
                      <Input value={form.tipoPerito} onChange={(e) => updateField("tipoPerito", e.target.value)} placeholder="Informe o tipo de perito" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Valor da Condenação (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.valorCondenacao} onChange={(e) => updateField("valorCondenacao", e.target.value)} placeholder="Informe o valor" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Honorários do Perito (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.honorariosPerito} onChange={(e) => updateField("honorariosPerito", e.target.value)} placeholder="Informe o valor" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Valor Honorários Sucessão (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.valorHonorariosSucessao} onChange={(e) => updateField("valorHonorariosSucessao", e.target.value)} placeholder="Informe o valor" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Petição (Opcional)</Label>
                      <Input value={form.peticao} onChange={(e) => updateField("peticao", e.target.value)} placeholder="Informe a petição" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Valor da Petição (Opcional)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <Input className="pl-8" value={form.valorPeticao} onChange={(e) => updateField("valorPeticao", e.target.value)} placeholder="Informe o valor" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Parceiro (Opcional)</Label>
                      <Input value={form.parceiro} onChange={(e) => updateField("parceiro", e.target.value)} placeholder="Informe o parceiro" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs text-muted-foreground">Código (Opcional)</Label>
                      <Input value={form.codigo} onChange={(e) => updateField("codigo", e.target.value)} placeholder="Informe o código" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Anotações */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3">Anotações, fatos e fundamentos (Opcional)</h3>
                <Textarea
                  value={form.anotacoes}
                  onChange={(e) => updateField("anotacoes", e.target.value)}
                  placeholder="Digite aqui..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setMode("select")}>Fechar</Button>
                <Button onClick={() => handleSave(false)}>Adicionar</Button>
                <Button onClick={() => handleSave(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  Adicionar e monitorar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
