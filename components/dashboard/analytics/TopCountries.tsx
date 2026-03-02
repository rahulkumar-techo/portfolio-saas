'use client'

import { motion } from 'framer-motion'
import { MOCK_ANALYTICS } from '@/lib/data'

export default function TopCountries() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-white text-base mb-5">
        Top Countries
      </h3>

      <div className="space-y-3">
        {MOCK_ANALYTICS.topCountries.map((c, i) => (
          <div key={c.country}>
            <div className="flex justify-between mb-1.5 text-xs">
              <span className="text-white/60">{c.country}</span>
              <span className="text-white/50">{c.percentage}%</span>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.percentage}%` }}
                transition={{ duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}