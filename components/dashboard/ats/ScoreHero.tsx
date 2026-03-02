'use client'

import { Badge } from '@/components/ui'
import BigScoreRing from './BigScoreRing'

export default function ScoreHero() {
  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <BigScoreRing score={92} />

        <div className="flex-1 text-center md:text-left">
          <Badge variant="cyan" dot className="mb-3">
            Excellent Score
          </Badge>

          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Your resume beats <span className="text-gradient">92% of applicants</span>
          </h2>

          <p className="text-white/50 text-sm leading-relaxed mb-6">
            Strong keyword density, clean formatting, and quantified achievements.
            A few small improvements could push you to 95+.
          </p>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Keywords', value: '47/50', color: '#22d3ee' },
              { label: 'Sections', value: '8/9', color: '#34d399' },
              { label: 'Issues', value: '3 minor', color: '#fbbf24' },
            ].map((s) => (
              <div key={s.label} className="text-center p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="font-display font-bold text-lg" style={{ color: s.color }}>
                  {s.value}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}