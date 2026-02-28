import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import birdlyLogo from "@/assets/birdly-logo.png";
import illustration from "@/assets/login-illustration.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const USERS = [
    { email: "basic@email.com", password: "123456", plan: "basic" },
    { email: "pro@email.com", password: "123456", plan: "pro" },
    { email: "premium@email.com", password: "123456", plan: "premium" },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) { toast.error("Informe um e-mail válido"); return; }
    if (password.length < 4) { toast.error("A senha deve ter pelo menos 4 caracteres"); return; }

    let user = USERS.find((u) => u.email === email.toLowerCase().trim() && u.password === password);
    if (!user) {
      const dynamicUsers = JSON.parse(localStorage.getItem("zapprobr_dynamic_users") || "[]");
      user = dynamicUsers.find((u: any) => u.email === email.toLowerCase().trim() && u.password === password);
    }
    if (!user) { toast.error("E-mail ou senha incorretos"); return; }

    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("zapprobr_auth", "true");
      localStorage.setItem("zapprobr_user", JSON.stringify({ email: user!.email, plan: user!.plan }));
      toast.success("Login realizado com sucesso!");
      navigate("/conversas", { replace: true });
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: "#05070A" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-end relative overflow-hidden" style={{ background: "#05070A" }}>
        <img src={illustration} alt="Ilustração" className="absolute inset-0 w-full h-full object-contain p-12" />
        <div className="relative z-10 w-full px-12 pb-12 pt-8 bg-gradient-to-t from-black/70 to-transparent">
          <h2 className="text-lg font-bold text-white mb-1">Automatize suas conversas</h2>
          <p style={{ color: "rgba(255,255,255,0.5)" }} className="text-sm">
            Gerencie mensagens, contatos e campanhas em um só lugar.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full lg:w-[55%] items-center justify-center p-8 sm:p-16" style={{ background: "#0A0D14" }}>
        <div className="w-full max-w-[380px]">
          {/* Logo */}
          <div className="mb-12">
            <span className="text-3xl font-bold text-white tracking-tight">Birdly</span>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-bold text-white mb-1">Bem-Vindo de volta</h1>
            <p style={{ color: "rgba(255,255,255,0.5)" }} className="text-sm">
              Entre com suas credenciais para acessar o painel.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[11px] uppercase tracking-widest font-medium" style={{ color: "#C8A55A" }}>
                E-mail
              </label>
              <input
                id="email" type="email" placeholder="seu@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                className="w-full h-12 rounded-lg px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                style={{
                  background: "rgba(200,165,90,0.08)",
                  border: "1px solid rgba(200,165,90,0.2)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A55A"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(200,165,90,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(200,165,90,0.2)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[11px] uppercase tracking-widest font-medium" style={{ color: "#C8A55A" }}>
                Senha
              </label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                  onChange={(e) => setPassword(e.target.value)} autoComplete="current-password"
                  className="w-full h-12 rounded-lg px-4 pr-10 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: "rgba(200,165,90,0.08)",
                    border: "1px solid rgba(200,165,90,0.2)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A55A"; e.currentTarget.style.boxShadow = "0 0 0 2px rgba(200,165,90,0.15)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(200,165,90,0.2)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox" id="remember" checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#C8A55A]"
                  style={{ accentColor: "#C8A55A", borderColor: "#C8A55A" }}
                />
                <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Lembrar-me
                </label>
              </div>
              <button type="button" onClick={() => toast.info("Funcionalidade em breve")}
                className="text-sm hover:underline" style={{ color: "#C8A55A" }}>
                Esqueceu a senha?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 text-base font-semibold rounded-lg transition-all hover:brightness-110 disabled:opacity-50"
              style={{
                background: "linear-gradient(to right, #C8A55A, #E8C875)",
                color: "#05070A",
              }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
