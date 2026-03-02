'use client'

import { useState } from 'react'
import ResumeHeader from '@/components/dashboard/resume/ResumeHeader'
import ResumeSidebar from '@/components/dashboard/resume/ResumeSidebar'
import AISuggestionBanner from '@/components/dashboard/resume/AISuggestionBanner'
import ExperienceSection from '@/components/dashboard/resume/ExperienceSection'
import SkillsSection from '@/components/dashboard/resume/SkillsSection'
import ContactSection from '@/components/dashboard/resume/ContactSection'
import EmptySection from '@/components/dashboard/resume/EmptySection'

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('experience')
  const [parsing, setParsing] = useState(false)

  const handleParse = () => {
    setParsing(true)
    setTimeout(() => setParsing(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <ResumeHeader parsing={parsing} onParse={handleParse} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ResumeSidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />

        <div className="lg:col-span-2 space-y-4">
          <AISuggestionBanner />

          {activeSection === 'experience' && <ExperienceSection />}
          {activeSection === 'skills' && <SkillsSection />}
          {activeSection === 'contact' && <ContactSection />}

          {!['experience', 'skills', 'contact'].includes(activeSection) && (
            <EmptySection activeSection={activeSection} />
          )}
        </div>
      </div>
    </div>
  )
}