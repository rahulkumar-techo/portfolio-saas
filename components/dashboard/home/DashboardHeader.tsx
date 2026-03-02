'use client'

import { MOCK_USER } from '@/lib/data'
import { Button } from '@/components/ui/Button'

export default function DashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
          Welcome back, {MOCK_USER.name.split(' ')[0]} 👋
        </h1>
        <p className="text-white/40 text-sm">
          portfolioai.app/{MOCK_USER.username}
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" size="sm">📤 Export PDF</Button>
        <Button size="sm" glow>✏️ Edit Portfolio</Button>
      </div>
    </div>
  )
}