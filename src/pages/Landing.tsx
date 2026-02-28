import { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
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
  Headphones,
  Send,
  Brain,
  Globe,
  Clock,
  ChevronDown,
  Sparkles,
  TrendingUp,
  MousePointer,
} from "lucide-react";

// ── Animated Counter ─────────────────────────────────────────────
function AnimatedCounter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {prefix}{isInView ? count.toLocaleString("pt-BR") : "0"}{suffix}
    </span>
  );
}

// ── Typewriter ───────────────────────────────────────────────────
function Typewriter({ texts, speed = 50, pause = 2500 }: { texts: string[]; speed?: number; pause?: number }) {
  const [display, setDisplay] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx((c) => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((c) => c - 1), speed / 2);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx((i) => (i + 1) % texts.length);
    }

    setDisplay(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return (
    <span>
      {display}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="text-[#4B83D6]"
      >
        |
      </motion.span>
    </span>
  );
}

// ── Magnetic Button ──────────────────────────────────────────────
function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  );
}

// ── FadeIn ───────────────────────────────────────────────────────
function FadeIn({ children, className = "", delay = 0, direction = "up" }: {
  children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const initial = direction === "up" ? { opacity: 0, y: 30 } : direction === "left" ? { opacity: 0, x: -30 } : { opacity: 0, x: 30 };

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── 3D Tilt Card ─────────────────────────────────────────────────
function TiltCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePos({ x: 0, y: 0 }); }}
      style={{
        transform: isHovered
          ? `perspective(800px) rotateY(${mousePos.x * 8}deg) rotateX(${-mousePos.y * 8}deg)`
          : "perspective(800px) rotateY(0deg) rotateX(0deg)",
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.4s ease-out",
      }}
      className={`group relative rounded-2xl border border-[#1a1f2e] bg-[#0d1017] overflow-hidden ${className}`}
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${(mousePos.x + 0.5) * 100}% ${(mousePos.y + 0.5) * 100}%, rgba(75,131,214,0.08), transparent 60%)`
            : "none",
        }}
      />
      {/* Shine effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `linear-gradient(${Math.atan2(mousePos.y, mousePos.x) * (180 / Math.PI) + 90}deg, transparent 30%, rgba(255,255,255,0.02) 50%, transparent 70%)`
            : "none",
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── Floating Particles (subtle) ─────────────────────────────────
function FloatingParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#4B83D6]/20"
          initial={{
            x: `${Math.random() * 100}vw`,
            y: `${Math.random() * 100}vh`,
          }}
          animate={{
            y: [null, `${-20 + Math.random() * 40}vh`],
            x: [null, `${Math.random() * 10 - 5}vw`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

// ── Stagger Container ────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
};

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
  { value: 10, suffix: "M+", label: "Mensagens processadas" },
  { value: 99, suffix: ".9%", label: "Disponibilidade" },
  { value: 500, suffix: "+", label: "Empresas ativas" },
  { value: 1, prefix: "<", suffix: "s", label: "Tempo de resposta" },
];

const PLANS = [
  {
    name: "Basic", price: "Grátis", period: "", desc: "Para quem está começando a automatizar.", highlight: false, color: "text-[#6B7A99]",
    items: ["Até 2 conexões", "Disparo de mensagens", "Painel básico", "Contatos ilimitados", "Suporte por e-mail"],
    cta: "Começar grátis", ctaStyle: "border border-[#1a2236] text-[#8899B4] hover:bg-[#111827] hover:text-white",
  },
  {
    name: "Pro", price: "R$197", period: "/mês", desc: "Para equipes que precisam escalar.", highlight: true, color: "text-[#4B83D6]",
    items: ["Até 5 conexões", "IA de recepção inteligente", "IAs setoriais", "CRM com pipeline completo", "Automações por gatilho", "Agendamento Google Meet", "Distribuição round-robin", "Painel analítico avançado", "Suporte prioritário"],
    cta: "Assinar Pro", ctaStyle: "bg-[#4B83D6] text-white hover:bg-[#3A6FBF]",
  },
  {
    name: "Premium", price: "R$497", period: "/mês", desc: "Para operações de alto volume.", highlight: false, color: "text-[#C9A84C]",
    items: ["Conexões ilimitadas", "Tudo do plano Pro", "API de integração", "Webhooks personalizados", "Multi-atendentes ilimitados", "White-label disponível", "Gerente de conta dedicado", "SLA de 99.9%"],
    cta: "Falar com consultor", ctaStyle: "border border-[#2a2520] text-[#C9A84C] hover:bg-[#1a1710] hover:text-[#E0BD5F]",
  },
];

// ── MAIN ─────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.96]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], [0, 50]);
  const navBg = useTransform(scrollYProgress, [0, 0.02], [0, 1]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative bg-[#080A0F] text-white min-h-screen overflow-x-hidden selection:bg-[#4B83D6]/20">
      <FloatingParticles />

      {/* Ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[#4B83D6] rounded-full blur-[150px]"
        />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[#3B5998]/[0.02] rounded-full blur-[100px]" />
      </div>

      {/* ── NAV ─────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-[#111827]" : "border-b border-transparent"
        }`}
      >
        <div className={`transition-all duration-300 ${scrolled ? "bg-[#080A0F]/90 backdrop-blur-xl" : "bg-transparent"}`}>
          <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
            <motion.div
              className="flex items-center gap-2.5"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-[#4B83D6] flex items-center justify-center"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Zap className="w-4 h-4 text-white" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight text-white">ZapProBR</span>
            </motion.div>

            <div className="hidden md:flex items-center gap-8 text-[13px] text-[#6B7A99]">
              {[
                { href: "#features", label: "Recursos" },
                { href: "#demo", label: "Demonstração" },
                { href: "#pricing", label: "Planos" },
              ].map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  whileHover={{ y: -1 }}
                  className="hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#4B83D6] group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-[13px] font-medium rounded-lg text-[#8899B4] hover:text-white transition-colors duration-200"
              >
                Entrar
              </motion.button>
              <MagneticButton
                onClick={() => navigate("/login")}
                className="px-5 py-2 text-[13px] font-medium rounded-lg bg-[#4B83D6] text-white hover:bg-[#3A6FBF] transition-colors duration-200"
              >
                Começar agora
              </MagneticButton>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="relative min-h-screen flex items-center justify-center px-6 pt-20"
      >
        {/* Animated grid */}
        <motion.div
          animate={{ opacity: [0.02, 0.04, 0.02] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(75,131,214,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(75,131,214,0.15) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#4B83D6]/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1a2236] bg-[#0d1017]/80 backdrop-blur-sm text-[13px] text-[#6B7A99] mb-8"
              whileHover={{ borderColor: "#4B83D6", scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="w-2 h-2 rounded-full bg-[#4B83D6]"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Plataforma líder em automação WhatsApp Business
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight leading-[1.08]"
          >
            <span className="text-white">Automatize, gerencie</span>
            <br />
            <span className="text-white">e escale com </span>
            <motion.span
              className="text-[#4B83D6] inline-block"
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                backgroundImage: "linear-gradient(90deg, #4B83D6, #6B9FE8, #4B83D6)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              inteligência.
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-base md:text-lg text-[#6B7A99] max-w-2xl mx-auto leading-relaxed h-8"
          >
            <Typewriter
              texts={[
                "Automatize conversas com inteligência artificial.",
                "Converta leads em clientes sem esforço.",
                "Gerencie milhares de contatos em um painel.",
                "Dispare campanhas em escala enterprise.",
              ]}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center pt-6"
          >
            <MagneticButton
              onClick={() => navigate("/login")}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#4B83D6] text-white font-semibold text-sm hover:bg-[#3A6FBF] transition-all duration-200 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Começar gratuitamente
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </MagneticButton>
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#1a2236] text-[#8899B4] font-semibold text-sm hover:bg-[#111827] hover:text-white hover:border-[#2a3348] transition-all duration-300"
            >
              <Play className="w-4 h-4" />
              Ver demonstração
            </motion.a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center justify-center gap-6 pt-8 text-[12px] text-[#4A5568]"
          >
            {["Sem cartão necessário", "Setup em 2 minutos", "Suporte em português"].map((text, i) => (
              <motion.span
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 text-[#4B83D6]" />
                {text}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <motion.span
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-[10px] text-[#4A5568] uppercase tracking-widest"
          >
            Scroll
          </motion.span>
          <ChevronDown className="w-4 h-4 text-[#4A5568]" />
        </motion.div>
      </motion.section>

      {/* ── STATS ──────────────────────────────────── */}
      <section className="relative py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl border border-[#1a1f2e] overflow-hidden bg-[#1a1f2e]"
          >
            {STATS.map((s) => (
              <motion.div key={s.label} variants={staggerItem} className="bg-[#0d1017] p-8 text-center group hover:bg-[#0f1420] transition-colors duration-300">
                <p className="text-2xl md:text-3xl font-bold text-white">
                  <AnimatedCounter value={s.value} suffix={s.suffix} prefix={s.prefix || ""} />
                </p>
                <p className="text-xs text-[#6B7A99] mt-1.5 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────── */}
      <section id="features" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <motion.p
              className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4B83D6] mb-3"
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              whileInView={{ opacity: 1, letterSpacing: "0.2em" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Recursos
            </motion.p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Tudo o que sua operação precisa
            </h2>
            <p className="text-[#6B7A99] mt-4 max-w-lg mx-auto text-sm">
              Ferramentas profissionais para equipes que levam comunicação a sério.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <TiltCard key={f.title} delay={i * 0.08} className="h-full hover:border-[#2a3348] transition-all duration-500">
                <div className="p-7">
                  <motion.div
                    className="w-11 h-11 rounded-xl bg-[#131825] border border-[#1a2236] flex items-center justify-center mb-5"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <f.icon className="w-5 h-5 text-[#4B83D6]" />
                  </motion.div>
                  <h3 className="text-[15px] font-semibold text-white mb-2 group-hover:text-[#4B83D6] transition-colors duration-300">{f.title}</h3>
                  <p className="text-sm text-[#6B7A99] leading-relaxed">{f.desc}</p>
                </div>
              </TiltCard>
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

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px">
              <motion.div
                className="h-full bg-gradient-to-r from-transparent via-[#4B83D6]/20 to-transparent"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.3 }}
              />
            </div>

            {[
              { step: "01", icon: Send, title: "Conecte seu WhatsApp", desc: "Escaneie o QR Code e conecte em segundos. Sem complicações técnicas." },
              { step: "02", icon: Brain, title: "Configure suas IAs", desc: "Defina as regras e treine a IA para cada departamento da sua empresa." },
              { step: "03", icon: BarChart3, title: "Acompanhe os resultados", desc: "Monitore métricas, conversões e desempenho em tempo real no dashboard." },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.15}>
                <div className="relative text-center md:text-left">
                  <motion.div
                    className="w-14 h-14 rounded-2xl bg-[#131825] border border-[#1a2236] flex items-center justify-center mb-5 mx-auto md:mx-0"
                    whileHover={{ scale: 1.1, borderColor: "#4B83D6" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="w-6 h-6 text-[#4B83D6]" />
                  </motion.div>
                  <span className="text-[10px] font-bold text-[#4B83D6]/40 tracking-widest uppercase mb-2 block">Passo {item.step}</span>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-[#6B7A99] leading-relaxed">{item.desc}</p>
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
            <motion.div
              className="rounded-2xl border border-[#1a1f2e] bg-[#0d1017] overflow-hidden"
              whileHover={{ borderColor: "#2a3348" }}
              transition={{ duration: 0.3 }}
            >
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-5 py-3.5 border-b border-[#141a27]">
                <div className="flex gap-1.5">
                  <motion.div whileHover={{ scale: 1.3 }} className="w-2.5 h-2.5 rounded-full bg-[#3a2020]" />
                  <motion.div whileHover={{ scale: 1.3 }} className="w-2.5 h-2.5 rounded-full bg-[#3a3018]" />
                  <motion.div whileHover={{ scale: 1.3 }} className="w-2.5 h-2.5 rounded-full bg-[#1a3a1a]" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[#111827] rounded-md px-4 py-1.5 text-[11px] text-[#4A5568] max-w-xs mx-auto text-center font-mono">
                    app.zapprobr.com/dashboard
                  </div>
                </div>
              </div>

              {/* Mock dashboard */}
              <div className="p-6 space-y-4">
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-3"
                >
                  {[
                    { label: "Conversas ativas", val: "1.247", trend: "+12%", icon: MessageSquare },
                    { label: "Mensagens hoje", val: "12.840", trend: "+8.3%", icon: Send },
                    { label: "Taxa de resposta", val: "94.2%", trend: "+2.1%", icon: TrendingUp },
                    { label: "Novos leads", val: "328", trend: "+15%", icon: Users },
                  ].map((card) => (
                    <motion.div
                      key={card.label}
                      variants={staggerItem}
                      whileHover={{ y: -2, borderColor: "#2a3348" }}
                      className="rounded-xl bg-[#111827] border border-[#1a2236] p-4 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] text-[#4A5568] uppercase tracking-wider">{card.label}</p>
                        <card.icon className="w-3.5 h-3.5 text-[#4B83D6]/40" />
                      </div>
                      <div className="flex items-end gap-2">
                        <p className="text-xl font-bold text-white">{card.val}</p>
                        <span className="text-[10px] text-[#3B8764] font-medium mb-0.5">{card.trend}</span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Chart */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
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
                        transition={{ delay: 0.5 + i * 0.03, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                        whileHover={{ backgroundColor: "rgba(75,131,214,0.7)" }}
                        className="flex-1 rounded-sm bg-[#4B83D6]/30 cursor-pointer transition-colors"
                      />
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
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
              <FadeIn key={plan.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`relative rounded-2xl p-7 flex flex-col h-full transition-all duration-300 ${
                    plan.highlight
                      ? "bg-[#0d1017] border-2 border-[#4B83D6]/30 hover:border-[#4B83D6]/50"
                      : "bg-[#0d1017] border border-[#1a1f2e] hover:border-[#2a3348]"
                  }`}
                >
                  {plan.highlight && (
                    <>
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <motion.span
                          animate={{ boxShadow: ["0 0 10px rgba(75,131,214,0.3)", "0 0 20px rgba(75,131,214,0.5)", "0 0 10px rgba(75,131,214,0.3)"] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#4B83D6] text-white"
                        >
                          Recomendado
                        </motion.span>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-[#4B83D6]/[0.02]" />
                    </>
                  )}

                  <p className={`text-xs font-semibold tracking-[0.15em] uppercase mb-4 ${plan.color} relative z-10`}>
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-1 relative z-10">
                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-sm text-[#4A5568] mb-0.5">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-[#4A5568] mb-7 relative z-10">{plan.desc}</p>

                  <ul className="space-y-3 text-sm text-[#6B7A99] mb-8 flex-1 relative z-10">
                    {plan.items.map((item, j) => (
                      <motion.li
                        key={item}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.04 }}
                        className="flex items-center gap-2.5"
                      >
                        <Check className={`w-3.5 h-3.5 flex-shrink-0 ${plan.highlight ? "text-[#4B83D6]" : "text-[#3B4A66]"}`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  <MagneticButton
                    onClick={() => navigate("/login")}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 relative z-10 ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </MagneticButton>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────── */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <motion.div
              className="relative rounded-2xl border border-[#1a1f2e] bg-[#0d1017] overflow-hidden"
              whileHover={{ borderColor: "#2a3348" }}
            >
              {/* Animated glow */}
              <motion.div
                animate={{ opacity: [0.03, 0.06, 0.03] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-[#4B83D6] rounded-full blur-[100px]"
              />

              <div className="relative z-10 text-center py-16 md:py-20 px-8 space-y-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold text-white leading-tight"
                >
                  Pronto para transformar sua
                  <br />
                  <span className="text-[#4B83D6]">operação?</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                  className="text-[#6B7A99] text-sm max-w-md mx-auto"
                >
                  Junte-se a centenas de empresas que já automatizaram sua comunicação com o ZapProBR.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 }}
                  className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                >
                  <MagneticButton
                    onClick={() => navigate("/login")}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#4B83D6] text-white font-semibold text-sm hover:bg-[#3A6FBF] transition-all duration-200"
                  >
                    Começar gratuitamente
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </MagneticButton>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate("/login")}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[#1a2236] text-[#8899B4] font-semibold text-sm hover:bg-[#111827] hover:text-white transition-all duration-200"
                  >
                    <Headphones className="w-4 h-4" />
                    Falar com especialista
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="relative border-t border-[#111827] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#4A5568]">
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-6 h-6 rounded-md bg-[#4B83D6] flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-[#6B7A99]">ZapProBR</span>
          </motion.div>
          <p>© 2025 ZapProBR. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
