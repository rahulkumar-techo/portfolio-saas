'use client'

import { motion } from 'framer-motion'

export default function ProgressRing({ value, max = 100, color, size = 80 }: any) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (value / max) * circ

  return (
    <div className="relative">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5 }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-sm" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  )
}