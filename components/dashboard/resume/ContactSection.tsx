/**
 * Contact Section
 * Controlled form with fallback + sync
 */

'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui'
import { Button } from '@/components/ui/button'
import type { ContactInterface } from '@/hooks/resume/useContact'

interface ContactSectionProps {
  contactData?: ContactInterface | null
  setContactData?: (data: ContactInterface) => void
}

export default function ContactSection({
  contactData,
  setContactData,
}: ContactSectionProps) {

  /* ---------------- Initial State ---------------- */

  const [formData, setFormData] = useState<ContactInterface>({
    name: '',
    title: '',
    email: '',
    location: '',
    github: '',
    linkedin: '',
  })

  /* ---------------- Sync When API Data Changes ---------------- */

  useEffect(() => {
    if (contactData) {
      setFormData({
        name: contactData.name ?? '',
        title: contactData.title ?? '',
        email: contactData.email ?? '',
        location: contactData.location ?? '',
        github: contactData.github ?? '',
        linkedin: contactData.linkedin ?? '',
      })
    }
  }, [contactData])

  /* ---------------- Handle Change ---------------- */

  const handleChange = (
    key: keyof ContactInterface,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  /* ---------------- Save ---------------- */

  const handleSaveChanges = () => {
    if (setContactData) {
      setContactData(formData)
    }
  }

  const fields = [
    { label: 'Full Name', key: 'name' },
    { label: 'Job Title', key: 'title' },
    { label: 'Email', key: 'email' },
    { label: 'Location', key: 'location' },
    { label: 'GitHub', key: 'github' },
    { label: 'LinkedIn', key: 'linkedin' },
  ] as const

  return (
    <Card>
      <h3 className="font-display font-bold text-white text-sm mb-4">
        Contact Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.key}>
            <label className="text-white/40 text-xs mb-1.5 block">
              {field.label}
            </label>

            <input
              value={formData[field.key] ?? ''}
              onChange={(e) =>
                handleChange(field.key, e.target.value)
              }
              className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-500/40 transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button size="sm"  onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </div>
    </Card>
  )
}
