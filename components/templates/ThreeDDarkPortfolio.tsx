"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const data = {
  name: "Liam Voss",
  initials: "LV",
  tagline: "Full-stack engineer crafting immersive digital worlds with code + 3D",
  about: "I'm a full-stack developer and 3D enthusiast who loves turning complex ideas into beautiful, interactive experiences. With a background in both frontend magic and backend systems, I specialize in immersive web applications powered by Three.js and modern AI.",
  stats: [
    { label: "CURRENT FOCUS", value: "Spatial interfaces + AI agents" },
    { label: "BASED IN", value: "San Fran • Remote" },
    { label: "PREVIOUSLY", value: "Meta • Vercel Labs" },
  ],
  projects: [
    { title: "NEXUS • Spatial Dashboard", desc: "Real-time collaborative 3D analytics platform with AI insights and gesture controls.", year: "2024", tags: ["THREE.JS"], gradStart: "#22ffcc", gradEnd: "#a78bfa" },
    { title: "ECHO • AI Memory Orb", desc: "3D interactive memory assistant. Chat with your personal knowledge base floating in space.", year: "2024", tags: ["AI", "NEXT.JS"], gradStart: "#f472b6", gradEnd: "#22ffcc" },
    { title: "VOID • Generative Gallery", desc: "Infinite procedural 3D art gallery. Every visitor sees a unique universe generated in realtime.", year: "2023", tags: ["NODE"], gradStart: "#34d399", gradEnd: "#22ffcc" },
  ],
  skills: [
    { icon: "⚛️", name: "React", sub: "Advanced + hooks" },
    { icon: "🔥", name: "Next.js", sub: "App router + server" },
    { icon: "📐", name: "Three.js", sub: "R3F + shaders" },
    { icon: "🐍", name: "Python", sub: "AI + data" },
    { icon: "💠", name: "TypeScript", sub: "Full type safety" },
    { icon: "🌐", name: "Tailwind", sub: "+ custom shaders" },
  ],
};

type ToastItem = { id: number; message: string };
type CanvasWithCleanup = HTMLCanvasElement & { _cleanup?: () => void };
type ThreeRuntimeWindow = Window & { THREE?: typeof import("three") };

