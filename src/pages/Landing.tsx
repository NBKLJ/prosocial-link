import { useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import {
  MessageSquare,
  Bot,
  Zap,
  BarChart3,
  Shield,
  Users,
  ArrowRight,
  Check,
  Play,
  ChevronRight,
  Headphones,
  Send,
  Calendar,
  Brain,
} from "lucide-react";

// ── Animated Section ─────────────────────────────────────────────
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Feature Card ─────────────────────────────────────────────────
function FeatureCard({
  icon: Icon,
  title,
  desc,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  delay?: number;
}) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <FadeIn delay={delay}>
      <div
        onMouseMove={handleMouse}
        className="group relative rounded-2xl border border-[#1a1f2e] bg-[#0d1017] p-7 hover:border-[#2a3348] transition-all duration-500 h-full"
      >
        <div
          className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(56,109,194,0.06), transparent 60%)`,
          }}
        />
        <div className="relative z-10">
          <div className="w-11 h-11 rounded-xl bg-[#131825] border border-[#1a2236] flex items-center justify-center mb-5">
            <Icon className="w-5 h-5 text-[#4B83D6]" />
          </div>
          <h3 className="text-[15px] font-semibold text-white mb-2">{title}</h3>
          <p className="text-sm text-[#6B7A99] leading-relaxed">{desc}</p>
        </div>
      </div>
    </FadeIn>
  );
}

// ── Data ─────────────────────────────────────────────────────────
const FEATURES = [
  { icon: MessageSquare, title: "Disparos em massa", desc: "Envie milhares de mensagens personalizadas com segmentação inteligente e relatórios detalhados." },
  { icon: Bot, title: "IAs Setoriais", desc: "Inteligência artificial dedicada para cada departamento da sua empresa, com respostas humanizadas." },
  { icon: Zap, title: "Automações", desc: "Crie fluxos automatizados por gatilho que trabalham 24 horas por dia, 7 dias por semana." },
  { icon: BarChart3, title: "Dashboard Analítico", desc: "Métricas em tempo real, funil de conversão e indicadores de desempenho da sua operação." },
  { icon: Shield, title: "Segurança Enterprise", desc: "Criptografia de ponta a ponta, backups automáticos e controle de acesso por função." },
  { icon: Users, title: "CRM Integrado", desc: "Pipeline visual com kanban, histórico completo e distribuição automática de leads." },
];

const STATS = [
  { value: "10M+", label: "Mensagens processadas" },
  { value: "99.9%", label: "Disponibilidade" },
  { value: "500+", label: "Empresas ativas" },
  { value: "<1s", label: "Tempo de resposta" },
];

const PLANS = [
  {
    name: "Basic",
    price: "Grátis",
    period: "",
    desc: "Para quem está começando a automatizar.",
    highlight: false,
    color: "text-[#6B7A99]",
    items: [
      "Até 2 conexões",
      "Disparo de mensagens",
      "Painel básico",
      "Contatos ilimitados",
      "Suporte por e-mail",
    ],
    cta: "Começar grátis",
    ctaStyle: "border border-[#1a2236] text-[#8899B4] hover:bg-[#111827] hover:text-white",
  },
  {
    name: "Pro",
    price: "R$197",
    period: "/mês",
    desc: "Para equipes que precisam escalar.",
    highlight: true,
    color: "text-[#4B83D6]",
    items: [
      "Até 5 conexões",
      "IA de recepção inteligente",
      "IAs setoriais",
      "CRM com pipeline completo",
      "Automações por gatilho",
      "Agendamento Google Meet",
      "Distribuição round-robin",
      "Painel analítico avançado",
      "Suporte prioritário",
    ],
    cta: "Assinar Pro",
    ctaStyle: "bg-[#4B83D6] text-white hover:bg-[#3A6FBF]",
  },
  {
    name: "Premium",
    price: "R$497",
    period: "/mês",
    desc: "Para operações de alto volume.",
    highlight: false,
    color: "text-[#C9A84C]",
    items: [
      "Conexões ilimitadas",
      "Tudo do plano Pro",
      "API de integração",
      "Webhooks personalizados",
      "Multi-atendentes ilimitados",
      "White-label disponível",
      "Gerente de conta dedicado",
      "SLA de 99.9%",
    ],
    cta: "Falar com consultor",
    ctaStyle: "border border-[#2a2520] text-[#C9A84C] hover:bg-[#1a1710] hover:text-[#E0BD5F]",
  },
];

// ── MAIN ─────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-[#080A0F] text-white min-h-screen overflow-x-hidden selection:bg-[#4B83D6]/20">
      {/* Subtle gradient bg */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#4B83D6]/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#3B5998]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* ── NAV ─────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#111827]"
      >
        <div className="bg-[#080A0F]/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#4B83D6] flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                ZapProBR
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-[13px] text-[#6B7A99]">
              <a href="#features" className="hover:text-white transition-colors duration-200">Recursos</a>
              <a href="#demo" className="hover:text-white transition-colors duration-200">Demonstração</a>
              <a href="#pricing" className="hover:text-white transition-colors duration-200">Planos</a>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-[13px] font-medium rounded-lg text-[#8899B4] hover:text-white transition-colors duration-200"
              >
                Entrar
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-[13px] font-medium rounded-lg bg-[#4B83D6] text-white hover:bg-[#3A6FBF] transition-colors duration-200"
              >
                Começar agora
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a2236] bg-[#0d1017] text-[13px] text-[#6B7A99] mb-8">
              <div className="w-2 h-2 rounded-full bg-[#4B83D6] animate-pulse" />
              Plataforma líder em automação WhatsApp Business
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight leading-[1.08]"
          >
            <span className="text-white">Automatize, gerencie</span>
            <br />
            <span className="text-white">e escale com </span>
            <span className="text-[#4B83D6]">inteligência.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-base md:text-lg text-[#6B7A99] max-w-2xl mx-auto leading-relaxed"
          >
            O ZapProBR unifica automação, CRM e inteligência artificial em uma única plataforma 
            para transformar a comunicação da sua empresa via WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
          >
            <button
              onClick={() => navigate("/login")}
              className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#4B83D6] text-white font-semibold text-sm hover:bg-[#3A6FBF] transition-all duration-200"
            >
              Começar gratuitamente
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[#1a2236] text-[#8899B4] font-semibold text-sm hover:bg-[#111827] hover:text-white transition-all duration-200"
            >
              <Play className="w-4 h-4" />
              Ver demonstração
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-[12px] text-[#4A5568]"
          >
            {["Sem cartão necessário", "Setup em 2 minutos", "Suporte em português"].map((text) => (
              <span key={text} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#4B83D6]" />
                {text}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────── */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl border border-[#1a1f2e] overflow-hidden bg-[#1a1f2e]">
            {STATS.map((s, i) => (
              <FadeIn key={s.label} delay={i * 0.05} className="bg-[#0d1017] p-8 text-center">
                <p className="text-2xl md:text-3xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-[#6B7A99] mt-1.5 uppercase tracking-wider">{s.label}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4B83D6] mb-3">Recursos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Tudo o que sua operação precisa
            </h2>
            <p className="text-[#6B7A99] mt-4 max-w-lg mx-auto text-sm">
              Ferramentas profissionais para equipes que levam comunicação a sério.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} {...f} delay={i * 0.06} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4B83D6] mb-3">Como funciona</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Simples de configurar, poderoso em resultados
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: Send, title: "Conecte seu WhatsApp", desc: "Escaneie o QR Code e conecte em segundos. Sem complicações técnicas." },
              { step: "02", icon: Brain, title: "Configure suas IAs", desc: "Defina as regras e treine a IA para cada departamento da sua empresa." },
              { step: "03", icon: BarChart3, title: "Acompanhe os resultados", desc: "Monitore métricas, conversões e desempenho em tempo real no dashboard." },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="relative">
                  <span className="text-[64px] font-black text-[#0d1017] leading-none select-none">{item.step}</span>
                  <div className="mt-[-20px] relative z-10">
                    <div className="w-10 h-10 rounded-lg bg-[#131825] border border-[#1a2236] flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-[#4B83D6]" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-[#6B7A99] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO ───────────────────────────────────── */}
      <section id="demo" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4B83D6] mb-3">Demonstração</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Conheça o painel de controle
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-[#1a1f2e] bg-[#0d1017] overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#141a27]">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2a1a1a]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2a2518]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1a2a1a]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[#111827] rounded-md px-4 py-1.5 text-[11px] text-[#4A5568] max-w-xs mx-auto text-center font-mono">
                    app.zapprobr.com/dashboard
                  </div>
                </div>
              </div>

              {/* Mock dashboard */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Conversas ativas", val: "1.247", trend: "+12%" },
                    { label: "Mensagens hoje", val: "12.840", trend: "+8.3%" },
                    { label: "Taxa de resposta", val: "94.2%", trend: "+2.1%" },
                    { label: "Novos leads", val: "328", trend: "+15%" },
                  ].map((card, i) => (
                    <motion.div
                      key={card.label}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.08 }}
                      className="rounded-xl bg-[#111827] border border-[#1a2236] p-4"
                    >
                      <p className="text-[10px] text-[#4A5568] uppercase tracking-wider">{card.label}</p>
                      <div className="flex items-end gap-2 mt-1">
                        <p className="text-xl font-bold text-white">{card.val}</p>
                        <span className="text-[10px] text-[#3B8764] font-medium mb-0.5">{card.trend}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart area */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="rounded-xl bg-[#111827] border border-[#1a2236] p-6 h-48 flex items-end gap-1"
                >
                  {Array.from({ length: 24 }).map((_, i) => {
                    const h = 25 + Math.sin(i * 0.4) * 25 + (i / 24) * 30;
                    return (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.02, duration: 0.4 }}
                        className="flex-1 rounded-sm bg-[#4B83D6]/40 hover:bg-[#4B83D6]/70 transition-colors"
                      />
                    );
                  })}
                </motion.div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────── */}
      <section id="pricing" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4B83D6] mb-3">Planos</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Planos transparentes, sem surpresas
            </h2>
            <p className="text-[#6B7A99] mt-4 max-w-lg mx-auto text-sm">
              Comece grátis e escale conforme sua operação cresce.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-4 items-start">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.08}>
                <div
                  className={`relative rounded-2xl p-7 flex flex-col h-full ${
                    plan.highlight
                      ? "bg-[#0d1017] border-2 border-[#4B83D6]/30"
                      : "bg-[#0d1017] border border-[#1a1f2e]"
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#4B83D6] text-white">
                        Recomendado
                      </span>
                    </div>
                  )}

                  <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-4 ${plan.color}`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-[#4A5568] mb-0.5">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-[#4A5568] mb-7">{plan.desc}</p>

                  <ul className="space-y-3 text-sm text-[#6B7A99] mb-8 flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-center gap-2.5">
                        <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.highlight ? "text-[#4B83D6]" : "text-[#3B4A66]"}`} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate("/login")}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="relative rounded-2xl border border-[#1a1f2e] bg-[#0d1017] overflow-hidden">
              {/* Subtle glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#4B83D6]/[0.04] rounded-full blur-[80px]" />

              <div className="relative z-10 text-center py-16 md:py-20 px-8 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                  Pronto para transformar sua
                  <br />
                  <span className="text-[#4B83D6]">operação?</span>
                </h2>
                <p className="text-[#6B7A99] text-sm max-w-md mx-auto">
                  Junte-se a centenas de empresas que já automatizaram sua comunicação com o ZapProBR.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                  <button
                    onClick={() => navigate("/login")}
                    className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#4B83D6] text-white font-semibold text-sm hover:bg-[#3A6FBF] transition-all duration-200"
                  >
                    Começar gratuitamente
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-[#1a2236] text-[#8899B4] font-semibold text-sm hover:bg-[#111827] hover:text-white transition-all duration-200"
                  >
                    <Headphones className="w-4 h-4" />
                    Falar com especialista
                  </button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="relative border-t border-[#111827] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#4A5568]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-[#4B83D6] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-[#6B7A99]">ZapProBR</span>
          </div>
          <p>© 2025 ZapProBR. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
