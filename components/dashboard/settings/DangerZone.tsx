'use client'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui/Button'

export default function DangerZone() {
  return (
    <Card className="border border-red-500/15">
      <h3 className="font-display font-bold text-white text-base mb-2">
        Danger Zone
      </h3>

      <div className="flex gap-3">
        <Button variant="danger" size="sm">
          Delete Portfolio
        </Button>
        <Button variant="danger" size="sm">
          Delete Account
        </Button>
      </div>
    </Card>
  )
}