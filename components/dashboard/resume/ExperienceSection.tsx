'use client'

import { motion } from 'framer-motion'
import { MOCK_EXPERIENCE } from '@/lib/data'
import ExperienceDrawer from '@/components/ui/resume/ExperienceForm';



export default function ExperienceSection() {
  return (
    <div className="space-y-4">
      {MOCK_EXPERIENCE.map((exp, i) => (
        <motion.div
          key={exp.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-2xl p-5 border border-white/5 hover:border-brand-500/20 transition-colors group"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h4 className="font-display font-bold text-white text-sm">
                {exp.role}
              </h4>
              <p className="text-brand-400 text-xs mt-0.5">
                {exp.company} · {exp.period}
              </p>
            </div>
          </div>

          <p className="text-white/50 text-xs leading-relaxed mb-3">
            {exp.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {exp.tech.map((t) => (
              <span
                key={t}
                className="text-xs bg-brand-500/10 border border-brand-500/15 text-brand-400 rounded-full px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      ))}

      <ExperienceDrawer />
    </div>
  )
}