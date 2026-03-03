import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Index";
import Relatorios from "./pages/Relatorios";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import Conversas from "./pages/Conversas";
import Disparos from "./pages/Disparos";
import DisparoRecepcao from "./pages/DisparoRecepcao";
import DisparoAudio from "./pages/DisparoAudio";
import DisparoAgendamento from "./pages/DisparoAgendamento";
import DisparoMensagem from "./pages/DisparoMensagem";
import Contatos from "./pages/Contatos";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";
import Automacoes from "./pages/Automacoes";
import Agendamentos from "./pages/Agendamentos";
import Agenda from "./pages/Agenda";
import AgendaConfiguracoes from "./pages/AgendaConfiguracoes";
import IAsSetoriais from "./pages/IAsSetoriais";
import Landing from "./pages/Landing";
import Contratos from "./pages/Contratos";
import Grupos from "./pages/Grupos";
import GestaoTarefas from "./pages/GestaoTarefas";
import TarefaDetalhe from "./pages/TarefaDetalhe";
import GestaoCalendarios from "./pages/GestaoCalendarios";
import GestaoUsuarios from "./pages/GestaoUsuarios";
import GestaoProdutividade from "./pages/GestaoProdutividade";
import Financeiro from "./pages/Financeiro";
import ProcessosPainel from "./pages/ProcessosPainel";
import ProcessosAcompanhamento from "./pages/ProcessosAcompanhamento";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("zapprobr_auth") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
          <Route path="/conversas" element={<ProtectedRoute><Conversas /></ProtectedRoute>} />
          <Route path="/disparos" element={<ProtectedRoute><Disparos /></ProtectedRoute>} />
          <Route path="/disparos/recepcao" element={<ProtectedRoute><DisparoRecepcao /></ProtectedRoute>} />
          <Route path="/disparos/audio" element={<ProtectedRoute><DisparoAudio /></ProtectedRoute>} />
          <Route path="/disparos/agendamento" element={<ProtectedRoute><DisparoAgendamento /></ProtectedRoute>} />
          <Route path="/disparos/mensagem" element={<ProtectedRoute><DisparoMensagem /></ProtectedRoute>} />
          <Route path="/automacoes" element={<ProtectedRoute><Automacoes /></ProtectedRoute>} />
          <Route path="/agendamentos" element={<ProtectedRoute><Agendamentos /></ProtectedRoute>} />
          <Route path="/agenda" element={<ProtectedRoute><Agenda /></ProtectedRoute>} />
          <Route path="/agenda/configuracoes" element={<ProtectedRoute><AgendaConfiguracoes /></ProtectedRoute>} />
          <Route path="/ias-setoriais" element={<ProtectedRoute><IAsSetoriais /></ProtectedRoute>} />
          <Route path="/contatos" element={<ProtectedRoute><Contatos /></ProtectedRoute>} />
          <Route path="/contratos" element={<ProtectedRoute><Contratos /></ProtectedRoute>} />
          <Route path="/financeiro" element={<ProtectedRoute><Financeiro /></ProtectedRoute>} />
          <Route path="/processos/painel" element={<ProtectedRoute><ProcessosPainel /></ProtectedRoute>} />
          <Route path="/processos/acompanhamento" element={<ProtectedRoute><ProcessosAcompanhamento /></ProtectedRoute>} />
          <Route path="/grupos" element={<ProtectedRoute><Grupos /></ProtectedRoute>} />
          <Route path="/gestao/tarefas" element={<ProtectedRoute><GestaoTarefas /></ProtectedRoute>} />
          <Route path="/gestao/tarefas/:id" element={<ProtectedRoute><TarefaDetalhe /></ProtectedRoute>} />
          <Route path="/gestao/calendarios" element={<ProtectedRoute><GestaoCalendarios /></ProtectedRoute>} />
          <Route path="/gestao/usuarios" element={<ProtectedRoute><GestaoUsuarios /></ProtectedRoute>} />
          <Route path="/gestao/produtividade" element={<ProtectedRoute><GestaoProdutividade /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
