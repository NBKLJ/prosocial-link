import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText, Upload, CheckCircle2, Send, User, Mail, Phone, FileSignature, Plus, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SendContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  onSend?: (data: { template: string; signers: Signer[] }) => void;
}

interface Signer {
  name: string;
  email: string;
  phone: string;
}

const CONTRACT_TEMPLATES = [
  { id: "tpl-1", name: "Contrato de Prestação de Serviços" },
  { id: "tpl-2", name: "Procuração Ad Judicia" },
  { id: "tpl-3", name: "Procuração Administrativa" },
  { id: "tpl-4", name: "Distrato Contratual" },
  { id: "tpl-5", name: "Aditivo Contratual" },
  { id: "tpl-6", name: "NDA / Confidencialidade" },
];

export function SendContractDialog({ open, onOpenChange, contactName = "", contactPhone = "", contactEmail = "", onSend }: SendContractDialogProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [uploadMode, setUploadMode] = useState(false);
  const [signers, setSigners] = useState<Signer[]>([
    { name: contactName, email: contactEmail, phone: contactPhone },
  ]);
  const [sending, setSending] = useState(false);

  const resetAndClose = () => {
    setStep(1);
    setSelectedTemplate("");
    setUploadMode(false);
    setSigners([{ name: contactName, email: contactEmail, phone: contactPhone }]);
    setSending(false);
    onOpenChange(false);
  };

  const addSigner = () => {
    setSigners([...signers, { name: "", email: "", phone: "" }]);
  };

  const removeSigner = (idx: number) => {
    if (signers.length <= 1) return;
    setSigners(signers.filter((_, i) => i !== idx));
  };

  const updateSigner = (idx: number, field: keyof Signer, value: string) => {
    setSigners(signers.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSend = () => {
    if (!signers[0].name.trim() || !signers[0].email.trim()) {
      toast.error("Preencha nome e e-mail do signatário principal");
      return;
    }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast.success("Contrato enviado para assinatura via ZapSign!");
      onSend?.({ template: selectedTemplate, signers });
      resetAndClose();
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-primary" />
            Enviar Contrato para Assinatura
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Selecione um modelo de contrato ou faça upload de um PDF"}
            {step === 2 && "Confirme os dados dos signatários"}
            {step === 3 && "Revise e envie o contrato"}
          </DialogDescription>
        </DialogHeader>

        {/* Progress steps */}
        <div className="flex items-center gap-2 py-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={cn("flex-1 h-0.5 rounded-full", step > s ? "bg-primary" : "bg-muted")} />}
            </div>
          ))}
        </div>

        {/* Step 1: Select template */}
        {step === 1 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setUploadMode(false)}
                className={cn("flex-1 py-2 rounded-lg text-xs font-medium border transition-colors", !uploadMode ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:bg-muted")}
              >
                <FileText className="w-4 h-4 inline mr-1.5" /> Modelo
              </button>
              <button
                onClick={() => setUploadMode(true)}
                className={cn("flex-1 py-2 rounded-lg text-xs font-medium border transition-colors", uploadMode ? "bg-primary/10 text-primary border-primary/30" : "border-border text-muted-foreground hover:bg-muted")}
              >
                <Upload className="w-4 h-4 inline mr-1.5" /> Upload PDF
              </button>
            </div>

            {!uploadMode ? (
              <div className="space-y-1.5 max-h-52 overflow-y-auto">
                {CONTRACT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors text-sm",
                      selectedTemplate === tpl.id ? "bg-primary/10 border border-primary/30 text-foreground" : "hover:bg-muted/50 border border-transparent text-foreground"
                    )}
                  >
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {tpl.name}
                    {selectedTemplate === tpl.id && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/30 transition-colors">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Clique ou arraste um PDF</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Máximo 10MB</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Signers */}
        {step === 2 && (
          <div className="space-y-4">
            {signers.map((signer, idx) => (
              <div key={idx} className="space-y-2 p-3 rounded-xl border border-border/50 bg-muted/20 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Signatário {idx + 1} {idx === 0 && "(Principal)"}
                  </span>
                  {signers.length > 1 && (
                    <button onClick={() => removeSigner(idx)} className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input value={signer.name} onChange={(e) => updateSigner(idx, "name", e.target.value)} placeholder="Nome completo" className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input value={signer.email} onChange={(e) => updateSigner(idx, "email", e.target.value)} placeholder="E-mail" className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input value={signer.phone} onChange={(e) => updateSigner(idx, "phone", e.target.value)} placeholder="Telefone (WhatsApp)" className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
              </div>
            ))}
            <button onClick={addSigner} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-dashed border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Adicionar signatário
            </button>
          </div>
        )}

        {/* Step 3: Review & Send */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="bg-muted/30 border border-border/50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Documento</p>
                <p className="text-sm font-medium text-foreground">
                  {uploadMode ? "PDF enviado" : CONTRACT_TEMPLATES.find(t => t.id === selectedTemplate)?.name || "Modelo selecionado"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Signatários ({signers.length})</p>
                {signers.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 py-1">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{i + 1}</div>
                    <div>
                      <p className="text-sm text-foreground">{s.name || "—"}</p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 rounded-lg px-3 py-2">
                <Send className="w-3.5 h-3.5" />
                O link será enviado automaticamente via WhatsApp
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep((step - 1) as 1 | 2)}>Voltar</Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep((step + 1) as 2 | 3)}
              disabled={step === 1 && !selectedTemplate && !uploadMode}
            >
              Próximo
            </Button>
          ) : (
            <Button onClick={handleSend} disabled={sending} className="gap-2">
              {sending ? (
                <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Enviando...</>
              ) : (
                <><Send className="w-4 h-4" /> Enviar via ZapSign</>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
