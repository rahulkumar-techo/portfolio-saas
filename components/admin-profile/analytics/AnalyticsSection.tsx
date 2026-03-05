"use client";

import Card3D from "../shared/Card3D";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";

export default function AnalyticsSection() {
  return (
    <section style={{ ...section, background: "rgba(5,6,15,0.8)" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <SectionLabel label="// PRODUCT ENGINEERING" />
        <h2 style={h2}>SaaS <span style={{ color: "#6C63FF" }}>Analytics Panel</span></h2>

        <Card3D depth={6} style={{ borderRadius: 22, background: "rgba(7,9,20,0.97)", border: "1px solid rgba(108,99,255,0.2)", overflow: "hidden", boxShadow: "0 40px 100px rgba(108,99,255,0.13)", marginTop: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.4)" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#FF5F56", "#FEBC2E", "#27C840"].map((c) => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#4B5563" }}>Portfolio Analytics v2.4</div>
            <div style={{ fontSize: 9, padding: "3px 8px", borderRadius: 20, background: "rgba(34,197,94,0.1)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.2)", fontFamily: "'JetBrains Mono',monospace" }}>● Live</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, padding: "18px 18px 12px" }}>
            {[ ["Portfolio Views", "24.8K", "+18%", "#6C63FF"], ["Resume DLs", "3.2K", "+31%", "#00D4FF"], ["Templates", "980", "+12%", "#FFD93D"], ["Active Users", "1.4K", "+45%", "#FF6B6B"] ].map(([l, v, d, c]) => (
              <Card3D key={l} depth={12} style={{ borderRadius: 14, padding: "14px 14px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: "#6B7280", marginBottom: 6 }}>{l}</div>
                <div style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 22, color: "#fff", marginBottom: 4 }}>{v}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: c, fontFamily: "'JetBrains Mono',monospace" }}>{d} ↑</div>
              </Card3D>
            ))}
          </div>
        </Card3D>
      </div>
    </section>
  );
}
