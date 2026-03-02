export const ATS_CHECKS = [
  { label: 'Keywords Match', score: 94, status: 'excellent', description: '47/50 target keywords found in your resume.' },
  { label: 'Format & Parsing', score: 100, status: 'excellent', description: 'Clean, ATS-readable format detected.' },
  { label: 'Section Headers', score: 88, status: 'good', description: 'All major sections present. Consider adding "Certifications".' },
  { label: 'Contact Info', score: 100, status: 'excellent', description: 'All contact fields properly formatted.' },
  { label: 'Date Formatting', score: 82, status: 'good', description: 'Some dates use inconsistent formatting.' },
  { label: 'Skills Section', score: 90, status: 'good', description: 'Strong skills list. Add more technical keywords.' },
  { label: 'Quantified Achievements', score: 72, status: 'warning', description: 'Add more numbers & metrics to achievements.' },
  { label: 'Action Verbs', score: 78, status: 'warning', description: 'Some bullet points lack strong action verbs.' },
]

export const STATUS_CONFIG = {
  excellent: { color: '#22d3ee', bg: '#22d3ee15', label: 'Excellent', badge: 'cyan' as const },
  good: { color: '#34d399', bg: '#34d39915', label: 'Good', badge: 'green' as const },
  warning: { color: '#fbbf24', bg: '#fbbf2415', label: 'Improve', badge: 'yellow' as const },
}