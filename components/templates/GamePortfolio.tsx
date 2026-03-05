"use client";
import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const TILE = 48;
const COLS = 28;
const ROWS = 20;
const PLAYER_SPEED = 3;

// ─── PORTFOLIO DATA ────────────────────────────────────────────────────────────
const PORTFOLIO = {
  name: "Rahul Kumar",
  title: "Full Stack Developer",
  level: 12,
  xp: 8420,
  hp: 100,
  skills: [
    { name: "React", level: 95, color: "#61dafb" },
    { name: "Node.js", level: 88, color: "#84cc16" },
    { name: "Three.js", level: 80, color: "#22ffcc" },
    { name: "Python", level: 82, color: "#facc15" },
    { name: "TypeScript", level: 90, color: "#3b82f6" },
    { name: "AWS", level: 75, color: "#f97316" },
  ],
};

// ─── MAP LEGEND ────────────────────────────────────────────────────────────────
// 0=grass, 1=wall/tree, 2=water, 3=path, 4=sand, 5=dark-grass
// NPCs and zones are separate layers
const RAW_MAP = `
1111111111111111111111111111
1003333000000000000000000001
1030000030000500500000000001
1300000003050050050000000001
1000001000000500500000055001
1000001000033333333000055001
1000001000030000030000000001
1333331000030000030000000001
1000000000030000030000000001
1000004440033333330000000001
1000004440000000000000011001
1000004440000000000000010001
1000000000000000000000010001
1000000220000000000000010001
1000000220000000000011110001
1000000000000000000010000001
1000000000011111110010000001
1000000000010000010010000001
1000000000333000333010000001
1111111111111111111111111111
`.trim().split("\n").map(row => row.split("").map(Number));

// Zone definitions (x, y in tiles, radius in tiles)
const ZONES = [
  { id: "about",    x: 6,  y: 3,  r: 3, label: "🏰 About Me",    color: "#a78bfa" },
  { id: "skills",   x: 14, y: 4,  r: 3, label: "⚔️ Skills Lab",   color: "#22ffcc" },
  { id: "projects", x: 6,  y: 14, r: 3, label: "🏗️ Project Forge", color: "#fbbf24" },
  { id: "contact",  x: 22, y: 10, r: 3, label: "📡 Contact Tower", color: "#ec4899" },
] as const;

// NPC positions
const NPCS = [
  { id: "about",    x: 6,  y: 2,  emoji: "🧙", name: "Wizard Rahul",    zone: "about" },
  { id: "skills",   x: 14, y: 3,  emoji: "⚔️", name: "Skill Trainer",   zone: "skills" },
  { id: "projects", x: 6,  y: 13, emoji: "🛠️", name: "Builder Bot",     zone: "projects" },
  { id: "contact",  x: 22, y: 9,  emoji: "📡", name: "Signal Keeper",   zone: "contact" },
] as const;

type Zone = (typeof ZONES)[number];
type ZoneId = Zone["id"];
type NPC = (typeof NPCS)[number];
type Skill = (typeof PORTFOLIO.skills)[number];

type Player = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  dir: "up" | "down" | "left" | "right";
  frame: number;
  frameTimer: number;
};

type Particle = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  size: number;
  decay: number;
};

type GameState = {
  player: Player;
  keys: Record<string, boolean>;
  camera: { x: number; y: number };
  particles: Particle[];
};

// Dialog content per NPC
const DIALOGS: Record<ZoneId, string[]> = {
  about: [
    "⚡ Welcome, traveler! I am Rahul Kumar, a Full Stack Developer from the digital realm!",
    "🌍 I craft AI-powered immersive web platforms — where code meets creativity.",
    "🎓 With 5+ years of experience, I've shipped products used by thousands worldwide.",
    "💼 Previously at TechCorp, PixelLabs & DesignStudio. Now building my own adventures!",
  ],
  skills: [
    "⚔️ Welcome to the Skills Lab! Here lie the weapons of a true developer.",
    "🔥 My strongest spells: React (Lv.95), TypeScript (Lv.90), Node.js (Lv.88)!",
    "✨ I also wield Three.js for 3D magic, Python for AI sorcery, and AWS cloud power!",
    "📈 Always learning — currently mastering WebGPU and Rust incantations!",
  ],
  projects: [
    "🏗️ Greetings! I guard the archives of Rahul's greatest creations!",
    "🚀 Portfolio SaaS — AI-powered portfolio generator. Built with Next.js + GPT-4.",
    "🤖 Career AI Platform — Microservice-based career assistant. 10k+ users!",
    "🌌 3D Dashboard — Real-time analytics powered by Three.js + WebSockets.",
  ],
  contact: [
    "📡 You've found the Contact Tower! Signals travel fast from here.",
    "✉️ Email: rahul@devworld.io — I reply within 24 hours!",
    "🐦 Twitter: @rahuldev — Follow for daily tech wisdom!",
    "💼 LinkedIn: linkedin.com/in/rahulkumar — Let's connect professionally!",
  ],
};

