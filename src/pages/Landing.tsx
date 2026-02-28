import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  MessageSquare,
  Bot,
  Zap,
  BarChart3,
  Shield,
  Users,
  ArrowRight,
  Sparkles,
  Globe,
  Clock,
  ChevronDown,
} from "lucide-react";

// ── Particle Canvas ──────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];
    const PARTICLE_COUNT = 80;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const dx = p.x - particles[j].x;
          const dy = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ── Typewriter ───────────────────────────────────────────────────
function Typewriter({ texts, speed = 60, pause = 2000 }: { texts: string[]; speed?: number; pause?: number }) {
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
      <span className="animate-pulse text-indigo-400">|</span>
    </span>
  );
}

// ── Glow Card ────────────────────────────────────────────────────
function GlowCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouse = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={handleMouse}
      className={`relative group rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden ${className}`}
    >
      {/* Cursor glow */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99,102,241,0.12), transparent 70%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ── Section Wrapper ──────────────────────────────────────────────
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`relative py-24 md:py-32 px-6 ${className}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

// ── Floating Orb ─────────────────────────────────────────────────
function FloatingOrb({ size, color, top, left, delay = 0 }: { size: number; color: string; top: string; left: string; delay?: number }) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        background: color,
        top,
        left,
        opacity: 0.15,
      }}
    />
  );
}

// ── MAIN LANDING ─────────────────────────────────────────────────
const FEATURES = [
  { icon: MessageSquare, title: "Mensagens em Massa", desc: "Dispare milhares de mensagens personalizadas com um clique." },
  { icon: Bot, title: "IAs Setoriais", desc: "Inteligência artificial dedicada para cada departamento." },
  { icon: Zap, title: "Automações Avançadas", desc: "Fluxos inteligentes que trabalham 24/7 por você." },
  { icon: BarChart3, title: "Dashboard em Tempo Real", desc: "Métricas e insights poderosos sobre sua operação." },
  { icon: Shield, title: "Segurança Total", desc: "Criptografia e compliance de nível enterprise." },
  { icon: Users, title: "CRM Integrado", desc: "Pipeline completo para converter mais leads." },
];

const STATS = [
  { value: "10M+", label: "Mensagens enviadas" },
  { value: "99.9%", label: "Uptime garantido" },
  { value: "500+", label: "Empresas confiam" },
  { value: "<1s", label: "Tempo de resposta" },
];

const Landing = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="relative bg-[#0B0B0F] text-white min-h-screen overflow-x-hidden selection:bg-indigo-500/30">
      <ParticleCanvas />

      {/* Gradient blobs */}
      <FloatingOrb size={600} color="rgba(99,102,241,0.3)" top="-10%" left="-10%" />
      <FloatingOrb size={500} color="rgba(139,92,246,0.25)" top="20%" left="70%" delay={2} />
      <FloatingOrb size={400} color="rgba(59,130,246,0.2)" top="60%" left="20%" delay={4} />

      {/* ── Nav ─────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between backdrop-blur-xl bg-white/[0.04] border border-white/[0.06] rounded-2xl px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Zap<span className="text-indigo-400">Pro</span>BR
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#about" className="hover:text-white transition-colors">Sobre</a>
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="px-5 py-2 text-sm font-medium rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all duration-300"
          >
            Entrar
          </button>
        </div>
      </motion.nav>

      {/* ── HERO ────────────────────────────────────── */}
      <motion.section
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20"
      >
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-500/[0.07] blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 space-y-8 max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            Plataforma #1 de WhatsApp Business
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95]">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              O futuro da
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
              automação
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
              começa agora.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed h-8">
            <Typewriter
              texts={[
                "Automatize conversas com inteligência artificial.",
                "Converta leads em clientes sem esforço.",
                "Gerencie milhares de contatos em um painel.",
                "Dispare campanhas em escala enterprise.",
              ]}
            />
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/login")}
              className="group relative px-8 py-4 rounded-2xl font-semibold text-white overflow-hidden"
            >
              {/* Glow bg */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                Começar agora
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              href="#demo"
              className="px-8 py-4 rounded-2xl font-semibold border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all"
            >
              Ver demonstração
            </motion.a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 z-10"
        >
          <ChevronDown className="w-6 h-6 text-white/20" />
        </motion.div>
      </motion.section>

      {/* ── STATS ──────────────────────────────────── */}
      <Section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <GlowCard key={s.label} delay={i * 0.1} className="p-6 text-center">
              <p className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {s.value}
              </p>
              <p className="text-sm text-white/40 mt-1">{s.label}</p>
            </GlowCard>
          ))}
        </div>
      </Section>

      {/* ── ABOUT ──────────────────────────────────── */}
      <Section id="about">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-indigo-400 text-sm font-semibold tracking-widest uppercase"
            >
              Sobre o ZapProBR
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-black leading-tight"
            >
              A plataforma que
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {" "}revoluciona{" "}
              </span>
              sua comunicação
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="text-white/40 text-lg leading-relaxed"
            >
              ZapProBR combina inteligência artificial, automação avançada e um CRM poderoso para transformar
              a forma como sua empresa se comunica pelo WhatsApp. Escale suas operações sem aumentar sua equipe.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-6"
            >
              {[
                { icon: Globe, text: "Multi-conexão" },
                { icon: Clock, text: "24/7 ativo" },
                { icon: Shield, text: "Enterprise" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-white/50">
                  <item.icon className="w-4 h-4 text-indigo-400" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Holographic sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative flex items-center justify-center"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-indigo-500/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border border-purple-500/20"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-12 rounded-full border border-blue-500/20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl flex items-center justify-center">
                  <Zap className="w-12 h-12 text-indigo-400" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── FEATURES ───────────────────────────────── */}
      <Section id="features">
        <div className="text-center mb-16 space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-indigo-400 text-sm font-semibold tracking-widest uppercase"
          >
            Recursos
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black"
          >
            Tudo que você precisa.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Nada que você não precisa.
            </span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <GlowCard key={f.title} delay={i * 0.08} className="p-8 hover:-translate-y-1 transition-transform duration-500">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-5">
                <f.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </GlowCard>
          ))}
        </div>
      </Section>

      {/* ── DEMO ───────────────────────────────────── */}
      <Section id="demo">
        <div className="text-center mb-16 space-y-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-indigo-400 text-sm font-semibold tracking-widest uppercase"
          >
            Demonstração
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black"
          >
            Veja o poder em ação
          </motion.h2>
        </div>

        <GlowCard className="p-2 md:p-3">
          <div className="rounded-xl bg-[#111118] overflow-hidden">
            {/* Mock browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white/[0.05] rounded-lg px-4 py-1.5 text-xs text-white/30 max-w-xs mx-auto text-center">
                  app.zapprobr.com
                </div>
              </div>
            </div>

            {/* Mock dashboard */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Conversas ativas", val: "1.247", color: "from-indigo-500 to-blue-500" },
                  { label: "Msgs enviadas hoje", val: "12.840", color: "from-purple-500 to-pink-500" },
                  { label: "Taxa de resposta", val: "94.2%", color: "from-emerald-500 to-teal-500" },
                  { label: "Novos leads", val: "328", color: "from-amber-500 to-orange-500" },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4"
                  >
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">{card.label}</p>
                    <p className={`text-xl font-bold mt-1 bg-clip-text text-transparent bg-gradient-to-r ${card.color}`}>
                      {card.val}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Mock chart area */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-6 h-48 flex items-end gap-1.5"
              >
                {Array.from({ length: 24 }).map((_, i) => {
                  const h = 20 + Math.sin(i * 0.5) * 30 + Math.random() * 40;
                  return (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.8 + i * 0.03, duration: 0.5 }}
                      className="flex-1 rounded-t bg-gradient-to-t from-indigo-600/60 to-indigo-400/20"
                    />
                  );
                })}
              </motion.div>
            </div>
          </div>
        </GlowCard>
      </Section>

      {/* ── CTA FINAL ──────────────────────────────── */}
      <Section className="pb-32">
        <div className="relative rounded-3xl overflow-hidden">
          {/* BG glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />

          <div className="relative z-10 text-center py-20 md:py-28 px-6 space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black leading-tight"
            >
              Entre para o
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">
                futuro agora.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-white/40 text-lg max-w-lg mx-auto"
            >
              Junte-se a centenas de empresas que já transformaram sua comunicação com o ZapProBR.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/login")}
              className="group relative inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
              <span className="relative z-10">Começar gratuitamente</span>
              <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        </div>
      </Section>

      {/* ── FOOTER ─────────────────────────────────── */}
      <footer className="relative border-t border-white/[0.05] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-white/50">ZapProBR</span>
          </div>
          <p>© 2025 ZapProBR. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
