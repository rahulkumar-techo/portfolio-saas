'use client'

import ProgressRing from './ProgressRing'

export default function SkillScores() {
  const scores = [
    { label: 'ATS Score', value: 92, color: '#22d3ee' },
    { label: 'Career Score', value: 87, color: '#fbbf24' },
    { label: 'Profile Strength', value: 78, color: '#5b6cff' },
    { label: 'Keyword Match', value: 94, color: '#34d399' },
  ]

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-white mb-6">Skill Scores</h3>

      <div className="grid grid-cols-2 gap-6">
        {scores.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <ProgressRing value={s.value} color={s.color} />
            <span className="text-white/50 text-xs mt-2">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}