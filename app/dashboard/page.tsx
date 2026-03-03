'use client'

import DashboardHeader from '@/components/dashboard/home/DashboardHeader'
import StatsGrid from '@/components/dashboard/home/StatsGrid'
import TrafficChart from '@/components/dashboard/home/TrafficChart'
import DeviceSplit from '@/components/dashboard/home/DeviceSplit'
import SkillScores from '@/components/dashboard/home/SkillScores'
import TopCountries from '@/components/dashboard/home/TopCountries';
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  
  const { data: session, status } = useSession()
  
  console.log("Rendering DashboardPage", session) // Debug log
  return (
    <div className="space-y-6 max-w-7xl">
      <DashboardHeader />
      <StatsGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <TrafficChart />
        <DeviceSplit />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SkillScores />
        <TopCountries />
      </div>
    </div>
  )
}