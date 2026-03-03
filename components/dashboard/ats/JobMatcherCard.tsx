'use client'

import { Card } from '@/components/ui'
import { Button } from '@/components/ui/button'

export default function JobMatcherCard({
  jobDescription,
  setJobDescription,
  analyzing,
  onAnalyze,
}: any) {
  return (
    <Card>
      <h3 className="font-display font-bold text-white text-base mb-1">
        Match Against Job Description
      </h3>

      <p className="text-white/40 text-sm mb-4">
        Paste a job posting to get a tailored keyword analysis
      </p>

      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Paste the job description here..."
        className="w-full h-32 bg-white/3 border border-white/10 rounded-xl p-4 text-white/70 text-sm resize-none"
      />

      <div className="flex justify-end mt-3">
        <Button loading={analyzing} onClick={onAnalyze} size="sm" glow>
          {analyzing ? 'Analyzing...' : '🎯 Analyze Match'}
        </Button>
      </div>
    </Card>
  )
}