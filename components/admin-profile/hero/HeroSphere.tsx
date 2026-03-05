"use client";

import Image from "next/image";

interface HeroSphereProps {
  tiltX: number;
  tiltY: number;
  avatar?: string;
}

export default function HeroSphere({ tiltX, tiltY, avatar = "AM" }: HeroSphereProps) {
  const techs = ["⚛️", "▲", "🟦", "🐳", "☁️", "🔴", "🦀", "⚙️"];

  return (
    <div style={{ position: "relative", width: 240, height: 240, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)", animation: "hpulse 3s ease-in-out infinite" }} />
      <div style={{ position: "absolute", width: 210, height: 210, top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "1px solid rgba(108,99,255,0.15)", borderRadius: "50%", animation: "hring 20s linear infinite" }} />
      <div style={{ position: "absolute", width: 185, height: 185, top: "50%", left: "50%", transform: "translate(-50%,-50%)", border: "1px solid rgba(0,212,255,0.1)", borderRadius: "50%", animation: "hring 14s linear infinite reverse" }} />

      <div style={{ position: "absolute", width: 210, height: 210, top: "50%", left: "50%", transformStyle: "preserve-3d", animation: "horbit 10s linear infinite" }}>
        {techs.map((icon, i) => {
          const a = (i / techs.length) * 360;
          return (
            <div key={i} style={{ position: "absolute", width: 32, height: 32, top: "50%", left: "50%", transform: `translate(-50%,-50%) rotate(${a}deg) translateX(105px) rotate(-${a}deg)`, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, background: "rgba(10,10,22,0.9)", border: "1px solid rgba(108,99,255,0.4)", boxShadow: "0 0 10px rgba(108,99,255,0.25)", fontSize: 14 }}>
              {icon}
            </div>
          );
        })}
      </div>

      <div style={{ position: "relative", zIndex: 10, width: 110, height: 110, borderRadius: "50%", background: "linear-gradient(135deg, #1a0533, #0d0d2b, #001a3d)", border: "2px solid rgba(108,99,255,0.6)", boxShadow: "0 0 50px rgba(108,99,255,0.4), inset 0 0 30px rgba(108,99,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron',monospace", fontWeight: 900, fontSize: 22, color: "#fff", transform: `rotateX(${tiltX * 0.3}deg) rotateY(${tiltY * 0.3}deg)`, transition: "transform 0.1s ease" }}>
         <Image
          src={avatar}
          alt="avatar"
          width={110}
          height={110}
          style={{ objectFit: "cover" }}
          className=" rounded-full"
        />
        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "linear-gradient(135deg, rgba(108,99,255,0.2), transparent, rgba(0,212,255,0.1))", animation: "holo 4s ease-in-out infinite alternate" }} />
      </div>

      <div style={{ position: "absolute", bottom: 28, right: 0, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, background: "rgba(0,0,0,0.85)", border: "1px solid rgba(34,197,94,0.35)", color: "#22c55e", fontSize: 10, fontFamily: "'JetBrains Mono',monospace", zIndex: 20 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", animation: "hpulse 1.5s ease-in-out infinite", display: "inline-block" }} /> Open
      </div>
    </div>
  );
}
