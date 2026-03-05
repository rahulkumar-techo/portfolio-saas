"use client";

import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type TouchEvent as ReactTouchEvent,
} from "react";

interface Card3DProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  depth?: number;
  onClick?: () => void;
}

export default function Card3D({ children, style = {}, className = "", depth = 18, onClick }: Card3DProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: ReactMouseEvent<HTMLDivElement> | ReactTouchEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const px = "touches" in e ? e.touches[0].clientX : e.clientX;
    const py = "touches" in e ? e.touches[0].clientY : e.clientY;

    setRotation({
      x: ((py - cy) / rect.height) * -depth,
      y: ((px - cx) / rect.width) * depth,
    });
  }, [depth]);

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
      onTouchMove={handleMove}
      onTouchEnd={() => setRotation({ x: 0, y: 0 })}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        transform: `perspective(800px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        transition: "transform 0.15s ease",
        willChange: "transform",
        position: "relative",
        cursor: onClick ? "pointer" : "default",
      }}
    >
      {children}
    </div>
  );
}
