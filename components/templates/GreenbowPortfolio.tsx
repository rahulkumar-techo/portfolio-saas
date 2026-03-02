"use client";

import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const SITE = {
  name: "GREENBOW",
  tagline: "Your Bridge to a Brighter Horizon",
  subtitle: "We help businesses design stories as vivid as a rainbow — colorful, memorable, and inspiring.",
  about: "Together, GREENBOW embodies a partner that helps businesses design their own unique path toward brighter futures. We specialize in social media marketing, brand design, content creation, and digital campaigns. What sets us apart is our belief in storytelling — we craft narratives that are colorful, meaningful, and memorable.",
  vision: "Our vision is to become a rainbow of possibilities for brands and people alike. We believe the future belongs to those who create ecosystems of connection: where campaigns transform into communities, where design shapes not only brands but lifestyles, and where ideas grow into platforms for progress.",
  mission: "To help every client shine with their own spectrum of colors — and to ensure those colors resonate across borders and cultures. With GREENBOW, your story doesn't just reach people. It inspires them.",
  services: [
    { icon: "🌈", title: "Brand Design", desc: "Crafting visual identities that radiate color and meaning across every touchpoint.", color: ["#ff6b6b", "#ff9a3c"] },
    { icon: "📱", title: "Social Media", desc: "Strategic storytelling that turns followers into communities and posts into movements.", color: ["#a78bfa", "#ec4899"] },
    { icon: "✨", title: "Content Creation", desc: "Vivid, compelling content that captures attention and converts curiosity into loyalty.", color: ["#22ffcc", "#3b82f6"] },
    { icon: "🚀", title: "Digital Campaigns", desc: "End-to-end campaigns engineered to launch brands into their brightest chapters yet.", color: ["#fbbf24", "#f97316"] },
    { icon: "🎨", title: "Creative Direction", desc: "Bold creative vision that unifies your narrative and makes your brand unforgettable.", color: ["#34d399", "#06b6d4"] },
    { icon: "🌍", title: "Global Reach", desc: "Cross-cultural expertise to carry your message across borders with resonance.", color: ["#f43f5e", "#8b5cf6"] },
  ],
  stats: [
    { value: "200+", label: "Brands Elevated" },
    { value: "40+", label: "Countries Reached" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "6yr", label: "Of Rainbow Magic" },
  ],
  contact: {
    phone: "+60-87-452933",
    email: "support@greenbowltd.com",
    address: "Level 11(A), Main Office Tower, Financial Park Labuan, Malaysia",
  },
};

const RAINBOW = ["#ff6b6b", "#ff9a3c", "#fbbf24", "#34d399", "#22ffcc", "#3b82f6", "#a78bfa", "#ec4899"];

type ToastItem = { id: number; message: string };
type CanvasWithCleanup = HTMLCanvasElement & { _cleanup?: () => void };
type ThreeRuntimeWindow = Window & { THREE?: typeof import("three") };

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 13, padding: "12px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.4)", animation: "toastIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <span style={{ fontSize: 16 }}>🌈</span> {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── RAINBOW TEXT ─────────────────────────────────────────────────────────────
function RainbowText({ children, style = {} }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ background: "linear-gradient(135deg, #ff6b6b, #ff9a3c, #fbbf24, #34d399, #22ffcc, #3b82f6, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", ...style }}>
      {children}
    </span>
  );
}

