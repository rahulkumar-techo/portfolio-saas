'use client'

import { motion } from 'framer-motion'

export default function ResumeProgress() {
  return (
    <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-xs">Completeness</span>
        <span className="text-emerald-400 font-bold text-sm">71%</span>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '71%' }}
          transition={{ duration: 1.2 }}
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
        />
      </div>

      <p className="text-white/30 text-xs mt-2">
        Add 2 more sections to reach 100%
      </p>
    </div>
  )
}