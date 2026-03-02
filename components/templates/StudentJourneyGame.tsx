'use client';

import React, {
  useEffect, useRef, useState, useCallback, useReducer,
} from "react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
type GameScreen   = "title" | "playing" | "gameover" | "victory";
type Direction    = "up" | "down" | "left" | "right";
type ZoneId       = "library" | "classroom" | "lab" | "cafeteria" | "career" | "interview";
type TileType     = 0 | 1 | 2 | 3 | 4 | 5 | 6;

interface Vec2          { x: number; y: number; }
interface PlayerState   { pos: Vec2; dir: Direction; moving: boolean; }
interface Stats {
  gpa: number; coding: number; dsa: number;
  softSkills: number; energy: number; confidence: number;
  jobOffers: number; day: number; studyStreak: number;
}
interface Zone {
  id: ZoneId; label: string; emoji: string; color: string;
  tileX: number; tileY: number; radius: number;
  action: string; description: string;
}
interface NPC {
  id: string; name: string; emoji: string;
  tileX: number; tileY: number; zone: ZoneId; color: string;
}
interface DialogEntry { speaker: string; emoji: string; lines: string[]; color: string; }
interface Particle    { id: number; x: number; y: number; vx: number; vy: number; color: string; life: number; decay: number; size: number; text?: string; }
interface QuizQuestion { question: string; options: string[]; correct: number; topic: string; }
interface GameEvent    { id: string; title: string; description: string; emoji: string; day: number; completed: boolean; }
interface JoystickState { active: boolean; origin: Vec2; current: Vec2; dx: number; dy: number; }

type GameAction =
  | { type: "STUDY_CODING" } | { type: "STUDY_DSA" } | { type: "ATTEND_CLASS" }
  | { type: "EAT_MEAL" }     | { type: "MOCK_INTERVIEW" } | { type: "APPLY_JOB" }
  | { type: "REST" }         | { type: "NEXT_DAY" };

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const TILE        = 40;
const COLS        = 26;
const ROWS        = 18;
const BASE_SPEED  = 2.8;
const TOTAL_DAYS  = 30;
const JOY_RADIUS  = 52;   // joystick outer radius px
const JOY_DEAD    = 0.18; // dead-zone fraction

const INITIAL_STATS: Stats = {
  gpa: 2.5, coding: 20, dsa: 15, softSkills: 30,
  energy: 80, confidence: 40, jobOffers: 0, day: 1, studyStreak: 0,
};

