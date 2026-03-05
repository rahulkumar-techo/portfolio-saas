"use client";

import { useState } from "react";
import type { Experience } from "../types";
import Card3D from "../shared/Card3D";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

interface ExperienceSectionProps {
  experience: Experience[];
}

export default function ExperienceSection({ experience }: ExperienceSectionProps) {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  return (
    <section id="experience" style={{ ...section }} className="grid-dots">
      <div style={{ maxWidth: 700, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionLabel label="// EXPERIENCE" />
        <h2 style={h2}>Career <span style={{ color: "#FFD93D" }}>Timeline</span></h2>

        <div style={{ position: "relative", marginTop: 40 }}>
          <div style={{ position: "absolute", left: 22, top: 0, bottom: 0, width: 2, background: "linear-gradient(to bottom,#6C63FF,#00D4FF,#FF6B6B,transparent)", boxShadow: "0 0 12px rgba(108,99,255,0.4)" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {experience.map((exp, i) => (
              <div key={exp.id} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
                <button onClick={() => setActiveNode(activeNode === i ? null : i)} style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',monospace", fontWeight: 700, fontSize: 9, cursor: "pointer", background: `${exp.color}20`, border: `2px solid ${exp.color}70`, color: exp.color, boxShadow: activeNode === i ? `0 0 30px ${exp.color}55` : `0 0 14px ${exp.color}28`, transition: "all 0.3s ease", animation: "glowPulse 2.5s ease-in-out infinite", zIndex: 2, position: "relative" }}>
                  {exp.abbr}
                </button>

                <Card3D depth={10} style={{ flex: 1, borderRadius: 16, background: "rgba(8,10,22,0.92)", border: `1px solid ${activeNode === i ? exp.color + "45" : "rgba(255,255,255,0.06)"}`, padding: "16px 18px", boxShadow: activeNode === i ? `0 0 28px ${exp.color}18` : "none", transition: "all 0.35s ease" }}>
                  <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 20, fontFamily: "'JetBrains Mono',monospace", background: `${exp.color}18`, color: exp.color, border: `1px solid ${exp.color}38` }}>{exp.year}</span>
                    <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'JetBrains Mono',monospace" }}>{exp.company}</span>
                  </div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 14, marginBottom: 4 }}>{exp.role}</div>
                  {activeNode === i
                    ? <p style={{ color: "#9CA3AF", fontSize: 12, lineHeight: 1.65 }}>{exp.desc}</p>
                    : <span style={{ color: "#4B5563", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>tap to expand</span>}
                </Card3D>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
