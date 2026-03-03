import { useState } from "react";
import {
  ArrowLeft, ArrowRight, X, Search, Plus,
  ShoppingCart, FileText, CalendarDays, Trash2,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface WizardData {
  segmento: string;
  segmentoCustom: string;
  modeloVenda: string;
  nomeEmpresa: string;
  cnpj: string;
  endereco: string;
  telefone: string;
  email: string;
  site: string;
  nomeAgente: string;
  tom: string;
  produtos: { nome: string; preco: string; link: string }[];
  horario: string;
  horarioSabado: string;
  mensagemBoasVindas: string;
  regras: string[];
  faqInicial: { pergunta: string; resposta: string }[];
  transbordo: boolean;
  transbordoTentativas: string;
  redesSociais: string;
  descricaoEmpresa: string;
}

const SEGMENTS = [
  "Infoprodutor / Produtos Digitais",
  "Clínica Médica",
  "Clínica Odontológica",
  "Clínica Estética",
  "Psicólogo / Terapeuta",
  "Cursos / Treinamentos",
  "Escola Infantil / Creche",
  "Salão / Barbearia",
  "Personal / Academia",
  "Imobiliária",
  "Escritório de Advocacia",
  "Contabilidade",
  "E-commerce / Loja Virtual",
  "Restaurante / Delivery",
];

const SALE_MODELS = [
  { id: "direta", label: "Venda Direta", desc: "O cliente compra direto pelo atendimento", icon: ShoppingCart },
  { id: "orcamento", label: "Proposta / Orçamento", desc: "A IA coleta dados e envia uma proposta", icon: FileText },
  { id: "agendamento", label: "Agendamento", desc: "O cliente agenda uma consulta ou reunião", icon: CalendarDays },
];

const TONES = [
  { id: "formal", label: "🎩 Formal", desc: "Linguagem corporativa e respeitosa" },
  { id: "amigavel", label: "😊 Amigável", desc: "Próximo, acolhedor e descontraído" },
  { id: "tecnico", label: "🔧 Técnico", desc: "Preciso, objetivo e direto" },
  { id: "persuasivo", label: "🎯 Persuasivo", desc: "Focado em conversão e vendas" },
];

const TOTAL_STEPS = 12;

interface CreationWizardProps {
  onClose: () => void;
  onFinish: (data: WizardData) => void;
}

const CreationWizard = ({ onClose, onFinish }: CreationWizardProps) => {
  const [step, setStep] = useState(1);
  const [segSearch, setSegSearch] = useState("");
  const [data, setData] = useState<WizardData>({
    segmento: "",
    segmentoCustom: "",
    modeloVenda: "",
    nomeEmpresa: "",
    cnpj: "",
    endereco: "",
    telefone: "",
    email: "",
    site: "",
    nomeAgente: "",
    tom: "",
    produtos: [{ nome: "", preco: "", link: "" }],
    horario: "Segunda a Sexta, 08:00 às 18:00",
    horarioSabado: "",
    mensagemBoasVindas: "",
    regras: ["Sempre cumprimentar o cliente pelo nome"],
    faqInicial: [{ pergunta: "", resposta: "" }],
    transbordo: true,
    transbordoTentativas: "3",
    redesSociais: "",
    descricaoEmpresa: "",
  });

  const u = <K extends keyof WizardData>(key: K, val: WizardData[K]) =>
    setData(p => ({ ...p, [key]: val }));

  const canNext = (): boolean => {
    switch (step) {
      case 1: return !!(data.segmento || data.segmentoCustom);
      case 2: return !!data.modeloVenda;
      case 3: return !!data.nomeEmpresa;
      case 4: return !!data.nomeAgente;
      case 5: return !!data.tom;
      default: return true;
    }
  };

  const next = () => { if (step < TOTAL_STEPS && canNext()) setStep(s => s + 1); };
  const prev = () => { if (step > 1) setStep(s => s - 1); };
  const finish = () => { onFinish(data); toast.success("IA criada com sucesso!"); };

  const filteredSegments = SEGMENTS.filter(s =>
    !segSearch || s.toLowerCase().includes(segSearch.toLowerCase())
  );

  const stepTitles: Record<number, { title: string; subtitle: string }> = {
    1: { title: "Segmento", subtitle: "Em qual segmento você atua?" },
    2: { title: "Modelo de Venda", subtitle: "Como funciona sua venda?" },
    3: { title: "Dados da Empresa", subtitle: "Informações básicas do seu negócio" },
    4: { title: "Nome do Agente", subtitle: "Como o agente vai se apresentar?" },
    5: { title: "Tom de Voz", subtitle: "Qual tom o agente deve usar?" },
    6: { title: "Produtos e Serviços", subtitle: "O que você oferece?" },
    7: { title: "Horário de Funcionamento", subtitle: "Quando sua empresa atende?" },
    8: { title: "Mensagem Inicial", subtitle: "A primeira mensagem que o cliente recebe" },
    9: { title: "Regras do Agente", subtitle: "Diretrizes de comportamento da IA" },
    10: { title: "Perguntas Frequentes", subtitle: "Respostas automáticas para dúvidas comuns" },
    11: { title: "Transbordo Humano", subtitle: "Quando transferir para um atendente?" },
    12: { title: "Revisão Final", subtitle: "Confira tudo antes de criar" },
  };

  const { title, subtitle } = stepTitles[step];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-sm font-bold">{step}</span>
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">{title}</h2>
                <p className="text-[11px] text-muted-foreground">Passo {step} de {TOTAL_STEPS}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  i < step ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="text-sm font-semibold text-foreground mb-1">{subtitle}</p>
          <p className="text-xs text-muted-foreground mb-5">
            {step === 1 && "Vamos criar um agente especialista no seu mercado"}
            {step === 2 && "Isso ajuda a IA a entender o fluxo de conversão"}
            {step === 3 && "Essas informações serão usadas pela IA nas conversas"}
            {step === 4 && "O nome que o agente usará para se apresentar aos clientes"}
            {step === 5 && "Define como a IA se comunica com seus clientes"}
            {step === 6 && "Liste seus produtos ou serviços com preços e links"}
            {step === 7 && "A IA informará o horário quando perguntada"}
            {step === 8 && "Customize a saudação que o cliente receberá"}
            {step === 9 && "Regras que a IA seguirá em todas as interações"}
            {step === 10 && "Perguntas que serão respondidas automaticamente"}
            {step === 11 && "Configure quando transferir para atendente humano"}
            {step === 12 && "Revise todas as configurações antes de finalizar"}
          </p>

          {/* Step 1 - Segmento */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex justify-end">
                <div className="relative w-48">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar..."
                    value={segSearch}
                    onChange={e => setSegSearch(e.target.value)}
                    className="pl-8 h-9 text-xs"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {filteredSegments.map(seg => (
                  <button
                    key={seg}
                    onClick={() => { u("segmento", seg); u("segmentoCustom", ""); }}
                    className={cn(
                      "text-left p-3.5 rounded-xl border text-sm font-medium transition-all",
                      data.segmento === seg
                        ? "border-primary bg-primary/5 text-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/30"
                    )}
                  >
                    {seg}
                  </button>
                ))}
              </div>
              <div className={cn(
                "flex items-center gap-3 p-4 rounded-xl border transition-all",
                data.segmentoCustom ? "border-primary bg-primary/5" : "border-border bg-muted/20"
              )}>
                <Plus className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">Outro segmento</p>
                  <Input
                    placeholder="Não encontrou seu segmento? Digite abaixo"
                    value={data.segmentoCustom}
                    onChange={e => { u("segmentoCustom", e.target.value); u("segmento", ""); }}
                    className="mt-1.5 h-8 text-xs border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Modelo de Venda */}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-3">
              {SALE_MODELS.map(m => (
                <button
                  key={m.id}
                  onClick={() => u("modeloVenda", m.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    data.modeloVenda === m.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    data.modeloVenda === m.id ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    <m.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                  {data.modeloVenda === m.id && (
                    <Check className="w-5 h-5 text-primary ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 3 - Dados da Empresa */}
          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">Nome da Empresa *</label>
                <Input value={data.nomeEmpresa} onChange={e => u("nomeEmpresa", e.target.value)} placeholder="Ex: Silva & Associados" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">CNPJ</label>
                <Input value={data.cnpj} onChange={e => u("cnpj", e.target.value)} placeholder="00.000.000/0000-00" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Telefone</label>
                <Input value={data.telefone} onChange={e => u("telefone", e.target.value)} placeholder="(11) 91234-5678" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">E-mail</label>
                <Input value={data.email} onChange={e => u("email", e.target.value)} placeholder="contato@empresa.com" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Website</label>
                <Input value={data.site} onChange={e => u("site", e.target.value)} placeholder="https://..." className="text-sm" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">Endereço</label>
                <Input value={data.endereco} onChange={e => u("endereco", e.target.value)} placeholder="Rua, número, bairro, cidade" className="text-sm" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-foreground">Descrição da Empresa</label>
                <Textarea value={data.descricaoEmpresa} onChange={e => u("descricaoEmpresa", e.target.value)} placeholder="Descreva sua empresa, diferenciais, tempo de atuação..." className="text-sm min-h-[80px] resize-none" />
              </div>
            </div>
          )}

          {/* Step 4 - Nome do Agente */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Nome do Agente *</label>
                <Input value={data.nomeAgente} onChange={e => u("nomeAgente", e.target.value)} placeholder="Ex: Ana, Carlos, Julia..." className="text-sm" />
                <p className="text-[11px] text-muted-foreground">Esse é o nome que o agente usará para se apresentar nas conversas</p>
              </div>
              {data.nomeAgente && (
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Pré-visualização</p>
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-sm text-foreground">
                      "Olá! Eu sou <span className="font-bold text-primary">{data.nomeAgente}</span>, assistente virtual da{" "}
                      <span className="font-bold">{data.nomeEmpresa || "sua empresa"}</span>. Como posso te ajudar?"
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5 - Tom de Voz */}
          {step === 5 && (
            <div className="grid grid-cols-1 gap-3">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => u("tom", t.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    data.tom === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                  )}
                >
                  <span className="text-2xl">{t.label.split(" ")[0]}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{t.label.split(" ").slice(1).join(" ")}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  {data.tom === t.id && <Check className="w-5 h-5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          )}

          {/* Step 6 - Produtos e Serviços */}
          {step === 6 && (
            <div className="space-y-3">
              {data.produtos.map((p, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">Produto/Serviço {i + 1}</span>
                    {data.produtos.length > 1 && (
                      <button onClick={() => u("produtos", data.produtos.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-[11px] text-muted-foreground">Nome</label>
                      <Input
                        value={p.nome}
                        onChange={e => {
                          const copy = [...data.produtos]; copy[i] = { ...copy[i], nome: e.target.value }; u("produtos", copy);
                        }}
                        placeholder="Nome do produto"
                        className="text-sm h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Preço</label>
                      <Input
                        value={p.preco}
                        onChange={e => {
                          const copy = [...data.produtos]; copy[i] = { ...copy[i], preco: e.target.value }; u("produtos", copy);
                        }}
                        placeholder="R$ 0,00"
                        className="text-sm h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] text-muted-foreground">Link (opcional)</label>
                      <Input
                        value={p.link}
                        onChange={e => {
                          const copy = [...data.produtos]; copy[i] = { ...copy[i], link: e.target.value }; u("produtos", copy);
                        }}
                        placeholder="https://..."
                        className="text-sm h-9"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full" onClick={() => u("produtos", [...data.produtos, { nome: "", preco: "", link: "" }])}>
                <Plus className="w-3.5 h-3.5" /> Adicionar produto/serviço
              </Button>
            </div>
          )}

          {/* Step 7 - Horário */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Horário de funcionamento (dias úteis)</label>
                <Input value={data.horario} onChange={e => u("horario", e.target.value)} placeholder="Segunda a Sexta, 08:00 às 18:00" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Horário aos sábados (opcional)</label>
                <Input value={data.horarioSabado} onChange={e => u("horarioSabado", e.target.value)} placeholder="Sábado, 09:00 às 13:00" className="text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Redes Sociais</label>
                <Input value={data.redesSociais} onChange={e => u("redesSociais", e.target.value)} placeholder="@sua_empresa no Instagram, Facebook, etc." className="text-sm" />
              </div>
            </div>
          )}

          {/* Step 8 - Mensagem de boas-vindas */}
          {step === 8 && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Mensagem de boas-vindas</label>
                <Textarea
                  value={data.mensagemBoasVindas}
                  onChange={e => u("mensagemBoasVindas", e.target.value)}
                  placeholder={`Olá! Seja bem-vindo(a) à ${data.nomeEmpresa || "nossa empresa"}! Eu sou ${data.nomeAgente || "o assistente"}, como posso te ajudar hoje?`}
                  className="text-sm min-h-[120px] resize-none"
                />
                <p className="text-[11px] text-muted-foreground">Essa é a primeira mensagem enviada quando o cliente inicia uma conversa</p>
              </div>
              {(data.mensagemBoasVindas || data.nomeAgente) && (
                <div className="rounded-xl border border-border bg-muted/20 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Pré-visualização</p>
                  <div className="bg-primary/5 rounded-lg p-3">
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {data.mensagemBoasVindas || `Olá! Seja bem-vindo(a) à ${data.nomeEmpresa || "nossa empresa"}! Eu sou ${data.nomeAgente || "o assistente"}, como posso te ajudar hoje?`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 9 - Regras */}
          {step === 9 && (
            <div className="space-y-3">
              {data.regras.map((r, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-[10px] font-bold shrink-0">{i + 1}</span>
                  <Input
                    value={r}
                    onChange={e => {
                      const copy = [...data.regras]; copy[i] = e.target.value; u("regras", copy);
                    }}
                    className="text-sm border-0 bg-transparent shadow-none focus-visible:ring-0 px-0"
                    placeholder="Escreva uma regra..."
                  />
                  {data.regras.length > 1 && (
                    <button onClick={() => u("regras", data.regras.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full" onClick={() => u("regras", [...data.regras, ""])}>
                <Plus className="w-3.5 h-3.5" /> Adicionar regra
              </Button>
            </div>
          )}

          {/* Step 10 - FAQ */}
          {step === 10 && (
            <div className="space-y-3">
              {data.faqInicial.map((faq, i) => (
                <div key={i} className="rounded-xl border border-border p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-muted-foreground">Pergunta {i + 1}</span>
                    {data.faqInicial.length > 1 && (
                      <button onClick={() => u("faqInicial", data.faqInicial.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <Input
                    value={faq.pergunta}
                    onChange={e => {
                      const copy = [...data.faqInicial]; copy[i] = { ...copy[i], pergunta: e.target.value }; u("faqInicial", copy);
                    }}
                    placeholder="Ex: Qual o horário de funcionamento?"
                    className="text-sm"
                  />
                  <Textarea
                    value={faq.resposta}
                    onChange={e => {
                      const copy = [...data.faqInicial]; copy[i] = { ...copy[i], resposta: e.target.value }; u("faqInicial", copy);
                    }}
                    placeholder="Resposta automática..."
                    className="text-sm min-h-[60px] resize-none"
                  />
                </div>
              ))}
              <Button variant="outline" size="sm" className="gap-1.5 text-xs w-full" onClick={() => u("faqInicial", [...data.faqInicial, { pergunta: "", resposta: "" }])}>
                <Plus className="w-3.5 h-3.5" /> Adicionar pergunta
              </Button>
            </div>
          )}

          {/* Step 11 - Transbordo */}
          {step === 11 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div>
                  <p className="text-sm font-bold text-foreground">Transbordo para humano</p>
                  <p className="text-xs text-muted-foreground">Transferir para atendente quando a IA não conseguir resolver</p>
                </div>
                <Switch checked={data.transbordo} onCheckedChange={v => u("transbordo", v)} />
              </div>
              {data.transbordo && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Após quantas tentativas sem resolução?</label>
                  <Select value={data.transbordoTentativas} onValueChange={v => u("transbordoTentativas", v)}>
                    <SelectTrigger className="text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 tentativas</SelectItem>
                      <SelectItem value="3">3 tentativas</SelectItem>
                      <SelectItem value="5">5 tentativas</SelectItem>
                      <SelectItem value="10">10 tentativas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}

          {/* Step 12 - Revisão */}
          {step === 12 && (
            <div className="space-y-3">
              {[
                { label: "Segmento", value: data.segmento || data.segmentoCustom },
                { label: "Modelo de Venda", value: SALE_MODELS.find(m => m.id === data.modeloVenda)?.label },
                { label: "Empresa", value: data.nomeEmpresa },
                { label: "Agente", value: data.nomeAgente },
                { label: "Tom de Voz", value: TONES.find(t => t.id === data.tom)?.label },
                { label: "Produtos", value: `${data.produtos.filter(p => p.nome).length} cadastrado(s)` },
                { label: "Horário", value: data.horario },
                { label: "Regras", value: `${data.regras.filter(r => r).length} regra(s)` },
                { label: "FAQ", value: `${data.faqInicial.filter(f => f.pergunta).length} pergunta(s)` },
                { label: "Transbordo", value: data.transbordo ? `Sim, após ${data.transbordoTentativas} tentativas` : "Desativado" },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
                  <span className="text-xs font-semibold text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-bold text-foreground">{item.value || "—"}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <button
            onClick={step === 1 ? onClose : prev}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 1 ? "Cancelar" : "Voltar"}
          </button>
          {step < TOTAL_STEPS ? (
            <Button onClick={next} disabled={!canNext()} className="gap-1.5 text-sm px-6">
              Próximo <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={finish} className="gap-1.5 text-sm px-6 bg-primary">
              <Check className="w-4 h-4" /> Criar Agente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreationWizard;
