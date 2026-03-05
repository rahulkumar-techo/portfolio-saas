"use client";

import { useState } from "react";
import type { Skill } from "../types";
import Card3D from "../shared/Card3D";
import Ring from "../shared/Ring";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [activeSkill, setActiveSkill] = useState<number | null>(null);

  return (
    <section id="skills" style={{ ...section, position: "relative" }} className="grid-dots">
      <div style={{ maxWidth: 960, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <SectionLabel label="// TECH STACK" />
        <h2 style={h2}>Skills & <span style={{ color: "#00D4FF" }}>Expertise</span></h2>
        <p style={{ textAlign: "center", color: "#4B5563", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", marginBottom: 32 }}>tap a card to see proficiency level</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 14 }}>
          {skills.map((sk, i) => (
            <Card3D key={sk.name} depth={20} onClick={() => setActiveSkill(activeSkill === i ? null : i)} style={{ borderRadius: 16, background: activeSkill === i ? `${sk.color}12` : "rgba(10,12,28,0.85)", border: `1px solid ${activeSkill === i ? sk.color + "55" : "rgba(255,255,255,0.06)"}`, padding: "18px 12px", textAlign: "center", boxShadow: activeSkill === i ? `0 0 28px ${sk.color}28` : "none", transition: "all 0.3s ease" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Ring value={sk.level} color={sk.color} size={52} />
                  <div style={{ position: "absolute", fontFamily: "'JetBrains Mono',monospace", fontSize: 9, fontWeight: 700, color: sk.color }}>{sk.level}</div>
                </div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#fff" }}>{sk.name}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#6B7280" }}>{sk.category}</div>
                {activeSkill === i && (
                  <div style={{ width: "100%" }}>
                    <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 4, background: `linear-gradient(90deg,${sk.color},${sk.color}88)`, boxShadow: `0 0 8px ${sk.color}`, width: `${sk.level}%`, transition: "width 1.2s ease" }} />
                    </div>
                    <div style={{ fontSize: 9, color: sk.color, fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>{sk.level}%</div>
                  </div>
                )}
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