// ─────────────────────────────────────────────────────────────────────────────
// MAP  (26 × 18)
// ─────────────────────────────────────────────────────────────────────────────
const RAW_MAP: TileType[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,3,3,3,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,4,4,0,0,1],
  [1,3,0,3,0,6,6,0,1,0,6,6,6,6,0,0,1,0,6,6,0,4,4,0,0,1],
  [1,3,0,3,0,6,6,0,1,0,6,6,6,6,0,0,1,0,6,6,0,4,4,0,0,1],
  [1,3,3,3,0,0,0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,4,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,4,1,0,0,6,6,0,0,0,1,0,0,4,4,4,0,0,0,1],
  [1,0,0,6,6,0,0,0,1,0,0,6,6,0,0,0,5,0,0,4,4,4,0,0,0,1],
  [1,0,0,6,6,0,0,0,5,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1,1,1,1,5,1,1,1,1,1,1],
  [1,0,0,0,0,3,3,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,3,3,0,1,0,6,6,6,6,0,0,1,0,6,0,6,0,6,0,0,1],
  [1,0,0,0,0,0,0,0,1,0,6,6,6,6,0,0,1,0,6,0,6,0,6,0,0,1],
  [1,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// ─────────────────────────────────────────────────────────────────────────────
// ZONES & NPCS
// ─────────────────────────────────────────────────────────────────────────────
const ZONES: Zone[] = [
  { id:"library",   label:"📚 Library",       emoji:"📚", color:"#f59e0b", tileX:2,  tileY:2,  radius:3, action:"Study DSA",      description:"Hit the books! +DSA, +GPA, -Energy" },
  { id:"classroom", label:"🎓 Classroom",      emoji:"🎓", color:"#3b82f6", tileX:12, tileY:2,  radius:3, action:"Attend Lecture",  description:"Learn from profs! +GPA, +SoftSkills" },
  { id:"lab",       label:"💻 CS Lab",         emoji:"💻", color:"#22ffcc", tileX:21, tileY:2,  radius:3, action:"Code Practice",   description:"Write code! +Coding, +Confidence" },
  { id:"cafeteria", label:"🍕 Cafeteria",      emoji:"🍕", color:"#ec4899", tileX:3,  tileY:10, radius:3, action:"Eat & Rest",      description:"Recharge! +Energy, +SoftSkills" },
  { id:"career",    label:"📋 Career Center",  emoji:"📋", color:"#a78bfa", tileX:12, tileY:10, radius:3, action:"Apply for Jobs",  description:"Send applications! Needs high stats." },
  { id:"interview", label:"🎤 Interview Room", emoji:"🎤", color:"#f43f5e", tileX:21, tileY:10, radius:3, action:"Mock Interview",  description:"Practice interviews! +Confidence" },
];

const NPCS: NPC[] = [
  { id:"librarian", name:"Ms. Patel",    emoji:"👩‍🏫", tileX:2,  tileY:3,  zone:"library",   color:"#f59e0b" },
  { id:"professor", name:"Prof. Sharma", emoji:"👨‍🏫", tileX:12, tileY:3,  zone:"classroom", color:"#3b82f6" },
  { id:"ta",        name:"TA Dev",       emoji:"🧑‍💻", tileX:21, tileY:3,  zone:"lab",       color:"#22ffcc" },
  { id:"friend",    name:"Priya",        emoji:"👩‍🎓", tileX:4,  tileY:10, zone:"cafeteria", color:"#ec4899" },
  { id:"counselor", name:"Career Coach", emoji:"🤵",   tileX:12, tileY:10, zone:"career",    color:"#a78bfa" },
  { id:"hr",        name:"HR Rekruiter", emoji:"💼",   tileX:21, tileY:10, zone:"interview", color:"#f43f5e" },
];

const NPC_DIALOGS: Record<string, DialogEntry> = {
  librarian: { speaker:"Ms. Patel",    emoji:"👩‍🏫", color:"#f59e0b", lines:["📖 Welcome! DSA is the heart of every technical interview.","🧠 Study arrays, trees, graphs & DP every day!","⏰ 1 hour/day beats 10 hours once a week!","💡 Check out CLRS book — it changes lives!"] },
  professor: { speaker:"Prof. Sharma", emoji:"👨‍🏫", color:"#3b82f6", lines:["🎓 Attendance matters for GPA AND networking!","📝 Take notes, ask questions, participate.","🤝 Soft skills are 50% of landing a job.","🌟 GPA above 3.5 opens doors to top companies!"] },
  ta:        { speaker:"TA Dev",       emoji:"🧑‍💻", color:"#22ffcc", lines:["💻 LeetCode daily — start Easy, move to Medium.","🚀 Build real projects & put them on GitHub!","🔧 Know React, Node, SQL and REST APIs cold.","✅ Solve 150+ problems before interviews!"] },
  friend:    { speaker:"Priya",        emoji:"👩‍🎓", color:"#ec4899", lines:["😊 Grab a bite — energy is everything!","💬 Soft skills matter more than you think.","🤗 Join clubs & hackathons — it really helps!","🍕 A fed brain is a sharp brain. Don't skip meals!"] },
  counselor: { speaker:"Career Coach", emoji:"🤵",   color:"#a78bfa", lines:["📋 1-page resume, clean & ATS-friendly.","🎯 Target companies that match your skill level first.","🔗 LinkedIn profile MUST be 100% complete!","📨 Apply to 10+ companies weekly for best results."] },
  hr:        { speaker:"HR Recruiter", emoji:"💼",   color:"#f43f5e", lines:["🎤 Mock interviews build muscle memory!","💡 Use the STAR method: Situation, Task, Action, Result.","👔 Dress professionally even for virtual interviews.","🌟 Confidence is contagious — believe in yourself!"] },
};

const QUIZ_POOL: QuizQuestion[] = [
  { question:"Time complexity of binary search?",       options:["O(n)","O(log n)","O(n²)","O(1)"],          correct:1, topic:"DSA" },
  { question:"Which DS uses LIFO order?",               options:["Queue","Array","Stack","Linked List"],       correct:2, topic:"DSA" },
  { question:"What does REST stand for?",               options:["Remote Exec State Transfer","Representational State Transfer","Resource State Template","Relational State Transfer"], correct:1, topic:"Web" },
  { question:"What is a closure in JavaScript?",        options:["A loop","Function + its lexical scope","An array method","A CSS property"], correct:1, topic:"JS" },
  { question:"React hook for side effects?",            options:["useState","useCallback","useEffect","useMemo"], correct:2, topic:"React" },
  { question:"What does SQL JOIN do?",                  options:["Deletes records","Combines rows from tables","Creates indexes","Updates columns"], correct:1, topic:"DB" },
  { question:"Big-O notation measures?",               options:["Memory allocation","Algorithm complexity","UI rendering","Network speed"], correct:1, topic:"DSA" },
  { question:"What is a Promise in JS?",               options:["A variable","An async result object","A CSS animation","A loop type"], correct:1, topic:"JS" },
];

const GAME_EVENTS: GameEvent[] = [
  { id:"hackathon",  title:"🏆 Hackathon!",       description:"Participate in the college hackathon! +Coding +Confidence", emoji:"🏆", day:7,  completed:false },
  { id:"internship", title:"📨 Internship Drive",  description:"Companies on campus! Polish your resume now.",              emoji:"📨", day:14, completed:false },
  { id:"placement",  title:"🎯 Placement Season",  description:"Final placements begin! Your skills are tested.",           emoji:"🎯", day:21, completed:false },
  { id:"offer",      title:"🎉 Job Offer!",         description:"You've received an offer! Keep grinding or accept?",        emoji:"🎉", day:28, completed:false },
];

const TILE_COLORS: Record<TileType, string> = {
  0:"#1a1a2e", 1:"#0d0d1a", 2:"#1a2a3a",
  3:"#2d1a0d", 4:"#0d1a2d", 5:"#2d2000", 6:"#1e1a2e",
};
const MINI_COLORS: Record<TileType, string> = {
  0:"#2a2a45", 1:"#070712", 2:"#0d2040",
  3:"#1a0d05", 4:"#051020", 5:"#1a1000", 6:"#1a1535",
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const clamp = (v: number, mn: number, mx: number): number => Math.max(mn, Math.min(mx, v));
const tileDist = (ax: number, ay: number, bx: number, by: number): number =>
  Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
const seeded01 = (i: number, seed: number): number => {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
    return;
  }
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
}

// ─────────────────────────────────────────────────────────────────────────────
// REDUCER
// ─────────────────────────────────────────────────────────────────────────────
function statsReducer(s: Stats, a: GameAction): Stats {
  switch (a.type) {
    case "STUDY_CODING":    return { ...s, coding: clamp(s.coding+8,0,100), confidence:clamp(s.confidence+4,0,100), energy:clamp(s.energy-15,0,100), studyStreak:s.studyStreak+1 };
    case "STUDY_DSA":       return { ...s, dsa:clamp(s.dsa+7,0,100), gpa:clamp(s.gpa+0.05,0,4), energy:clamp(s.energy-18,0,100), studyStreak:s.studyStreak+1 };
    case "ATTEND_CLASS":    return { ...s, gpa:clamp(s.gpa+0.08,0,4), softSkills:clamp(s.softSkills+5,0,100), energy:clamp(s.energy-10,0,100) };
    case "EAT_MEAL":        return { ...s, energy:clamp(s.energy+40,0,100), softSkills:clamp(s.softSkills+3,0,100) };
    case "MOCK_INTERVIEW":  return { ...s, confidence:clamp(s.confidence+10,0,100), softSkills:clamp(s.softSkills+6,0,100), energy:clamp(s.energy-20,0,100) };
    case "APPLY_JOB": {
      const score = (s.coding + s.dsa + s.softSkills + s.confidence) / 4;
      const ok = score > 55 && Math.random() < score / 110;
      return { ...s, jobOffers: ok ? s.jobOffers+1 : s.jobOffers, confidence:clamp(s.confidence+(ok?8:-2),0,100), energy:clamp(s.energy-12,0,100) };
    }
    case "REST":            return { ...s, energy:clamp(s.energy+30,0,100), studyStreak:0 };
    case "NEXT_DAY":        return { ...s, day:s.day+1, energy:clamp(s.energy+20,0,100) };
    default:                return s;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

/** Returns true if window width <= 640 */
function useIsMobile(): boolean {
  const [mob, setMob] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 640 : false));
  useEffect(() => {
    const fn = () => setMob(window.innerWidth <= 640);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mob;
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface StatBarProps { label: string; value: number; max: number; color: string; icon: string; compact?: boolean; }
const StatBar: React.FC<StatBarProps> = ({ label, value, max, color, icon, compact }) => (
  <div style={{ marginBottom: compact ? 4 : 6 }}>
    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
      <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: compact ? 5 : 6, color:"rgba(255,255,255,0.65)" }}>{icon} {label}</span>
      <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: compact ? 5 : 6, color }}>
        {max === 4 ? (value as number).toFixed(1) : Math.round(value)}
      </span>
    </div>
    <div style={{ height: compact ? 4 : 5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
      <div style={{ height:"100%", width:`${(value/max)*100}%`, background:color, borderRadius:3, transition:"width 0.5s ease", boxShadow:`0 0 5px ${color}88` }} />
    </div>
  </div>
);

interface DialogBoxProps { entry: DialogEntry; lineIndex: number; onNext: ()=>void; onClose: ()=>void; isMobile: boolean; }
const DialogBox: React.FC<DialogBoxProps> = ({ entry, lineIndex, onNext, onClose, isMobile }) => {
  const isLast = lineIndex >= entry.lines.length - 1;
  return (
    <div style={{ position:"absolute", bottom: isMobile ? 170 : 90, left:"50%", transform:"translateX(-50%)", width:`min(${isMobile?92:600}px,94vw)`, zIndex:300, background:"rgba(5,5,18,0.97)", border:`2px solid ${entry.color}`, borderRadius:14, boxShadow:`0 0 40px ${entry.color}44`, animation:"slideUp .22s ease", overflow:"hidden" }}>
      <div style={{ background:`${entry.color}18`, borderBottom:`1px solid ${entry.color}44`, padding:"8px 14px", display:"flex", alignItems:"center", gap:10 }}>
        <span style={{ fontSize: isMobile ? 18 : 22 }}>{entry.emoji}</span>
        <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile ? 7 : 8, color:entry.color }}>{entry.speaker}</span>
        <div style={{ marginLeft:"auto", display:"flex", gap:3 }}>
          {entry.lines.map((_,i)=>(
            <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i<=lineIndex ? entry.color:`${entry.color}33`, transition:"background .3s" }} />
          ))}
        </div>
      </div>
      <div style={{ padding: isMobile ? "12px 14px" : "16px 20px" }}>
        <p style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile ? 7 : 8, color:"#e4e4e7", lineHeight:2.1 }}>{entry.lines[lineIndex]}</p>
      </div>
      <div style={{ padding:"8px 14px 12px", display:"flex", justifyContent:"flex-end", gap:8 }}>
        <button onClick={onClose} style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, padding: isMobile?"10px 14px":"7px 14px", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.4)", borderRadius:6, cursor:"pointer", minHeight:40 }}>✕</button>
        <button onClick={onNext}  style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, padding: isMobile?"10px 16px":"7px 14px", background:`${entry.color}22`, border:`1px solid ${entry.color}`, color:entry.color, borderRadius:6, cursor:"pointer", minHeight:40 }}>
          {isLast ? "Got it ✓" : "Next →"}
        </button>
      </div>
    </div>
  );
};

interface QuizModalProps { question: QuizQuestion; onAnswer: (correct:boolean)=>void; isMobile: boolean; }
const QuizModal: React.FC<QuizModalProps> = ({ question, onAnswer, isMobile }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16, touchAction:"none" }}>
    <div style={{ background:"rgba(5,5,18,0.98)", border:"2px solid #22ffcc", borderRadius:18, padding: isMobile?"20px 18px":"28px 32px", maxWidth:520, width:"100%", boxShadow:"0 0 60px #22ffcc44" }}>
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:8, color:"#22ffcc", marginBottom:8 }}>🧠 QUIZ — {question.topic}</div>
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:9, color:"#fff", lineHeight:2, marginBottom:20 }}>{question.question}</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {question.options.map((opt,i)=>(
          <button key={i} onClick={()=>onAnswer(i===question.correct)}
            style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, padding: isMobile?"14px 14px":"11px 16px", background:"rgba(34,255,204,0.07)", border:"1px solid rgba(34,255,204,0.25)", color:"#e4e4e7", borderRadius:8, cursor:"pointer", textAlign:"left", lineHeight:1.6, minHeight:48, touchAction:"manipulation" }}>
            {String.fromCharCode(65+i)}. {opt}
          </button>
        ))}
      </div>
    </div>
  </div>
);

