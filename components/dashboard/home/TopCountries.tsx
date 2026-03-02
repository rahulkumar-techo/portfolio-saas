'use client'

import { motion } from 'framer-motion'
import { MOCK_ANALYTICS } from '@/lib/data'

export default function TopCountries() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-white mb-6">Top Countries</h3>

      <div className="space-y-4">
        {MOCK_ANALYTICS.topCountries.map((c) => (
          <div key={c.country}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-white/70">{c.country}</span>
              <span className="text-white/50">{c.visits.toLocaleString()}</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.percentage}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-brand-600 to-brand-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}