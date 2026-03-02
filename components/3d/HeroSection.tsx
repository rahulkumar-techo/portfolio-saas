'use client'

import { useMemo } from 'react'

interface HeroSceneProps {
  mouseX?: number
  mouseY?: number
  isMobile?: boolean
}

function seeded01(i: number, seed: number): number {
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453
  return x - Math.floor(x)
}

export function HeroScene({ mouseX = 0, mouseY = 0, isMobile = false }: HeroSceneProps) {
  const stars = useMemo(
    () =>
      Array.from({ length: isMobile ? 50 : 90 }, (_, i) => ({
        left: `${seeded01(i, 7) * 100}%`,
        top: `${seeded01(i, 19) * 100}%`,
        size: i % 7 === 0 ? 3 : 2,
        duration: `${3 + seeded01(i, 31) * 3}s`,
        delay: `${seeded01(i, 53) * 2.5}s`,
      })),
    [isMobile]
  )

  const orbX = `${50 + mouseX * 8}%`
  const orbY = `${50 + mouseY * 6}%`

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(91,108,255,0.18),transparent_45%),radial-gradient(circle_at_70%_60%,rgba(34,211,238,0.14),transparent_42%),radial-gradient(circle_at_50%_50%,rgba(244,114,182,0.12),transparent_55%)]" />
      <div
        className="absolute h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-200"
        style={{ left: orbX, top: orbY, background: 'rgba(34, 211, 238, 0.22)' }}
      />
      {stars.map((star, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/70 animate-pulse"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDuration: star.duration,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  )
}