interface EventModalProps { event: GameEvent; onAccept:()=>void; onSkip:()=>void; isMobile:boolean; }
const EventModal: React.FC<EventModalProps> = ({ event, onAccept, onSkip, isMobile }) => (
  <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.88)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16, touchAction:"none" }}>
    <div style={{ background:"rgba(5,5,18,0.98)", border:"2px solid #a78bfa", borderRadius:18, padding: isMobile?"24px 20px":"32px 36px", maxWidth:440, width:"100%", textAlign:"center", boxShadow:"0 0 60px #a78bfa44" }}>
      <div style={{ fontSize: isMobile?48:56, marginBottom:14 }}>{event.emoji}</div>
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?9:11, color:"#a78bfa", marginBottom:12 }}>{event.title}</div>
      <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:8, color:"rgba(255,255,255,0.6)", lineHeight:2.2, marginBottom:24 }}>{event.description}</div>
      <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
        <button onClick={onAccept} style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?8:8, padding:"14px 22px", background:"rgba(167,139,250,0.2)", border:"1px solid #a78bfa", color:"#a78bfa", borderRadius:10, cursor:"pointer", minHeight:48, touchAction:"manipulation" }}>✅ Participate!</button>
        <button onClick={onSkip}   style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?8:8, padding:"14px 20px", background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"rgba(255,255,255,0.4)", borderRadius:10, cursor:"pointer", minHeight:48, touchAction:"manipulation" }}>Skip</button>
      </div>
    </div>
  </div>
);

interface ActivityPanelProps { zone: Zone; stats: Stats; onAction:()=>void; onClose:()=>void; isMobile:boolean; }
const ActivityPanel: React.FC<ActivityPanelProps> = ({ zone, stats, onAction, onClose, isMobile }) => {
  const canApply = zone.id !== "career" || (stats.coding + stats.dsa + stats.confidence) / 3 > 45;
  return (
    <div style={{ position:"absolute", bottom: isMobile ? 168 : 88, left:"50%", transform:"translateX(-50%)", width:`min(${isMobile?94:480}px,96vw)`, zIndex:250, background:"rgba(5,5,18,0.96)", border:`1px solid ${zone.color}`, borderRadius:14, padding: isMobile?"16px 16px":"18px 22px", boxShadow:`0 0 28px ${zone.color}33`, animation:"slideUp .2s ease" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:12 }}>
        <span style={{ fontSize: isMobile ? 26 : 30 }}>{zone.emoji}</span>
        <div>
          <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?8:9, color:zone.color }}>{zone.label}</div>
          <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, color:"rgba(255,255,255,0.45)", marginTop:4 }}>{zone.description}</div>
        </div>
      </div>
      {!canApply && <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:6, color:"#ef4444", marginBottom:10, padding:"6px 10px", background:"rgba(239,68,68,0.1)", borderRadius:6 }}>⚠️ Boost stats first! (avg &gt;45 needed)</div>}
      <div style={{ display:"flex", gap:10 }}>
        <button onClick={onAction} disabled={!canApply}
          style={{ flex:1, fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:7, padding: isMobile?"14px 10px":"12px", background:canApply?`${zone.color}22`:"rgba(255,255,255,0.04)", border:`1px solid ${canApply?zone.color:"rgba(255,255,255,0.1)"}`, color:canApply?zone.color:"rgba(255,255,255,0.25)", borderRadius:8, cursor:canApply?"pointer":"not-allowed", minHeight:48, touchAction:"manipulation" }}>
          {zone.action}
        </button>
        <button onClick={onClose}
          style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, padding:isMobile?"14px 16px":"12px 16px", background:"transparent", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.35)", borderRadius:8, cursor:"pointer", minHeight:48, touchAction:"manipulation" }}>✕</button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VIRTUAL JOYSTICK
