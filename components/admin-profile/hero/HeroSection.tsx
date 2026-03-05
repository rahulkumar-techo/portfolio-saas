"use client";

import type { Hero } from "../types";
import HeroSphere from "./HeroSphere";

interface HeroSectionProps {
  hero: Hero;
  tilt: { x: number; y: number };
}

export default function HeroSection({ hero, tilt }: HeroSectionProps) {
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 52, overflow: "hidden" }} className="grid-dots">
      <div style={{ position: "absolute", width: 600, height: 600, top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "radial-gradient(circle,rgba(108,99,255,0.1) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 280, height: 280, top: "15%", right: "8%", background: "radial-gradient(circle,rgba(0,212,255,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "0 16px", maxWidth: 800, width: "100%" }}>
        <div className="float-a" style={{ marginBottom: 24 }}>
          <HeroSphere tiltX={tilt.x} tiltY={tilt.y} avatar={hero.avatar} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14, color: "#6B7280", fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
          <span style={{ color: "#6C63FF" }}>◉</span> {hero.location}
        </div>

        <h1 className="shimmer-text fade-up" style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(38px,9vw,86px)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 14, animationDelay: "0.1s", opacity: 0 }}>
          {hero.name}
        </h1>

        <div className="fade-up" style={{ marginBottom: 16, animationDelay: "0.2s", opacity: 0 }}>
          <span style={{ padding: "8px 20px", borderRadius: 30, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'JetBrains Mono',monospace", background: "linear-gradient(135deg,rgba(108,99,255,0.2),rgba(0,212,255,0.1))", border: "1px solid rgba(108,99,255,0.4)", color: "#A78BFA", boxShadow: "0 0 20px rgba(108,99,255,0.2)" }}>
            {hero.title}
          </span>
        </div>

        <p className="fade-up" style={{ fontSize: 17, color: "#9CA3AF", lineHeight: 1.65, maxWidth: 520, marginBottom: 28, animationDelay: "0.3s", opacity: 0 }}>
          {hero.tagline}
        </p>
      </div>

      <div className="float-b" style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.25em", color: "#374151", fontFamily: "'JetBrains Mono',monospace" }}>SCROLL</div>
        <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom,#6C63FF,transparent)" }} />
      </div>
    </section>
  );
}
