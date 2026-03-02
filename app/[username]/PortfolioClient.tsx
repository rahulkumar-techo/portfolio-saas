'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import {
  MOCK_USER, MOCK_SKILLS, MOCK_PROJECTS, MOCK_EXPERIENCE
} from '@/lib/data'

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function RevealOnScroll({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
const SECTIONS = ['About', 'Skills', 'Projects', 'Experience', 'Contact']

function PortfolioNav({ username }: { username: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('about')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
      const sects = SECTIONS.map(s => ({
        id: s.toLowerCase(),
        top: document.getElementById(s.toLowerCase())?.getBoundingClientRect().top ?? 999,
      }))
      const current = sects.find(s => s.top > -50 && s.top < 300)
      if (current) setActive(current.id)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl bg-surface-900/85 border-b border-brand-500/10' : 'bg-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-white/80 hover:text-white transition-colors text-sm">
          ← PortfolioAI
        </Link>

        <div className="hidden sm:flex items-center gap-1">
          {SECTIONS.map(s => (
            <a
              key={s}
              href={`#${s.toLowerCase()}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                active === s.toLowerCase()
                  ? 'text-brand-400 bg-brand-500/10'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              {s}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="text-xs font-medium px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-500 transition-colors"
        >
          Hire Me
        </a>
      </div>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function PortfolioHero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Bg */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand-600/6 blur-[150px]" />

      <motion.div style={{ y, opacity }} className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mx-auto mb-8 relative inline-block"
        >
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-cyan-500 flex items-center justify-center text-5xl font-bold text-white font-display shadow-2xl shadow-brand-500/30">
            {MOCK_USER.name[0]}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center border-2 border-surface-900 text-sm">
            ✓
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
            {MOCK_USER.name}
          </h1>
          <p className="text-brand-400 font-medium text-lg sm:text-xl">{MOCK_USER.title}</p>
          <p className="text-white/50 text-base leading-relaxed max-w-xl mx-auto">
            {MOCK_USER.bio}
          </p>
        </motion.div>

        {/* Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4 flex-wrap mt-6 text-white/40 text-sm"
        >
          <span>📍 {MOCK_USER.location}</span>
          <span>•</span>
          <a href={`mailto:${MOCK_USER.email}`} className="hover:text-brand-400 transition-colors">{MOCK_USER.email}</a>
          <span>•</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Open to work</span>
        </motion.div>

        {/* Socials */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex items-center justify-center gap-3 mt-8 flex-wrap"
        >
          {[
            { label: 'GitHub', href: `https://${MOCK_USER.github}`, emoji: '⚡' },
            { label: 'LinkedIn', href: `https://${MOCK_USER.linkedin}`, emoji: '💼' },
            { label: 'Twitter', href: '#', emoji: '𝕏' },
            { label: 'Download CV', href: '#', emoji: '📄', highlight: true },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                link.highlight
                  ? 'bg-brand-600 text-white hover:bg-brand-500'
                  : 'glass border border-white/10 text-white/60 hover:text-white hover:border-brand-500/30'
              }`}
            >
              <span>{link.emoji}</span>
              {link.label}
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/25 text-xs flex flex-col items-center gap-2"
      >
        <span>Scroll</span>
        <span>↓</span>
      </motion.div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────
function AboutSection() {
  const stats = [
    { label: 'Years Experience', value: '5+' },
    { label: 'Projects Shipped', value: '40+' },
    { label: 'Open Source Stars', value: '8.6K' },
    { label: 'Companies', value: '4' },
  ]

  return (
    <section id="about" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium uppercase tracking-widest">About Me</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">Crafting digital experiences</h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, i) => (
            <RevealOnScroll key={stat.label} delay={i * 0.08}>
              <div className="glass rounded-2xl p-5 text-center border border-white/5">
                <div className="font-display font-bold text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-white/40 text-xs">{stat.label}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="glass rounded-2xl p-8 border border-brand-500/10">
            <p className="text-white/65 text-lg leading-relaxed">{MOCK_USER.bio}</p>
            <p className="text-white/65 text-base leading-relaxed mt-4">
              When I'm not building products, you'll find me contributing to open source, writing technical deep-dives, or mentoring junior developers. I believe great software is built at the intersection of engineering rigor and thoughtful design.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

// ─── Skills ───────────────────────────────────────────────────────────────────
function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium uppercase tracking-widest">Technical Skills</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">My tech stack</h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {MOCK_SKILLS.map((group, gi) => (
            <RevealOnScroll key={group.category} delay={gi * 0.12}>
              <div className="glass rounded-2xl p-6 border border-white/5 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-2 h-5 rounded-full" style={{ background: group.color }} />
                  <h3 className="font-display font-bold text-white text-sm">{group.category}</h3>
                </div>
                <div className="space-y-4">
                  {group.skills.map((skill, si) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1.5 text-xs">
                        <span className="text-white/70">{skill.name}</span>
                        <span style={{ color: group.color }}>{skill.level}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: si * 0.08 }}
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${group.color}60, ${group.color})` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Projects ─────────────────────────────────────────────────────────────────
function ProjectsSection() {
  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium uppercase tracking-widest">Featured Work</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">Projects I'm proud of</h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {MOCK_PROJECTS.map((proj, i) => (
            <RevealOnScroll key={proj.id} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -6 }}
                className="glass rounded-2xl overflow-hidden border border-white/5 hover:border-brand-500/25 transition-all duration-300 group cursor-pointer h-full flex flex-col"
              >
                <div className="h-40 relative overflow-hidden" style={{ background: proj.image }}>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50">
                    <span className="text-white text-sm font-medium glass px-4 py-2 rounded-xl">View Project →</span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 text-white/60 text-xs bg-black/30 rounded-lg px-2 py-1">
                    ⭐ {proj.stars.toLocaleString()}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-display font-bold text-white text-base mb-2">{proj.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed flex-1">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {proj.tech.map(t => (
                      <span key={t} className="text-xs bg-brand-500/10 border border-brand-500/15 text-brand-400 rounded-full px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Experience ───────────────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <section id="experience" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <span className="text-brand-400 text-sm font-medium uppercase tracking-widest">Work History</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3">Experience</h2>
          </div>
        </RevealOnScroll>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/40 via-brand-500/20 to-transparent" />

          <div className="space-y-8">
            {MOCK_EXPERIENCE.map((exp, i) => (
              <RevealOnScroll key={exp.id} delay={i * 0.1}>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 border border-brand-500/30 flex items-center justify-center text-white font-bold font-display text-sm relative z-10">
                    {exp.company[0]}
                  </div>
                  <div className="flex-1 glass rounded-2xl p-5 border border-white/5 hover:border-brand-500/15 transition-colors">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
                      <div>
                        <h3 className="font-display font-bold text-white text-base">{exp.role}</h3>
                        <p className="text-brand-400 text-sm">{exp.company}</p>
                      </div>
                      <span className="text-white/35 text-xs bg-white/5 rounded-lg px-3 py-1 flex-shrink-0">{exp.period}</span>
                    </div>
                    <p className="text-white/55 text-sm leading-relaxed mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tech.map(t => (
                        <span key={t} className="text-xs bg-white/5 border border-white/8 text-white/40 rounded-full px-2 py-0.5">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function ContactSection() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section id="contact" className="py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-12">
            <span className="text-brand-400 text-sm font-medium uppercase tracking-widest">Get In Touch</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mt-3 mb-4">Let's work together</h2>
            <p className="text-white/50 leading-relaxed">
              Open to senior roles, fractional CTO opportunities, and interesting open source collaborations.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <div className="glass rounded-2xl p-8 border border-brand-500/15">
            {sent ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✉️</div>
                <h3 className="font-display font-bold text-white text-xl mb-2">Message Sent!</h3>
                <p className="text-white/50">I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Your Name</label>
                    <input required className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500/40 transition-colors" placeholder="Jane Smith" />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs block mb-1.5">Email</label>
                    <input required type="email" className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500/40 transition-colors" placeholder="jane@company.com" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-xs block mb-1.5">Subject</label>
                  <input className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-500/40 transition-colors" placeholder="Senior Engineer opportunity at Acme" />
                </div>
                <div>
                  <label className="text-white/40 text-xs block mb-1.5">Message</label>
                  <textarea required rows={4} className="w-full bg-white/3 border border-white/8 rounded-xl px-4 py-3 text-white text-sm resize-none focus:outline-none focus:border-brand-500/40 transition-colors" placeholder="Hi Alex, we're looking for..." />
                </div>
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-500 text-white font-medium py-3.5 rounded-xl transition-colors">
                  Send Message →
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

// ─── Main Portfolio Page ──────────────────────────────────────────────────────
export function PortfolioClient({ username }: { username: string }) {
  return (
    <main className="min-h-screen bg-surface-900">
      <PortfolioNav username={username} />
      <PortfolioHero />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ExperienceSection />
      <ContactSection />

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-white/25 text-sm">
          Built with{' '}
          <Link href="/" className="text-brand-400 hover:text-brand-300 transition-colors">PortfolioAI</Link>
          {' '}· © {new Date().getFullYear()} {MOCK_USER.name}
        </p>
      </footer>
    </main>
  )
}
