"use client";

import type { Project } from "../types";
import SectionLabel from "../shared/SectionLabel";
import { h2, section } from "../styles";
import ProjectCube from "./ProjectCube";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" style={{ ...section, background: "rgba(5,6,15,0.7)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <SectionLabel label="// PROJECTS" />
        <h2 style={h2}><span style={{ color: "#FF6B6B" }}>3D</span> Project Showcase</h2>
        <p style={{ textAlign: "center", color: "#4B5563", fontSize: 11, fontFamily: "'JetBrains Mono',monospace", marginBottom: 36 }}>drag each cube · 6 faces to explore</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(170px,1fr))", gap: 32, justifyItems: "center" }}>
          {projects.map((p) => (
            <div key={p.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <ProjectCube project={p} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 12, color: "#fff" }}>{p.title}</div>
                <div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 4, flexWrap: "wrap" }}>
                  {p.tech.slice(0, 2).map((t, i) => <span key={i} style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, background: p.color + "18", color: p.color, border: `1px solid ${p.color}30`, fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
