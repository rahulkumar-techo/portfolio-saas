"use client";

export default function AdminProfileStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap');
      *{box-sizing:border-box;margin:0;padding:0;}html{scroll-behavior:smooth;}
      ::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-track{background:#05060f;}::-webkit-scrollbar-thumb{background:#6C63FF;border-radius:2px;}
      @keyframes hpulse{0%,100%{opacity:.6;transform:scale(1);}50%{opacity:1;transform:scale(1.04);}}
      @keyframes hring{from{transform:translate(-50%,-50%) rotate(0deg);}to{transform:translate(-50%,-50%) rotate(360deg);}}
      @keyframes horbit{from{transform:translate(-50%,-50%) rotateZ(0deg) rotateX(70deg);}to{transform:translate(-50%,-50%) rotateZ(360deg) rotateX(70deg);}}
      @keyframes holo{0%{opacity:.25;}100%{opacity:.65;}}
      @keyframes floatA{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
      @keyframes floatB{0%,100%{transform:translateY(-7px);}50%{transform:translateY(7px);}}
      @keyframes glowPulse{0%,100%{box-shadow:0 0 18px rgba(108,99,255,0.3);}50%{box-shadow:0 0 38px rgba(108,99,255,0.6);}}
      @keyframes scan{0%{transform:translateY(-100%);}100%{transform:translateY(100vh);}}
      @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
      @keyframes shimmer{0%{background-position:-200% center;}100%{background-position:200% center;}}
      .float-a{animation:floatA 4s ease-in-out infinite;}
      .float-b{animation:floatB 3.2s ease-in-out infinite;}
      .glow-pulse{animation:glowPulse 2s ease-in-out infinite;}
      .fade-up{animation:fadeUp 0.9s ease forwards;}
      .shimmer-text{background:linear-gradient(90deg,#fff 0%,#6C63FF 30%,#00D4FF 60%,#fff 100%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:shimmer 4s linear infinite;}
      .grid-dots{background-image:radial-gradient(rgba(108,99,255,0.25) 1px,transparent 1px);background-size:32px 32px;}
    `}</style>
  );
}
