'use client'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui/button'
import { MOCK_USER } from '@/lib/data'

export default function ProfileSection() {
  return (
    <Card>
      <h3 className="font-display font-bold text-white text-base mb-5">
        Profile Information
      </h3>

      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">
          {MOCK_USER.name[0]}
        </div>
        <div>
          <Button variant="outline" size="sm">
            Change Photo
          </Button>
          <p className="text-white/30 text-xs mt-1.5">
            JPG, PNG, or GIF. Max 5MB.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Display Name', value: MOCK_USER.name },
          { label: 'Username', value: MOCK_USER.username, prefix: '@' },
          { label: 'Email', value: MOCK_USER.email, type: 'email' },
          { label: 'Location', value: MOCK_USER.location },
          { label: 'GitHub URL', value: MOCK_USER.github },
          { label: 'LinkedIn URL', value: MOCK_USER.linkedin },
        ].map((field) => (
          <div key={field.label}>
            <label className="text-white/40 text-xs mb-1.5 block">
              {field.label}
            </label>

            <div className="flex rounded-xl overflow-hidden border border-white/8">
              {field.prefix && (
                <span className="px-3 py-2.5 bg-white/3 text-white/30 text-sm border-r border-white/8">
                  {field.prefix}
                </span>
              )}

              <input
                type={field.type || 'text'}
                defaultValue={field.value}
                className="flex-1 bg-white/3 px-4 py-2.5 text-white text-sm focus:outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <label className="text-white/40 text-xs mb-1.5 block">Bio</label>
        <textarea
          defaultValue={MOCK_USER.bio}
          rows={3}
          className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none"
        />
      </div>
    </Card>
  )
}