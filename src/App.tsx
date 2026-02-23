import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CRM from "./pages/CRM";
import Conversas from "./pages/Conversas";
import Disparos from "./pages/Disparos";
import Automacoes from "./pages/Automacoes";
import Agendamentos from "./pages/Agendamentos";
import Relatorios from "./pages/Relatorios";
import Contatos from "./pages/Contatos";
import Conexoes from "./pages/Conexoes";
import Configuracoes from "./pages/Configuracoes";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/conversas" element={<Conversas />} />
          <Route path="/disparos" element={<Disparos />} />
          <Route path="/disparos/recepcao" element={<Disparos />} />
          <Route path="/disparos/audio" element={<Disparos />} />
          <Route path="/disparos/agendamento" element={<Disparos />} />
          <Route path="/automacoes" element={<Automacoes />} />
          <Route path="/agendamentos" element={<Agendamentos />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/contatos" element={<Contatos />} />
          <Route path="/conexoes" element={<Conexoes />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
