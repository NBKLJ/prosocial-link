import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Shield } from "lucide-react";
import { motion } from "framer-motion";
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

  const steps = [
    { num: "01", title: "Conecte", desc: "Vincule seu WhatsApp em poucos cliques" },
    { num: "02", title: "Configure", desc: "Crie fluxos e respostas automáticas" },
    { num: "03", title: "Automatize", desc: "Deixe o Birdly trabalhar por você 24/7" },
  ];

  return (
    <div className="flex min-h-screen w-full" style={{ background: "#05070A" }}>
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[48%] flex-col relative overflow-hidden" style={{ background: "#0A0D14" }}>
        {/* Glow */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle, #C8A55A 0%, transparent 70%)" }} />
          <div className="absolute bottom-32 right-16 w-56 h-56 rounded-full" style={{ background: "radial-gradient(circle, #C8A55A 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 flex flex-col h-full px-12 py-10">
          {/* Top logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4"
          >
            <img src={illustration} alt="Birdly" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-white tracking-tight">Birdly</span>
          </motion.div>

          {/* Center */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 blur-3xl opacity-20 rounded-full" style={{ background: "#C8A55A" }} />
              <img src={illustration} alt="Birdly" className="w-28 h-28 object-contain relative z-10" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl font-bold text-white text-center mb-2"
            >
              Como funciona?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-sm text-center mb-10"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Três passos para voar mais alto
            </motion.p>

            {/* Timeline */}
            <div className="w-full max-w-xs space-y-0">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.15 }}
                  className="flex gap-4 relative"
                >
                  {/* Vertical line + dot */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: "rgba(200,165,90,0.15)",
                        color: "#C8A55A",
                        border: "1px solid rgba(200,165,90,0.3)",
                      }}
                    >
                      {step.num}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="w-px flex-1 min-h-[32px]" style={{ background: "rgba(200,165,90,0.15)" }} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pb-8">
                    <p className="text-sm font-semibold text-white">{step.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-[11px] text-center"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            © 2026 Birdly. Todos os direitos reservados.
          </motion.p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full lg:w-[52%] items-center justify-center p-8 sm:p-16" style={{ background: "#05070A" }}>
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full max-w-[400px]"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <img src={illustration} alt="Birdly" className="w-8 h-8 object-contain" />
            <span className="text-xl font-bold text-white">Birdly</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta 👋</h1>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              Insira seus dados para continuar de onde parou.
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
                className="w-full h-12 rounded-xl px-4 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                style={{
                  background: "rgba(200,165,90,0.06)",
                  border: "1px solid rgba(200,165,90,0.15)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A55A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(200,165,90,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(200,165,90,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
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
                  className="w-full h-12 rounded-xl px-4 pr-10 text-sm text-white placeholder:text-white/30 outline-none transition-all"
                  style={{
                    background: "rgba(200,165,90,0.06)",
                    border: "1px solid rgba(200,165,90,0.15)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#C8A55A"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(200,165,90,0.1)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(200,165,90,0.15)"; e.currentTarget.style.boxShadow = "none"; }}
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
                  className="h-4 w-4 rounded"
                  style={{ accentColor: "#C8A55A" }}
                />
                <label htmlFor="remember" className="text-sm cursor-pointer" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Lembrar-me
                </label>
              </div>
              <button type="button" onClick={() => toast.info("Funcionalidade em breve")}
                className="text-sm hover:underline" style={{ color: "#C8A55A" }}>
                Esqueceu a senha?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full h-12 text-base font-semibold rounded-xl transition-all hover:brightness-110 hover:shadow-lg disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #C8A55A, #E8C875)",
                color: "#05070A",
                boxShadow: "0 4px 20px rgba(200,165,90,0.25)",
              }}
            >
              {loading ? "Entrando..." : "Entrar no Ninho"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            <Shield className="w-3 h-3" />
            <span>Conexão segura e criptografada</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
