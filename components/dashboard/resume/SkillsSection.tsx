'use client'

/**
 * Skills Section
 * Fetch + Edit + Delete skill groups
 */

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash } from 'lucide-react'
import useSkills from '@/hooks/resume/useSkills'
import SkillsForm from '@/components/ui/resume/SkillsForm'
import { SkillGroup } from '@/types/server-types/resume'

export default function SkillsSection() {

  const {
    skillGroups,
    fetchSkills,
    updateSkills,
    deleteSkillGroup,
    loading
  } = useSkills()

  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  return (
    <div className="space-y-4">

      {/* Skill Groups */}
      {skillGroups.map((group: SkillGroup, i: number) => (
        <motion.div
          key={group.category}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass rounded-2xl p-5 border border-white/5"
        >

          {/* Header */}
          <div className="flex items-center justify-between mb-4">

            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: group.color }}
              />
              <h4 className="font-display font-bold text-white text-sm">
                {group.category}
              </h4>
            </div>

            {/* Actions */}
            <div className="flex gap-3 text-white/50">
              <button
                onClick={async () => {
                  const ok = await deleteSkillGroup(group.category)
                  if (!ok) {
                    setFormError("Failed to delete skill group")
                  }
                }}
                className="hover:text-red-400 transition"
              >
                <Trash size={14} />
              </button>

            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            {group.skills.map((skill, index) => (
              <div key={skill.name}>

                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="text-white/70">
                    {skill.name}
                  </span>

                  <span className="text-white/40">
                    {skill.level}%
                  </span>
                </div>

                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.08,
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

      {formError && (
        <p className="text-sm text-red-500">{formError}</p>
      )}

      {/* Add / Update Form */}
      <SkillsForm
        loading={loading}
        initialData={skillGroups}
        onSubmit={async (data) => {
          setFormError(null)
          const updated = await updateSkills(data)
          if (!updated) {
            setFormError("Failed to save skills")
          }
        }}
      />

    </div>
  )
}
