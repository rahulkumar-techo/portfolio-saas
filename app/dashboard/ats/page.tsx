'use client'

import { useState } from 'react'
import ATSHeader from '@/components/dashboard/ats/ATSHeader'
import ScoreHero from '@/components/dashboard/ats/ScoreHero'
import JobMatcherCard from '@/components/dashboard/ats/JobMatcherCard'
import DetailedChecks from '@/components/dashboard/ats/DetailedChecks'

export default function ATSPage() {
  const [jobDescription, setJobDescription] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => setAnalyzing(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <ATSHeader />
      <ScoreHero />
      <JobMatcherCard
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        analyzing={analyzing}
        onAnalyze={handleAnalyze}
      />
      <DetailedChecks />
    </div>
  )
}