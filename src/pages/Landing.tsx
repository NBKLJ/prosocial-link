import { useRef, useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  MessageSquare, Bot, Zap, BarChart3, Shield, Users, ArrowRight, Check,
  Send, Sparkles, TrendingUp, Crown, ChevronDown,
} from "lucide-react";
import birdlyLogo from "@/assets/birdly-logo.png";
import workflowPreview from "@/assets/workflow-preview.png";

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
      canvas.height = window.innerHeight * 3;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        decay: Math.random() * 0.003 + 0.001,
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

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `rgba(232, 200, 117, ${Math.max(0, Math.min(0.7, p.alpha))})`);
        gradient.addColorStop(0.5, `rgba(200, 165, 90, ${Math.max(0, Math.min(0.3, p.alpha * 0.5))})`);
        gradient.addColorStop(1, `rgba(200, 165, 90, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
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
      <div className="absolute inset-0" style={{ perspective: "800px", perspectiveOrigin: "50% 30%" }}>
        <motion.div
          animate={{ opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", top: "20%", left: "-20%", right: "-20%", bottom: "-60%",
            transform: "rotateX(60deg)",
            backgroundImage: `
              linear-gradient(rgba(200,165,90,0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200,165,90,0.3) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#05070A_70%)]" />
    </div>
  );
}

// ── ANIMATED TEXT (word by word, no clipping) ────────────────────
function AnimatedHeadline({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  // If children is a string, animate word-by-word; otherwise animate as single block
  if (typeof children === "string") {
    const words = children.split(" ");
    return (
      <div ref={ref} className={className} style={{ lineHeight: 1.15 }}>
        {words.map((word, i) => (
          <motion.span
            key={i}
            className="inline-block mr-[0.25em]"
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.7, delay: delay + i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ lineHeight: 1.15 }}
      initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}

// (ShimmerText removed — shimmer is handled via CSS @keyframes shimmerGold)

// ── TYPING CURSOR ───────────────────────────────────────────────
function TypingWords({ words, className = "" }: { words: string[]; className?: string }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    let timeout: NodeJS.Timeout;
    if (!deleting) {
      if (displayed.length < word.length) {
        timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 80);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (displayed.length > 0) {
        timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, index, words]);

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity }}
        className="inline-block w-[3px] h-[0.85em] bg-[#C8A55A] ml-1 align-middle"
      />
    </span>
  );
}

// ── ANGULAR CARD ────────────────────────────────────────────────
function AngularCard({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const handleMouse = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 5 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouse}
      className={`relative group cursor-default ${className}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
    >
      <div className="absolute inset-0 bg-[#0a0d14] transition-all duration-500" />
      {/* Mouse-following glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(200,165,90,0.06), transparent 60%)`,
        }}
      />
      {/* Gold border on hover */}
      <motion.div
        className="absolute inset-0"
        animate={hovered ? { boxShadow: "inset 0 0 0 1px rgba(200,165,90,0.4), 0 0 40px rgba(200,165,90,0.08)" } : { boxShadow: "inset 0 0 0 1px rgba(200,165,90,0.08), 0 0 0px rgba(200,165,90,0)" }}
        transition={{ duration: 0.4 }}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
      />
      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-[20px] h-[20px]"
        style={{
          background: hovered
            ? "linear-gradient(135deg, transparent 50%, rgba(200,165,90,0.7) 50%)"
            : "linear-gradient(135deg, transparent 50%, rgba(200,165,90,0.15) 50%)",
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
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`relative group px-8 py-4 font-semibold text-sm tracking-wide uppercase overflow-hidden ${className}`}
      style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "conic-gradient(from var(--angle, 0deg), #C8A55A, transparent 40%, #C8A55A 60%, transparent)",
          animation: "borderRotate 3s linear infinite",
        }}
      />
      <div className="absolute inset-[1.5px] bg-[#05070A] group-hover:bg-[#080b12] transition-colors duration-300"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%)" }}
      />
      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 z-[5]"
        style={{ background: "linear-gradient(105deg, transparent 40%, rgba(232,200,117,0.15) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
      />
      <span className="relative z-10 text-[#E8C875] group-hover:text-white transition-colors duration-300">{children}</span>
    </motion.button>
  );
}

