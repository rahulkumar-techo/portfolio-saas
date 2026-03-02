'use client'

import AnalyticsHeader from '@/components/dashboard/analytics/AnalyticsHeader'
import KPISection from '@/components/dashboard/analytics/KPISection'
import TrafficChart from '@/components/dashboard/analytics/TrafficChart'
import TopPages from '@/components/dashboard/analytics/TopPages'
import TopCountries from '@/components/dashboard/analytics/TopCountries'
import DeviceChart from '@/components/dashboard/analytics/DeviceChart'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-6xl">
      <AnalyticsHeader />
      <KPISection />
      <TrafficChart />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <TopPages />
        <TopCountries />
        <DeviceChart />
      </div>
    </div>
  )
}