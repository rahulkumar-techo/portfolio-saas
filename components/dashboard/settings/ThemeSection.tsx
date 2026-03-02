'use client'

import { Card } from '@/components/ui'

const THEME_OPTIONS = [
  { id: 'nebula', name: 'Nebula', preview: 'linear-gradient(135deg,#1a1a3e,#0a0a1a)' },
  { id: 'aurora', name: 'Aurora', preview: 'linear-gradient(135deg,#0a1a2e,#1a0a2e)' },
  { id: 'void', name: 'Void', preview: 'linear-gradient(135deg,#030308,#0a0a18)' },
]

export default function ThemeSection({
  selectedTheme,
  setSelectedTheme,
}: any) {
  return (
    <Card>
      <h3 className="font-display font-bold text-white text-base mb-2">
        Portfolio Theme
      </h3>

      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelectedTheme(theme.id)}
            className={`relative rounded-xl overflow-hidden border-2 ${
              selectedTheme === theme.id
                ? 'border-brand-500'
                : 'border-white/10'
            }`}
          >
            <div className="h-20" style={{ background: theme.preview }} />
            <div className="p-2 bg-white/3">
              <p className="text-white text-xs font-medium">
                {theme.name}
              </p>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}