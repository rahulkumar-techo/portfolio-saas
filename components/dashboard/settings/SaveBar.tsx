'use client'

import { Button } from '@/components/ui/Button'

export default function SaveBar({
  saved,
  onSave,
}: {
  saved: boolean
  onSave: () => void
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-white/30 text-xs">
        Changes are saved to your account
      </p>

      <Button onClick={onSave} glow>
        {saved ? '✓ Saved!' : 'Save All Changes'}
      </Button>
    </div>
  )
}