function Toast({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div style={{ position: "fixed", bottom: 32, right: 32, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background: "rgb(23,23,23)", color: "rgb(165,243,252)", fontSize: 13, padding: "12px 22px", borderRadius: 9999, boxShadow: "0 10px 15px -3px rgba(34,255,204,0.3), 0 0 0 1px rgb(165,243,252)", display: "flex", alignItems: "center", gap: 12, whiteSpace: "nowrap", animation: "toastPop 0.4s cubic-bezier(0.16,1,0.3,1) forwards" }}>
          <span style={{ fontSize: 15 }}>✦</span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const canvasRef = useRef<CanvasWithCleanup | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3600);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      showToast("Message received in the nebula ✨ Thank you!");
      setFormState({ name: "", email: "", message: "" });
      setSending(false);
    }, 1380);
  };

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
    script.onload = () => {
      const THREE = (window as ThreeRuntimeWindow).THREE;
      if (!THREE) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const isMobile = window.innerWidth < 768;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 300);
      camera.position.set(0, 0, 38);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: false, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.2 : 1.8));
      renderer.setSize(window.innerWidth, window.innerHeight);
      scene.add(new THREE.AmbientLight(0x99aadd, 0.35));
      const dl1 = new THREE.DirectionalLight(0xaaffff, 1.1); dl1.position.set(25, 30, 25); scene.add(dl1);
      const dl2 = new THREE.DirectionalLight(0xffaaff, 0.7); dl2.position.set(-30, -15, 20); scene.add(dl2);
      const pl = new THREE.PointLight(0x22ffcc, 1.8, 80); pl.position.set(10, 15, 15); scene.add(pl);
      const colors = [0x22ffcc, 0xff22cc, 0x88aaff, 0xffdd66];
      const meshes: any[] = [];
      const objectCount = isMobile ? 9 : 18;
      for (let i = 0; i < objectCount; i++) {
        const type = ["sphere", "torus", "box"][Math.floor(Math.random() * 3)];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const scale = 0.7 + Math.random() * 1.6;
        let geo;
        if (type === "sphere") geo = new THREE.SphereGeometry(1.35 * scale, 18, 18);
        else if (type === "torus") geo = new THREE.TorusGeometry(1.9 * scale, 0.32, 10, 26);
        else geo = new THREE.BoxGeometry(1.7 * scale, 1.7 * scale, 1.7 * scale);
        const mat = new THREE.MeshPhongMaterial({ color: 0x111122, emissive: color, emissiveIntensity: 0.95, shininess: 8, specular: 0x222233, flatShading: false });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set((Math.random() - 0.5) * 55, (Math.random() - 0.5) * 45, (Math.random() - 0.5) * 22 - 8);
        mesh.userData = { baseX: mesh.position.x, baseY: mesh.position.y, rotSpeedY: 0.003 + Math.random() * 0.013, rotSpeedX: Math.random() > 0.6 ? 0.0025 : 0, floatAmp: 1.8 + Math.random() * 2.2, floatFreq: 0.65 + Math.random() * 0.85, phase: Math.random() * Math.PI * 2 };
        scene.add(mesh); meshes.push(mesh);
      }
      const particleCount = isMobile ? 1800 : 4200;
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) { positions[i] = (Math.random() - 0.5) * 95; positions[i + 1] = (Math.random() - 0.5) * 95; positions[i + 2] = (Math.random() - 0.5) * 95 - 15; }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const starMat = new THREE.PointsMaterial({ size: 0.18, color: 0xccddee, transparent: true, opacity: 0.65, depthTest: false, blending: THREE.AdditiveBlending });
      const stars = new THREE.Points(starGeo, starMat);
      scene.add(stars);
      let mouseTarget = { x: 0, y: 0 }, currentMouse = { x: 0, y: 0 };
      const onMouse = (e: MouseEvent) => { mouseTarget.x = ((e.clientX / window.innerWidth) * 2 - 1) * 14; mouseTarget.y = (-(e.clientY / window.innerHeight) * 2 + 1) * 11; };
      window.addEventListener("mousemove", onMouse);
      let frameId = 0;
      const animate = () => {
        frameId = requestAnimationFrame(animate);
        const time = Date.now() * 0.0012;
        currentMouse.x = currentMouse.x * 0.86 + mouseTarget.x * 0.14;
        currentMouse.y = currentMouse.y * 0.86 + mouseTarget.y * 0.14;
        camera.position.x = currentMouse.x * 0.6;
        camera.position.y = currentMouse.y * 0.45 + Math.sin(time * 0.4) * 0.6;
        camera.lookAt(0, 0, 0);
        meshes.forEach((mesh) => { const d = mesh.userData; mesh.rotation.y += d.rotSpeedY; if (d.rotSpeedX) mesh.rotation.x += d.rotSpeedX; mesh.position.y = d.baseY + Math.sin(time * d.floatFreq + d.phase) * d.floatAmp; mesh.position.x = d.baseX + Math.cos(time * d.floatFreq * 0.6 + d.phase) * (d.floatAmp * 0.25); });
        stars.rotation.y = time * 0.02;
        renderer.render(scene, camera);
      };
      animate();
      const onResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
      window.addEventListener("resize", onResize);
      canvas._cleanup = () => { cancelAnimationFrame(frameId); window.removeEventListener("mousemove", onMouse); window.removeEventListener("resize", onResize); renderer.dispose(); };
    };
    document.head.appendChild(script);
    return () => { if (canvasRef.current?._cleanup) canvasRef.current._cleanup(); };
  }, []);

  const glass = { background: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 24 };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        input,textarea,button{font-family:inherit;}
        .nav-link{color:rgba(255,255,255,0.7);background:none;border:none;cursor:pointer;font-size:14px;font-weight:500;transition:color 0.2s;}
        .nav-link:hover{color:#22ffcc;}
        .project-card{transition:all 0.4s cubic-bezier(0.4,0,0.2,1);}
        .project-card:hover{transform:translateY(-12px);box-shadow:0 25px 50px -12px rgba(34,255,204,0.2),0 0 0 1px #22ffcc;}
        .skill-pill{transition:all 0.3s cubic-bezier(0.4,0,0.2,1);cursor:pointer;}
        .skill-pill:hover{transform:scale(1.08) rotate(2deg);background:rgb(23,23,23)!important;box-shadow:0 0 15px -3px rgb(168,85,247);}
        .scanline{position:absolute;top:0;left:-100%;width:40%;height:100%;background:linear-gradient(90deg,transparent,rgba(165,243,252,0.3),transparent);animation:scan 4s linear infinite;pointer-events:none;z-index:1;opacity:0.15;}
        @keyframes scan{0%{left:-40%;}100%{left:300%;}}
        .neon-text{text-shadow:0 0 10px rgb(34,255,204),0 0 20px rgb(34,255,204),0 0 40px rgb(168,85,247);}
        .sh-line{position:relative;display:inline-block;}
        .sh-line::after{content:'';position:absolute;width:60px;height:2px;background:linear-gradient(90deg,#22ffcc,#a78bfa);bottom:-8px;left:0;}
        @keyframes ping{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.6;transform:scale(1.5);}}
        .ping{animation:ping 1.5s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
        .pulse{animation:pulse 2s ease-in-out infinite;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        .f1{animation:fadeUp 0.8s 0.1s both;}
        .f2{animation:fadeUp 0.8s 0.25s both;}
        .f3{animation:fadeUp 0.8s 0.4s both;}
        .f4{animation:fadeUp 0.8s 0.55s both;}
        input:focus,textarea:focus{outline:none;border-color:#22ffcc!important;}
        .inp{width:100%;background:#18181b;border:1px solid rgba(255,255,255,0.2);border-radius:9999px;padding:16px 20px;font-size:14px;color:white;display:block;}
        .ta{width:100%;background:#18181b;border:1px solid rgba(255,255,255,0.2);border-radius:20px;padding:16px 20px;font-size:14px;color:white;resize:none;display:block;}
        @keyframes toastPop{from{opacity:0;transform:translateY(12px);}to{opacity:1;transform:translateY(0);}}
        .footer-link{cursor:pointer;letter-spacing:0.05em;transition:color 0.2s;color:#52525b;}
        .footer-link:hover{color:#22ffcc;}
        .lts-build{font-size:11px;font-weight:600;padding:0 20px;height:36px;border-radius:9999px;border:1px solid rgba(255,255,255,0.3);background:transparent;color:white;display:flex;align-items:center;gap:8px;letter-spacing:0.05em;transition:border-color 0.2s;}
        .lts-build:hover{border-color:#22ffcc;}
        .btn-primary{background:white;color:#09090b;border:none;padding:0 32px;height:48px;border-radius:9999px;font-weight:600;font-size:14px;display:inline-flex;align-items:center;gap:12px;transition:all 0.2s;}
        .btn-primary:hover{box-shadow:0 0 25px -3px rgba(34,255,204,0.6);}
        .btn-outline{background:transparent;color:white;border:1px solid rgba(255,255,255,0.4);padding:0 28px;height:48px;border-radius:9999px;font-size:14px;font-weight:500;display:inline-flex;align-items:center;gap:12px;transition:all 0.2s;}
        .btn-outline:hover{border-color:white;}
        .view-all{font-size:12px;color:#71717a;text-decoration:none;display:flex;align-items:center;gap:8px;transition:color 0.2s;}
        .view-all:hover{color:white;}
        .proj-btn-primary{flex:1;height:44px;background:white;color:#09090b;border:none;border-radius:16px;font-weight:500;font-size:12px;cursor:pointer;transition:all 0.2s;}
        .proj-btn-primary:active{transform:scale(0.97);}
        .proj-btn-outline{flex:1;height:44px;background:transparent;color:white;border:1px solid rgba(255,255,255,0.3);border-radius:16px;font-weight:500;font-size:12px;cursor:pointer;transition:all 0.2s;}
        .chip{font-size:9px;background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;color:#67e8f9;}
        .submit-btn{width:100%;height:48px;background:white;color:#09090b;border:none;border-radius:9999px;font-weight:600;font-size:14px;display:flex;align-items:center;justify-content:center;gap:12px;cursor:pointer;transition:all 0.2s;}
        .submit-btn:hover{background:#cffafe;}
        .submit-btn:active{transform:scale(0.97);}

        .mobile-menu-btn{display:none!important;}

        @media (max-width: 1024px){
          .desktop-nav,.nav-cta{display:none!important;}
          .mobile-menu-btn{display:flex!important;}
          .hero-grid,.about-grid{grid-template-columns:1fr!important;gap:32px!important;}
          .projects-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important;}
          .skills-grid{grid-template-columns:repeat(3,minmax(0,1fr))!important;}
          .nav-shell{padding:16px 20px!important;}
        }

        @media (max-width: 720px){
          .mobile-menu{padding:14px 20px!important;}
          .projects-grid,.skills-grid,.stats-grid{grid-template-columns:1fr!important;}
          .hero-orb{width:220px!important;height:220px!important;border-radius:48px!important;}
          .section-head{flex-direction:column!important;align-items:flex-start!important;gap:20px!important;}
          .view-all{display:none!important;}
          .footer-inner{flex-direction:column!important;align-items:flex-start!important;gap:16px!important;}
        }
      `}</style>

      <div style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif", background: "#09090b", color: "#e4e4e7", overflowX: "hidden", minHeight: "100vh" }}>
        <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, filter: "contrast(110%) brightness(105%)" }} />

        {/* NAV */}
        <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, background: scrollY > 50 ? "rgba(9,9,11,0.9)" : "rgba(9,9,11,0.7)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.1)", transition: "background 0.3s" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="nav-shell" style={{ padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                <div style={{ width: 28, height: 28, background: "#22ffcc", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#09090b" }}>{data.initials}</div>
                <span style={{ fontWeight: 600, fontSize: 20, letterSpacing: "-0.04em" }}>{data.name}</span>
              </div>
              <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 32 }}>
                {["about", "projects", "skills", "contact"].map(id => (
                  <button key={id} className="nav-link" onClick={() => scrollTo(id)}>{id.charAt(0).toUpperCase() + id.slice(1)}</button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button className="lts-build nav-cta" onClick={() => scrollTo("contact")}>
                  <span style={{ width: 8, height: 8, background: "#34d399", borderRadius: "50%" }} className="pulse" />
                  LET'S BUILD
                </button>
                <button className="mobile-menu-btn" onClick={() => setMobileOpen(v => !v)} style={{ width: 36, height: 36, background: "none", border: "none", color: "rgba(255,255,255,0.6)", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  {mobileOpen ? "✕" : "☰"}
                </button>
              </div>
            </div>
          </div>
          {mobileOpen && (
            <div className="mobile-menu" style={{ maxWidth: 1280, margin: "0 auto", padding: "16px 32px", borderTop: "1px solid rgba(255,255,255,0.1)", background: "#09090b", display: "flex", flexDirection: "column", gap: 4 }}>
              {["about", "projects", "skills", "contact"].map(id => (
                <button key={id} className="nav-link" onClick={() => scrollTo(id)} style={{ textAlign: "left", padding: "10px 16px", borderRadius: 16 }}>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* HERO */}
        <header style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", paddingTop: 64 }}>
          <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "7fr 5fr", gap: 48, alignItems: "center", width: "100%" }}>
            <div>
              <div className="f1" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 500, letterSpacing: "1px", padding: "0 16px", height: 24, borderRadius: 9999, marginBottom: 24 }}>
                <div style={{ width: 6, height: 6, background: "#22ffcc", borderRadius: "50%" }} className="ping" />
                AVAILABLE FOR FREELANCE
              </div>
              <h1 className="neon-text f2" style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-0.05em" }}>
                HI, I'M{" "}
                <span style={{ background: "linear-gradient(135deg, #67e8f9, #c4b5fd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  {data.name.toUpperCase()}
                </span>
              </h1>
              <p className="f3" style={{ marginTop: 12, fontSize: "clamp(16px, 2.2vw, 26px)", color: "rgba(255,255,255,0.4)", fontWeight: 300, maxWidth: 440, lineHeight: 1.4 }}>
                {data.tagline}
              </p>
              <div className="f4" style={{ display: "flex", gap: 16, marginTop: 48, flexWrap: "wrap" }}>
                <button className="btn-primary" onClick={() => scrollTo("projects")}><span>VIEW PROJECTS</span><span>→</span></button>
                <button className="btn-outline" onClick={() => scrollTo("contact")}><span style={{ color: "#22ffcc" }}>↓</span><span>Get in touch</span></button>
              </div>
              <div className="f4" style={{ marginTop: 64, display: "flex", alignItems: "center", gap: 32, fontSize: 12 }}>
                <div style={{ display: "flex" }}>
                  {[{ l: "R", c: "#a78bfa" }, { l: "3", c: "#22ffcc" }].map((x, i) => (
                    <div key={i} style={{ width: 24, height: 24, borderRadius: 8, background: x.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", marginLeft: i > 0 ? -8 : 0 }}>{x.l}</div>
                  ))}
                </div>
                <div style={{ color: "#71717a", lineHeight: 1.6 }}>
                  Currently building<br />
                  <span style={{ color: "#22ffcc", fontWeight: 500 }}>AI-powered 3D interfaces</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div className="hero-orb" style={{ ...glass, width: 256, height: 256, borderRadius: 64, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, rgba(34,255,204,0.08), rgba(168,85,247,0.08))" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "3px", color: "#22ffcc", marginBottom: 4 }}>CURRENTLY IN</div>
                  <div style={{ fontSize: 64, fontWeight: 700 }}>3D</div>
                  <div style={{ fontSize: 12, color: "#71717a", marginTop: 32 }}>SPACE</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 48, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: "#52525b", fontSize: 10, letterSpacing: "0.15em" }}>
            <div style={{ width: 1, height: 32, background: "linear-gradient(to bottom, transparent, #52525b, transparent)" }} />
            <span>SCROLL FOR MORE</span>
          </div>
          <div className="scanline" />
        </header>

        {/* ABOUT */}
        <section id="about" style={{ position: "relative", zIndex: 1, padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="about-grid" style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "5fr 7fr", gap: 64, alignItems: "center" }}>
            <div>
              <span style={{ padding: "6px 12px", fontSize: 11, fontWeight: 500, background: "rgba(255,255,255,0.1)", color: "#67e8f9", borderRadius: 9999 }}>CHAPTER 01</span>
              <h2 className="sh-line" style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.04em", marginTop: 12, lineHeight: 1.1, display: "block" }}>
                The story behind the pixels
              </h2>
            </div>
            <div style={{ ...glass, padding: 40 }}>
              <p style={{ color: "#d4d4d8", fontSize: 20, lineHeight: 1.5 }}>{data.about}</p>
              <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, marginTop: 48 }}>
                {data.stats.map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: 11, color: "#71717a", letterSpacing: "0.05em" }}>{stat.label}</div>
                    <div style={{ fontWeight: 500, color: i === 0 ? "#67e8f9" : "white", marginTop: 4, fontSize: 14 }}>{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" style={{ position: "relative", zIndex: 1, padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
              <div>
                <span style={{ padding: "6px 12px", fontSize: 11, fontWeight: 500, background: "rgba(255,255,255,0.1)", color: "#67e8f9", borderRadius: 9999 }}>CHAPTER 02</span>
                <h2 className="sh-line" style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.04em", marginTop: 12, display: "block" }}>Featured creations</h2>
              </div>
              <a href="#" className="view-all"><span style={{ fontWeight: 500 }}>View all projects</span><span style={{ fontSize: 18 }}>→</span></a>
            </div>
            <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
              {data.projects.map((p, i) => (
                <div key={i} className="project-card" style={{ ...glass, borderRadius: 24, overflow: "hidden" }}>
                  <div style={{ height: 8, background: `linear-gradient(90deg, ${p.gradStart}, ${p.gradEnd})` }} />
                  <div style={{ padding: 28 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <span style={{ fontSize: 11, fontFamily: "monospace", color: "#a78bfa" }}>{p.year}</span>
                      <div style={{ display: "flex", gap: 4 }}>{p.tags.map(t => <span key={t} className="chip">{t}</span>)}</div>
                    </div>
                    <h3 style={{ fontWeight: 600, fontSize: 22, marginTop: 12, letterSpacing: "-0.02em" }}>{p.title}</h3>
                    <p style={{ color: "#71717a", fontSize: 14, marginTop: 8, lineHeight: 1.6 }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
                      <button className="proj-btn-primary" onClick={() => showToast("Live demo opened (demo)")}>LIVE DEMO</button>
                      <button className="proj-btn-outline" onClick={() => showToast("GitHub link copied")}>GITHUB</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" style={{ position: "relative", zIndex: 1, padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <span style={{ padding: "6px 12px", fontSize: 11, fontWeight: 500, background: "rgba(255,255,255,0.1)", color: "#67e8f9", borderRadius: 9999 }}>CHAPTER 03</span>
              <h2 className="sh-line" style={{ fontSize: "clamp(24px, 4vw, 48px)", fontWeight: 600, letterSpacing: "-0.04em", marginTop: 12, display: "inline-block" }}>Tools of the trade</h2>
            </div>
            <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16, maxWidth: 800, margin: "0 auto" }}>
              {data.skills.map((sk, i) => (
                <div key={i} className="skill-pill" style={{ ...glass, borderRadius: 24, padding: "24px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 36, marginBottom: 16 }}>{sk.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{sk.name}</div>
                  <div style={{ fontSize: 11, color: "#71717a", marginTop: 4 }}>{sk.sub}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 64, fontSize: 12, color: "#71717a", display: "flex", alignItems: "center", justifyContent: "center", gap: 20 }}>
              <div style={{ height: 1, width: 48, background: "rgba(255,255,255,0.2)" }} />
              <span>Always learning new dimensions</span>
              <div style={{ height: 1, width: 48, background: "rgba(255,255,255,0.2)" }} />
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" style={{ position: "relative", zIndex: 1, padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ maxWidth: 440, margin: "0 auto" }}>
              <div style={{ ...glass, padding: 32 }}>
                <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em" }}>Start a conversation</h2>
                <p style={{ color: "#71717a", marginTop: 8, fontSize: 14 }}>Have an exciting project? Let's talk in 3D.</p>
                <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 24 }}>
                  <div>
                    <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", display: "block", marginBottom: 8 }}>Your name</label>
                    <input className="inp" type="text" value={formState.name} onChange={e => setFormState(v => ({ ...v, name: e.target.value }))} placeholder="Taylor Kim" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", display: "block", marginBottom: 8 }}>Email address</label>
                    <input className="inp" type="email" value={formState.email} onChange={e => setFormState(v => ({ ...v, email: e.target.value }))} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: "#71717a", display: "block", marginBottom: 8 }}>Message</label>
                    <textarea className="ta" rows={4} value={formState.message} onChange={e => setFormState(v => ({ ...v, message: e.target.value }))} placeholder="I want to build a floating AI city..." />
                  </div>
                  <button className="submit-btn" onClick={handleSubmit} disabled={sending} style={{ opacity: sending ? 0.8 : 1 }}>
                    <span>{sending ? "TRANSMITTING..." : "SEND INTO THE VOID"}</span>
                    {!sending && <span>↗</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ position: "relative", zIndex: 1, background: "#000", padding: "48px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
          <div className="footer-inner" style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, color: "#52525b" }}>
            <div>© 2025 {data.name} • Not a real person, but the vibe is</div>
            <div style={{ display: "flex", gap: 24 }}>
              {["TWITTER", "GITHUB", "LINKEDIN"].map(l => <span key={l} className="footer-link">{l}</span>)}
            </div>
          </div>
        </footer>

        <Toast toasts={toasts} />
      </div>
    </>
  );
}
