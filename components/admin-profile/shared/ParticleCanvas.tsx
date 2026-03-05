/**
 * Animated particle background canvas
 */

"use client"

import { useEffect, useRef } from "react"

export default function ParticleCanvas() {

  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {

    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight

    const pts = Array.from({ length: 70 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.5 + 0.4,
      color: ["#6C63FF", "#00D4FF", "#FF6B6B", "#FFD93D"][
        Math.floor(Math.random() * 4)
      ]
    }))

    let raf = 0

    const draw = () => {

      ctx.clearRect(0, 0, W, H)

      pts.forEach(p => {

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = W
        if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H
        if (p.y > H) p.y = 0

        ctx.save()

        ctx.globalAlpha = 0.5
        ctx.fillStyle = p.color
        ctx.shadowColor = p.color
        ctx.shadowBlur = 8

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()

      })

      for (let i = 0; i < pts.length; i++)
        for (let j = i + 1; j < pts.length; j++) {

          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 90) {

            ctx.save()

            ctx.globalAlpha = (1 - dist / 90) * 0.07
            ctx.strokeStyle = "#6C63FF"
            ctx.lineWidth = 0.5

            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.stroke()

            ctx.restore()

          }
        }

      raf = requestAnimationFrame(draw)

    }

    draw()

    const resize = () => {

      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight

    }

    window.addEventListener("resize", resize)

    return () => {

      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)

    }

  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6
      }}
    />
  )
}