// ─── TILE COLORS ──────────────────────────────────────────────────────────────
const TILE_COLORS: Record<number, string> = {
  0: "#2d4a2d", // grass
  1: "#1a1a2e", // wall/dark
  2: "#1e3a5f", // water
  3: "#4a3728", // path
  4: "#c2a46e", // sand
  5: "#1e3a1e", // dark grass
};

// ─── MINIMAP COLORS ───────────────────────────────────────────────────────────
const MINI_COLORS: Record<number, string> = {
  0: "#3a6b3a",
  1: "#111",
  2: "#2563eb",
  3: "#78503a",
  4: "#d4a96a",
  5: "#2d5a2d",
};

// ─── HELPER: distance in tiles ────────────────────────────────────────────────
function dist(ax: number, ay: number, bx: number, by: number) {
  return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}

function seeded01(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// ─── DIALOG BOX ──────────────────────────────────────────────────────────────
function DialogBox({ npc, lines, lineIndex, onNext, onClose }: { npc: NPC | null; lines: string[]; lineIndex: number; onNext: () => void; onClose: () => void }) {
  if (!npc || lineIndex >= lines.length) return null;
  const isLast = lineIndex === lines.length - 1;

  return (
    <div style={{
      position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)",
      width: "min(640px, 90vw)", zIndex: 200,
      background: "linear-gradient(135deg, rgba(10,10,24,0.98), rgba(20,10,40,0.98))",
      border: "2px solid #a78bfa",
      borderRadius: 16,
      boxShadow: "0 0 40px rgba(167,139,250,0.3), inset 0 0 20px rgba(167,139,250,0.05)",
      animation: "dialogIn 0.2s cubic-bezier(0.16,1,0.3,1)",
      overflow: "hidden",
    }}>
      {/* Top bar */}
      <div style={{ background: "rgba(167,139,250,0.15)", padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(167,139,250,0.3)" }}>
        <span style={{ fontSize: 24 }}>{npc.emoji}</span>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 10, color: "#a78bfa" }}>{npc.name}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {lines.map((_, i: number) => (
            <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= lineIndex ? "#a78bfa" : "rgba(167,139,250,0.2)", transition: "background 0.3s" }} />
          ))}
        </div>
      </div>
      {/* Text */}
      <div style={{ padding: "20px 24px" }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 9, color: "#e4e4e7", lineHeight: 2.2, letterSpacing: "0.04em" }}>
          {lines[lineIndex]}
        </p>
      </div>
      {/* Actions */}
      <div style={{ padding: "12px 24px 16px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
        <button onClick={onClose} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, padding: "8px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.5)", borderRadius: 8, cursor: "pointer" }}>
          [ESC] Close
        </button>
        <button onClick={onNext} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, padding: "8px 16px", background: isLast ? "rgba(167,139,250,0.3)" : "rgba(167,139,250,0.15)", border: "1px solid #a78bfa", color: "#a78bfa", borderRadius: 8, cursor: "pointer", transition: "background 0.2s" }}>
          {isLast ? "[E] Done ✓" : "[E] Next →"}
        </button>
      </div>
    </div>
  );
}

// ─── SKILL PANEL ─────────────────────────────────────────────────────────────
function SkillBar({ skill }: { skill: Skill }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: skill.color }}>{skill.name}</span>
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.6)" }}>Lv.{skill.level}</span>
      </div>
      <div style={{ height: 8, background: "rgba(255,255,255,0.1)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${skill.level}%`, background: `linear-gradient(90deg, ${skill.color}88, ${skill.color})`, borderRadius: 4, transition: "width 1s ease", boxShadow: `0 0 8px ${skill.color}88` }} />
      </div>
    </div>
  );
}

