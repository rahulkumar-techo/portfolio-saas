"use client";

import type { Stat } from "../types";
import Card3D from "../shared/Card3D";
import Counter from "../shared/Counter";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

interface StatsSectionProps {
  stats: Stat[];
}

export default function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section style={{ ...section, background: "rgba(5,6,15,0.85)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <SectionLabel label="// ACHIEVEMENTS" />
        <h2 style={h2}>By the <span style={{ color: "#00D4FF" }}>Numbers</span></h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 18, marginTop: 32 }}>
          {stats.map((st, i) => (
            <Card3D key={i} depth={22} className="float-a" style={{ borderRadius: 20, background: "rgba(8,10,22,0.94)", border: `1px solid ${st.color}28`, padding: "30px 16px", textAlign: "center", boxShadow: `0 0 28px ${st.color}0e`, animationDelay: `${i * 0.4}s`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, opacity: 0.04, color: st.color, pointerEvents: "none" }}>⬡</div>
              <div style={{ position: "relative" }}>
                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: "clamp(34px,5vw,50px)", color: st.color, textShadow: `0 0 24px ${st.color}55`, lineHeight: 1 }}>
                  <Counter target={st.value} suffix={st.suffix} />
                </div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#9CA3AF", marginTop: 8 }}>{st.label}</div>
                <div style={{ width: 28, height: 2, borderRadius: 2, background: st.color, boxShadow: `0 0 8px ${st.color}`, margin: "12px auto 0" }} />
              </div>
            </Card3D>
          ))}
        </div>
      </div>
    </section>
  );
}
