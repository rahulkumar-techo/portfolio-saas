"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { Project } from "../types";

interface ProjectCubeProps {
  project: Project;
}

export default function ProjectCube({ project: p }: ProjectCubeProps) {
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(0);
  const [drag, setDrag] = useState(false);
  const last = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const raf = useRef<number | null>(null);
  const S = 150;

  const startD = (x: number, y: number) => {
    setDrag(true);
    last.current = { x, y };
    if (raf.current !== null) cancelAnimationFrame(raf.current);
  };

  const moveD = (x: number, y: number) => {
    if (!drag) return;
    const dx = x - last.current.x;
    const dy = y - last.current.y;
    vel.current = { x: dx * 0.8, y: dy * 0.8 };
    setRotY((v) => v + dx * 0.5);
    setRotX((v) => Math.max(-30, Math.min(30, v - dy * 0.3)));
    last.current = { x, y };
  };

  const endD = () => {
    setDrag(false);
    const inertia = () => {
      vel.current.x *= 0.92;
      vel.current.y *= 0.92;
      setRotY((v) => v + vel.current.x);
      setRotX((v) => v + vel.current.y);
      if (Math.abs(vel.current.x) > 0.05 || Math.abs(vel.current.y) > 0.05) {
        raf.current = requestAnimationFrame(inertia);
      }
    };
    raf.current = requestAnimationFrame(inertia);
  };

  useEffect(() => {
    if (drag) return;
    const auto = () => {
      setRotY((v) => v + 0.25);
      raf.current = requestAnimationFrame(auto);
    };
    raf.current = requestAnimationFrame(auto);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [drag]);

  const face: CSSProperties = {
    position: "absolute",
    width: S,
    height: S,
    backfaceVisibility: "hidden",
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    textAlign: "center",
    boxSizing: "border-box",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(16px)",
    background: "rgba(8,10,22,0.92)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        onMouseDown={(e) => startD(e.clientX, e.clientY)}
        onMouseMove={(e) => moveD(e.clientX, e.clientY)}
        onMouseUp={endD}
        onMouseLeave={endD}
        onTouchStart={(e) => startD(e.touches[0].clientX, e.touches[0].clientY)}
        onTouchMove={(e) => {
          e.preventDefault();
          moveD(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={endD}
        style={{ width: S, height: S, perspective: 600, cursor: "grab", userSelect: "none" }}
      >
        <div style={{ width: S, height: S, position: "relative", transformStyle: "preserve-3d", transform: `rotateY(${rotY}deg) rotateX(${rotX}deg)` }}>
          <div style={{ ...face, transform: `translateZ(${S / 2}px)`, borderColor: p.color + "40", boxShadow: `0 0 20px ${p.color}20` }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>🚀</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 12, lineHeight: 1.3 }}>{p.title}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", color: p.color, fontSize: 10, marginTop: 4 }}>{p.year}</div>
          </div>
          <div style={{ ...face, transform: `rotateY(180deg) translateZ(${S / 2}px)` }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>🔗</div>
            <div style={{ color: "#9CA3AF", fontSize: 10, marginBottom: 6, fontFamily: "'JetBrains Mono',monospace" }}>Source Code</div>
            <div style={{ padding: "4px 10px", borderRadius: 20, background: p.color + "25", color: p.color, border: `1px solid ${p.color}40`, fontSize: 10, fontFamily: "'JetBrains Mono',monospace" }}>GitHub →</div>
          </div>
          <div style={{ ...face, transform: `rotateY(90deg) translateZ(${S / 2}px)` }}>
            <div style={{ color: "#6B7280", fontSize: 9, marginBottom: 6, fontFamily: "'JetBrains Mono',monospace", letterSpacing: "0.1em" }}>STACK</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
              {p.tech.map((t, i) => <span key={i} style={{ padding: "2px 6px", borderRadius: 4, background: "rgba(108,99,255,0.2)", color: "#A78BFA", fontSize: 9, fontFamily: "'JetBrains Mono',monospace" }}>{t}</span>)}
            </div>
          </div>
          <div style={{ ...face, transform: `rotateY(-90deg) translateZ(${S / 2}px)` }}>
            <div style={{ color: "#9CA3AF", fontSize: 10, lineHeight: 1.5, fontFamily: "'JetBrains Mono',monospace" }}>{p.desc}</div>
          </div>
          <div style={{ ...face, transform: `rotateX(90deg) translateZ(${S / 2}px)` }}>
            <div style={{ color: "#6B7280", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", marginBottom: 4 }}>Role</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, color: "#fff", fontSize: 11 }}>{p.role}</div>
          </div>
          <div style={{ ...face, transform: `rotateX(-90deg) translateZ(${S / 2}px)` }}>
            <div style={{ fontSize: 24 }}>⭐</div>
            <div style={{ color: "#6B7280", fontSize: 9, fontFamily: "'JetBrains Mono',monospace", marginTop: 4 }}>Featured</div>
          </div>
        </div>
      </div>
      <div style={{ fontSize: 10, color: "#4B5563", fontFamily: "'JetBrains Mono',monospace" }}>↔ drag</div>
    </div>
  );
}
