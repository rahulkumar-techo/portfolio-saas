'use client'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { MOCK_USER } from '@/lib/data'

export default function ContactSection() {
  return (
    <Card>
      <h3 className="font-display font-bold text-white text-sm mb-4">
        Contact Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Full Name', value: MOCK_USER.name },
          { label: 'Job Title', value: MOCK_USER.title },
          { label: 'Email', value: MOCK_USER.email },
          { label: 'Location', value: MOCK_USER.location },
          { label: 'GitHub', value: MOCK_USER.github },
          { label: 'LinkedIn', value: MOCK_USER.linkedin },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-white/40 text-xs mb-1.5 block">
              {field.label}
            </label>
            <input
              defaultValue={field.value}
              className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/40 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button size="sm" glow>
          Save Changes
        </Button>
      </div>
    </Card>
  )
}