// ─── PRISM ORBS (decorative background blobs) ─────────────────────────────────
function PrismOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {[
        { top: "10%", left: "5%", c1: "#ff6b6b", c2: "#fbbf24", size: 320, delay: 0 },
        { top: "60%", right: "5%", c1: "#a78bfa", c2: "#22ffcc", size: 280, delay: 2 },
        { top: "30%", left: "60%", c1: "#ec4899", c2: "#3b82f6", size: 200, delay: 4 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute", top: orb.top, left: orb.left, right: orb.right,
          width: orb.size, height: orb.size, borderRadius: "50%",
          background: `radial-gradient(circle, ${orb.c1}22, ${orb.c2}11, transparent 70%)`,
          animation: `orbFloat 8s ease-in-out ${orb.delay}s infinite alternate`,
          filter: "blur(40px)",
        }} />
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function GreenbowPortfolio() {
  const canvasRef = useRef<CanvasWithCleanup | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  const showToast = useCallback((msg: string) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message: msg }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }, []);

  // Intersection observer for reveal animations
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(prev => new Set([...prev, e.target.id]));
      });
    }, { threshold: 0.15 });
    ["about", "vision", "mission", "services", "contact"].forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Three.js rainbow 3D background
  useEffect(() => {
    if (!canvasRef.current) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    script.onload = () => {
      const THREE = (window as ThreeRuntimeWindow).THREE;
      if (!THREE) return;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 400);
      camera.position.set(0, 0, 42);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x050508, 1);

      // Lights
      scene.add(new THREE.AmbientLight(0x111122, 0.8));
      const lights: Array<{ color: number; pos: [number, number, number]; intensity: number }> = [
        { color: 0xff6b6b, pos: [20, 20, 10], intensity: 2 },
        { color: 0x22ffcc, pos: [-20, -10, 15], intensity: 1.8 },
        { color: 0xa78bfa, pos: [0, 30, -10], intensity: 1.5 },
        { color: 0xfbbf24, pos: [-30, 0, 20], intensity: 1.2 },
      ];
      lights.forEach(l => {
        const pl = new THREE.PointLight(l.color, l.intensity, 120);
        pl.position.set(...l.pos);
        scene.add(pl);
      });

      // Rainbow-colored floating objects
      const rainbowHex = [0xff6b6b, 0xff9a3c, 0xfbbf24, 0x34d399, 0x22ffcc, 0x3b82f6, 0xa78bfa, 0xec4899];
      const meshes: any[] = [];
      const count = window.innerWidth < 768 ? 12 : 24;

      for (let i = 0; i < count; i++) {
        const color = rainbowHex[i % rainbowHex.length];
        const t = i % 4;
        const scale = 0.5 + Math.random() * 1.4;
        let geo;
        if (t === 0) geo = new THREE.TorusGeometry(1.6 * scale, 0.28, 10, 28);
        else if (t === 1) geo = new THREE.OctahedronGeometry(1.4 * scale);
        else if (t === 2) geo = new THREE.SphereGeometry(1.2 * scale, 14, 14);
        else geo = new THREE.TorusKnotGeometry(0.9 * scale, 0.25, 60, 8);

        const mat = new THREE.MeshPhongMaterial({
          color: 0x080810,
          emissive: color,
          emissiveIntensity: 0.7,
          shininess: 30,
          specular: 0x334455,
          transparent: true,
          opacity: 0.85,
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          (Math.random() - 0.5) * 70,
          (Math.random() - 0.5) * 55,
          (Math.random() - 0.5) * 25 - 10
        );
        mesh.userData = {
          bx: mesh.position.x, by: mesh.position.y,
          ry: 0.004 + Math.random() * 0.012,
          rx: Math.random() > 0.5 ? 0.003 : 0,
          rz: Math.random() > 0.7 ? 0.002 : 0,
          amp: 1.5 + Math.random() * 2.5,
          freq: 0.5 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          pulsePhase: Math.random() * Math.PI * 2,
        };
        scene.add(mesh);
        meshes.push(mesh);
      }

      // Stars
      const starCount = 5000;
      const starPos = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount * 3; i += 3) {
        starPos[i] = (Math.random() - 0.5) * 120;
        starPos[i + 1] = (Math.random() - 0.5) * 120;
        starPos[i + 2] = (Math.random() - 0.5) * 100 - 20;
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      const starMat = new THREE.PointsMaterial({ size: 0.14, color: 0xddeeff, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthTest: false });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);

      let mouse = { x: 0, y: 0 }, cam = { x: 0, y: 0 };
      const onMouse = (e: MouseEvent) => {
        mouse.x = ((e.clientX / window.innerWidth) * 2 - 1) * 16;
        mouse.y = (-(e.clientY / window.innerHeight) * 2 + 1) * 12;
      };
      window.addEventListener("mousemove", onMouse);

      let frameId = 0;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const t = Date.now() * 0.001;
        cam.x += (mouse.x - cam.x) * 0.04;
        cam.y += (mouse.y - cam.y) * 0.04;
        camera.position.x = cam.x * 0.5;
        camera.position.y = cam.y * 0.4 + Math.sin(t * 0.3) * 0.8;
        camera.lookAt(0, 0, 0);
        meshes.forEach(m => {
          const d = m.userData;
          m.rotation.y += d.ry;
          if (d.rx) m.rotation.x += d.rx;
          if (d.rz) m.rotation.z += d.rz;
          m.position.y = d.by + Math.sin(t * d.freq + d.phase) * d.amp;
          m.position.x = d.bx + Math.cos(t * d.freq * 0.55 + d.phase) * (d.amp * 0.3);
          // Pulse emissive
          m.material.emissiveIntensity = 0.55 + Math.sin(t * 1.2 + d.pulsePhase) * 0.25;
        });
        stars.rotation.y = t * 0.015;
        stars.rotation.x = t * 0.005;
        renderer.render(scene, camera);
      };
      animate();

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);
      canvas._cleanup = () => {
        cancelAnimationFrame(frameId);
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        renderer.dispose();
      };
    };
    document.head.appendChild(script);
    return () => { if (canvasRef.current?._cleanup) canvasRef.current._cleanup(); };
  }, []);

  const handleSubmit = () => {
    if (!form.name || !form.email) return showToast("Please fill in your name and email.");
    setSending(true);
    setTimeout(() => {
      showToast("Message sent! Your rainbow is on its way ✨");
      setForm({ name: "", email: "", message: "" });
      setSending(false);
    }, 1500);
  };

  const revealed = (id: string) => visibleSections.has(id);
  const navLinks = ["about", "vision", "mission", "services", "contact"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body, #root { background: #050508; }
        input, textarea, button { font-family: 'Outfit', sans-serif; }
        
        :root {
          --r1: #ff6b6b; --r2: #ff9a3c; --r3: #fbbf24;
          --r4: #34d399; --r5: #22ffcc; --r6: #3b82f6;
          --r7: #a78bfa; --r8: #ec4899;
          --rainbow: linear-gradient(135deg, var(--r1), var(--r2), var(--r3), var(--r4), var(--r5), var(--r6), var(--r7), var(--r8));
          --glass: rgba(255,255,255,0.06);
          --border: rgba(255,255,255,0.1);
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #050508; }
        ::-webkit-scrollbar-thumb { background: var(--rainbow); border-radius: 4px; }

        .rb-border {
          position: relative;
          border-radius: 20px;
        }
        .rb-border::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          padding: 1px;
          background: var(--rainbow);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.5;
          pointer-events: none;
        }

        .glass {
          background: rgba(10,10,18,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.09);
        }

        .nav-link {
          background: none; border: none; color: rgba(255,255,255,0.6);
          font-size: 13px; font-weight: 500; cursor: pointer;
          letter-spacing: 0.08em; text-transform: uppercase;
          transition: color 0.2s; padding: 4px 0;
          font-family: 'Outfit', sans-serif;
        }
        .nav-link:hover { color: #fff; }

        .service-card {
          background: rgba(10,10,18,0.8);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px 28px;
          transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), border-color 0.3s, box-shadow 0.35s;
          cursor: default;
        }
        .service-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,0.2);
        }

        .stat-card {
          background: rgba(10,10,18,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 28px 20px;
          text-align: center;
          transition: transform 0.3s;
        }
        .stat-card:hover { transform: translateY(-4px); }

        .inp {
          width: 100%; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px; padding: 14px 18px;
          color: white; font-size: 14px;
          transition: border-color 0.2s;
        }
        .inp:focus { outline: none; border-color: #a78bfa; }
        .inp::placeholder { color: rgba(255,255,255,0.25); }
        .ta { resize: none; border-radius: 14px; }

        .btn-rainbow {
          background: var(--rainbow);
          background-size: 200% 100%;
          border: none; color: #050508; font-weight: 700;
          border-radius: 100px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s; letter-spacing: 0.04em;
          font-family: 'Outfit', sans-serif;
        }
        .btn-rainbow:hover { transform: scale(1.04); box-shadow: 0 0 40px rgba(167,139,250,0.4); }
        .btn-rainbow:active { transform: scale(0.98); }

        .btn-ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: white; border-radius: 100px; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.2s; font-family: 'Outfit', sans-serif;
          font-weight: 500;
        }
        .btn-ghost:hover { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); }

        @keyframes orbFloat {
          from { transform: translateY(0) scale(1); }
          to { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes heroFade {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rainbowShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ping {
          0%,100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.4; }
        }
        @keyframes scanline {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-title { animation: heroFade 0.9s 0.1s both; }
        .hero-sub { animation: heroFade 0.9s 0.3s both; }
        .hero-btns { animation: heroFade 0.9s 0.5s both; }
        .hero-badge { animation: heroFade 0.9s 0.05s both; }

        .section-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .section-reveal.visible { opacity: 1; transform: translateY(0); }

        .scanline-anim {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(167,139,250,0.4), transparent);
          animation: scanline 6s linear infinite;
          pointer-events: none;
        }

        .rainbow-hr {
          border: none;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }

        .rb-text {
          background: var(--rainbow);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .chapter-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px; padding: 6px 16px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
          margin-bottom: 20px;
        }

        .contact-info-item {
          display: flex; align-items: flex-start; gap: 16px;
          padding: 20px; border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          transition: background 0.2s;
        }
        .contact-info-item:hover { background: rgba(255,255,255,0.07); }

        footer a { color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.2s; }
        footer a:hover { color: white; }

        .mobile-menu-btn { display: none !important; }

        @media (max-width: 1024px) {
          .desktop-nav, .nav-cta { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
          .about-grid, .vision-grid, .contact-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .services-grid { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
        }

        @media (max-width: 720px) {
          .nav-shell { padding: 14px 18px !important; }
          .mobile-menu { padding: 16px 20px !important; }
          .stats-grid, .services-grid { grid-template-columns: 1fr !important; }
          .about-quote-card, .mission-card, .contact-form-card { padding: 24px !important; }
          .scroll-indicator { display: none !important; }
          .footer-inner { flex-direction: column !important; align-items: flex-start !important; }
          .footer-links { gap: 16px !important; flex-wrap: wrap !important; }
        }
      `}</style>

      <div style={{ fontFamily: "'Outfit', sans-serif", background: "#050508", color: "#e4e4e7", overflowX: "hidden", position: "relative" }}>

        {/* ── THREE.JS CANVAS ── */}
        <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }} />

        {/* ── PRISM ORBS ── */}
        <PrismOrbs />

        {/* ── NAV ── */}
        <nav style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrollY > 60 ? "rgba(5,5,8,0.92)" : "rgba(5,5,8,0.4)",
          backdropFilter: "blur(20px)",
          borderBottom: scrollY > 60 ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
          transition: "all 0.4s",
        }}>
          <div className="nav-shell" style={{ maxWidth: 1240, margin: "0 auto", padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--rainbow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 900, color: "#050508", letterSpacing: "-0.05em" }}>G</div>
              <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.04em" }} className="rb-text">GREENBOW</span>
            </div>

            {/* Desktop nav */}
            <div className="desktop-nav" style={{ display: "flex", gap: 36 }}>
              {navLinks.map(id => (
                <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{id}</button>
              ))}
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button className="btn-rainbow nav-cta" onClick={() => scrollTo("contact")} style={{ padding: "10px 24px", fontSize: 12 }}>
                <span style={{ width: 6, height: 6, background: "#050508", borderRadius: "50%", animation: "ping 1.5s infinite" }} />
                LET'S CONNECT
              </button>
              <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)} style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center" }}>
                {mobileOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="mobile-menu" style={{ background: "rgba(5,5,8,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "16px 32px", display: "flex", flexDirection: "column", gap: 8 }}>
              {navLinks.map(id => (
                <button key={id} className="nav-link" onClick={() => scrollTo(id)} style={{ textAlign: "left", padding: "10px 0" }}>{id}</button>
              ))}
            </div>
          )}
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px", textAlign: "center" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="hero-badge">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--rainbow)", flexShrink: 0, animation: "ping 2s infinite" }} />
              Branding · Design · Digital Campaigns
            </div>

            <h1 className="hero-title" style={{ fontSize: "clamp(44px, 7.5vw, 96px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", marginBottom: 8 }}>
              <span className="rb-text">Your Bridge</span>
              <br />
              <span style={{ color: "white" }}>to a Brighter</span>
              <br />
              <span style={{ fontFamily: "'DM Serif Display', serif", fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>Horizon</span>
            </h1>

            <p className="hero-sub" style={{ fontSize: "clamp(15px, 2vw, 20px)", color: "rgba(255,255,255,0.5)", maxWidth: 580, margin: "28px auto 0", lineHeight: 1.7, fontWeight: 300 }}>
              {SITE.subtitle}
            </p>

            <div className="hero-btns" style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 48, flexWrap: "wrap" }}>
              <button className="btn-rainbow" onClick={() => scrollTo("services")} style={{ padding: "16px 36px", fontSize: 14 }}>
                Explore Services →
              </button>
              <button className="btn-ghost" onClick={() => scrollTo("about")} style={{ padding: "16px 32px", fontSize: 14 }}>
                Our Story
              </button>
            </div>

            {/* Stats row */}
            <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginTop: 80, maxWidth: 700, margin: "80px auto 0" }}>
              {SITE.stats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, background: `linear-gradient(135deg, ${RAINBOW[i * 2]}, ${RAINBOW[i * 2 + 1]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 6, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator" style={{ position: "absolute", bottom: 36, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: "0.15em" }}>
            <div style={{ width: 1, height: 36, background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))" }} />
            SCROLL
          </div>

          <div className="scanline-anim" />
        </section>

        <hr className="rainbow-hr" style={{ position: "relative", zIndex: 1 }} />

        {/* ── ABOUT ── */}
        <section id="about" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }} className={`about-grid section-reveal ${revealed("about") ? "visible" : ""}`}>
            <div>
              <div className="chapter-badge">
                <span className="rb-text">01</span>
                About Us
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                The Story<br />
                <span className="rb-text">Behind the Colors</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.85, fontSize: 16, marginTop: 24, fontWeight: 300 }}>{SITE.about}</p>
              <button className="btn-rainbow" onClick={() => scrollTo("vision")} style={{ padding: "13px 28px", fontSize: 13, marginTop: 36 }}>
                Our Vision →
              </button>
            </div>

            {/* Decorative card */}
            <div style={{ position: "relative" }}>
              <div className="rb-border glass about-quote-card" style={{ padding: 40 }}>
                <div style={{ fontSize: 48, marginBottom: 20 }}>🌈</div>
                <blockquote style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.5 }}>
                  "Every rainbow begins with a single spark of light."
                </blockquote>
                <p style={{ marginTop: 20, fontSize: 14, color: "rgba(255,255,255,0.4)", fontWeight: 300, lineHeight: 1.7 }}>
                  Let GREENBOW be that spark for your brand — whether you're launching something new, entering a new market, or refreshing your image.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 28, flexWrap: "wrap" }}>
                  {["Branding", "Social Media", "Campaigns", "Design", "Growth"].map((tag, i) => (
                    <span key={i} style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: `${RAINBOW[i]}20`, color: RAINBOW[i], border: `1px solid ${RAINBOW[i]}40` }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="rainbow-hr" style={{ position: "relative", zIndex: 1 }} />

        {/* ── VISION ── */}
        <section id="vision" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }} className={`section-reveal ${revealed("vision") ? "visible" : ""}`}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div className="chapter-badge" style={{ margin: "0 auto 20px" }}>
                <span className="rb-text">02</span>
                Vision
              </div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.05 }}>
                A Rainbow of<br />
                <span className="rb-text">Possibilities</span>
              </h2>
            </div>

            <div className="vision-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              {/* Vision text */}
              <div className="glass rb-border" style={{ padding: 48, borderRadius: 24 }}>
                <p style={{ fontSize: "clamp(15px, 1.6vw, 20px)", color: "rgba(255,255,255,0.7)", lineHeight: 1.9, fontWeight: 300 }}>{SITE.vision}</p>
              </div>

              {/* Vision pillars */}
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {[
                  { icon: "🔗", title: "Connection", desc: "Campaigns that evolve into communities.", color: "#22ffcc" },
                  { icon: "🎨", title: "Design", desc: "Shaping brands into lasting lifestyles.", color: "#a78bfa" },
                  { icon: "🌉", title: "Bridge", desc: "A gateway between brands and their futures.", color: "#fbbf24" },
                  { icon: "🌍", title: "Growth", desc: "Ecosystems that carry brands into brighter horizons.", color: "#ec4899" },
                ].map((pillar, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 20, padding: "20px 24px", borderRadius: 16, background: "rgba(10,10,18,0.6)", border: "1px solid rgba(255,255,255,0.07)", transition: "border-color 0.3s" }}
                    onMouseOver={e => e.currentTarget.style.borderColor = pillar.color + "60"}
                    onMouseOut={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: pillar.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{pillar.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15, color: pillar.color }}>{pillar.title}</div>
                      <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4, fontWeight: 300 }}>{pillar.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="rainbow-hr" style={{ position: "relative", zIndex: 1 }} />

        {/* ── MISSION ── */}
        <section id="mission" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }} className={`section-reveal ${revealed("mission") ? "visible" : ""}`}>
            <div className="chapter-badge" style={{ margin: "0 auto 20px" }}>
              <span className="rb-text">03</span>
              Mission
            </div>
            <h2 style={{ fontSize: "clamp(32px, 5vw, 60px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 40 }}>
              We Make Your Colors<br />
              <span className="rb-text">Resonate Worldwide</span>
            </h2>
            <div className="glass rb-border mission-card" style={{ padding: "48px 56px", borderRadius: 28, display: "inline-block", maxWidth: 720, textAlign: "left" }}>
              <p style={{ fontSize: "clamp(16px, 1.8vw, 22px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, fontFamily: "'DM Serif Display', serif", fontStyle: "italic" }}>
                {SITE.mission}
              </p>
            </div>

            {/* Rainbow spectrum bar */}
            <div style={{ marginTop: 56, display: "flex", borderRadius: 100, overflow: "hidden", height: 6 }}>
              {RAINBOW.map((c, i) => (
                <div key={i} style={{ flex: 1, background: c, transition: "flex 0.3s" }} />
              ))}
            </div>
            <p style={{ marginTop: 16, fontSize: 11, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase" }}>Your Unique Spectrum of Colors</p>
          </div>
        </section>

        <hr className="rainbow-hr" style={{ position: "relative", zIndex: 1 }} />

        {/* ── SERVICES ── */}
        <section id="services" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }} className={`section-reveal ${revealed("services") ? "visible" : ""}`}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 24 }}>
              <div>
                <div className="chapter-badge">
                  <span className="rb-text">04</span>
                  Services
                </div>
                <h2 style={{ fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                  What We <span className="rb-text">Create</span>
                </h2>
              </div>
              <p style={{ maxWidth: 320, color: "rgba(255,255,255,0.4)", fontSize: 15, lineHeight: 1.7, fontWeight: 300 }}>
                From concept to campaign — every service designed to make your brand shine.
              </p>
            </div>

            <div className="services-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {SITE.services.map((svc, i) => (
                <div key={i} className="service-card"
                  onMouseOver={e => { e.currentTarget.style.boxShadow = `0 20px 60px ${svc.color[0]}25`; e.currentTarget.style.borderColor = svc.color[0] + "40"; }}
                  onMouseOut={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: `linear-gradient(135deg, ${svc.color[0]}22, ${svc.color[1]}22)`, border: `1px solid ${svc.color[0]}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{svc.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, background: `linear-gradient(135deg, ${svc.color[0]}, ${svc.color[1]})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{svc.title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontWeight: 300 }}>{svc.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <hr className="rainbow-hr" style={{ position: "relative", zIndex: 1 }} />

        {/* ── CONTACT ── */}
        <section id="contact" style={{ position: "relative", zIndex: 1, padding: "100px 24px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }} className={`contact-grid section-reveal ${revealed("contact") ? "visible" : ""}`}>
            {/* Left */}
            <div>
              <div className="chapter-badge">
                <span className="rb-text">05</span>
                Contact
              </div>
              <h2 style={{ fontSize: "clamp(28px, 4vw, 52px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
                Start Your<br />
                <span className="rb-text">Rainbow Journey</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, lineHeight: 1.8, marginBottom: 40, fontWeight: 300 }}>
                Ready to design your path to growth? We'd love to hear from you.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { icon: "📞", label: "Phone", value: SITE.contact.phone, color: "#22ffcc" },
                  { icon: "✉️", label: "Email", value: SITE.contact.email, color: "#a78bfa" },
                  { icon: "📍", label: "Office", value: SITE.contact.address, color: "#fbbf24" },
                ].map((item, i) => (
                  <div key={i} className="contact-info-item">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 4 }}>{item.label}</div>
                      <div style={{ fontSize: 14, color: item.color, fontWeight: 500 }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — form */}
            <div className="glass rb-border contact-form-card" style={{ padding: 40, borderRadius: 24 }}>
              <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Send a Message</h3>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, marginBottom: 28 }}>We'll get back within 24 hours 🌈</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Your Name</label>
                  <input className="inp" type="text" placeholder="Alex Rivera" value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Email Address</label>
                  <input className="inp" type="email" placeholder="alex@yourbrand.com" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Message</label>
                  <textarea className="inp ta" rows={4} placeholder="Tell us about your vision..." value={form.message} onChange={e => setForm(v => ({ ...v, message: e.target.value }))} />
                </div>
                <button className="btn-rainbow" onClick={handleSubmit} disabled={sending} style={{ padding: "15px 28px", fontSize: 14, justifyContent: "center", opacity: sending ? 0.8 : 1 }}>
                  {sending ? "Sending your spark... ✨" : "Send into the Rainbow ↗"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ position: "relative", zIndex: 1, background: "rgba(0,0,0,0.6)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "48px 24px" }}>
          {/* Rainbow top bar */}
          <div style={{ height: 3, background: "var(--rainbow)", borderRadius: "100px 100px 0 0", position: "absolute", top: 0, left: 24, right: 24 }} />
          <div className="footer-inner" style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--rainbow)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 900, color: "#050508" }}>G</div>
                <span style={{ fontWeight: 800, fontSize: 16 }} className="rb-text">GREENBOW</span>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", maxWidth: 300, lineHeight: 1.6 }}>
                Greenbow Ltd · Company No. LL20617<br />
                Registered under Labuan Financial Service Authority
              </p>
            </div>
            <div className="footer-links" style={{ display: "flex", gap: 32, fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {navLinks.map(id => <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); scrollTo(id); }}>{id.charAt(0).toUpperCase() + id.slice(1)}</a>)}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.05em" }}>
              © 2026 GREENBOW · All Rights Reserved
            </div>
          </div>
        </footer>

        <Toast toasts={toasts} />
      </div>
    </>
  );
}
