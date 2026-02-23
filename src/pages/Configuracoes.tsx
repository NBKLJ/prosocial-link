import { AppLayout } from "@/components/AppLayout";
import { Settings, User, Bell, Shield, Palette } from "lucide-react";

const sections = [
  { icon: User, title: "Perfil", description: "Informações pessoais e dados da conta" },
  { icon: Bell, title: "Notificações", description: "Preferências de alertas e avisos" },
  { icon: Shield, title: "Segurança", description: "Senha, autenticação e sessões ativas" },
  { icon: Palette, title: "Aparência", description: "Tema, idioma e personalização" },
];

const Configuracoes = () => (
  <AppLayout>
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid gap-3">
        {sections.map((s) => (
          <div key={s.title} className="glass-card rounded-xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <s.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Configuracoes;