// ─── HUD ─────────────────────────────────────────────────────────────────────
function HUD({ nearZone, nearNPC }: { nearZone: Zone | null; nearNPC: NPC | null }) {
  return (
    <>
      {/* Top-left: player card */}
      <div className="hud-player-card" style={{ position: "absolute", top: 16, left: 16, zIndex: 100, background: "rgba(5,5,15,0.92)", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 12, padding: "12px 16px", minWidth: 200, backdropFilter: "blur(8px)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #a78bfa, #22ffcc)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🧙</div>
          <div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#a78bfa" }}>{PORTFOLIO.name}</div>
            <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{PORTFOLIO.title}</div>
          </div>
        </div>
        {/* HP bar */}
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#ef4444", marginBottom: 3 }}>HP</div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #dc2626, #ef4444)", borderRadius: 3, boxShadow: "0 0 6px #ef4444" }} />
          </div>
        </div>
        {/* XP bar */}
        <div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#fbbf24", marginBottom: 3 }}>XP {PORTFOLIO.xp.toLocaleString()}</div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ height: "100%", width: "76%", background: "linear-gradient(90deg, #d97706, #fbbf24)", borderRadius: 3, boxShadow: "0 0 6px #fbbf24" }} />
          </div>
        </div>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "#22ffcc", marginTop: 8 }}>
          ★ LEVEL {PORTFOLIO.level}
        </div>
      </div>

      {/* Top-right: controls */}
      <div className="hud-controls-card" style={{ position: "absolute", top: 16, right: 16, zIndex: 100, background: "rgba(5,5,15,0.85)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", backdropFilter: "blur(8px)" }}>
        <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>CONTROLS</div>
        {[["WASD / ↑↓←→", "Move"], ["E / Space", "Interact"], ["ESC", "Close dialog"]].map(([k, v]) => (
          <div key={k} style={{ display: "flex", gap: 8, marginBottom: 4, alignItems: "center" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: 4, color: "#22ffcc" }}>{k}</span>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "rgba(255,255,255,0.4)" }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Bottom center: zone label */}
      {nearZone && (
        <div style={{ position: "absolute", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "rgba(5,5,15,0.9)", border: `1px solid ${nearZone.color}`, borderRadius: 100, padding: "6px 20px", backdropFilter: "blur(8px)", boxShadow: `0 0 20px ${nearZone.color}44`, animation: "popIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: nearZone.color }}>{nearZone.label}</span>
        </div>
      )}

      {/* NPC prompt */}
      {nearNPC && (
        <div style={{ position: "absolute", bottom: nearZone ? 70 : 24, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "rgba(5,5,15,0.9)", border: "1px solid #a78bfa55", borderRadius: 100, padding: "5px 18px", animation: "popIn 0.3s cubic-bezier(0.16,1,0.3,1)" }}>
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 7, color: "rgba(255,255,255,0.7)" }}>Press [E] to talk to {nearNPC.name}</span>
        </div>
      )}
    </>
  );
}

// ─── MINIMAP ─────────────────────────────────────────────────────────────────
function Minimap({ playerTileX, playerTileY }: { playerTileX: number; playerTileY: number }) {
  const scale = 5;
  return (
    <div style={{ position: "absolute", bottom: 16, right: 16, zIndex: 100, background: "rgba(5,5,15,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: 8, backdropFilter: "blur(8px)" }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>MINIMAP</div>
      <div style={{ position: "relative", width: COLS * scale, height: ROWS * scale }}>
        {RAW_MAP.map((row, ry) =>
          row.map((tile, rx) => (
            <div key={`${rx}-${ry}`} style={{ position: "absolute", left: rx * scale, top: ry * scale, width: scale, height: scale, background: MINI_COLORS[tile] || "#111" }} />
          ))
        )}
        {/* Zone dots */}
        {ZONES.map(z => (
          <div key={z.id} style={{ position: "absolute", left: z.x * scale - 3, top: z.y * scale - 3, width: 7, height: 7, borderRadius: "50%", background: z.color, boxShadow: `0 0 4px ${z.color}`, opacity: 0.8 }} />
        ))}
        {/* Player dot */}
        <div style={{ position: "absolute", left: playerTileX * scale - 3, top: playerTileY * scale - 3, width: 7, height: 7, borderRadius: "50%", background: "#fff", boxShadow: "0 0 6px #fff", zIndex: 1, transition: "left 0.1s, top 0.1s" }} />
      </div>
    </div>
  );
}

// ─── SKILLS PANEL (floating) ──────────────────────────────────────────────────
function SkillsPanel({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div style={{ position: "absolute", bottom: 80, left: 16, zIndex: 100, background: "rgba(5,5,15,0.95)", border: "1px solid rgba(34,255,204,0.4)", borderRadius: 14, padding: "16px 20px", width: 240, backdropFilter: "blur(10px)", animation: "dialogIn 0.3s" }}>
      <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#22ffcc", marginBottom: 14 }}>⚔️ SKILL TREE</div>
      {PORTFOLIO.skills.map(sk => <SkillBar key={sk.name} skill={sk} />)}
    </div>
  );
}

// ─── MAIN GAME COMPONENT ──────────────────────────────────────────────────────
export default function GamePortfolio() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<GameState>({
    player: { x: 3 * TILE + TILE / 2, y: 3 * TILE + TILE / 2, dx: 0, dy: 0, dir: "down", frame: 0, frameTimer: 0 },
    keys: {},
    camera: { x: 0, y: 0 },
    particles: [],
  });

  const [playerTile, setPlayerTile] = useState({ x: 3, y: 3 });
  const [nearZone, setNearZone] = useState<Zone | null>(null);
  const [nearNPC, setNearNPC] = useState<NPC | null>(null);
  const [dialog, setDialog] = useState<NPC | null>(null);
  const [dialogLine, setDialogLine] = useState(0);
  const [showSkills, setShowSkills] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const animRef = useRef<number | null>(null);

  const spawnParticle = useCallback((x: number, y: number, color: string, count = 8) => {
    const g = gameRef.current;
    for (let i = 0; i < count; i++) {
      g.particles.push({ id: Math.random(), x, y, vx: (Math.random() - 0.5) * 3, vy: -Math.random() * 3 - 1, color, life: 1, size: 3 + Math.random() * 4, decay: 0.02 + Math.random() * 0.02 });
    }
  }, []);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  }, []);

  const nextLine = useCallback(() => {
    if (!dialog) return;
    const lines = DIALOGS[dialog.id];
    if (dialogLine >= lines.length - 1) {
      setDialog(null);
      notify("✨ Quest updated!");
    } else {
      setDialogLine(l => l + 1);
    }
  }, [dialog, dialogLine, notify]);

  const closeDialog = useCallback(() => {
    setDialog(null);
    setDialogLine(0);
  }, []);

  // Canvas game loop
  useEffect(() => {
    if (!started) return;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const maybeCtx = canvas.getContext("2d");
    if (!maybeCtx) return;
    const ctx = maybeCtx as CanvasRenderingContext2D;

    // Load pixel font for canvas
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const g = gameRef.current;

    // Tilesheet patterns
    function isSolid(tx: number, ty: number) {
      if (tx < 0 || tx >= COLS || ty < 0 || ty >= ROWS) return true;
      const t = RAW_MAP[ty][tx];
      return t === 1 || t === 2;
    }

    function drawTile(tx: number, ty: number, camX: number, camY: number) {
      const sx = tx * TILE - camX;
      const sy = ty * TILE - camY;
      if (sx < -TILE || sx > canvas.width + TILE || sy < -TILE || sy > canvas.height + TILE) return;

      const t = RAW_MAP[ty][tx];
      ctx.fillStyle = TILE_COLORS[t] || "#2d4a2d";
      ctx.fillRect(sx, sy, TILE, TILE);

      // Grid lines subtle
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(sx, sy, TILE, TILE);

      // Tile decorations
      if (t === 2) {
        // Water shimmer
        const wt = Date.now() * 0.001;
        ctx.fillStyle = `rgba(30,100,200,${0.3 + Math.sin(wt + tx * 0.5 + ty * 0.7) * 0.15})`;
        ctx.fillRect(sx, sy, TILE, TILE);
        // Wave lines
        ctx.strokeStyle = `rgba(100,180,255,${0.2 + Math.sin(wt * 2 + tx) * 0.1})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sx + 4, sy + TILE * 0.4 + Math.sin(wt + tx) * 3);
        ctx.lineTo(sx + TILE - 4, sy + TILE * 0.4 + Math.sin(wt + tx + 1) * 3);
        ctx.stroke();
      }
      if (t === 0 || t === 5) {
        // Grass dots
        if ((tx + ty) % 3 === 0) {
          ctx.fillStyle = t === 5 ? "#16532d" : "#3a6b3a";
          ctx.fillRect(sx + 6, sy + 8, 2, 8);
          ctx.fillRect(sx + 10, sy + 6, 2, 10);
          ctx.fillRect(sx + 14, sy + 9, 2, 7);
        }
      }
      if (t === 1) {
        // Wall/tree
        ctx.fillStyle = "#0f0f1a";
        ctx.fillRect(sx + 2, sy + 2, TILE - 4, TILE - 4);
        // Tree trunk
        ctx.fillStyle = "#3d2b1a";
        ctx.fillRect(sx + TILE / 2 - 3, sy + TILE - 12, 6, 12);
        // Tree top
        ctx.fillStyle = "#1a4d1a";
        ctx.beginPath();
        ctx.moveTo(sx + TILE / 2, sy + 4);
        ctx.lineTo(sx + TILE - 6, sy + TILE - 8);
        ctx.lineTo(sx + 6, sy + TILE - 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#2d6b2d";
        ctx.beginPath();
        ctx.moveTo(sx + TILE / 2, sy + 2);
        ctx.lineTo(sx + TILE - 10, sy + TILE - 16);
        ctx.lineTo(sx + 10, sy + TILE - 16);
        ctx.closePath();
        ctx.fill();
      }
      if (t === 4) {
        // Sand dots
        ctx.fillStyle = "#b89050";
        for (let d = 0; d < 4; d++) {
          ctx.fillRect(sx + ((tx * 7 + d * 11) % (TILE - 4)) + 2, sy + ((ty * 5 + d * 13) % (TILE - 4)) + 2, 2, 2);
        }
      }
    }

    function drawZoneMarker(zone: Zone, camX: number, camY: number) {
      const t = Date.now() * 0.001;
      const sx = zone.x * TILE - camX;
      const sy = zone.y * TILE - camY;
      const r = zone.r * TILE;

      // Pulsing zone circle
      const alpha = 0.1 + Math.sin(t * 2) * 0.06;
      ctx.beginPath();
      ctx.arc(sx + TILE / 2, sy + TILE / 2, r, 0, Math.PI * 2);
      ctx.fillStyle = zone.color + Math.floor(alpha * 255).toString(16).padStart(2, "0");
      ctx.fill();
      ctx.strokeStyle = zone.color + "88";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Zone label on ground
      ctx.font = "bold 10px monospace";
      ctx.fillStyle = zone.color + "cc";
      ctx.textAlign = "center";
      ctx.fillText(zone.label, sx + TILE / 2, sy + TILE + 14);
    }

    function drawNPC(npc: NPC, camX: number, camY: number) {
      const t = Date.now() * 0.001;
      const sx = npc.x * TILE - camX + TILE / 2;
      const sy = npc.y * TILE - camY + TILE / 2;
      const bounce = Math.sin(t * 2 + npc.x) * 3;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + TILE / 2 - 2, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // NPC body (pixel style)
      ctx.font = `${TILE - 8}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(npc.emoji, sx, sy - 2 + bounce);

      // Name tag
      const isNear = dist(g.player.x / TILE, g.player.y / TILE, npc.x, npc.y) < 4;
      if (isNear) {
        ctx.font = "bold 9px monospace";
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        const tw = ctx.measureText(npc.name).width;
        ctx.fillStyle = "rgba(10,10,24,0.85)";
        ctx.roundRect(sx - tw / 2 - 6, sy - TILE / 2 + bounce - 20, tw + 12, 18, 4);
        ctx.fill();
        ctx.fillStyle = "#a78bfa";
        ctx.fillText(npc.name, sx, sy - TILE / 2 + bounce - 11);

        // Exclamation mark
        ctx.font = "bold 14px sans-serif";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("!", sx, sy - TILE / 2 + bounce - 32 + Math.sin(t * 3) * 2);
      }
    }

    function drawPlayer(camX: number, camY: number) {
      const p = g.player;
      const t = Date.now() * 0.001;
      const sx = p.x - camX;
      const sy = p.y - camY;
      const moving = p.dx !== 0 || p.dy !== 0;
      const bob = moving ? Math.sin(t * 10) * 3 : 0;

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.beginPath();
      ctx.ellipse(sx, sy + TILE / 2 - 2, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player glow
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, TILE * 0.7);
      grad.addColorStop(0, "rgba(167,139,250,0.25)");
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, TILE * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Player sprite (pixel art style with canvas)
      const pw = 28, ph = 36;
      const px = sx - pw / 2, py = sy - ph / 2 + bob;

      // Body
      ctx.fillStyle = "#6d28d9";
      ctx.fillRect(px + 6, py + 14, pw - 12, ph - 20);

      // Head
      ctx.fillStyle = "#fbbf24";
      ctx.fillRect(px + 8, py + 2, pw - 16, 14);

      // Eyes based on direction
      ctx.fillStyle = "#1a1a2e";
      if (p.dir === "down" || p.dir === "right") ctx.fillRect(px + 10, py + 7, 3, 3);
      if (p.dir === "down" || p.dir === "left") ctx.fillRect(px + pw - 13, py + 7, 3, 3);

      // Hair
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(px + 8, py + 2, pw - 16, 4);

      // Legs (animated)
      ctx.fillStyle = "#374151";
      if (moving) {
        const legPhase = Math.sin(t * 12);
        ctx.fillRect(px + 7, py + ph - 10, 6, 10 + legPhase * 3);
        ctx.fillRect(px + pw - 13, py + ph - 10, 6, 10 - legPhase * 3);
      } else {
        ctx.fillRect(px + 7, py + ph - 10, 6, 10);
        ctx.fillRect(px + pw - 13, py + ph - 10, 6, 10);
      }

      // Cape/cloak
      ctx.fillStyle = "#7c3aed";
      ctx.beginPath();
      ctx.moveTo(px + 4, py + 14);
      ctx.lineTo(px + 2, py + ph - 8 + Math.sin(t * 3) * 2);
      ctx.lineTo(px + 8, py + ph - 12);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(px + pw - 4, py + 14);
      ctx.lineTo(px + pw - 2, py + ph - 8 + Math.sin(t * 3 + 1) * 2);
      ctx.lineTo(px + pw - 8, py + ph - 12);
      ctx.closePath();
      ctx.fill();

      // Wand/staff
      ctx.strokeStyle = "#a78bfa";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(sx + pw / 2 - 2, sy - 4 + bob);
      ctx.lineTo(sx + pw / 2 + 6, sy - 14 + bob);
      ctx.stroke();
      // Wand star
      const st = Date.now() * 0.003;
      ctx.fillStyle = `hsl(${st * 60 % 360},100%,70%)`;
      ctx.beginPath();
      ctx.arc(sx + pw / 2 + 6, sy - 14 + bob, 4 + Math.sin(t * 4) * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawParticles(camX: number, camY: number) {
      g.particles = g.particles.filter(p => p.life > 0);
      g.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= p.decay;
        const radius = Math.max(0, p.size * p.life);
        if (radius <= 0) return;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x - camX, p.y - camY, radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    }

    function update() {
      const p = g.player;
      const dialogOpen = !!document.querySelector("[data-dialog-open]");

      if (!dialogOpen) {
        let ndx = 0, ndy = 0;
        if (g.keys["ArrowUp"] || g.keys["w"] || g.keys["W"]) ndy = -PLAYER_SPEED;
        if (g.keys["ArrowDown"] || g.keys["s"] || g.keys["S"]) ndy = PLAYER_SPEED;
        if (g.keys["ArrowLeft"] || g.keys["a"] || g.keys["A"]) ndx = -PLAYER_SPEED;
        if (g.keys["ArrowRight"] || g.keys["d"] || g.keys["D"]) ndx = PLAYER_SPEED;

        // Diagonal normalise
        if (ndx !== 0 && ndy !== 0) { ndx *= 0.707; ndy *= 0.707; }

        p.dx = ndx; p.dy = ndy;

        // Collision detection
        const nx = p.x + ndx;
        const ny = p.y + ndy;
        const margin = 14;

        const txL = Math.floor((nx - margin) / TILE);
        const txR = Math.floor((nx + margin) / TILE);
        const tyT = Math.floor((ny - margin) / TILE);
        const tyB = Math.floor((ny + margin) / TILE);

        const canX = !isSolid(txL, Math.floor(p.y / TILE)) && !isSolid(txR, Math.floor(p.y / TILE));
        const canY = !isSolid(Math.floor(p.x / TILE), tyT) && !isSolid(Math.floor(p.x / TILE), tyB);

        if (canX) p.x = nx;
        if (canY) p.y = ny;

        if (ndx > 0) p.dir = "right";
        else if (ndx < 0) p.dir = "left";
        else if (ndy < 0) p.dir = "up";
        else if (ndy > 0) p.dir = "down";
      } else {
        p.dx = 0; p.dy = 0;
      }

      // Camera follow
      const targetCamX = p.x - canvas.width / 2;
      const targetCamY = p.y - canvas.height / 2;
      const maxCamX = COLS * TILE - canvas.width;
      const maxCamY = ROWS * TILE - canvas.height;
      g.camera.x += (Math.max(0, Math.min(maxCamX, targetCamX)) - g.camera.x) * 0.1;
      g.camera.y += (Math.max(0, Math.min(maxCamY, targetCamY)) - g.camera.y) * 0.1;
    }

    function checkProximity() {
      const p = gameRef.current.player;
      const ptx = p.x / TILE;
      const pty = p.y / TILE;

      const zone = ZONES.find(z => dist(ptx, pty, z.x, z.y) < z.r);
      const npc = NPCS.find(n => dist(ptx, pty, n.x, n.y) < 2.2);

      setPlayerTile({ x: Math.floor(ptx), y: Math.floor(pty) });
      setNearZone(zone || null);
      setNearNPC(npc || null);

      if (zone?.id === "skills") setShowSkills(true);
      else setShowSkills(false);
    }

    function drawLoop() {
      update();
      checkProximity();

      const cam = g.camera;
      const p = g.player;

      // Background
      ctx.fillStyle = "#0a0a14";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // World bounds shadow
      ctx.fillStyle = "#050508";
      ctx.fillRect(-cam.x < 0 ? 0 : -cam.x, 0, Math.max(0, -cam.x), canvas.height);

      // Draw tiles
      for (let ty = 0; ty < ROWS; ty++) {
        for (let tx = 0; tx < COLS; tx++) {
          drawTile(tx, ty, cam.x, cam.y);
        }
      }

      // Zone markers
      ZONES.forEach(z => drawZoneMarker(z, cam.x, cam.y));

      // NPCs (behind player if player is lower)
      const playerTileY2 = Math.floor(p.y / TILE);
      NPCS.filter(n => n.y <= playerTileY2).forEach(n => drawNPC(n, cam.x, cam.y));
      drawPlayer(cam.x, cam.y);
      NPCS.filter(n => n.y > playerTileY2).forEach(n => drawNPC(n, cam.x, cam.y));

      // Particles
      drawParticles(cam.x, cam.y);

      // Vignette
      const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, canvas.height * 0.85);
      vig.addColorStop(0, "transparent");
      vig.addColorStop(1, "rgba(0,0,5,0.7)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animRef.current = requestAnimationFrame(drawLoop);
    }

    // Input handlers
    const onKeyDown = (e: KeyboardEvent) => {
      g.keys[e.key] = true;
      if (e.key === "e" || e.key === "E" || e.key === " ") {
        e.preventDefault();
        const npc = NPCS.find(n => dist(g.player.x / TILE, g.player.y / TILE, n.x, n.y) < 2.2);
        if (npc) {
          setDialog(npc);
          setDialogLine(0);
          spawnParticle(g.player.x, g.player.y, "#a78bfa", 10);
        }
      }
      if (e.key === "Escape") {
        setDialog(null);
        setDialogLine(0);
      }
    };
    const onKeyUp = (e: KeyboardEvent) => { g.keys[e.key] = false; };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    animRef.current = requestAnimationFrame(drawLoop);

    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", resize);
    };
  }, [started, spawnParticle]);

  // START SCREEN
  if (!started) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          body { margin: 0; background: #050508; }
          @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
          @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
          @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
          @keyframes starTwinkle { 0%,100%{opacity:0.3} 50%{opacity:1} }
          @keyframes titleGlow {
            0%,100%{text-shadow:0 0 20px #a78bfa, 0 0 40px #a78bfa}
            50%{text-shadow:0 0 40px #a78bfa, 0 0 80px #22ffcc, 0 0 120px #ec4899}
          }
        `}</style>
        <div style={{ width: "100vw", height: "100vh", background: "#050508", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "'Press Start 2P', monospace" }}>
          {/* Stars */}
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 2,
                height: 2,
                background: "white",
                borderRadius: "50%",
                left: `${seeded01(i, 11) * 100}%`,
                top: `${seeded01(i, 29) * 100}%`,
                opacity: 0.4,
                animation: `starTwinkle ${2 + seeded01(i, 47) * 3}s ${seeded01(i, 71) * 3}s infinite`,
              }}
            />
          ))}

          {/* Scanline */}
          <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "rgba(167,139,250,0.15)", animation: "scanline 4s linear infinite", pointerEvents: "none" }} />

          {/* Title card */}
          <div style={{ textAlign: "center", zIndex: 10 }}>
            <div style={{ fontSize: "clamp(8px, 2vw, 14px)", color: "#a78bfa", animation: "titleGlow 3s infinite", marginBottom: 8, letterSpacing: "0.2em" }}>
              ★ WELCOME TO ★
            </div>
            <div style={{ fontSize: "clamp(24px, 6vw, 52px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: 6, textShadow: "0 0 30px #a78bfa" }}>
              RAHUL.EXE
            </div>
            <div style={{ fontSize: "clamp(6px, 1.2vw, 10px)", color: "#22ffcc", letterSpacing: "0.15em", marginBottom: 40 }}>
              AN INTERACTIVE PORTFOLIO ADVENTURE
            </div>

            <div style={{ animation: "float 3s ease-in-out infinite", fontSize: 80, marginBottom: 32 }}>🧙</div>

            <div style={{ background: "rgba(10,10,24,0.9)", border: "1px solid rgba(167,139,250,0.3)", borderRadius: 16, padding: "24px 32px", marginBottom: 40, maxWidth: 480, backdropFilter: "blur(10px)" }}>
              <div style={{ fontSize: "clamp(6px, 1vw, 9px)", color: "rgba(255,255,255,0.6)", lineHeight: 2.5 }}>
                <div>🌈 EXPLORE 4 QUEST ZONES</div>
                <div>⚔️ DISCOVER SKILLS & PROJECTS</div>
                <div>💬 TALK TO NPCs TO LEARN MORE</div>
                <div>🗺️ USE MINIMAP TO NAVIGATE</div>
              </div>
            </div>

            <button
              onClick={() => setStarted(true)}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(8px, 1.5vw, 12px)", padding: "16px 40px", background: "linear-gradient(135deg, #7c3aed, #a78bfa)", border: "none", color: "white", borderRadius: 12, cursor: "pointer", letterSpacing: "0.1em", boxShadow: "0 0 30px rgba(124,58,237,0.5)", transition: "all 0.2s", animation: "blink 1.5s infinite" }}
              onMouseOver={(e: ReactMouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.animation = "none"; }}
              onMouseOut={(e: ReactMouseEvent<HTMLButtonElement>) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.animation = "blink 1.5s infinite"; }}
            >
              ▶ PRESS START
            </button>

            <div style={{ marginTop: 24, fontSize: "clamp(5px, 0.8vw, 7px)", color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em" }}>
              USE WASD OR ARROW KEYS TO MOVE
            </div>
          </div>
        </div>
      </>
    );
  }

  // ─── GAME SCREEN ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { overflow: hidden; background: #050508; cursor: crosshair; }
        @keyframes dialogIn { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes popIn { from{opacity:0;transform:translateX(-50%) scale(0.85)} to{opacity:1;transform:translateX(-50%) scale(1)} }
        @keyframes notifIn { from{opacity:0;transform:translateY(-20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes notifOut { to{opacity:0;transform:translateY(-20px)} }
        button:hover { opacity: 0.85; }
        @media (max-width: 960px) {
          .hud-player-card, .hud-controls-card { display: none !important; }
        }
        @media (max-width: 720px) {
          .zone-legend { display: none !important; }
        }
      `}</style>

      <div style={{ width: "100vw", height: "100vh", position: "relative", overflow: "hidden", background: "#050508" }} data-dialog-open={dialog ? "true" : undefined}>
        {/* Game canvas */}
        <canvas ref={canvasRef} style={{ display: "block", imageRendering: "pixelated" }} />

        {/* HUD */}
        <HUD nearZone={nearZone} nearNPC={nearNPC} />

        {/* Skill panel (shows in skills zone) */}
        <SkillsPanel visible={showSkills && !dialog} />

        {/* Minimap */}
        <Minimap playerTileX={playerTile.x} playerTileY={playerTile.y} />

        {/* Dialog */}
        {dialog && (
          <DialogBox
            npc={dialog}
            lines={DIALOGS[dialog.id] || []}
            lineIndex={dialogLine}
            onNext={nextLine}
            onClose={closeDialog}
          />
        )}

        {/* Notification */}
        {notification && (
          <div style={{ position: "absolute", top: 80, left: "50%", transform: "translateX(-50%)", zIndex: 300, background: "rgba(5,5,15,0.95)", border: "1px solid #22ffcc", borderRadius: 100, padding: "8px 24px", animation: "notifIn 0.3s ease", backdropFilter: "blur(8px)" }}>
            <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 8, color: "#22ffcc" }}>{notification}</span>
          </div>
        )}

        {/* Mobile controls */}
        <div style={{ position: "absolute", bottom: 80, left: 24, zIndex: 200 }}>
          {/* D-Pad */}
          <div style={{ display: "grid", gridTemplateColumns: "40px 40px 40px", gridTemplateRows: "40px 40px 40px", gap: 4 }}>
            {[
              [null, "ArrowUp", null],
              ["ArrowLeft", null, "ArrowRight"],
              [null, "ArrowDown", null],
            ].map((row, ri) => row.map((key, ci) => key ? (
              <button key={`${ri}-${ci}`}
                onPointerDown={() => { gameRef.current.keys[key] = true; }}
                onPointerUp={() => { gameRef.current.keys[key] = false; }}
                onPointerLeave={() => { gameRef.current.keys[key] = false; }}
                style={{ width: 40, height: 40, background: "rgba(167,139,250,0.2)", border: "1px solid rgba(167,139,250,0.4)", borderRadius: 8, color: "#a78bfa", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", userSelect: "none", touchAction: "none" }}>
                {key === "ArrowUp" ? "▲" : key === "ArrowDown" ? "▼" : key === "ArrowLeft" ? "◄" : "►"}
              </button>
            ) : <div key={`${ri}-${ci}`} />))}
          </div>
        </div>

        {/* Mobile interact button */}
        <div style={{ position: "absolute", bottom: 80, right: 24, zIndex: 200 }}>
          <button
            onPointerDown={() => {
              const g = gameRef.current;
              const npc = NPCS.find(n => dist(g.player.x / TILE, g.player.y / TILE, n.x, n.y) < 2.2);
              if (npc) { setDialog(npc); setDialogLine(0); }
              else if (dialog) nextLine();
            }}
            style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(167,139,250,0.25)", border: "2px solid rgba(167,139,250,0.6)", color: "#a78bfa", fontFamily: "'Press Start 2P', monospace", fontSize: 8, cursor: "pointer", userSelect: "none", touchAction: "none" }}>
            {dialog ? "▶" : "E"}
          </button>
        </div>

        {/* Zone legend */}
        <div className="zone-legend" style={{ position: "absolute", top: "50%", right: 16, transform: "translateY(-50%)", zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
          {ZONES.map(z => (
            <div key={z.id} style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(5,5,15,0.85)", border: `1px solid ${z.color}44`, borderRadius: 100, padding: "4px 10px", backdropFilter: "blur(6px)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: z.color, boxShadow: `0 0 6px ${z.color}` }} />
              <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: 6, color: "rgba(255,255,255,0.5)" }}>{z.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
