"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "../types";
import Card3D from "../shared/Card3D";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const [activeTesti, setActiveTesti] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTesti((i) => (i + 1) % testimonials.length), 4500);
    return () => clearInterval(t);
  }, [testimonials.length]);

  return (
    <section style={{ ...section }} className="grid-dots">
      <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionLabel label="// TESTIMONIALS" />
        <h2 style={h2}>What <span style={{ color: "#FF6B6B" }}>Clients</span> Say</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28, marginTop: 8 }}>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setActiveTesti(i)} style={{ height: 8, borderRadius: 4, background: i === activeTesti ? "#6C63FF" : "rgba(255,255,255,0.12)", width: i === activeTesti ? 24 : 8, transition: "all 0.3s ease", border: "none", cursor: "pointer" }} />
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 16 }}>
          {testimonials.map((t, i) => (
            <Card3D key={t.id} depth={14} style={{ borderRadius: 20, background: "rgba(8,10,22,0.92)", border: `1px solid ${i === activeTesti ? t.color + "42" : "rgba(255,255,255,0.06)"}`, padding: 22, boxShadow: i === activeTesti ? `0 0 40px ${t.color}18` : "none", transform: i === activeTesti ? "scale(1.02)" : "scale(0.98)", transition: "all 0.45s ease" }}>
              <div style={{ fontSize: 42, lineHeight: 1, marginBottom: 10, color: t.color + "35", fontFamily: "Georgia,serif" }}>&quot;</div>
              <p style={{ color: "#D1D5DB", fontSize: 12, lineHeight: 1.75, marginBottom: 18 }}>{t.text}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 11, background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}45`, flexShrink: 0 }}>{t.avatar}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#fff" }}>{t.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#6B7280", marginTop: 1 }}>{t.role}</div>
                </div>
                <div style={{ color: "#FFD93D", fontSize: 11, letterSpacing: 1 }}>★★★★★</div>
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
