import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/logo.png";
import illustration from "@/assets/login-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      toast.error("Informe um e-mail válido");
      return;
    }
    if (password.length < 4) {
      toast.error("A senha deve ter pelo menos 4 caracteres");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("zapprobr_auth", "true");
      toast.success("Login realizado com sucesso!");
      navigate("/conversas", { replace: true });
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel - Illustration */}
      <div className="hidden lg:flex lg:w-[45%] bg-muted/40 relative flex-col justify-end overflow-hidden">
        {/* Illustration centered in panel */}
        <div className="flex-1 flex items-end justify-center px-8 pt-16">
          <img
            src={illustration}
            alt="Ilustração de automação de conversas"
            className="w-[28rem] h-auto max-h-[65vh] object-contain"
          />
        </div>

        {/* Text pinned to bottom */}
        <div className="px-10 pb-10 pt-6">
          <h2 className="text-xl font-bold text-foreground mb-1">
            Automatize suas conversas
          </h2>
          <p className="text-muted-foreground text-sm">
            Gerencie mensagens, contatos e campanhas em um só lugar.
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-[55%] items-center justify-center bg-card p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ZapPro" className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground">
              Zap<span className="text-primary">Pro</span>
            </span>
          </div>

          {/* Welcome text */}
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground">
              Bem-Vindo de volta
            </h1>
            <p className="text-muted-foreground text-sm">
              Entre com suas credenciais para acessar o painel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-muted/50 border-0 text-sm"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-muted/50 border-0 pr-10 text-sm"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => toast.info("Funcionalidade em breve")}
                className="text-sm text-primary hover:underline"
              >
                Esqueceu a senha?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold rounded-lg"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