// ── HOLOGRAM SCAN ───────────────────────────────────────────────
function HologramScan() {
  return (
    <motion.div className="absolute inset-0 pointer-events-none z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      <motion.div
        className="absolute left-0 right-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(200,165,90,0.4), rgba(232,200,117,0.8), rgba(200,165,90,0.4), transparent)", boxShadow: "0 0 20px rgba(200,165,90,0.3), 0 0 60px rgba(200,165,90,0.1)" }}
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
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#05070A] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#05070A] to-transparent z-10" />
      <motion.div
        className="flex gap-20 items-center"
        animate={{ x: [0, -900] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...logos, ...logos, ...logos].map((name, i) => (
          <div key={i} className="flex-shrink-0 text-xl font-bold tracking-[0.25em] text-[#C8A55A]/15 uppercase select-none whitespace-nowrap">
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
function FadeIn({ children, className = "", delay = 0, direction = "up" }: { children: React.ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const initialPos = direction === "up" ? { y: 40 } : direction === "left" ? { x: -40 } : { x: 40 };
  const animatePos = direction === "up" ? { y: 0 } : { x: 0 };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...initialPos }}
      animate={isInView ? { opacity: 1, ...animatePos } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── FLOATING GLOW ORB ───────────────────────────────────────────
function FloatingOrb({ color = "rgba(200,165,90,0.06)", size = 400, x = "50%", y = "50%", delay = 0 }: { color?: string; size?: number; x?: string; y?: string; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, transform: "translate(-50%, -50%)", background: `radial-gradient(circle, ${color}, transparent 70%)`, filter: "blur(60px)" }}
      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
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
  { value: 100, suffix: "K+", label: "Mensagens processadas" },
  { value: 100, suffix: "%", label: "Disponibilidade" },
  { value: 500, suffix: "+", label: "Empresas ativas" },
  { value: 1, prefix: "<", suffix: "s", label: "Tempo de resposta" },
];

const PLANS = [
  {
    name: "Basic", price: "R$150", period: "/mês", desc: "Para quem está começando.", highlight: false, featured: false,
    items: ["Até 2 conexões", "Disparo de mensagens", "Painel básico", "Contatos ilimitados", "Suporte por e-mail"],
    cta: "Começar agora",
  },
  {
    name: "Pro", price: "R$550", period: "/mês", desc: "Para equipes que precisam escalar.", highlight: true, featured: true,
    items: ["Até 5 conexões", "IA de recepção inteligente", "IAs setoriais", "CRM com pipeline", "Automações por gatilho", "Agendamento Google Meet", "Distribuição round-robin", "Painel avançado", "Suporte prioritário"],
    cta: "Começar agora",
  },
  {
    name: "Premium", price: "R$1.500", period: "/mês", desc: "Operações de alto volume.", highlight: false, featured: false,
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

const globalStyles = `
@property --angle { syntax: '<angle>'; initial-value: 0deg; inherits: false; }
@keyframes borderRotate { to { --angle: 360deg; } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
@keyframes pulseGold { 0%, 100% { box-shadow: 0 0 0 0 rgba(200,165,90,0.4); } 70% { box-shadow: 0 0 0 12px rgba(200,165,90,0); } }
@keyframes shimmerGold { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
`;

// ── MAIN ────────────────────────────────────────────────────────
const Landing = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="relative bg-[#05070A] text-white min-h-screen overflow-x-hidden selection:bg-[#C8A55A]/30 selection:text-[#05070A]">
      <style>{globalStyles}</style>
      <GoldParticles />

      {/* ── NAV ───────────────────────────────────── */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? "border-b border-[#C8A55A]/10" : ""}`}
      >
        <div className={`transition-all duration-700 ${scrolled ? "bg-[#05070A]/90 backdrop-blur-2xl shadow-2xl shadow-black/20" : "bg-transparent"}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-5">
            <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.03 }}>
              <img src={birdlyLogo} alt="Birdly" className="w-9 h-9 rounded-lg object-contain" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent">
                Birdly
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
      <motion.section style={{ y: heroY, opacity: heroOpacity }} className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <PerspectiveGrid />
        <FloatingOrb color="rgba(200,165,90,0.05)" size={600} x="30%" y="40%" delay={0} />
        <FloatingOrb color="rgba(30,64,175,0.04)" size={500} x="70%" y="60%" delay={3} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 border border-[#C8A55A]/25 bg-[#C8A55A]/[0.06] backdrop-blur-md text-[11px] tracking-[0.18em] uppercase text-[#E8C875]"
              style={{ clipPath: "polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%)" }}
              animate={{ boxShadow: ["0 0 25px rgba(200,165,90,0)", "0 0 25px rgba(200,165,90,0.2)", "0 0 25px rgba(200,165,90,0)"] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Crown className="w-3.5 h-3.5" />
              Plataforma #1 do Brasil em Automação WhatsApp
            </motion.div>
          </motion.div>

          {/* Headline — compact, no overflow clipping */}
          <div className="mb-8">
            <AnimatedHeadline className="text-5xl md:text-7xl lg:text-[5.5rem] font-extralight tracking-tight text-white/90" delay={0.5}>
              O futuro da
            </AnimatedHeadline>
            <div className="my-3">
              <motion.span
                initial={{ opacity: 0, scale: 0.85, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="inline-block text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight"
                style={{
                  color: "#C8A55A",
                  lineHeight: 1.15,
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg, #C8A55A 0%, #E8C875 40%, #C8A55A 70%, #E8C875 100%)",
                    backgroundSize: "300% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    animation: "shimmerGold 4s ease-in-out infinite",
                  }}
                >
                  automação
                </span>
              </motion.span>
            </div>
            <AnimatedHeadline className="text-5xl md:text-7xl lg:text-[5.5rem] font-extralight tracking-tight text-white/90" delay={1.0}>
              começa aqui
            </AnimatedHeadline>
          </div>

          {/* Typing subheadline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mb-10"
          >
            <p className="text-lg md:text-xl font-light text-white/35 max-w-2xl mx-auto leading-relaxed tracking-wide">
              Transforme seu WhatsApp em uma máquina de{" "}
              <TypingWords
                words={["vendas", "atendimento", "conversão", "resultados"]}
                className="text-[#E8C875] font-medium"
              />
            </p>
            <p className="text-base md:text-lg font-light text-white/20 max-w-xl mx-auto mt-2">
              com inteligência artificial, automações e CRM integrado.
            </p>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12"
          >
            <BorderGlowButton onClick={() => navigate("/login")} className="text-base">
              Começar agora <ArrowRight className="inline w-4 h-4 ml-2" />
            </BorderGlowButton>
            <a href="#sistema" className="text-sm font-light tracking-wider uppercase text-white/25 hover:text-[#C8A55A] transition-all duration-300 flex items-center gap-2 group">
              Ver demonstração
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <ChevronDown className="w-4 h-4 group-hover:text-[#C8A55A]" />
              </motion.div>
            </a>
          </motion.div>

          {/* Inline Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                className="text-center"
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
              >
                <div className="text-2xl md:text-3xl font-bold bg-gradient-to-b from-[#E8C875] to-[#C8A55A] bg-clip-text text-transparent">
                  <AnimatedCounter value={s.value} suffix={s.suffix} prefix={s.prefix} />
                </div>
                <div className="text-[10px] tracking-[0.2em] uppercase text-white/20 mt-1">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="mt-16"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="w-5 h-8 border border-[#C8A55A]/20 rounded-full mx-auto flex items-start justify-center p-1"
            >
              <motion.div
                className="w-1 h-2 bg-[#C8A55A]/40 rounded-full"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A55A]/25 to-transparent" />

      {/* ── FEATURES ─────────────────────────────── */}
      <section id="features" className="relative py-32 px-6">
        <FloatingOrb color="rgba(200,165,90,0.03)" size={700} x="80%" y="30%" delay={2} />
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-20">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/50 mb-5">Recursos</p>
            <AnimatedHeadline className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90">
              Tecnologia de ponta
            </AnimatedHeadline>
            <AnimatedHeadline className="text-4xl md:text-5xl font-black tracking-tight mt-1" delay={0.1}>
              <span style={{ background: "linear-gradient(135deg, #C8A55A, #E8C875)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                para resultados reais
              </span>
            </AnimatedHeadline>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <AngularCard key={i} delay={i * 0.1}>
                <div className="p-8">
                  <div className="relative w-14 h-14 mb-6">
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-[#C8A55A]/15 bg-[#C8A55A]/[0.03]"
                      whileHover={{ borderColor: "rgba(200,165,90,0.5)", boxShadow: "0 0 25px rgba(200,165,90,0.15)" }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <f.icon className="w-6 h-6 text-[#C8A55A]" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-xl border border-[#C8A55A]/0"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-white/90 mb-3 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed font-light">{f.desc}</p>
                </div>
              </AngularCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── O SISTEMA (Demo) ─────────────────────── */}
      <section id="sistema" className="relative py-32 px-6">
        <FloatingOrb color="rgba(30,64,175,0.03)" size={500} x="20%" y="50%" delay={4} />
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/50 mb-5">O Sistema</p>
            <AnimatedHeadline className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90">
              Veja o poder em
            </AnimatedHeadline>
            <AnimatedHeadline className="text-4xl md:text-5xl font-black tracking-tight mt-1" delay={0.1}>
              <span style={{ background: "linear-gradient(135deg, #C8A55A, #E8C875)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ação
              </span>
            </AnimatedHeadline>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Workflow Image */}
            <FadeIn direction="left" delay={0.2}>
              <div className="relative group">
                <div className="absolute -inset-[2px] bg-gradient-to-br from-[#C8A55A]/30 via-transparent to-[#C8A55A]/30 rounded-xl" />
                <div className="relative bg-[#0a0d14] rounded-xl overflow-hidden border border-[#C8A55A]/10">
                  <div className="flex items-center gap-2 px-5 py-3 bg-[#0d1017] border-b border-[#C8A55A]/10">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                    </div>
                    <div className="flex-1 text-center">
                      <span className="text-[10px] tracking-[0.1em] text-white/15">Fluxo de automação — Birdly AI</span>
                    </div>
                  </div>
                  <div className="relative overflow-hidden">
                    <img src={workflowPreview} alt="Fluxo de automação IA" className="w-full" />
                    {/* Animated scan line */}
                    <motion.div
                      className="absolute inset-x-0 h-[2px] pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent, #C8A55A, transparent)" }}
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Animated pulse dots on nodes */}
                    <motion.div
                      className="absolute top-[30%] left-[15%] w-3 h-3 rounded-full"
                      style={{ background: "#C8A55A", boxShadow: "0 0 15px #C8A55A" }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute top-[35%] left-[45%] w-3 h-3 rounded-full"
                      style={{ background: "#C8A55A", boxShadow: "0 0 15px #C8A55A" }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                    />
                    <motion.div
                      className="absolute top-[20%] right-[25%] w-3 h-3 rounded-full"
                      style={{ background: "#C8A55A", boxShadow: "0 0 15px #C8A55A" }}
                      animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1.2 }}
                    />
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Flow description */}
            <FadeIn direction="right" delay={0.4}>
              <div className="space-y-6">
                <p className="text-white/30 text-sm font-light leading-relaxed">
                  O Birdly conecta seus canais a fluxos de IA inteligentes que processam, respondem e atualizam seu CRM automaticamente — tudo rodando 24/7.
                </p>
                {[
                  { step: "01", title: "Mensagem recebida", desc: "O WhatsApp captura a mensagem e envia ao fluxo" },
                  { step: "02", title: "IA processa", desc: "O chatbot analisa intenção e contexto da conversa" },
                  { step: "03", title: "CRM atualizado", desc: "Lead é criado ou atualizado automaticamente" },
                  { step: "04", title: "Resposta enviada", desc: "A resposta personalizada chega em segundos" },
                ].map((item, i) => (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
                    className="flex gap-4 items-start"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: "rgba(200,165,90,0.1)", color: "#C8A55A", border: "1px solid rgba(200,165,90,0.2)" }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white/80">{item.title}</p>
                      <p className="text-xs text-white/30 mt-0.5">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── IMPACT / NUMBERS ─────────────────────── */}
      <section id="impacto" className="relative py-32 px-6">
        <FloatingOrb color="rgba(200,165,90,0.04)" size={500} x="50%" y="50%" delay={1} />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="left">
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/50 mb-6">Impacto</p>
            <AnimatedHeadline className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90">
              Números que
            </AnimatedHeadline>
            <AnimatedHeadline className="text-4xl md:text-5xl font-black tracking-tight mt-1" delay={0.1}>
              <span style={{ background: "linear-gradient(135deg, #C8A55A, #E8C875)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                falam por si
              </span>
            </AnimatedHeadline>
            <p className="text-white/25 font-light mt-6 leading-relaxed max-w-md text-base">
              Nossos clientes experimentam resultados transformadores desde o primeiro mês.
              A tecnologia Birdly não é uma promessa — é uma garantia de performance.
            </p>
          </FadeIn>

          <div className="grid grid-cols-2 gap-5">
            {IMPACT.map((m, i) => (
              <AngularCard key={i} delay={i * 0.12}>
                <div className="p-7 text-center">
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-b from-[#E8C875] to-[#C8A55A] bg-clip-text text-transparent">
                    <AnimatedCounter value={m.value} suffix={m.suffix} />
                  </div>
                  <p className="text-[10px] tracking-[0.15em] uppercase text-white/20 mt-3">{m.label}</p>
                  <motion.div className="mt-4 h-[2px] bg-[#C8A55A]/10 overflow-hidden rounded-full">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #C8A55A, #E8C875)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${60 + i * 10}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.4 + i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/50 mb-5">Planos</p>
            <AnimatedHeadline className="text-4xl md:text-5xl font-extralight tracking-tight text-white/90">
              Investimento que
            </AnimatedHeadline>
            <AnimatedHeadline className="text-4xl md:text-5xl font-black tracking-tight mt-1" delay={0.1}>
              <span style={{ background: "linear-gradient(135deg, #C8A55A, #E8C875)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                se paga sozinho
              </span>
            </AnimatedHeadline>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: [0.25, 0.46, 0.45, 0.94] }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                className="relative"
              >
                {plan.featured && (
                  <div className="absolute -inset-[1.5px] z-0 overflow-hidden"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                      background: "conic-gradient(from var(--angle, 0deg), #C8A55A, transparent 30%, #E8C875 50%, transparent 70%, #C8A55A)",
                      animation: "borderRotate 4s linear infinite",
                    }}
                  />
                )}

                <div
                  className={`relative h-full p-8 ${plan.featured ? "bg-[#0a0d14]" : "bg-[#080b12] border border-[#C8A55A]/5"}`}
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)",
                    backgroundImage: plan.name === "Premium"
                      ? "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(200,165,90,0.02) 10px, rgba(200,165,90,0.02) 11px)"
                      : "none",
                  }}
                >
                  {plan.featured && (
                    <motion.div
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#C8A55A]/10 border border-[#C8A55A]/20 mb-6 text-[10px] tracking-[0.15em] uppercase text-[#C8A55A]"
                      style={{ clipPath: "polygon(4px 0, 100% 0, calc(100% - 4px) 100%, 0 100%)" }}
                      animate={{ boxShadow: ["0 0 10px rgba(200,165,90,0)", "0 0 10px rgba(200,165,90,0.2)", "0 0 10px rgba(200,165,90,0)"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-3 h-3" />
                      Mais popular
                    </motion.div>
                  )}

                  <h3 className={`text-xl font-bold tracking-tight ${plan.featured ? "text-[#E8C875]" : plan.name === "Premium" ? "text-[#E8C875]/80" : "text-white/50"}`}>
                    {plan.name}
                  </h3>
                  <p className="text-white/20 text-sm font-light mt-1">{plan.desc}</p>

                  <div className="mt-6 mb-8">
                    <span className="text-4xl md:text-5xl font-black text-white">{plan.price}</span>
                    {plan.period && <span className="text-white/20 text-sm font-light">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.items.map((item, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + j * 0.04 }}
                        className="flex items-center gap-3 text-sm text-white/35 font-light"
                      >
                        <Check className={`w-4 h-4 flex-shrink-0 ${plan.featured ? "text-[#C8A55A]" : "text-[#C8A55A]/30"}`} />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  {plan.featured ? (
                    <BorderGlowButton onClick={() => navigate("/login")} className="w-full text-center">
                      {plan.cta}
                    </BorderGlowButton>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02, borderColor: "rgba(200,165,90,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate("/login")}
                      className={`w-full py-3.5 text-sm font-semibold tracking-wider uppercase transition-all duration-300 ${
                        plan.name === "Premium"
                          ? "border border-[#C8A55A]/15 text-[#C8A55A]/80 hover:bg-[#C8A55A]/5"
                          : "border border-white/8 text-white/35 hover:text-white/60 hover:border-white/15"
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
      <section className="relative py-36 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,165,90,0.05),transparent_60%)] pointer-events-none" />
        <FloatingOrb color="rgba(200,165,90,0.04)" size={600} x="50%" y="50%" delay={0} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="text-[11px] tracking-[0.3em] uppercase text-[#C8A55A]/50 mb-8">Pronto para começar?</p>
          </FadeIn>
          <AnimatedHeadline className="text-4xl md:text-6xl font-extralight tracking-tight text-white/90">
            Eleve seu negócio ao
          </AnimatedHeadline>
          <AnimatedHeadline className="text-4xl md:text-6xl font-black tracking-tight mt-2" delay={0.1}>
            <span style={{ background: "linear-gradient(135deg, #C8A55A, #E8C875, #C8A55A)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              próximo nível
            </span>
          </AnimatedHeadline>
          <FadeIn delay={0.3}>
            <p className="text-white/25 font-light mt-8 mb-12 max-w-lg mx-auto leading-relaxed text-base">
              Junte-se a mais de 500 empresas que já transformaram seu atendimento com a plataforma mais avançada do mercado.
            </p>
          </FadeIn>
          <FadeIn delay={0.4}>
            <BorderGlowButton onClick={() => navigate("/login")} className="text-base mx-auto">
              Começar agora <ArrowRight className="inline w-4 h-4 ml-2" />
            </BorderGlowButton>
          </FadeIn>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="relative border-t border-[#C8A55A]/10 pt-16 pb-10 px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C8A55A]/30 to-transparent absolute top-0 left-0 right-0" />

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <img src={birdlyLogo} alt="Birdly" className="w-8 h-8 rounded-lg object-contain" />
                <span className="text-lg font-bold bg-gradient-to-r from-[#C8A55A] to-[#E8C875] bg-clip-text text-transparent">
                  Birdly
                </span>
              </div>
              <p className="text-sm text-white/15 font-light leading-relaxed">
                Tecnologia de elite para automação WhatsApp Business.
              </p>
            </div>

            {/* Consultor de Vendas */}
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#C8A55A]/30 mb-4 font-semibold">Vendas</h4>
              <ul className="space-y-2.5">
                <li className="text-sm text-white/15 font-light">Fale com um consultor</li>
                <li>
                  <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="text-sm text-white/15 hover:text-[#C8A55A] transition-colors duration-300 font-light flex items-center gap-2">
                    📱 WhatsApp Comercial
                  </a>
                </li>
                <li>
                  <a href="mailto:vendas@birdly.com" className="text-sm text-white/15 hover:text-[#C8A55A] transition-colors duration-300 font-light flex items-center gap-2">
                    ✉️ vendas@birdly.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Suporte Técnico */}
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#C8A55A]/30 mb-4 font-semibold">Suporte</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="text-sm text-white/15 hover:text-[#C8A55A] transition-colors duration-300 font-light flex items-center gap-2">
                    🛠️ Suporte Técnico
                  </a>
                </li>
                <li>
                  <a href="mailto:suporte@birdly.com" className="text-sm text-white/15 hover:text-[#C8A55A] transition-colors duration-300 font-light flex items-center gap-2">
                    ✉️ suporte@birdly.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Treinamento */}
            <div>
              <h4 className="text-[11px] tracking-[0.2em] uppercase text-[#C8A55A]/30 mb-4 font-semibold">Treinamento</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="https://wa.me/5500000000000" target="_blank" rel="noopener noreferrer" className="text-sm text-white/15 hover:text-[#C8A55A] transition-colors duration-300 font-light flex items-center gap-2">
                    🎓 Agendar treinamento
                  </a>
                </li>
                <li>
                  <a href="mailto:treinamento@birdly.com" className="text-sm text-white/15 hover:text-[#C8A55A] transition-colors duration-300 font-light flex items-center gap-2">
                    ✉️ treinamento@birdly.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-[#C8A55A]/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/10 tracking-wider">
              © 2026 Birdly. Todos os direitos reservados.
            </p>
            <p className="text-[11px] text-white/8 tracking-wider">
              Feito com excelência no Brasil 🇧🇷
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
