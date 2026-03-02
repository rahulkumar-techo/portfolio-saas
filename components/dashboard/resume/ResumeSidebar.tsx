'use client'

import ResumeProgress from './ResumeProgress'

const RESUME_SECTIONS = [
  { id: 'contact', label: 'Contact Info', icon: '👤', complete: true },
  { id: 'summary', label: 'Professional Summary', icon: '📝', complete: true },
  { id: 'experience', label: 'Work Experience', icon: '💼', complete: true },
  { id: 'skills', label: 'Skills', icon: '⚡', complete: true },
  { id: 'education', label: 'Education', icon: '🎓', complete: true },
  { id: 'projects', label: 'Projects', icon: '🚀', complete: false },
  { id: 'certifications', label: 'Certifications', icon: '🏅', complete: false },
]

export default function ResumeSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: string
  setActiveSection: (id: string) => void
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display font-bold text-white text-sm mb-4">
        Resume Sections
      </h3>

      <div className="space-y-1.5">
        {RESUME_SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
              activeSection === sec.id
                ? 'bg-brand-600/15 border border-brand-500/25 text-white'
                : 'text-white/55 hover:bg-white/3 hover:text-white'
            }`}
          >
            <span>{sec.icon}</span>
            <span className="flex-1 text-left font-medium">{sec.label}</span>
            {sec.complete ? (
              <span className="text-emerald-400 text-xs">✓</span>
            ) : (
              <span className="text-yellow-400/60 text-xs">○</span>
            )}
          </button>
        ))}
      </div>

      <ResumeProgress />
    </div>
  )
}