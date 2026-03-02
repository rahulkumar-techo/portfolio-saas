'use client'

import { motion } from 'framer-motion'

export default function BigScoreRing({ score }: { score: number }) {
  const r = 80
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 90 ? '#22d3ee' : score >= 75 ? '#34d399' : '#fbbf24'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={200} height={200} viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={12} />
        <motion.circle
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 12px ${color}80)` }}
        />
        <circle cx="100" cy="100" r={r - 20} fill="none" stroke={`${color}10`} strokeWidth={1} />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-display font-bold text-5xl"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="text-white/40 text-sm mt-1">/ 100</span>
      </div>
    </div>
  )
}