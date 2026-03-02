'use client'

import { motion } from 'framer-motion'
import { MOCK_ANALYTICS } from '@/lib/data'

const COLORS = ['#5b6cff', '#22d3ee', '#34d399', '#fbbf24', '#f472b6']

export default function TopPages() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-white text-base mb-5">
        Top Pages
      </h3>

      <div className="space-y-3">
        {MOCK_ANALYTICS.topPages.map((page, i) => (
          <div key={page.page}>
            <div className="flex justify-between mb-1.5 text-xs">
              <span className="text-white/60 font-mono">{page.page}</span>
              <span className="text-white/50">{page.views.toLocaleString()}</span>
            </div>

            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(page.views / MOCK_ANALYTICS.topPages[0].views) * 100}%`,
                }}
                transition={{ duration: 1 }}
                className="h-full rounded-full"
                style={{ background: COLORS[i] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}