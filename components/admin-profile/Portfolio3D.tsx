"use client";

import { useEffect, useState } from "react";

import portfolioData from "../../app/admin-profile/data";

import type { PortfolioData } from "./types";
import { BG } from "./styles";
import ParticleCanvas from "./shared/ParticleCanvas";
import AdminProfileStyles from "./shared/AdminProfileStyles";
import HeroSection from "./hero/HeroSection";
import AboutSection from "./about/AboutSection";
import SkillsSection from "./skills/SkillsSection";
import ProjectsSection from "./projects/ProjectsSection";
import ExperienceSection from "./experience/ExperienceSection";
import AnalyticsSection from "./analytics/AnalyticsSection";
import TestimonialsSection from "./testimonials/TestimonialsSection";
import StatsSection from "./stats/StatsSection";
import ContactSection from "./contact/ContactSection";

export default function Portfolio3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const d: PortfolioData = portfolioData;

  useEffect(() => {
    const h = (e: MouseEvent | TouchEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const px = "touches" in e ? e.touches[0].clientX : e.clientX;
      const py = "touches" in e ? e.touches[0].clientY : e.clientY;
      setTilt({ x: ((py - cy) / cy) * -12, y: ((px - cx) / cx) * 12 });
    };

    window.addEventListener("mousemove", h);
    window.addEventListener("touchmove", h, { passive: true });

    return () => {
      window.removeEventListener("mousemove", h);
      window.removeEventListener("touchmove", h);
    };
  }, []);

  return (
    <div style={{ fontFamily: "'Syne','Orbitron',sans-serif", background: BG, color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <AdminProfileStyles />
      <ParticleCanvas />

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: "100%", height: 2, background: "linear-gradient(transparent,rgba(108,99,255,0.06),transparent)", animation: "scan 9s linear infinite" }} />
      </div>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", background: "rgba(5,6,15,0.88)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(108,99,255,0.13)" }}>
        <span style={{ fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 17, background: "linear-gradient(90deg,#6C63FF,#00D4FF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AM.</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 20, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.28)", color: "#22c55e", fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e", animation: "hpulse 1.5s ease-in-out infinite", display: "inline-block" }} /> Open to work
        </div>
      </nav>

      <HeroSection hero={d.hero} tilt={tilt} />
      <AboutSection about={d.about} hero={d.hero} />
      <SkillsSection skills={d.skills} />
      <ProjectsSection projects={d.projects} />
      <ExperienceSection experience={d.experience} />
      <AnalyticsSection />
      <TestimonialsSection testimonials={d.testimonials} />
      <StatsSection stats={d.stats} />
      <ContactSection contact={d.contact} />

      <footer style={{ borderTop: "1px solid rgba(108,99,255,0.1)", background: "rgba(0,0,0,0.5)", padding: "20px 16px", textAlign: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#374151" }}>
          © {new Date().getFullYear()} Rahul Kumar · Built with Next.js · TypeScript · React
        </p>
      </footer>
    </div>
  );
}
