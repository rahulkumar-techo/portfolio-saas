'use client'

import { Button } from '@/components/ui/Button'

export default function ResumeHeader({
  parsing,
  onParse,
}: {
  parsing: boolean
  onParse: () => void
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
          Resume Builder
        </h1>
        <p className="text-white/40 text-sm">
          Build and optimize your ATS-ready resume
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button variant="outline" size="sm" icon={<span>📥</span>}>
          Import PDF
        </Button>

        <Button loading={parsing} onClick={onParse} variant="secondary" size="sm">
          🧠 Parse with AI
        </Button>

        <Button size="sm" glow icon={<span>📤</span>}>
          Export PDF
        </Button>
      </div>
    </div>
  )
}