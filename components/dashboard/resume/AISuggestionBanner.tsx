'use client'

import { motion } from 'framer-motion'

export default function AISuggestionBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-xl bg-brand-600/8 border border-brand-500/20 flex items-start gap-3"
    >
      <span className="text-lg flex-shrink-0">🧠</span>

      <div className="flex-1">
        <p className="text-brand-300 text-sm font-medium mb-0.5">
          AI Suggestion
        </p>
        <p className="text-white/50 text-xs leading-relaxed">
          Your "Led" and "Built" verbs are strong — add metrics to 3 bullet
          points to boost your ATS score by ~5 points.
        </p>
      </div>

      <button className="text-white/25 hover:text-white text-sm transition-colors flex-shrink-0">
        ✕
      </button>
    </motion.div>
  )
}