// ─────────────────────────────────────────────────────────────────────────────
interface VirtualJoystickProps {
  joystick: JoystickState;
  onStart: (e: React.TouchEvent | React.PointerEvent) => void;
  onMove:  (e: React.TouchEvent | React.PointerEvent) => void;
  onEnd:   () => void;
}
const VirtualJoystick: React.FC<VirtualJoystickProps> = ({ joystick, onStart, onMove, onEnd }) => {
  const knobX = joystick.active ? joystick.current.x - joystick.origin.x : 0;
  const knobY = joystick.active ? joystick.current.y - joystick.origin.y : 0;
  const dist2 = Math.sqrt(knobX**2 + knobY**2);
  const maxD  = JOY_RADIUS - 18;
  const cx    = dist2 > maxD ? (knobX / dist2) * maxD : knobX;
  const cy    = dist2 > maxD ? (knobY / dist2) * maxD : knobY;
  return (
    <div
      onTouchStart={onStart as React.TouchEventHandler}
      onTouchMove={onMove as React.TouchEventHandler}
      onTouchEnd={onEnd}
      onTouchCancel={onEnd}
      style={{ width: JOY_RADIUS*2, height: JOY_RADIUS*2, borderRadius:"50%", background:"rgba(34,255,204,0.08)", border:"1px solid rgba(34,255,204,0.25)", position:"relative", touchAction:"none", userSelect:"none", display:"flex", alignItems:"center", justifyContent:"center" }}>
      {/* Crosshair guides */}
      <div style={{ position:"absolute", top:"50%", left:0, right:0, height:1, background:"rgba(34,255,204,0.08)", transform:"translateY(-50%)" }} />
      <div style={{ position:"absolute", left:"50%", top:0, bottom:0, width:1, background:"rgba(34,255,204,0.08)", transform:"translateX(-50%)" }} />
      {/* Knob */}
      <div style={{ position:"absolute", width:34, height:34, borderRadius:"50%", background:"rgba(34,255,204,0.22)", border:"2px solid rgba(34,255,204,0.6)", boxShadow:joystick.active?"0 0 14px rgba(34,255,204,0.4)":"none", transform:`translate(${cx}px,${cy}px)`, transition: joystick.active?"none":"transform .15s ease", pointerEvents:"none" }} />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const StudentJourneyGame: React.FC = () => {
  const isMobile = useIsMobile();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [screen, setScreen]   = useState<GameScreen>("title");
  const [stats, dispatch]     = useReducer(statsReducer, INITIAL_STATS);
  const [nearZone, setNearZone]       = useState<Zone | null>(null);
  const [nearNPC,  setNearNPC]        = useState<NPC  | null>(null);
  const [dialogEntry, setDialogEntry] = useState<DialogEntry | null>(null);
  const [dialogLine,  setDialogLine]  = useState(0);
  const [quiz,       setQuiz]         = useState<QuizQuestion | null>(null);
  const [activeEvent,setActiveEvent]  = useState<GameEvent | null>(null);
  const [events, setEvents]           = useState<GameEvent[]>(GAME_EVENTS);
  const [activityPanel, setActivityPanel] = useState<Zone | null>(null);
  const [showDayPanel,  setShowDayPanel]  = useState(false);
  const [showHUD,       setShowHUD]       = useState(false); // mobile stat drawer
  const [notification, setNotification] = useState<{text:string;color:string}|null>(null);
  const [joystick, setJoystick] = useState<JoystickState>({ active:false, origin:{x:0,y:0}, current:{x:0,y:0}, dx:0, dy:0 });

  const keysRef     = useRef<Record<string,boolean>>({});
  const playerRef   = useRef<PlayerState>({ pos:{x:13*TILE,y:9*TILE}, dir:"down", moving:false });
  const statsRef    = useRef<Stats>(stats);
  const joyRef      = useRef<JoystickState>(joystick);
  const animRef     = useRef<number>(0);

  useEffect(()=>{ statsRef.current = stats; }, [stats]);
  useEffect(()=>{ joyRef.current   = joystick; }, [joystick]);

  // ── NOTIFY ────────────────────────────────────────────────────────────────
  const notify = useCallback((text:string, color="#22ffcc")=>{
    setNotification({text,color});
    setTimeout(()=>setNotification(null), 2600);
  },[]);

  // ── INTERACT ──────────────────────────────────────────────────────────────
  const interact = useCallback(()=>{
    const p   = playerRef.current;
    const ptx = p.pos.x / TILE;
    const pty = p.pos.y / TILE;
    const npc  = NPCS.find(n => tileDist(ptx,pty,n.tileX,n.tileY) < 2.5);
    const zone = ZONES.find(z => tileDist(ptx,pty,z.tileX,z.tileY) < z.radius);
    if (npc) {
      const e = NPC_DIALOGS[npc.id];
      if (e) { setDialogEntry(e); setDialogLine(0); }
    } else if (zone) {
      setActivityPanel(zone);
    }
  },[]);

  // ── ACTIVITY ──────────────────────────────────────────────────────────────
  const doActivity = useCallback((zone: Zone)=>{
    setActivityPanel(null);
    if ((zone.id==="library"||zone.id==="lab") && Math.random()<0.6) {
      setQuiz(QUIZ_POOL[Math.floor(Math.random()*QUIZ_POOL.length)]);
      return;
    }
    const map: Record<ZoneId,GameAction["type"]> = {
      library:"STUDY_DSA", classroom:"ATTEND_CLASS", lab:"STUDY_CODING",
      cafeteria:"EAT_MEAL", career:"APPLY_JOB", interview:"MOCK_INTERVIEW",
    };
    dispatch({ type: map[zone.id] } as GameAction);
    const msgs: Record<ZoneId,{msg:string;color:string}> = {
      library:   {msg:"+DSA +GPA 📚",         color:"#f59e0b"},
      classroom: {msg:"+GPA +SoftSkills 🎓",  color:"#3b82f6"},
      lab:       {msg:"+Coding +Conf 💻",     color:"#22ffcc"},
      cafeteria: {msg:"+Energy recharged 🍕", color:"#ec4899"},
      career:    {msg:"Application sent 📋",  color:"#a78bfa"},
      interview: {msg:"+Confidence +Skills 🎤",color:"#f43f5e"},
    };
    const info = msgs[zone.id];
    notify(info.msg, info.color);
  },[notify]);

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  const handleQuizAnswer = useCallback((correct:boolean)=>{
    setQuiz(null);
    if (correct) { dispatch({type:"STUDY_DSA"}); dispatch({type:"STUDY_CODING"}); notify("🧠 Correct! Double XP!","#22ffcc"); }
    else          { dispatch({type:"STUDY_DSA"}); notify("📖 Wrong — keep studying!","#f59e0b"); }
  },[notify]);

  // ── EVENT ─────────────────────────────────────────────────────────────────
  const handleEventAccept = useCallback(()=>{
    if (!activeEvent) return;
    dispatch({type:"STUDY_CODING"}); dispatch({type:"MOCK_INTERVIEW"});
    notify(`${activeEvent.emoji} ${activeEvent.title} done!`, "#a78bfa");
    setEvents(prev=>prev.map(e=>e.id===activeEvent.id?{...e,completed:true}:e));
    setActiveEvent(null);
  },[activeEvent, notify]);

  // ── NEXT DAY ──────────────────────────────────────────────────────────────
  const nextDay = useCallback(()=>{
    dispatch({type:"NEXT_DAY"});
    setShowDayPanel(false);
    const newDay = statsRef.current.day + 1;
    const ev = events.find(e => e.day === newDay && !e.completed);
    if (ev) setTimeout(()=>setActiveEvent({...ev}), 400);
    if (newDay > TOTAL_DAYS) setScreen(statsRef.current.jobOffers>0?"victory":"gameover");
  },[events]);

  // ── COLLISION ─────────────────────────────────────────────────────────────
  const isSolid = useCallback((tx:number,ty:number):boolean=>{
    if (tx<0||tx>=COLS||ty<0||ty>=ROWS) return true;
    const t = RAW_MAP[ty]?.[tx];
    return t===1||t===3||t===4;
  },[]);

  // ── JOYSTICK TOUCH HANDLERS ───────────────────────────────────────────────
  const handleJoyStart = useCallback((e: React.TouchEvent | React.PointerEvent)=>{
    const touch = "touches" in e ? e.touches[0] : e;
    const origin:Vec2 = {x:touch.clientX, y:touch.clientY};
    setJoystick({active:true, origin, current:origin, dx:0, dy:0});
  },[]);

  const handleJoyMove = useCallback((e: React.TouchEvent | React.PointerEvent)=>{
    const touch = "touches" in e ? e.touches[0] : e;
    setJoystick(prev=>{
      if(!prev.active) return prev;
      const dx = (touch.clientX - prev.origin.x) / JOY_RADIUS;
      const dy = (touch.clientY - prev.origin.y) / JOY_RADIUS;
      const len = Math.sqrt(dx*dx+dy*dy);
      const ndx = len > JOY_DEAD ? (dx/Math.max(len,1)) : 0;
      const ndy = len > JOY_DEAD ? (dy/Math.max(len,1)) : 0;
      return {...prev, current:{x:touch.clientX,y:touch.clientY}, dx:ndx, dy:ndy};
    });
  },[]);

  const handleJoyEnd = useCallback(()=>{
    setJoystick({active:false, origin:{x:0,y:0}, current:{x:0,y:0}, dx:0, dy:0});
  },[]);

  // ── CANVAS LOOP ───────────────────────────────────────────────────────────
  useEffect(()=>{
    if (screen !== "playing") return;
    if (!canvasRef.current) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const c: CanvasRenderingContext2D = ctx;

    const resize = ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    let lp: PlayerState = {...playerRef.current};
    let camX=0, camY=0;
    const localParticles: Particle[] = [];

    /* ── tile drawing ── */
    function drawTile(tx:number,ty:number,cx:number,cy:number):void {
      const sx=tx*TILE-cx, sy=ty*TILE-cy;
      if(sx<-TILE||sx>canvas.width+TILE||sy<-TILE||sy>canvas.height+TILE) return;
      const t:TileType = (RAW_MAP[ty]?.[tx]??0) as TileType;
      const now = Date.now()*0.001;
      c.fillStyle = TILE_COLORS[t]; c.fillRect(sx,sy,TILE,TILE);
      c.strokeStyle="rgba(255,255,255,0.025)"; c.lineWidth=0.5; c.strokeRect(sx,sy,TILE,TILE);
      if(t===0||t===6){
        c.fillStyle=t===6?"rgba(80,60,160,0.1)":"rgba(255,255,255,0.025)";
        c.fillRect(sx+2,sy+2,TILE-4,TILE-4);
        if((tx+ty)%4===0){ c.fillStyle="rgba(255,255,255,0.04)"; c.fillRect(sx+4,sy+4,2,2); }
      }
      if(t===1){
        c.fillStyle="rgba(0,0,0,0.45)"; c.fillRect(sx,sy,TILE,TILE);
        c.strokeStyle="rgba(255,255,255,0.05)"; c.lineWidth=0.5;
        const row=ty%2;
        for(let b=0;b<2;b++){
          const bx=row===0?b*TILE/2:b*TILE/2-TILE/4;
          c.strokeRect(sx+bx,sy,TILE/2,TILE/2); c.strokeRect(sx+bx,sy+TILE/2,TILE/2,TILE/2);
        }
      }
      if(t===3){
        c.fillStyle="#3d2008"; c.fillRect(sx+2,sy+2,TILE-4,TILE-4);
        const bc=["#ef4444","#3b82f6","#22ffcc","#fbbf24","#a78bfa","#ec4899"];
        for(let b=0;b<6;b++){ c.fillStyle=bc[b]; c.fillRect(sx+4+b*5,sy+6,4,TILE-14); }
      }
      if(t===4){
        c.fillStyle="#080812"; c.fillRect(sx+4,sy+6,TILE-8,TILE-14);
        const ga=0.6+Math.sin(now+tx*0.5)*0.2;
        c.fillStyle=`rgba(34,255,204,${ga*0.22})`; c.fillRect(sx+5,sy+7,TILE-10,TILE-16);
        c.strokeStyle=`rgba(34,255,204,${ga*0.6})`; c.lineWidth=1; c.strokeRect(sx+4,sy+6,TILE-8,TILE-14);
        c.fillStyle=`rgba(34,255,204,${ga*0.7})`;
        for(let l=0;l<3;l++){ const w=8+((tx*7+l*5)%12); c.fillRect(sx+7,sy+10+l*5,w,1.5); }
        c.fillStyle="#222"; c.fillRect(sx+TILE/2-3,sy+TILE-8,6,8);
      }
      if(t===5){
        c.fillStyle="#4a3200"; c.fillRect(sx+6,sy+4,TILE-12,TILE-4);
        c.fillStyle="#6b4800"; c.fillRect(sx+8,sy+6,TILE-16,TILE-8);
        c.fillStyle="#fbbf24"; c.beginPath(); c.arc(sx+TILE/2+4,sy+TILE/2,2,0,Math.PI*2); c.fill();
      }
    }

    function drawZone(zone:Zone,cx:number,cy:number):void {
      const now=Date.now()*0.001;
      const sx=zone.tileX*TILE-cx+TILE/2, sy=zone.tileY*TILE-cy+TILE/2;
      const r=zone.radius*TILE, pulse=0.08+Math.sin(now*2.5)*0.04;
      c.beginPath(); c.arc(sx,sy,r,0,Math.PI*2);
      c.fillStyle=zone.color+Math.floor(pulse*255).toString(16).padStart(2,"0"); c.fill();
      c.strokeStyle=zone.color+"99"; c.lineWidth=1.5; c.setLineDash([6,5]); c.stroke(); c.setLineDash([]);
      c.font="bold 10px monospace"; c.fillStyle=zone.color+"dd"; c.textAlign="center";
      c.fillText(zone.label,sx,sy+r+14);
    }

    function drawNPC(npc:NPC,cx:number,cy:number):void {
      const now=Date.now()*0.001;
      const sx=npc.tileX*TILE-cx+TILE/2, sy=npc.tileY*TILE-cy+TILE/2;
      const bounce=Math.sin(now*1.8+npc.tileX)*3;
      c.fillStyle="rgba(0,0,0,0.28)"; c.beginPath(); c.ellipse(sx,sy+TILE/2-3,11,5,0,0,Math.PI*2); c.fill();
      c.font=`${TILE-6}px serif`; c.textAlign="center"; c.textBaseline="middle";
      c.fillText(npc.emoji,sx,sy-2+bounce);
      const ptx=lp.pos.x/TILE, pty=lp.pos.y/TILE;
      if(tileDist(ptx,pty,npc.tileX,npc.tileY)<4){
        c.font="bold 8px monospace";
        const tw=c.measureText(npc.name).width;
        c.fillStyle="rgba(5,5,18,0.9)";
        c.beginPath(); roundRectPath(c, sx - tw / 2 - 6, sy - TILE / 2 + bounce - 22, tw + 12, 17, 4); c.fill();
        c.fillStyle=npc.color; c.fillText(npc.name,sx,sy-TILE/2+bounce-14);
        c.font="bold 13px sans-serif"; c.fillStyle="#fbbf24";
        c.fillText("!",sx,sy-TILE/2+bounce-33+Math.sin(now*3)*2);
      }
    }

    function drawPlayer(cx:number,cy:number):void {
      const p=lp;
      const sx=p.pos.x-cx, sy=p.pos.y-cy;
      const now=Date.now()*0.001;
      const moving=p.moving, bob=moving?Math.sin(now*10)*3:0;
      const grad=c.createRadialGradient(sx,sy,0,sx,sy,28);
      grad.addColorStop(0,"rgba(34,255,204,0.18)"); grad.addColorStop(1,"transparent");
      c.fillStyle=grad; c.beginPath(); c.arc(sx,sy,28,0,Math.PI*2); c.fill();
      c.fillStyle="rgba(0,0,0,0.32)"; c.beginPath(); c.ellipse(sx,sy+TILE/2-3,13,6,0,0,Math.PI*2); c.fill();
      const pw=26,ph=34, px=sx-pw/2, py=sy-ph/2+bob;
      c.fillStyle="#1e3a5f"; c.fillRect(px-5,py+10,8,16);
      c.fillStyle="#3b82f6"; c.fillRect(px-4,py+12,6,5);
      c.fillStyle="#1e3a5f"; c.fillRect(px+4,py+13,pw-8,ph-20);
      c.fillStyle="#162d4a"; c.fillRect(px+8,py+22,10,6);
      c.fillStyle="#f5cba7"; c.fillRect(px+6,py+2,pw-12,13);
      c.fillStyle="#1a0a00"; c.fillRect(px+6,py+2,pw-12,5);
      if(p.dir!=="up"){ c.fillStyle="#1a1a2e"; c.fillRect(px+9,py+8,3,3); c.fillRect(px+pw-12,py+8,3,3); }
      c.strokeStyle="#22ffcc"; c.lineWidth=1;
      c.strokeRect(px+8,py+7,5,4); c.strokeRect(px+pw-13,py+7,5,4);
      c.beginPath(); c.moveTo(px+13,py+9); c.lineTo(px+pw-13,py+9); c.stroke();
      c.fillStyle="#1e3a6e";
      if(moving){ const lph=Math.sin(now*12); c.fillRect(px+5,py+ph-10,7,10+lph*3); c.fillRect(px+pw-12,py+ph-10,7,10-lph*3); }
      else{ c.fillRect(px+5,py+ph-10,7,10); c.fillRect(px+pw-12,py+ph-10,7,10); }
      c.fillStyle="#fff"; c.fillRect(px+4,py+ph-2,9,3); c.fillRect(px+pw-13,py+ph-2,9,3);
      c.fillStyle="#111"; c.fillRect(px+pw-2,py+16,10,7);
      c.fillStyle="rgba(34,255,204,0.45)"; c.fillRect(px+pw-1,py+17,8,5);
    }

    function drawParticles(cx:number,cy:number):void {
      for(let i=localParticles.length-1;i>=0;i--){
        const p=localParticles[i];
        p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.life-=p.decay;
        if(p.life<=0){ localParticles.splice(i,1); continue; }
        c.globalAlpha=Math.max(0,p.life);
        if(p.text){ c.font="bold 10px monospace"; c.fillStyle=p.color; c.textAlign="center"; c.fillText(p.text,p.x-cx,p.y-cy); }
        else{ c.fillStyle=p.color; c.beginPath(); c.arc(p.x-cx,p.y-cy,p.size*p.life,0,Math.PI*2); c.fill(); }
      }
      c.globalAlpha=1;
    }

    function drawMinimap():void {
      const sc=4;
      const mw=COLS*sc, mh=ROWS*sc;
      const mx=canvas.width-mw-12, my=canvas.height-mh-12;
      c.fillStyle="rgba(3,3,14,0.88)"; c.strokeStyle="rgba(255,255,255,0.1)"; c.lineWidth=1;
      c.beginPath(); roundRectPath(c, mx - 5, my - 20, mw + 10, mh + 25, 7); c.fill(); c.stroke();
      c.font="bold 6px monospace"; c.fillStyle="rgba(255,255,255,0.3)"; c.textAlign="center";
      c.fillText("MAP",mx+mw/2,my-7);
      RAW_MAP.forEach((row,ry)=>row.forEach((tile,rx)=>{
        c.fillStyle=MINI_COLORS[tile as TileType]||"#111";
        c.fillRect(mx+rx*sc,my+ry*sc,sc,sc);
      }));
      ZONES.forEach(z=>{ c.fillStyle=z.color; c.beginPath(); c.arc(mx+z.tileX*sc+2,my+z.tileY*sc+2,4,0,Math.PI*2); c.fill(); });
      c.fillStyle="#fff"; c.beginPath(); c.arc(mx+(lp.pos.x/TILE)*sc,my+(lp.pos.y/TILE)*sc,3,0,Math.PI*2); c.fill();
    }

    /* ── main loop ── */
    function loop():void {
      const paused = document.querySelector("[data-dialog],[data-quiz],[data-event],[data-activity]") !== null;

      if(!paused){
        const k   = keysRef.current;
        const joy = joyRef.current;
        let dx=0, dy=0;
        if(k["ArrowUp"]   ||k["w"]||k["W"]) dy=-BASE_SPEED;
        if(k["ArrowDown"] ||k["s"]||k["S"]) dy= BASE_SPEED;
        if(k["ArrowLeft"] ||k["a"]||k["A"]) dx=-BASE_SPEED;
        if(k["ArrowRight"]||k["d"]||k["D"]) dx= BASE_SPEED;
        if(joy.active){ dx=joy.dx*BASE_SPEED; dy=joy.dy*BASE_SPEED; }
        if(dx&&dy){ dx*=0.707; dy*=0.707; }

        const nx=lp.pos.x+dx, ny=lp.pos.y+dy, m=14;
        const txL=Math.floor((nx-m)/TILE), txR=Math.floor((nx+m)/TILE);
        const tyT=Math.floor((ny-m)/TILE), tyB=Math.floor((ny+m)/TILE);
        const canX=!isSolid(txL,Math.floor(lp.pos.y/TILE))&&!isSolid(txR,Math.floor(lp.pos.y/TILE));
        const canY=!isSolid(Math.floor(lp.pos.x/TILE),tyT)&&!isSolid(Math.floor(lp.pos.x/TILE),tyB);
        if(canX) lp={...lp,pos:{...lp.pos,x:nx}};
        if(canY) lp={...lp,pos:{...lp.pos,y:ny}};
        const mov=dx!==0||dy!==0;
        let dir:Direction=lp.dir;
        if(dx>0)dir="right"; else if(dx<0)dir="left"; else if(dy<0)dir="up"; else if(dy>0)dir="down";
        lp={...lp,moving:mov,dir};
        playerRef.current=lp;
      }

      /* camera */
      const tcx=lp.pos.x-canvas.width/2, tcy=lp.pos.y-canvas.height/2;
      camX+=(Math.max(0,Math.min(COLS*TILE-canvas.width,tcx))-camX)*0.12;
      camY+=(Math.max(0,Math.min(ROWS*TILE-canvas.height,tcy))-camY)*0.12;

      /* render */
      c.fillStyle="#050510"; c.fillRect(0,0,canvas.width,canvas.height);
      for(let ty=0;ty<ROWS;ty++) for(let tx=0;tx<COLS;tx++) drawTile(tx,ty,camX,camY);
      ZONES.forEach(z=>drawZone(z,camX,camY));
      const pty2=Math.floor(lp.pos.y/TILE);
      NPCS.filter(n=>n.tileY<=pty2).forEach(n=>drawNPC(n,camX,camY));
      drawPlayer(camX,camY);
      NPCS.filter(n=>n.tileY>pty2).forEach(n=>drawNPC(n,camX,camY));
      drawParticles(camX,camY);
      drawMinimap();
      const vig=c.createRadialGradient(canvas.width/2,canvas.height/2,canvas.height*0.28,canvas.width/2,canvas.height/2,canvas.height*0.85);
      vig.addColorStop(0,"transparent"); vig.addColorStop(1,"rgba(0,0,8,0.7)");
      c.fillStyle=vig; c.fillRect(0,0,canvas.width,canvas.height);

      /* proximity */
      const ptx2=lp.pos.x/TILE, pty3=lp.pos.y/TILE;
      const zone=ZONES.find(z=>tileDist(ptx2,pty3,z.tileX,z.tileY)<z.radius)??null;
      const npc =NPCS.find(n =>tileDist(ptx2,pty3,n.tileX,n.tileY)<2.5)??null;
      setNearZone(zone); setNearNPC(npc);

      animRef.current=requestAnimationFrame(loop);
    }

    /* keyboard */
    const onKeyDown=(e:KeyboardEvent)=>{
      keysRef.current[e.key]=true;
      if((e.key==="e"||e.key==="E"||e.key===" ")&&!quiz){ e.preventDefault(); interact(); }
      if(e.key==="Escape"){ setDialogEntry(null); setActivityPanel(null); setShowDayPanel(false); setShowHUD(false); }
      if(e.key==="Tab"){ e.preventDefault(); setShowDayPanel(v=>!v); }
    };
    const onKeyUp=(e:KeyboardEvent)=>{ keysRef.current[e.key]=false; };
    window.addEventListener("keydown",onKeyDown);
    window.addEventListener("keyup",onKeyUp);

    animRef.current=requestAnimationFrame(loop);
    return ()=>{
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown",onKeyDown);
      window.removeEventListener("keyup",onKeyUp);
      window.removeEventListener("resize",resize);
    };
  },[screen, isSolid, interact, quiz]);

  // ── SHARED STYLES ─────────────────────────────────────────────────────────
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
    html, body { overscroll-behavior:none; }
    body { overflow:hidden; background:#050510; touch-action:none; }
    @keyframes blink   { 0%,100%{opacity:1}50%{opacity:0} }
    @keyframes floatUp { 0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)} }
    @keyframes starPop { 0%,100%{opacity:.15}50%{opacity:.85} }
    @keyframes slideUp { from{opacity:0;transform:translateX(-50%) translateY(12px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }
    @keyframes popIn   { from{opacity:0;transform:translateX(-50%) scale(.88)}to{opacity:1;transform:translateX(-50%) scale(1)} }
    @keyframes notifIn { from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)} }
    @keyframes drawerIn{ from{transform:translateX(-100%)}to{transform:translateX(0)} }
  `;

  // ─────────────────────────────────────────────────────────────────────────
  // TITLE
  // ─────────────────────────────────────────────────────────────────────────
  if(screen==="title") return (
    <>
      <style>{css}</style>
      <div style={{ width:"100vw", height:"100vh", background:"#050510", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Press Start 2P',monospace", position:"relative", overflow:"hidden", padding:16, touchAction:"none" }}>
        {Array.from({length:60},(_,i)=>(
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              background: "white",
              borderRadius: "50%",
              left: `${seeded01(i, 7) * 100}%`,
              top: `${seeded01(i, 19) * 100}%`,
              animation: `starPop ${2 + seeded01(i, 31) * 3}s ${seeded01(i, 47) * 3}s infinite`,
            }}
          />
        ))}
        <div style={{ fontSize: isMobile?54:72, animation:"floatUp 3s ease-in-out infinite", marginBottom:14 }}>🧑‍💻</div>
        <div style={{ fontSize:"clamp(5px,1.4vw,9px)", color:"#22ffcc", letterSpacing:"0.2em", marginBottom:8 }}>★ INTERACTIVE GAME ★</div>
        <div style={{ fontSize:"clamp(20px,5.5vw,44px)", color:"#fff", lineHeight:1.2, textAlign:"center", marginBottom:8, textShadow:"0 0 28px #22ffcc" }}>STUDENT<br/>JOURNEY</div>
        <div style={{ fontSize:"clamp(5px,1vw,7px)", color:"rgba(255,255,255,0.35)", letterSpacing:"0.12em", marginBottom:28 }}>FROM CAMPUS TO CAREER</div>
        <div style={{ background:"rgba(10,10,28,0.92)", border:"1px solid rgba(34,255,204,0.2)", borderRadius:12, padding:"18px 22px", maxWidth:420, width:"100%", marginBottom:28, backdropFilter:"blur(10px)" }}>
          <div style={{ fontSize:"clamp(5px,.9vw,7px)", color:"rgba(255,255,255,0.5)", lineHeight:2.8, textAlign:"center" }}>
            {["📚 STUDY DSA, CODING & SOFT SKILLS","💻 CRACK QUIZ CHALLENGES","🎤 PRACTICE MOCK INTERVIEWS","📋 APPLY BEFORE DAY 30","🏆 SURVIVE CAMPUS EVENTS"].map(t=><div key={t}>{t}</div>)}
          </div>
        </div>
        <button onClick={()=>setScreen("playing")}
          style={{ fontFamily:"'Press Start 2P',monospace", fontSize:"clamp(8px,1.6vw,11px)", padding:"14px 36px", background:"linear-gradient(135deg,#0d4a3a,#22ffcc22)", border:"2px solid #22ffcc", color:"#22ffcc", borderRadius:12, cursor:"pointer", animation:"blink 1.4s infinite", boxShadow:"0 0 28px rgba(34,255,204,0.3)", letterSpacing:"0.1em", touchAction:"manipulation", minHeight:52 }}
          onMouseOver={e=>{(e.target as HTMLElement).style.animation="none";}}
          onMouseOut={e=>{(e.target as HTMLElement).style.animation="blink 1.4s infinite";}}>
          ▶ START
        </button>
        <div style={{ marginTop:16, fontSize:"clamp(4px,.7vw,6px)", color:"rgba(255,255,255,0.18)", letterSpacing:"0.08em", textAlign:"center" }}>
          {isMobile?"JOYSTICK TO MOVE · TAP ⚡ TO INTERACT":"WASD/ARROWS · E TO INTERACT · TAB FOR STATS"}
        </div>
      </div>
    </>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // GAME OVER / VICTORY
  // ─────────────────────────────────────────────────────────────────────────
  if(screen==="gameover"||screen==="victory"){
    const win=screen==="victory";
    return (
      <>
        <style>{css}</style>
        <div style={{ width:"100vw", height:"100vh", background:"#050510", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Press Start 2P',monospace", gap:18, padding:20 }}>
          <div style={{ fontSize: isMobile?60:76 }}>{win?"🎉":"😔"}</div>
          <div style={{ fontSize:"clamp(14px,3.5vw,28px)", color:win?"#22ffcc":"#ef4444", textShadow:`0 0 20px ${win?"#22ffcc":"#ef4444"}`, textAlign:"center" }}>{win?"YOU'RE HIRED!":"GAME OVER"}</div>
          <div style={{ fontSize:"clamp(6px,1.2vw,8px)", color:"rgba(255,255,255,0.5)", lineHeight:2.8, textAlign:"center" }}>
            <div>{win?`🏆 Offers: ${stats.jobOffers}`:"No offers — keep grinding!"}</div>
            <div>GPA: {stats.gpa.toFixed(2)} · Coding: {stats.coding} · DSA: {stats.dsa}</div>
          </div>
          <button onClick={()=>window.location.reload()} style={{ fontFamily:"'Press Start 2P',monospace", fontSize:"clamp(7px,1.3vw,9px)", padding:"13px 28px", background:`rgba(${win?"34,255,204":"239,68,68"},.15)`, border:`1px solid ${win?"#22ffcc":"#ef4444"}`, color:win?"#22ffcc":"#ef4444", borderRadius:10, cursor:"pointer", minHeight:48, touchAction:"manipulation" }}>↺ TRY AGAIN</button>
        </div>
      </>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // PLAYING
  // ─────────────────────────────────────────────────────────────────────────
  const progress = Math.round((stats.day / TOTAL_DAYS) * 100);
  const isBlocked = !!(dialogEntry || quiz || activeEvent || activityPanel || showDayPanel);

  return (
    <>
      <style>{css}</style>
      <div style={{ width:"100vw", height:"100vh", position:"relative", overflow:"hidden", background:"#050510", touchAction:"none" }}>
        <canvas ref={canvasRef} style={{ display:"block", imageRendering:"pixelated" }} />

        {/* ── TOP BAR ── */}
        <div style={{ position:"absolute", top:0, left:0, right:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"space-between", padding: isMobile?"8px 10px":"10px 14px", background:"rgba(3,3,14,0.82)", backdropFilter:"blur(8px)", borderBottom:"1px solid rgba(255,255,255,0.07)", gap:8 }}>
          {/* Stats toggle (mobile) or mini-stats (desktop) */}
          {isMobile ? (
            <button onClick={()=>setShowHUD(v=>!v)} style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, padding:"8px 10px", background:"rgba(34,255,204,0.12)", border:"1px solid rgba(34,255,204,0.3)", color:"#22ffcc", borderRadius:8, cursor:"pointer", touchAction:"manipulation", whiteSpace:"nowrap" }}>
              📊 STATS
            </button>
          ) : (
            <div style={{ display:"flex", gap:12, alignItems:"center" }}>
              {[["🎓",stats.gpa.toFixed(1),"#fbbf24"],["💻",stats.coding,"#22ffcc"],["🧠",stats.dsa,"#3b82f6"],["⚡",stats.energy,"#f59e0b"]].map(([ic,v,c])=>(
                <div key={ic as string} style={{ display:"flex", alignItems:"center", gap:4 }}>
                  <span style={{ fontSize:12 }}>{ic}</span>
                  <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:c as string }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Day progress */}
          <div style={{ display:"flex", alignItems:"center", gap:8, flex:1, justifyContent:"center" }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, color:"rgba(255,255,255,0.5)", whiteSpace:"nowrap" }}>Day {stats.day}/{TOTAL_DAYS}</span>
            <div style={{ flex:1, maxWidth: isMobile?80:140, height:5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#22ffcc,#a78bfa)", borderRadius:3, transition:"width .5s" }} />
            </div>
          </div>

          {/* Next day + offers */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {stats.jobOffers>0 && <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, color:"#22ffcc" }}>🎉×{stats.jobOffers}</span>}
            <button onClick={()=>setShowDayPanel(true)} style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, padding: isMobile?"8px 10px":"7px 12px", background:"rgba(167,139,250,0.14)", border:"1px solid rgba(167,139,250,0.35)", color:"#a78bfa", borderRadius:8, cursor:"pointer", touchAction:"manipulation", whiteSpace:"nowrap" }}>
              🌙{isMobile?"":" END DAY"}
            </button>
          </div>
        </div>

        {/* ── MOBILE SLIDING STAT DRAWER ── */}
        {isMobile && showHUD && (
          <div style={{ position:"absolute", top:0, left:0, bottom:0, width:220, zIndex:400, background:"rgba(3,3,14,0.97)", borderRight:"1px solid rgba(34,255,204,0.2)", padding:"54px 16px 16px", animation:"drawerIn .25s ease", overflowY:"auto" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:"#22ffcc" }}>📊 STATS</span>
              <button onClick={()=>setShowHUD(false)} style={{ background:"none", border:"none", color:"rgba(255,255,255,0.5)", fontSize:18, cursor:"pointer", touchAction:"manipulation" }}>✕</button>
            </div>
            <StatBar label="GPA"        value={stats.gpa}        max={4}   color="#fbbf24" icon="🎓" compact={isMobile}/>
            <StatBar label="Coding"     value={stats.coding}     max={100} color="#22ffcc" icon="💻" compact={isMobile}/>
            <StatBar label="DSA"        value={stats.dsa}        max={100} color="#3b82f6" icon="🧠" compact={isMobile}/>
            <StatBar label="SoftSkills" value={stats.softSkills} max={100} color="#ec4899" icon="🤝" compact={isMobile}/>
            <StatBar label="Energy"     value={stats.energy}     max={100} color="#f59e0b" icon="⚡" compact={isMobile}/>
            <StatBar label="Confidence" value={stats.confidence} max={100} color="#a78bfa" icon="💪" compact={isMobile}/>
            {stats.studyStreak>1&&<div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:6, color:"#fbbf24", marginTop:12 }}>🔥 {stats.studyStreak}-DAY STREAK!</div>}
            {stats.jobOffers>0&&<div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:6, color:"#22ffcc", marginTop:8 }}>🎉 {stats.jobOffers} OFFER{stats.jobOffers>1?"S":""}!</div>}
            <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.07)", margin:"16px 0" }}/>
            <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:6, color:"rgba(255,255,255,0.35)", lineHeight:2.4 }}>
              {ZONES.map(z=><div key={z.id}><span style={{color:z.color}}>{z.emoji}</span> {z.label.replace(/^.{2}/,"").trim()}</div>)}
            </div>
          </div>
        )}
        {isMobile && showHUD && <div onClick={()=>setShowHUD(false)} style={{ position:"absolute", inset:0, zIndex:399, background:"rgba(0,0,0,0.45)" }} />}

        {/* ── DESKTOP LEFT HUD ── */}
        {!isMobile && (
          <div style={{ position:"absolute", top:54, left:14, zIndex:100, background:"rgba(3,3,14,0.92)", border:"1px solid rgba(34,255,204,0.25)", borderRadius:12, padding:"14px 16px", width:200, backdropFilter:"blur(10px)" }}>
            <StatBar label="GPA"        value={stats.gpa}        max={4}   color="#fbbf24" icon="🎓"/>
            <StatBar label="Coding"     value={stats.coding}     max={100} color="#22ffcc" icon="💻"/>
            <StatBar label="DSA"        value={stats.dsa}        max={100} color="#3b82f6" icon="🧠"/>
            <StatBar label="SoftSkills" value={stats.softSkills} max={100} color="#ec4899" icon="🤝"/>
            <StatBar label="Energy"     value={stats.energy}     max={100} color="#f59e0b" icon="⚡"/>
            <StatBar label="Confidence" value={stats.confidence} max={100} color="#a78bfa" icon="💪"/>
            {stats.studyStreak>1&&<div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:6, color:"#fbbf24", marginTop:8 }}>🔥 {stats.studyStreak}-DAY STREAK!</div>}
            {stats.jobOffers>0&&<div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:6, color:"#22ffcc", marginTop:6, padding:"4px 8px", background:"rgba(34,255,204,0.08)", borderRadius:5 }}>🎉 {stats.jobOffers} OFFER{stats.jobOffers>1?"S":""}!</div>}
          </div>
        )}

        {/* ── DESKTOP CONTROLS ── */}
        {!isMobile && (
          <div style={{ position:"absolute", top:54, right:14, zIndex:100, background:"rgba(3,3,14,0.88)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:12, padding:"12px 14px", backdropFilter:"blur(8px)" }}>
            <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:5, color:"rgba(255,255,255,0.3)", marginBottom:7 }}>CONTROLS</div>
            {[["WASD","Move"],["E/Space","Interact"],["Tab","Day Panel"],["ESC","Close"]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", gap:7, marginBottom:4, alignItems:"center" }}>
                <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:5, background:"rgba(255,255,255,0.07)", padding:"2px 5px", borderRadius:3, color:"#22ffcc" }}>{k}</span>
                <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:5, color:"rgba(255,255,255,0.3)" }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── ZONE / NPC PROMPT ── */}
        {nearZone && !isBlocked && (
          <div style={{ position:"absolute", bottom: isMobile?172:28, left:"50%", transform:"translateX(-50%)", zIndex:100, background:"rgba(3,3,14,0.94)", border:`1px solid ${nearZone.color}`, borderRadius:100, padding: isMobile?"8px 18px":"6px 20px", boxShadow:`0 0 18px ${nearZone.color}44`, animation:"popIn .22s", whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:8, color:nearZone.color }}>{nearZone.label} — {isMobile?"Tap ⚡":"[E]"}</span>
          </div>
        )}
        {nearNPC && !isBlocked && (
          <div style={{ position:"absolute", bottom: isMobile?(nearZone?212:172):(nearZone?68:28), left:"50%", transform:"translateX(-50%)", zIndex:100, background:"rgba(3,3,14,0.9)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:100, padding: isMobile?"7px 16px":"5px 16px", animation:"popIn .22s", whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, color:"rgba(255,255,255,0.6)" }}>Talk to {nearNPC.name} {isMobile?"⚡":"[E]"}</span>
          </div>
        )}

        {/* ── MODALS ── */}
        {activityPanel && !dialogEntry && (
          <div data-activity="true">
            <ActivityPanel zone={activityPanel} stats={stats} isMobile={isMobile} onAction={()=>doActivity(activityPanel)} onClose={()=>setActivityPanel(null)} />
          </div>
        )}
        {dialogEntry && (
          <div data-dialog="true">
            <DialogBox entry={dialogEntry} lineIndex={dialogLine} isMobile={isMobile}
              onNext={()=>{ if(dialogLine>=dialogEntry.lines.length-1){setDialogEntry(null);setDialogLine(0);}else setDialogLine(l=>l+1); }}
              onClose={()=>{ setDialogEntry(null); setDialogLine(0); }} />
          </div>
        )}
        {quiz && (
          <div data-quiz="true">
            <QuizModal question={quiz} onAnswer={handleQuizAnswer} isMobile={isMobile} />
          </div>
        )}
        {activeEvent && (
          <div data-event="true">
            <EventModal event={activeEvent} isMobile={isMobile} onAccept={handleEventAccept} onSkip={()=>setActiveEvent(null)} />
          </div>
        )}

        {/* ── DAY PANEL ── */}
        {showDayPanel && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.82)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:16, touchAction:"none" }}>
            <div style={{ background:"rgba(5,5,18,0.98)", border:"2px solid #a78bfa", borderRadius:18, padding: isMobile?"22px 18px":"32px 40px", maxWidth:440, width:"100%", textAlign:"center", boxShadow:"0 0 50px #a78bfa44" }}>
              <div style={{ fontSize: isMobile?44:52, marginBottom:12 }}>🌙</div>
              <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?9:10, color:"#a78bfa", marginBottom:16 }}>END OF DAY {stats.day}</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:20 }}>
                {[["GPA",`${stats.gpa.toFixed(2)}/4`,"#fbbf24"],["Coding",`${stats.coding}/100`,"#22ffcc"],["DSA",`${stats.dsa}/100`,"#3b82f6"],["Energy",`${stats.energy}/100`,"#f59e0b"]].map(([l,v,c])=>(
                  <div key={l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 12px", border:`1px solid ${c}33` }}>
                    <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:5, color:"rgba(255,255,255,0.4)", marginBottom:4 }}>{l}</div>
                    <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?8:9, color:c as string }}>{v}</div>
                  </div>
                ))}
              </div>
              {stats.studyStreak>1&&<div style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, color:"#fbbf24", marginBottom:14 }}>🔥 {stats.studyStreak}-DAY STREAK!</div>}
              <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                <button onClick={nextDay} style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:8, padding:"13px 20px", background:"rgba(167,139,250,0.18)", border:"1px solid #a78bfa", color:"#a78bfa", borderRadius:10, cursor:"pointer", minHeight:48, touchAction:"manipulation" }}>
                  {stats.day>=TOTAL_DAYS?"🎓 FINISH!":"☀️ Next Day →"}
                </button>
                <button onClick={()=>{ dispatch({type:"REST"}); setShowDayPanel(false); }} style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?7:8, padding:"13px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", color:"rgba(255,255,255,0.4)", borderRadius:10, cursor:"pointer", minHeight:48, touchAction:"manipulation" }}>💤 Rest</button>
              </div>
            </div>
          </div>
        )}

        {/* ── NOTIFICATION ── */}
        {notification && (
          <div style={{ position:"absolute", top: isMobile?52:58, left:"50%", transform:"translateX(-50%)", zIndex:300, background:"rgba(3,3,14,0.96)", border:`1px solid ${notification.color}`, borderRadius:100, padding: isMobile?"8px 18px":"7px 20px", boxShadow:`0 0 18px ${notification.color}44`, animation:"notifIn .25s ease", whiteSpace:"nowrap" }}>
            <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize: isMobile?6:7, color:notification.color }}>{notification.text}</span>
          </div>
        )}

        {/* ── MOBILE CONTROLS (joystick + action buttons) ── */}
        {isMobile && (
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:160, zIndex:200, display:"flex", alignItems:"flex-end", justifyContent:"space-between", padding:"0 20px 24px", pointerEvents:"none" }}>
            {/* Left: Joystick */}
            <div style={{ pointerEvents:"all" }}>
              <VirtualJoystick joystick={joystick} onStart={handleJoyStart} onMove={handleJoyMove} onEnd={handleJoyEnd} />
            </div>

            {/* Right: Action buttons */}
            <div style={{ pointerEvents:"all", display:"flex", flexDirection:"column", gap:10, alignItems:"center" }}>
              {/* Main interact */}
              <button
                onPointerDown={e=>{ e.preventDefault(); interact(); }}
                style={{ width:62, height:62, borderRadius:"50%", background:"rgba(34,255,204,0.18)", border:"2px solid rgba(34,255,204,0.5)", color:"#22ffcc", fontFamily:"'Press Start 2P',monospace", fontSize:7, cursor:"pointer", userSelect:"none", touchAction:"manipulation", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2, boxShadow:"0 0 12px rgba(34,255,204,0.2)" }}>
                <span style={{fontSize:18}}>⚡</span>
                <span style={{fontSize:5}}>ACT</span>
              </button>
              {/* Dialog next (only when dialog open) */}
              {dialogEntry && (
                <button
                  onPointerDown={e=>{ e.preventDefault(); if(dialogLine>=dialogEntry.lines.length-1){setDialogEntry(null);setDialogLine(0);}else setDialogLine(l=>l+1); }}
                  style={{ width:52, height:52, borderRadius:"50%", background:"rgba(167,139,250,0.2)", border:"2px solid rgba(167,139,250,0.5)", color:"#a78bfa", fontFamily:"'Press Start 2P',monospace", fontSize:7, cursor:"pointer", userSelect:"none", touchAction:"manipulation", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  ›
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── DESKTOP ZONE LEGEND ── (right side, only if no right HUD overlap) */}
        {!isMobile && (
          <div style={{ position:"absolute", top:"50%", right:14, transform:"translateY(-50%)", zIndex:100, display:"flex", flexDirection:"column", gap:6 }}>
            {ZONES.map(z=>(
              <div key={z.id} style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(3,3,14,0.82)", border:`1px solid ${z.color}33`, borderRadius:100, padding:"4px 10px", backdropFilter:"blur(5px)" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:z.color, boxShadow:`0 0 5px ${z.color}` }} />
                <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:5, color:"rgba(255,255,255,0.4)" }}>{z.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentJourneyGame;
