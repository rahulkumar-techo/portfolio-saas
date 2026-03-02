'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DASHBOARD_NAV, MOCK_USER } from '@/lib/data'
import { Badge } from '@/components/ui/index'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const pathname = usePathname()

  const activeSection = DASHBOARD_NAV.find(n => {
    if (n.href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(n.href)
  })?.id ?? 'portfolio'

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      {/* ── Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="hidden md:flex flex-col h-full border-r border-brand-500/10 bg-surface-800/50 flex-shrink-0 overflow-hidden"
          >
            {/* Logo */}
            <div className="h-16 flex items-center px-5 border-b border-brand-500/10 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs font-display">P</span>
                </div>
                <span className="font-display font-bold text-white text-base">
                  Portfolio<span className="text-gradient-blue">AI</span>
                </span>
              </Link>
            </div>

            {/* User Card */}
            <div className="p-4 border-b border-brand-500/10 flex-shrink-0">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {MOCK_USER.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{MOCK_USER.name}</p>
                  <p className="text-white/40 text-xs truncate">@{MOCK_USER.username}</p>
                </div>
                <Badge variant="blue" className="ml-auto flex-shrink-0">Pro</Badge>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <p className="text-white/25 text-xs font-medium uppercase tracking-widest px-3 mb-3">Workspace</p>
              {DASHBOARD_NAV.map((item) => (
                <Link key={item.id} href={item.href}>
                  <motion.div
                    whileHover={{ x: 3 }}
                    className={`sidebar-item ${activeSection === item.id ? 'active' : 'text-white/55'}`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                    {item.id === 'ats' && (
                      <Badge variant="green" className="ml-auto text-xs">92</Badge>
                    )}
                  </motion.div>
                </Link>
              ))}

              <div className="pt-4 mt-4 border-t border-white/5">
                <p className="text-white/25 text-xs font-medium uppercase tracking-widest px-3 mb-3">Account</p>
                <Link href="/alexchen" target="_blank">
                  <div className="sidebar-item text-white/55">
                    <span>🔗</span>
                    <span>View Live Portfolio</span>
                  </div>
                </Link>
                <div className="sidebar-item text-white/55 cursor-pointer">
                  <span>📤</span>
                  <span>Export Resume</span>
                </div>
                <div className="sidebar-item text-white/55 cursor-pointer">
                  <span>🚪</span>
                  <span>Sign Out</span>
                </div>
              </div>
            </nav>

            {/* ATS Score Widget */}
            <div className="p-4 border-t border-brand-500/10 flex-shrink-0">
              <div className="p-4 rounded-xl glass border border-emerald-500/15">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/60 text-xs font-medium">ATS Score</span>
                  <span className="text-emerald-400 font-bold font-display text-lg">92</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                  />
                </div>
                <p className="text-white/30 text-xs mt-2">Excellent • Top 8% of applicants</p>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main Content ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-brand-500/10 bg-surface-800/30 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex w-8 h-8 items-center justify-center rounded-lg border border-white/10 hover:border-brand-500/30 text-white/50 hover:text-white transition-all"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>

            {/* Mobile logo */}
            <span className="md:hidden font-display font-bold text-white text-base">
              Portfolio<span className="text-gradient-blue">AI</span>
            </span>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/3 border border-white/8 text-white/40 text-sm">
              <span>🔍</span>
              <span>Search...</span>
              <span className="ml-4 text-xs bg-white/10 rounded px-1.5 py-0.5">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 hover:border-brand-500/30 text-white/50 hover:text-white transition-all">
              🔔
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
              {MOCK_USER.name[0]}
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-brand-500/10 bg-surface-900/95 backdrop-blur-xl">
        <div className="flex items-center justify-around px-2 py-2">
          {DASHBOARD_NAV.slice(0, 5).map((item:any) => (
            <Link key={item.id} href={item.href} className="flex flex-col items-center gap-1 py-1 px-3 flex-1">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  activeSection === item.id
                    ? 'bg-brand-600/20 border border-brand-500/30'
                    : ''
                }`}
              >
                <span className="text-base">{item.icon}</span>
              </motion.div>
              <span className={`text-xs font-medium truncate w-full text-center ${
                activeSection === item.id ? 'text-brand-400' : 'text-white/35'
              }`}>
                {item.label.split(' ')[0]}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
