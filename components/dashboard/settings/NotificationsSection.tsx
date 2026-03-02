'use client'

import { Card } from '@/components/ui'
import ToggleSwitch from './ToggleSwitch'

export default function NotificationsSection({
  notifications,
  setNotifications,
}: any) {
  const items = [
    { key: 'viewAlerts', label: 'Profile View Alerts' },
    { key: 'weeklyReport', label: 'Weekly Report' },
    { key: 'jobMatches', label: 'Job Matches' },
    { key: 'productUpdates', label: 'Product Updates' },
  ]

  return (
    <Card>
      <h3 className="font-display font-bold text-white text-base mb-5">
        Notifications
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.key} className="flex justify-between py-2">
            <span className="text-white text-sm">{item.label}</span>

            <ToggleSwitch
              checked={notifications[item.key]}
              onChange={() =>
                setNotifications((prev: any) => ({
                  ...prev,
                  [item.key]: !prev[item.key],
                }))
              }
            />
          </div>
        ))}
      </div>
    </Card>
  )
}