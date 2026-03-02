'use client'

import { useState } from 'react'
import SettingsHeader from '@/components/dashboard/settings/SettingsHeader'
import ProfileSection from '@/components/dashboard/settings/ProfileSection'
import ThemeSection from '@/components/dashboard/settings/ThemeSection'
import NotificationsSection from '@/components/dashboard/settings/NotificationsSection'
import DangerZone from '@/components/dashboard/settings/DangerZone'
import SaveBar from '@/components/dashboard/settings/SaveBar'

export default function SettingsPage() {
  const [selectedTheme, setSelectedTheme] = useState('nebula')
  const [notifications, setNotifications] = useState({
    viewAlerts: true,
    weeklyReport: true,
    jobMatches: false,
    productUpdates: true,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <SettingsHeader />

      <ProfileSection />

      <ThemeSection
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
      />

      <NotificationsSection
        notifications={notifications}
        setNotifications={setNotifications}
      />

      <DangerZone />

      <SaveBar saved={saved} onSave={handleSave} />
    </div>
  )
}