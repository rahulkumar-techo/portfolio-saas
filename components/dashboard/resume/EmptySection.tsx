'use client'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui/Button'

const RESUME_SECTIONS = [
  { id: 'contact', label: 'Contact Info', icon: '👤' },
  { id: 'summary', label: 'Professional Summary', icon: '📝' },
  { id: 'experience', label: 'Work Experience', icon: '💼' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'projects', label: 'Projects', icon: '🚀' },
  { id: 'certifications', label: 'Certifications', icon: '🏅' },
]

export default function EmptySection({
  activeSection,
  onAdd,
}: {
  activeSection: string
  onAdd?: (section: string) => void
}) {
  const section = RESUME_SECTIONS.find(s => s.id === activeSection)

  const showAddButton = ['education', 'projects', 'certifications'].includes(activeSection)

  return (
    <Card className="text-center py-12">
      <div className="text-4xl mb-3">{section?.icon}</div>

      <h3 className="font-display font-bold text-white text-lg mb-2">
        {section?.label}
      </h3>

      <p className="text-white/40 text-sm mb-6">
        No entries yet. Add your first one.
      </p>

      {showAddButton && (
        <Button
          size="sm"
          glow
          icon={<span>+</span>}
          onClick={() => onAdd?.(activeSection)}
        >
          Add {section?.label}
        </Button>
      )}
    </Card>
  )
}