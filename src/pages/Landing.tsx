import { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import {
  MessageSquare, Bot, Zap, BarChart3, Shield, Users, ArrowRight, Check,
  Send, Brain, Globe, Clock, Sparkles, TrendingUp, Crown,
} from "lucide-react";

// ── GOLD PARTICLES (Canvas) ─────────────────────────────────────
function GoldParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.4 - 0.1,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        decay: Math.random() * 0.002 + 0.001,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.decay) * 0.01;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        gradient.addColorStop(0, `rgba(200, 165, 90, ${Math.max(0, Math.min(0.6, p.alpha))})`);
        gradient.addColorStop(1, `rgba(200, 165, 90, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[1]" />;
}

// ── PERSPECTIVE GRID ────────────────────────────────────────────
function PerspectiveGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          perspective: "800px",
          perspectiveOrigin: "50% 30%",
        }}
      >
        <motion.div
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "20%",
            left: "-20%",
            right: "-20%",
            bottom: "-60%",
            transform: "rotateX(60deg)",
            backgroundImage: `
              linear-gradient(rgba(200,165,90,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,165,90,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
      {/* Radial fade */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#05070A_70%)]" />
    </div>
  );
}

// ── REVEAL TEXT ──────────────────────────────────────────────────
function RevealText({ children, className = "", delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const words = children.split(" ");

  return (
    <div ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 0.6, delay: delay + i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </div>
  );
}

// ── ANGULAR CARD ────────────────────────────────────────────────
function AngularCard({ children, className = "", delay = 0, glowOnHover = true }: {
  children: React.ReactNode; className?: string; delay?: number; glowOnHover?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative group ${className}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[#0a0d14] transition-all duration-500" />
      {/* Gold border glow on hover */}
      {glowOnHover && (
        <div className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ boxShadow: "inset 0 0 0 1px rgba(200,165,90,0.4), 0 0 30px rgba(200,165,90,0.08)" }}
        />
      )}
      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-[20px] h-[20px]"
        style={{
          background: hovered
            ? "linear-gradient(135deg, transparent 50%, rgba(200,165,90,0.6) 50%)"
            : "linear-gradient(135deg, transparent 50%, rgba(200,165,90,0.2) 50%)",
          transition: "background 0.5s",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── BORDER GLOW BUTTON ──────────────────────────────────────────
function BorderGlowButton({ children, onClick, className = "" }: { children: React.ReactNode; onClick?: () => void; className?: string }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative group px-8 py-4 font-semibold text-sm tracking-wide uppercase overflow-hidden ${className}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
    >
      {/* Rotating conic gradient border */}
      <div
        className="absolute inset-0 opacity-70 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "conic-gradient(from var(--angle, 0deg), #C8A55A, transparent 40%, #C8A55A 60%, transparent)",
          animation: "borderRotate 3s linear infinite",
        }}
      />
      <div className="absolute inset-[1px] bg-[#05070A]"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)" }}
      />
      <span className="relative z-10 text-[#E8C875] group-hover:text-white transition-colors duration-300">{children}</span>
    </motion.button>
  );
}

// ── HOLOGRAM SCAN ───────────────────────────────────────────────
function HologramScan() {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(200,165,90,0.6), rgba(232,200,117,0.8), rgba(200,165,90,0.6), transparent)" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}

// ── MARQUEE ROW ─────────────────────────────────────────────────
function MarqueeRow() {
  const logos = ["TechCorp", "AutoFlow", "DataSync", "CloudNex", "SmartOps", "DigiPro", "NexaHub", "FlowAI"];
  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#05070A] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#05070A] to-transparent z-10" />
      <motion.div
        className="flex gap-16 items-center"
        animate={{ x: [0, -800] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {[...logos, ...logos].map((name, i) => (
          <div key={i} className="flex-shrink-0 text-lg font-bold tracking-[0.2em] text-[#C8A55A]/20 uppercase select-none">
            {name}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── ANIMATED COUNTER ────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2200;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{isInView ? count.toLocaleString("pt-BR") : "0"}{suffix}</span>;
}

// ── FADE IN ─────────────────────────────────────────────────────
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── DATA ────────────────────────────────────────────────────────
const FEATURES = [
  { icon: MessageSquare, title: "Disparos em Massa", desc: "Envie milhares de mensagens personalizadas com segmentação inteligente e relatórios em tempo real." },
  { icon: Bot, title: "IAs Setoriais", desc: "IA dedicada para cada departamento com respostas humanizadas e aprendizado contínuo." },
  { icon: Zap, title: "Automações", desc: "Fluxos automatizados por gatilho que operam 24/7 sem intervenção humana." },
  { icon: BarChart3, title: "Dashboard Analítico", desc: "Métricas em tempo real, funil de conversão e KPIs de desempenho operacional." },
  { icon: Shield, title: "Segurança Enterprise", desc: "Criptografia ponta a ponta, backups automáticos e controle de acesso granular." },
  { icon: Users, title: "CRM Integrado", desc: "Pipeline visual kanban, histórico completo e distribuição automática de leads." },
];

const STATS = [
  { value: 10, suffix: "M+", label: "Mensagens processadas" },
  { value: 99, suffix: ".9%", label: "Disponibilidade" },
  { value: 500, suffix: "+", label: "Empresas ativas" },
  { value: 1, prefix: "<", suffix: "s", label: "Tempo de resposta" },
];

const PLANS = [
  {
    name: "Basic", price: "Grátis", period: "", desc: "Para quem está começando.", highlight: false, featured: false,
    items: ["Até 2 conexões", "Disparo de mensagens", "Painel básico", "Contatos ilimitados", "Suporte por e-mail"],
    cta: "Começar grátis",
  },
  {
    name: "Pro", price: "R$197", period: "/mês", desc: "Para equipes que precisam escalar.", highlight: true, featured: true,
    items: ["Até 5 conexões", "IA de recepção inteligente", "IAs setoriais", "CRM com pipeline", "Automações por gatilho", "Agendamento Google Meet", "Distribuição round-robin", "Painel avançado", "Suporte prioritário"],
    cta: "Assinar Pro",
  },
  {
    name: "Premium", price: "R$497", period: "/mês", desc: "Operações de alto volume.", highlight: false, featured: false,
    items: ["Conexões ilimitadas", "Tudo do plano Pro", "API de integração", "Webhooks personalizados", "Multi-atendentes ilimitados", "White-label", "Gerente dedicado", "SLA 99.9%"],
    cta: "Falar com consultor",
  },
];

const IMPACT = [
  { value: 340, suffix: "%", label: "Aumento médio em conversões" },
  { value: 85, suffix: "%", label: "Redução no tempo de resposta" },
  { value: 12, suffix: "x", label: "ROI médio dos clientes" },
  { value: 50, suffix: "K+", label: "Atendimentos automatizados/mês" },
];

// ── CSS for border rotation ─────────────────────────────────────
const globalStyles = `
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes borderRotate {
  to { --angle: 360deg; }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;

// ── MAIN ────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative bg-[#05070A] text-white min-h-screen overflow-x-hidden selection:bg-[#C8A55A]/20">
      <style>{globalStyles}</style>
      <GoldParticles />

      {/* ── NAV ───────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-[#C8A55A]/10" : ""}`}
      >
        <div className={`transition-all duration-500 ${scrolled ? "bg-[#05070A]/80 backdrop-blur-2xl" : "bg-transparent"}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C8A55A] to-[#E8C875] flex items-center justify-center shadow-lg shadow-[#C8A55A]/20">
                <Zap className="w-5 h-5 text-[#05070A]" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent">
                ZapProBR
              </span>
            </motion.div>

            <div className="hidden md:flex items-center gap-10 text-[13px] font-light tracking-[0.08em] uppercase text-white/40">
              {[
                { href: "#features", label: "Recursos" },
                { href: "#sistema", label: "Sistema" },
                { href: "#impacto", label: "Impacto" },
                { href: "#pricing", label: "Planos" },
              ].map((link) => (
                <a key={link.href} href={link.href}
                  className="hover:text-[#C8A55A] transition-colors duration-300 relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-[#C8A55A] to-[#E8C875] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/login")}
                className="px-5 py-2.5 text-[13px] font-light tracking-wider uppercase text-white/50 hover:text-[#C8A55A] transition-colors duration-300">
                Entrar
              </button>
              <BorderGlowButton onClick={() => navigate("/login")}>
                Começar agora
              </BorderGlowButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ──────────────────────────────────── */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center px-6 pt-24">
        <PerspectiveGrid />

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#C8A55A]/[0.03] rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2.5 border border-[#C8A55A]/20 bg-[#C8A55A]/5 backdrop-blur-sm text-[12px] tracking-[0.15em] uppercase text-[#C8A55A]"
              style={{ clipPath: "polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)" }}
              animate={{ boxShadow: ["0 0 20px rgba(200,165,90,0)", "0 0 20px rgba(200,165,90,0.15)", "0 0 20px rgba(200,165,90,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-3.5 h-3.5" />
              Plataforma #1 do Brasil em Automação WhatsApp
            </motion.div>
          </motion.div>

          {/* Headline */}
          <div>
            <RevealText className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-[0.95]" delay={0.6}>
              O futuro da
            </RevealText>
            <RevealText className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] bg-gradient-to-r from-[#C8A55A] via-[#E8C875] to-[#C8A55A] bg-clip-text text-transparent mt-2" delay={0.75}>
              automação
            </RevealText>
            <RevealText className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-[0.95] mt-2" delay={0.9}>
              começa aqui
            </RevealText>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-lg md:text-xl font-light text-white/40 max-w-2xl mx-auto leading-relaxed tracking-wide"
          >
            Transforme seu WhatsApp em uma máquina de vendas com inteligência artificial,
            automações e CRM integrado. Tecnologia de elite para resultados extraordinários.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <BorderGlowButton onClick={() => navigate("/login")} className="text-base">
              Iniciar gratuitamente <ArrowRight className="inline w-4 h-4 ml-2" />
            </BorderGlowButton>
            <a href="#sistema" className="text-sm font-light tracking-wider uppercase text-white/30 hover:text-[#C8A55A] transition-colors duration-300 flex items-center gap-2">
              Ver demonstração
              <motion.div animate={{ y: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ArrowRight className="w-3 h-3 rotate-90" />
              </motion.div>
            </a>
          </motion.div>

          {/* Inline Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-8"
          >
            {STATS.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-[#E8C875] to-[#C8A55A] bg-clip-text text-transparent">
                  <AnimatedCounter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div className="text-[11px] tracking-[0.15em] uppercase text-white/25 mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* ── PARTNERS MARQUEE ──────────────────────── */}
      <section className="relative py-16">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A55A]/20 to-transparent mb-16" />
        <FadeIn className="text-center mb-10">
          <p className="text-[11px] tracking-[0.3em] uppercase text-white/20">Empresas que confiam no ZapProBR</p>
        </FadeIn>
        <MarqueeRow />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A55A]/20 to-transparent mt-16" />
      </section>

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="features" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/60 mb-4">Recursos</p>
            <RevealText className="text-4xl md:text-5xl font-extralight tracking-tight">
              Tecnologia de ponta
            </RevealText>
            <RevealText className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent mt-1" delay={0.1}>
              para resultados reais
            </RevealText>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <AngularCard key={i} delay={i * 0.08}>
                <div className="p-8">
                  <div className="relative w-12 h-12 mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-[#C8A55A]/20"
                      whileHover={{ borderColor: "rgba(200,165,90,0.6)", boxShadow: "0 0 20px rgba(200,165,90,0.15)" }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <f.icon className="w-5 h-5 text-[#C8A55A]" />
                    </div>
                    {/* Pulsing ring on hover */}
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-[#C8A55A]/0 group-hover:border-[#C8A55A]/30"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed font-light">{f.desc}</p>
                </div>
              </AngularCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── O SISTEMA (Demo) ─────────────────────── */}
      <section id="sistema" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/60 mb-4">O Sistema</p>
            <RevealText className="text-4xl md:text-5xl font-extralight tracking-tight">
              Veja o poder em
            </RevealText>
            <RevealText className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent mt-1" delay={0.1}>
              ação
            </RevealText>
          </FadeIn>

          {/* Dashboard Mockup */}
          <FadeIn delay={0.2}>
            <div className="relative">
              {/* Chamfered gold frame */}
              <div className="absolute -inset-[2px] bg-gradient-to-br from-[#C8A55A]/30 via-transparent to-[#C8A55A]/30"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)" }}
              />
              <div className="relative bg-[#0a0d14] overflow-hidden"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)" }}
              >
                {/* Browser chrome */}
                <div className="flex items-center gap-2 px-5 py-3 bg-[#0d1017] border-b border-[#C8A55A]/10">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C8A55A]/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C8A55A]/15" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#C8A55A]/10" />
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-[10px] tracking-[0.1em] text-white/15">app.zapprobr.com</span>
                  </div>
                </div>

                {/* Dashboard content with stagger */}
                <div className="p-6 space-y-4 min-h-[350px]">
                  {/* Top metrics */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Mensagens Hoje", val: "12.847", icon: Send, change: "+24%" },
                      { label: "Leads Novos", val: "384", icon: Users, change: "+18%" },
                      { label: "Taxa de Resposta", val: "94.2%", icon: TrendingUp, change: "+5.2%" },
                      { label: "Automações Ativas", val: "47", icon: Zap, change: "+3" },
                    ].map((m, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                        className="bg-[#0d1017] border border-[#C8A55A]/5 p-4"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
                      >
                        <m.icon className="w-4 h-4 text-[#C8A55A]/40 mb-2" />
                        <p className="text-[10px] text-white/25 uppercase tracking-wider">{m.label}</p>
                        <p className="text-xl font-bold text-white mt-1">{m.val}</p>
                        <p className="text-[10px] text-[#C8A55A]/60 mt-1">{m.change}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chart area */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="bg-[#0d1017] border border-[#C8A55A]/5 p-5 h-[180px] relative overflow-hidden"
                    style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
                  >
                    <p className="text-[10px] text-white/20 uppercase tracking-wider mb-4">Volume de Mensagens — Últimos 7 dias</p>
                    {/* Simulated chart bars */}
                    <div className="flex items-end gap-2 h-[110px]">
                      {[65, 45, 80, 55, 90, 70, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          className="flex-1 bg-gradient-to-t from-[#C8A55A]/30 to-[#E8C875]/10 rounded-t-sm"
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.8 + i * 0.08, ease: "easeOut" }}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Hologram scan */}
                <HologramScan />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── IMPACT / NUMBERS ─────────────────────── */}
      <section id="impacto" className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/60 mb-6">Impacto</p>
            <RevealText className="text-4xl md:text-5xl font-extralight tracking-tight leading-tight">
              Números que
            </RevealText>
            <RevealText className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent mt-1" delay={0.1}>
              falam por si
            </RevealText>
            <p className="text-white/30 font-light mt-6 leading-relaxed max-w-md">
              Nossos clientes experimentam resultados transformadores desde o primeiro mês.
              A tecnologia ZapProBR não é uma promessa — é uma garantia de performance.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 gap-5">
            {IMPACT.map((m, i) => (
              <AngularCard key={i} delay={i * 0.1}>
                <div className="p-6 text-center">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-[#E8C875] to-[#C8A55A] bg-clip-text text-transparent">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </div>
                  <p className="text-[11px] tracking-[0.12em] uppercase text-white/25 mt-2">{m.label}</p>
                  {/* Animated progress bar */}
                  <motion.div className="mt-4 h-[2px] bg-[#C8A55A]/10 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#C8A55A] to-[#E8C875]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${60 + i * 10}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: "easeOut" }}
                    />
                  </motion.div>
                </div>
              </AngularCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────── */}
      <section id="pricing" className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-20">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/60 mb-4">Planos</p>
            <RevealText className="text-4xl md:text-5xl font-extralight tracking-tight">
              Investimento que
            </RevealText>
            <RevealText className="text-4xl md:text-5xl font-black bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent mt-1" delay={0.1}>
              se paga sozinho
            </RevealText>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="relative"
              >
                {/* Pro plan: rotating gold border */}
                {plan.featured && (
                  <div className="absolute -inset-[1px] z-0 overflow-hidden"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                      background: "conic-gradient(from var(--angle, 0deg), #C8A55A, transparent 30%, #E8C875 50%, transparent 70%, #C8A55A)",
                      animation: "borderRotate 4s linear infinite",
                    }}
                  />
                )}

                <div
                  className={`relative h-full p-8 ${plan.featured ? "bg-[#0a0d14]" : "bg-[#080b12] border border-[#C8A55A]/5"} ${plan.name === "Premium" ? "bg-[#0a0d14]" : ""}`}
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                    backgroundImage: plan.name === "Premium"
                      ? "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200,165,90,0.02) 10px, rgba(200,165,90,0.02) 11px)"
                      : "none",
                  }}
                >
                  {plan.featured && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#C8A55A]/10 border border-[#C8A55A]/20 mb-6 text-[10px] tracking-[0.15em] uppercase text-[#C8A55A]"
                      style={{ clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}>
                      <Sparkles className="w-3 h-3" />
                      Mais popular
                    </div>
                  )}

                  <h3 className={`text-lg font-bold tracking-tight ${plan.featured ? "text-[#C8A55A]" : plan.name === "Premium" ? "text-[#E8C875]" : "text-white/60"}`}>
                    {plan.name}
                  </h3>
                  <p className="text-white/25 text-sm font-light mt-1">{plan.desc}</p>

                  <div className="mt-6 mb-8">
                    <span className="text-4xl md:text-5xl font-black text-white">{plan.price}</span>
                    {plan.period && <span className="text-white/25 text-sm font-light">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-white/40 font-light">
                        <Check className={`w-4 h-4 flex-shrink-0 ${plan.featured ? "text-[#C8A55A]" : "text-[#C8A55A]/40"}`} />
                        {item}
                      </li>
                    ))}
                  </ul>

                  {plan.featured ? (
                    <BorderGlowButton onClick={() => navigate("/login")} className="w-full text-center">
                      {plan.cta}
                    </BorderGlowButton>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/login")}
                      className={`w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                        plan.name === "Premium"
                          ? "border border-[#C8A55A]/20 text-[#C8A55A] hover:bg-[#C8A55A]/5"
                          : "border border-white/10 text-white/40 hover:text-white hover:border-white/20"
                      }`}
                      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)" }}
                    >
                      {plan.cta}
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────── */}
      <section className="relative py-32 px-6">
        {/* Radial gold ambient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,90,0.04),transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/60 mb-6">Pronto para começar?</p>
          </FadeIn>
          <RevealText className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight">
            Eleve seu negócio ao
          </RevealText>
          <RevealText className="text-4xl md:text-6xl font-black bg-gradient-to-r from-[#C8A55A] via-[#E8C875] to-[#C8A55A] bg-clip-text text-transparent mt-2" delay={0.1}>
            próximo nível
          </RevealText>
          <FadeIn delay={0.3}>
            <p className="text-white/30 font-light mt-6 mb-10 max-w-lg mx-auto leading-relaxed">
              Junte-se a mais de 500 empresas que já transformaram seu atendimento com a plataforma mais avançada do mercado.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <BorderGlowButton onClick={() => navigate("/login")} className="text-base mx-auto">
              Começar agora — é grátis <ArrowRight className="inline w-4 h-4 ml-2" />
            </BorderGlowButton>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="relative border-t border-[#C8A55A]/10 pt-16 pb-10 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A55A]/30 to-transparent absolute top-0 left-0 right-0" />

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C8A55A] to-[#E8C875] flex items-center justify-center">
                  <Zap className="w-4 h-4 text-[#05070A]" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent">
                  ZapProBR
                </span>
              </div>
              <p className="text-sm text-white/20 font-light leading-relaxed">
                Tecnologia de elite para automação WhatsApp Business.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Produto", links: ["Recursos", "Planos", "API", "Integrações"] },
              { title: "Empresa", links: ["Sobre", "Blog", "Carreiras", "Contato"] },
              { title: "Legal", links: ["Termos de Uso", "Privacidade", "LGPD", "Cookies"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#C8A55A]/40 mb-4 font-semibold">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a href="#" className="text-sm text-white/20 hover:text-[#C8A55A] transition-colors duration-300 font-light">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#C8A55A]/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/15 tracking-wider">
              © 2025 ZapProBR. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-white/10 tracking-wider">
              Feito com excelência no Brasil 🇧🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
