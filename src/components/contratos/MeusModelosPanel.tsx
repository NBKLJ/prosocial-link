import { useState, useEffect } from "react";
import {
  FileText, Plus, Search, Edit3, Trash2, ChevronDown,
  Save, X, Briefcase, Scale, FileSignature, Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ── TYPES ─────────────────────────────────────────────────
export interface DocumentModel {
  id: string;
  name: string;
  type: "contrato" | "procuracao" | "distrato" | "aditivo" | "outro";
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const typeLabels: Record<string, string> = {
  contrato: "Contrato", procuracao: "Procuração", distrato: "Distrato", aditivo: "Aditivo", outro: "Outro",
};

const typeIcons: Record<string, typeof FileText> = {
  contrato: Briefcase, procuracao: Scale, distrato: X, aditivo: Plus, outro: FileText,
};

// ── MOCK DATA ─────────────────────────────────────────────
const INITIAL_MODELS: DocumentModel[] = [
  {
    id: "mod-1",
    name: "Procuração Ad Judicia Padrão",
    type: "procuracao",
    description: "Procuração padrão para representação judicial em qualquer instância",
    createdAt: "2026-02-10",
    updatedAt: "2026-02-28",
    content: `PROCURAÇÃO AD JUDICIA

OUTORGANTE: {{NOME_CLIENTE}}, {{NACIONALIDADE_CLIENTE}}, {{ESTADO_CIVIL_CLIENTE}}, {{PROFISSAO_CLIENTE}}, portador(a) do RG nº {{RG_CLIENTE}} e inscrito(a) no CPF sob o nº {{CPF_CLIENTE}}, residente e domiciliado(a) à {{ENDERECO_CLIENTE}}.

OUTORGADO: {{NOME_ADVOGADO}}, inscrito(a) na OAB/{{UF_OAB}} sob o nº {{NUMERO_OAB}}, com escritório profissional à {{ENDERECO_ESCRITORIO}}.

PODERES: Por este instrumento particular de procuração, o(a) OUTORGANTE nomeia e constitui o(a) OUTORGADO(A) como seu(sua) bastante procurador(a), a quem confere amplos e gerais poderes para o foro em geral, com a cláusula "AD JUDICIA ET EXTRA", podendo propor contra quem de direito as ações competentes e defendê-lo(a) nas contrárias, seguindo umas e outras até final decisão, usando os recursos legais e acompanhando-os, conferindo-lhe, ainda, poderes especiais para confessar, desistir, transigir, firmar compromissos ou acordos, receber e dar quitação, agindo em conjunto ou separadamente, podendo ainda substabelecer esta a outrem, com ou sem reserva de iguais poderes, dando tudo por bom, firme e valioso.

{{CIDADE_CLIENTE}}, {{DATA_DOCUMENTO}}.

_______________________________
{{NOME_CLIENTE}}
CPF: {{CPF_CLIENTE}}`,
  },
  {
    id: "mod-2",
    name: "Contrato de Prestação de Serviços Advocatícios",
    type: "contrato",
    description: "Contrato padrão de honorários para prestação de serviços jurídicos",
    createdAt: "2026-01-15",
    updatedAt: "2026-02-20",
    content: `CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS

Pelo presente instrumento particular, as partes abaixo qualificadas:

CONTRATANTE: {{NOME_CLIENTE}}, inscrito(a) no CPF/CNPJ sob o nº {{CPF_CNPJ_CLIENTE}}, residente/estabelecido(a) à {{ENDERECO_CLIENTE}}, telefone {{TELEFONE_CLIENTE}}, e-mail {{EMAIL_CLIENTE}}.

CONTRATADO: {{NOME_ADVOGADO}}, {{NOME_ESCRITORIO}}, inscrito na OAB/{{UF_OAB}} sob o nº {{NUMERO_OAB}}, CNPJ {{CNPJ_ESCRITORIO}}, com sede à {{ENDERECO_ESCRITORIO}}.

CLÁUSULA 1ª – DO OBJETO
O(A) CONTRATADO(A) prestará serviços advocatícios ao(à) CONTRATANTE, consistentes em {{DESCRICAO_SERVICOS}}.

CLÁUSULA 2ª – DOS HONORÁRIOS
Pelos serviços prestados, o(a) CONTRATANTE pagará ao(à) CONTRATADO(A) o valor de {{VALOR_HONORARIOS}}, a ser pago da seguinte forma: {{FORMA_PAGAMENTO}}.

CLÁUSULA 3ª – DAS DESPESAS
As despesas processuais e extrajudiciais correrão por conta do(a) CONTRATANTE, mediante prévio aviso e aprovação.

CLÁUSULA 4ª – DA VIGÊNCIA
O presente contrato vigorará pelo prazo de {{PRAZO_CONTRATO}}, podendo ser prorrogado mediante aditivo contratual.

CLÁUSULA 5ª – DA RESCISÃO
Qualquer das partes poderá rescindir o presente contrato, mediante notificação por escrito com antecedência mínima de 30 (trinta) dias.

CLÁUSULA 6ª – DO FORO
Fica eleito o foro da Comarca de {{COMARCA}}, Estado de {{ESTADO}}, para dirimir quaisquer questões oriundas do presente instrumento.

{{CIDADE_CLIENTE}}, {{DATA_DOCUMENTO}}.

_______________________________          _______________________________
{{NOME_CONTRATANTE}}                     {{NOME_ADVOGADO}}
CPF: {{CPF_CLIENTE}}                     OAB: {{NUMERO_OAB}}`,
  },
  {
    id: "mod-3",
    name: "Contrato de Compra e Venda",
    type: "contrato",
    description: "Modelo padrão de contrato de compra e venda de bens",
    createdAt: "2026-02-01",
    updatedAt: "2026-02-25",
    content: `CONTRATO PARTICULAR DE COMPRA E VENDA

Pelo presente instrumento particular, as partes:

VENDEDOR(A): {{NOME_VENDEDOR}}, {{NACIONALIDADE_VENDEDOR}}, {{ESTADO_CIVIL_VENDEDOR}}, portador(a) do RG nº {{RG_VENDEDOR}} e inscrito(a) no CPF sob o nº {{CPF_VENDEDOR}}, residente e domiciliado(a) à {{ENDERECO_VENDEDOR}}.

COMPRADOR(A): {{NOME_CLIENTE}}, {{NACIONALIDADE_CLIENTE}}, {{ESTADO_CIVIL_CLIENTE}}, portador(a) do RG nº {{RG_CLIENTE}} e inscrito(a) no CPF sob o nº {{CPF_CLIENTE}}, residente e domiciliado(a) à {{ENDERECO_CLIENTE}}.

CLÁUSULA 1ª – DO OBJETO
O(A) VENDEDOR(A) vende ao(à) COMPRADOR(A), e este(a) compra, o seguinte bem: {{DESCRICAO_BEM}}.

CLÁUSULA 2ª – DO PREÇO E FORMA DE PAGAMENTO
O preço total da venda é de {{VALOR_TOTAL}}, que será pago da seguinte forma: {{FORMA_PAGAMENTO}}.

CLÁUSULA 3ª – DA ENTREGA
A entrega do bem será realizada em {{DATA_ENTREGA}}, no endereço {{LOCAL_ENTREGA}}.

CLÁUSULA 4ª – DAS GARANTIAS
O(A) VENDEDOR(A) garante que o bem objeto deste contrato está livre e desembaraçado de quaisquer ônus, dívidas ou pendências.

CLÁUSULA 5ª – DO FORO
As partes elegem o foro da Comarca de {{COMARCA}} para dirimir eventuais litígios.

{{CIDADE}}, {{DATA_DOCUMENTO}}.

_______________________________          _______________________________
{{NOME_VENDEDOR}}                        {{NOME_CLIENTE}}`,
  },
];

// ── NEW MODEL DIALOG ─────────────────────────────────────
function NewModelDialog({ open, onOpenChange, onSave }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (model: DocumentModel) => void;
}) {
  const [name, setName] = useState("");
  const [type, setType] = useState<DocumentModel["type"]>("contrato");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");

  const handleSave = () => {
    if (!name.trim()) { toast.error("Informe o nome do documento"); return; }
    if (!content.trim()) { toast.error("Adicione o conteúdo do documento"); return; }
    const now = new Date().toISOString().split("T")[0];
    onSave({
      id: `mod-${Date.now()}`,
      name: name.trim(),
      type,
      description: description.trim(),
      content: content.trim(),
      createdAt: now,
      updatedAt: now,
    });
    setName(""); setType("contrato"); setDescription(""); setContent("");
    onOpenChange(false);
    toast.success("Modelo cadastrado com sucesso!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> Novo Documento / Modelo
          </DialogTitle>
          <DialogDescription>
            Cadastre um modelo padrão de contrato, procuração ou outro documento. Use variáveis como {"{{NOME_CLIENTE}}"} para campos que a IA preencherá automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome do Documento</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ex: Procuração Padrão, Contrato de Compra e Venda..."
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as DocumentModel["type"])}
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              >
                <option value="contrato">Contrato</option>
                <option value="procuracao">Procuração</option>
                <option value="distrato">Distrato</option>
                <option value="aditivo">Aditivo</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição breve</label>
              <input
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descrição curta do modelo"
                className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">Conteúdo do Documento</label>
              <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
                Use {"{{VARIAVEL}}"} para campos dinâmicos
              </span>
            </div>
            <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20 p-4 flex justify-center">
              <div className="bg-white shadow-xl rounded-sm w-full min-h-[400px] relative">
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={`Cole ou escreva o texto do seu documento aqui...\n\nExemplo:\nCONTRATO DE PRESTAÇÃO DE SERVIÇOS\n\nCONTRATANTE: {{NOME_CLIENTE}}, CPF {{CPF_CLIENTE}}...`}
                  className="w-full h-full min-h-[400px] bg-transparent px-10 py-12 text-sm text-gray-800 leading-relaxed focus:outline-none resize-y placeholder:text-gray-400"
                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                />
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              <strong className="text-foreground">Dica:</strong> Variáveis disponíveis: {"{{NOME_CLIENTE}}"}, {"{{CPF_CLIENTE}}"}, {"{{ENDERECO_CLIENTE}}"}, {"{{TELEFONE_CLIENTE}}"}, {"{{EMAIL_CLIENTE}}"}, {"{{NOME_ADVOGADO}}"}, {"{{OAB}}"}, {"{{DATA_DOCUMENTO}}"}, e outras. A IA preenche automaticamente os dados do cliente a partir da conversa.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" /> Salvar Modelo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── MAIN PANEL ────────────────────────────────────────────
export function MeusModelosPanel({ openNewDialog: externalOpen }: { openNewDialog?: boolean }) {
  const [models, setModels] = useState<DocumentModel[]>(INITIAL_MODELS);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNewDialog, setShowNewDialog] = useState(false);

  useEffect(() => {
    if (externalOpen) setShowNewDialog(true);
  }, [externalOpen]);

  const filtered = models.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleExpand = (id: string) => {
    if (expandedId === id) { setExpandedId(null); setEditingId(null); }
    else { setExpandedId(id); setEditingId(null); }
  };

  const handleStartEdit = (model: DocumentModel) => {
    setEditingId(model.id);
    setEditContent(model.content);
  };

  const handleSaveEdit = (id: string) => {
    setModels(prev => prev.map(m => m.id === id ? { ...m, content: editContent, updatedAt: new Date().toISOString().split("T")[0] } : m));
    setEditingId(null);
    toast.success("Modelo atualizado!");
  };

  const handleDelete = (id: string) => {
    setModels(prev => prev.filter(m => m.id !== id));
    if (expandedId === id) setExpandedId(null);
    toast.success("Modelo removido");
  };

  const handleAddModel = (model: DocumentModel) => {
    setModels(prev => [model, ...prev]);
  };

  // Extract variables from content
  const extractVars = (content: string) => {
    const matches = content.match(/\{\{([^}]+)\}\}/g);
    return matches ? [...new Set(matches)] : [];
  };

  return (
    <div className="space-y-4">
      {/* Search + Add */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar modelos..."
            className="w-full bg-card border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setShowNewDialog(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" /> Novo Modelo
        </button>
      </div>

      {/* Info */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <FileSignature className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Seus Modelos de Documentos</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cadastre procurações, contratos e outros documentos com os dados do advogado já preenchidos. 
            Clique em um modelo para ver e editar o conteúdo completo.
          </p>
        </div>
      </div>

      {/* Model list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhum modelo encontrado</p>
          <button onClick={() => setShowNewDialog(true)} className="mt-3 text-xs font-semibold text-primary hover:underline">
            + Cadastrar primeiro modelo
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((model, i) => {
            const isExpanded = expandedId === model.id;
            const isEditing = editingId === model.id;
            const Icon = typeIcons[model.type] || FileText;
            const vars = extractVars(model.content);

            return (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-card border border-border/50 rounded-xl overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => handleToggleExpand(model.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-muted/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground text-sm truncate">{model.name}</h4>
                      <Badge variant="outline" className="text-[10px] flex-shrink-0">{typeLabels[model.type]}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{model.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                      <span>Criado: {model.createdAt}</span>
                      <span>Atualizado: {model.updatedAt}</span>
                      <span className="text-primary">{vars.length} variáveis</span>
                    </div>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform flex-shrink-0", isExpanded && "rotate-180")} />
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-border/30 pt-4">
                        {/* Variables list */}
                        {vars.length > 0 && (
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Variáveis do Documento</p>
                            <div className="flex flex-wrap gap-1.5">
                              {vars.map(v => (
                                <span key={v} className="text-[10px] font-mono px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20">
                                  {v}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Content area */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Conteúdo do Documento</p>
                            <div className="flex items-center gap-2">
                              {!isEditing ? (
                                <>
                                  <button onClick={() => handleStartEdit(model)} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-primary/10">
                                    <Edit3 className="w-3.5 h-3.5" /> Editar
                                  </button>
                                  <button onClick={() => { navigator.clipboard.writeText(model.content); toast.success("Conteúdo copiado!"); }}
                                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50">
                                    <Copy className="w-3.5 h-3.5" /> Copiar
                                  </button>
                                  <button onClick={() => handleDelete(model.id)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-destructive hover:text-destructive/80 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-destructive/10">
                                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => handleSaveEdit(model.id)} className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/15">
                                    <Save className="w-3.5 h-3.5" /> Salvar
                                  </button>
                                  <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50">
                                    <X className="w-3.5 h-3.5" /> Cancelar
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {isEditing ? (
                            <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20 p-6 flex justify-center">
                              <div className="bg-white shadow-xl rounded-sm w-full max-w-[700px] min-h-[600px] relative">
                                <textarea
                                  value={editContent}
                                  onChange={e => setEditContent(e.target.value)}
                                  className="w-full h-full min-h-[600px] bg-transparent px-12 py-14 text-sm text-gray-800 leading-relaxed focus:outline-none resize-y"
                                  style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="border border-border/50 rounded-xl overflow-hidden bg-muted/20 p-6 flex justify-center">
                              <div className="bg-white shadow-xl rounded-sm w-full max-w-[700px] min-h-[400px] px-12 py-14 relative">
                                <pre className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
                                  {model.content}
                                </pre>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <NewModelDialog open={showNewDialog} onOpenChange={setShowNewDialog} onSave={handleAddModel} />
    </div>
  );
}
