"use client";

import type { About, Hero } from "../types";
import Card3D from "../shared/Card3D";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

interface AboutSectionProps {
  about: About;
  hero: Hero;
}

export default function AboutSection({ about, hero }: AboutSectionProps) {
  return (
    <section id="about" style={{ ...section, background: "rgba(5,6,15,0.6)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel label="// ABOUT ME" />
        <h2 style={h2}>The <span style={{ color: "#6C63FF" }}>Developer</span> Behind the Code</h2>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 24, justifyContent: "center", marginTop: 32 }}>
          <Card3D depth={14} style={{ borderRadius: 22, background: "linear-gradient(135deg,rgba(10,12,28,0.95),rgba(20,15,45,0.95))", border: "1px solid rgba(108,99,255,0.22)", boxShadow: "0 30px 80px rgba(108,99,255,0.13),inset 0 1px 0 rgba(255,255,255,0.04)", padding: 28, maxWidth: 340, width: "100%" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: 22, background: "linear-gradient(135deg,rgba(108,99,255,0.04),transparent,rgba(0,212,255,0.03))", pointerEvents: "none" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 58, height: 58, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 18, color: "#fff", background: "linear-gradient(135deg,#6C63FF,#A855F7)", boxShadow: "0 8px 24px rgba(108,99,255,0.4)", flexShrink: 0 }}>{hero.avatar}</div>
              <div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 15 }}>{hero.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", color: "#A78BFA", fontSize: 11, marginTop: 2 }}>{about.role}</div>
              </div>
            </div>
            <p style={{ color: "#9CA3AF", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>{about.bio}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
              {about.highlights.map((item, i) => (
                <div key={i} style={{ padding: "8px 10px", borderRadius: 10, textAlign: "center", fontSize: 11, fontWeight: 600, background: "rgba(108,99,255,0.1)", border: "1px solid rgba(108,99,255,0.2)", color: "#C4B5FD", fontFamily: "'JetBrains Mono',monospace" }}>{item}</div>
              ))}
            </div>
          </Card3D>

          <Card3D className="float-b" depth={10} style={{ borderRadius: 14, background: "rgba(0,0,0,0.85)", border: "1px solid rgba(255,255,255,0.07)", padding: 22, maxWidth: 420, width: "100%", fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
              {["#FF5F56", "#FEBC2E", "#27C840"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              <span style={{ color: "#4B5563", fontSize: 10, marginLeft: 6 }}>portfolio ~ %</span>
            </div>
            {[
              ["$ ", "whoami", "#00D4FF"],
              ["→ ", `${hero.name} — ${hero.title}`, "#A78BFA"],
              ["$ ", "cat stack.json", "#00D4FF"],
              ["→ ", '{ "core": ["Next.js","Node","AWS"] }', "#FFD93D"],
              ["$ ", "git log --oneline | head", "#00D4FF"],
              ["→ ", "feat: ship portfolio SaaS v2.0", "#22c55e"],
              ["→ ", "perf: 100ms → 12ms API latency", "#22c55e"],
              ["→ ", "scale: 100k concurrent rps", "#22c55e"],
              ["$ ", "█", "#6C63FF"],
            ].map(([pre, text, color], i) => (
              <div key={i} style={{ marginBottom: 4, color }}>
                <span style={{ color: "#4B5563" }}>{pre}</span>{text}
              </div>
            ))}
          </Card3D>
        </div>
      </div>
    </section>
  );
}
