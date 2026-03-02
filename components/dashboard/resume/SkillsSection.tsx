'use client'

import { motion } from 'framer-motion'
import { MOCK_SKILLS } from '@/lib/data'

export default function SkillsSection() {
  return (
    <div className="space-y-4">
      {MOCK_SKILLS.map((group, i) => (
        <motion.div
          key={group.category}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-2xl p-5 border border-white/5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: group.color }}
            />
            <h4 className="font-display font-bold text-white text-sm">
              {group.category}
            </h4>
          </div>

          <div className="space-y-3">
            {group.skills.map((skill, index) => (
              <div key={skill.name}>
                {/* Label */}
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-white/70">{skill.name}</span>
                  <span className="text-white/40">{skill.level}%</span>
                </div>

                {/* Progress Bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{
                      duration: 1,
                      delay: index * 0.1,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${group.color}80, ${group.color})`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}