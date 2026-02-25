import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import Conversas from "./pages/Conversas";
import Disparos from "./pages/Disparos";
import DisparoRecepcao from "./pages/DisparoRecepcao";
import DisparoAudio from "./pages/DisparoAudio";
import DisparoAgendamento from "./pages/DisparoAgendamento";
import Relatorios from "./pages/Relatorios";
import Contatos from "./pages/Contatos";
import Conexoes from "./pages/Conexoes";
import Configuracoes from "./pages/Configuracoes";
import Login from "./pages/Login";

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
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Conversas /></ProtectedRoute>} />
          <Route path="/crm" element={<ProtectedRoute><CRM /></ProtectedRoute>} />
          <Route path="/conversas" element={<ProtectedRoute><Conversas /></ProtectedRoute>} />
          <Route path="/disparos" element={<ProtectedRoute><Disparos /></ProtectedRoute>} />
          <Route path="/disparos/recepcao" element={<ProtectedRoute><DisparoRecepcao /></ProtectedRoute>} />
          <Route path="/disparos/audio" element={<ProtectedRoute><DisparoAudio /></ProtectedRoute>} />
          <Route path="/disparos/agendamento" element={<ProtectedRoute><DisparoAgendamento /></ProtectedRoute>} />
          <Route path="/contatos" element={<ProtectedRoute><Contatos /></ProtectedRoute>} />
          <Route path="/configuracoes" element={<ProtectedRoute><Configuracoes /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
