'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { ATS_CHECKS, STATUS_CONFIG } from './ats.data'

export default function DetailedChecks() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-white text-base mb-6">
        Detailed Analysis
      </h3>

      <div className="space-y-3">
        {ATS_CHECKS.map((check, i) => {
          const cfg = STATUS_CONFIG[check.status as keyof typeof STATUS_CONFIG]

          return (
            <motion.div
              key={check.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              style={{ background: check.status === 'warning' ? '#fbbf2406' : 'rgba(255,255,255,0.02)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold font-display"
                style={{ background: cfg.bg, color: cfg.color }}
              >
                {check.score}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-white font-medium text-sm">
                    {check.label}
                  </span>
                  <Badge variant={cfg.badge} className="text-xs">
                    {cfg.label}
                  </Badge>
                </div>

                <p className="text-white/40 text-xs">
                  {check.description}
                </p>
              </div>

              <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${check.score}%` }}
                  transition={{ duration: 1, delay: i * 0.06 + 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: cfg.color }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}