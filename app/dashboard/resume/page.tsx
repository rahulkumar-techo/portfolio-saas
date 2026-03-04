'use client'

import { useEffect, useState } from 'react'
import ResumeHeader from '@/components/dashboard/resume/ResumeHeader'
import ResumeSidebar from '@/components/dashboard/resume/ResumeSidebar'
import AISuggestionBanner from '@/components/dashboard/resume/AISuggestionBanner'
import ExperienceSection from '@/components/dashboard/resume/ExperienceSection'
import SkillsSection from '@/components/dashboard/resume/SkillsSection'
import ContactSection from '@/components/dashboard/resume/ContactSection'
import EducationSection from '@/components/dashboard/resume/EducationSection'
import ProjectsSection from '@/components/dashboard/resume/ProjectsSection'
import CertificationsSection from '@/components/dashboard/resume/CertificationsSection'
import EmptySection from '@/components/dashboard/resume/EmptySection'
import useContact from '@/hooks/resume/useContact'

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState('experience')
  const [parsing, setParsing] = useState(false)

  const handleParse = () => {
    setParsing(true)
    setTimeout(() => setParsing(false), 2500)
  }
  const { contact, updateContact, fetchContact } = useContact()

  useEffect(() => {
    if (activeSection === 'contact') {
      fetchContact()
    }
  }, [activeSection, fetchContact])

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
          {activeSection === 'education' && <EducationSection />}
          {activeSection === 'projects' && <ProjectsSection />}
          {activeSection === 'certifications' && <CertificationsSection />}
          {activeSection === 'contact' && <ContactSection contactData={contact} setContactData={updateContact} />}

          {!['experience', 'skills', 'contact', 'education', 'projects', 'certifications'].includes(activeSection) && (
            <EmptySection activeSection={activeSection} />
          )}
        </div>
      </div>
    </div>
  )
}
