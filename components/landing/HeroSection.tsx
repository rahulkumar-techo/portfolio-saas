'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/index'

const HeroScene = dynamic(() => import('@/components/3d/HeroScene').then(m => ({ default: m.HeroScene })), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
})

// ─── Animated Counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = to / 60
    const timer = setInterval(() => {
      start += step
      if (start >= to) { setCount(to); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [to])
  return <>{count.toLocaleString()}{suffix}</>
}

// ─── Typing Headline ─────────────────────────────────────────────────────────
const TYPED_WORDS = ['Portfolio', 'ATS Resume', 'Career Page', 'Job Profile']

function TypingText() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const full = TYPED_WORDS[wordIndex]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    if (!deleting && displayed.length < full.length) {
      timeout = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 80)
    } else if (!deleting && displayed.length === full.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      timeout = setTimeout(() => {
        setDeleting(false)
        setWordIndex((i) => (i + 1) % TYPED_WORDS.length)
      }, 0)
    }
    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [displayed, deleting, full])

  return (
    <span className="text-gradient">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  )
}

// ─── Stats Row ────────────────────────────────────────────────────────────────
const STATS = [
  { value: 50000, suffix: '+', label: 'Portfolios Built' },
  { value: 92, suffix: '%', label: 'ATS Pass Rate' },
  { value: 3, suffix: 'x', label: 'More Interviews' },
  { value: 4.9, suffix: '★', label: 'User Rating' },
]

// ─── Main Hero ────────────────────────────────────────────────────────────────
export function HeroSection() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setMouse({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    })
  }, [isMobile])

  return (
    <section
      ref={containerRef}
      onMouseMove={onMouseMove}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Background layers */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] lg:w-[600px] lg:h-[600px] rounded-full bg-brand-600/8 blur-[80px] sm:blur-[100px] lg:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[500px] lg:h-[500px] rounded-full bg-cyan-500/6 blur-[70px] sm:blur-[90px] lg:blur-[100px] pointer-events-none" />
        <div className="absolute top-2/3 left-1/3 w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full bg-pink-500/5 blur-[60px] sm:blur-[75px] lg:blur-[80px] pointer-events-none" />
      </div>

      {/* 3D Canvas — full coverage on desktop, top portion on mobile */}
      <div className={`absolute ${isMobile ? 'inset-x-0 top-0 h-[50vh]' : 'inset-0'} pointer-events-none`}>
        <HeroScene mouseX={mouse.x} mouseY={mouse.y} isMobile={isMobile} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 text-center lg:grid-cols-2 lg:items-center lg:text-left gap-12 lg:gap-20">
            {/* Left: Text content */}
            <div className="pt-[42vh] sm:pt-[40vh] lg:pt-0 space-y-8">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-center gap-3 flex-wrap justify-center lg:justify-start"
              >
                <Badge variant="blue" dot>New — AI Career Score v2.0</Badge>
                <Badge variant="cyan">GPT-4 Powered</Badge>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h1 className="font-display font-bold leading-[1.1] text-white">
                  <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-2">
                    Build Your AI-Powered
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                    <TypingText />
                  </span>
                </h1>
              </motion.div>

              {/* Sub */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="text-white/55 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Convert your resume into a professional portfolio and job-winning CV in seconds. Beat ATS filters and land{' '}
                <span className="text-white/80 font-medium">3× more interviews</span>.
              </motion.p>

              {/* CTA Buttons */}

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col items-center lg:items-start gap-6 w-full"
              >
                {/* Main CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="text-base px-8 py-4 w-full sm:w-auto flex gap-2 items-center justify-center"
                    >
                      ✨ Generate Portfolio
                    </Button>
                  </Link>

                  <Link href="/dashboard" className="w-full sm:w-auto">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="text-base px-8 py-4 w-full sm:w-auto flex gap-2 items-center justify-center"
                    >
                      📄 Create ATS Resume
                    </Button>
                  </Link>
                </div>

                {/* Divider */}
                <div className="w-full max-w-sm border-t border-white/10" />

                {/* Admin Demo */}
                <Link href="/admin-profile" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base px-8 py-4 w-full sm:w-auto flex gap-2 items-center justify-center"
                  >
                    👀 See Admin Portfolio & Resume
                  </Button>
                </Link>
              </motion.div>

              {/* Trust */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="flex items-center gap-4 justify-center lg:justify-start text-sm text-white/35 flex-wrap"
              >
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> Free forever plan
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-emerald-400">✓</span> 2 min setup
                </span>
              </motion.div>
            </div>

            {/* Right: Visual (desktop only — mobile uses full canvas behind) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative h-[500px] items-center justify-center hidden lg:flex"
            >
              {/* Decorative ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[400px] h-[400px] rounded-full border border-brand-500/10 animate-spin-slow" />
                <div className="absolute w-[300px] h-[300px] rounded-full border border-cyan-500/10 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
              </div>

              {/* Floating stats cards */}
              {[
                { label: 'ATS Score', value: '97/100', color: '#22d3ee', pos: 'top-8 left-4' },
                { label: 'Career Score', value: '★ 9.2', color: '#fbbf24', pos: 'top-24 right-0' },
                { label: 'Profile Views', value: '+340%', color: '#34d399', pos: 'bottom-24 left-0' },
              ].map((card, idx) => (
                <motion.div
                  key={card.label}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4 + idx * 0.75, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute ${card.pos} glass rounded-xl p-3 border-gradient`}
                >
                  <div className="text-white/40 text-xs mb-1">{card.label}</div>
                  <div className="font-display font-bold text-lg" style={{ color: card.color }}>
                    {card.value}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-20 pt-10 border-t border-white/5"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
                    <Counter to={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/40 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="relative z-10 flex flex-col items-center pb-8 text-white/30 text-xs gap-2"
      >
        <span>Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-4 h-6 rounded-full border border-white/20 flex items-start justify-center p-1"
        >
          <div className="w-1 h-1.5 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
