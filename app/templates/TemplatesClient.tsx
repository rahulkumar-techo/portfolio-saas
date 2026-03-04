'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'
import { Section, SectionHeader, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/button'
import { TEMPLATES, type Template } from '@/lib/data'

type Category = 'all' | Template['category']

const CATEGORIES: { id: Category; label: string; icon: string }[] = [
  { id: 'all', label: 'All Templates', icon: '✦' },
  { id: 'developer', label: 'Developer', icon: '💻' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'corporate', label: 'Corporate', icon: '🤵' },
]

export function TemplatesClient() {
  const [active, setActive] = useState<Category>('all')
  const [hovered, setHovered] = useState<string | null>(null)

  const filtered = active === 'all'
    ? TEMPLATES
    : TEMPLATES.filter((t) => t.category === active)

  return (
    <main className="min-h-screen bg-surface-900">
      <Navbar />

      <div className="pt-24">
        <Section>
          <SectionHeader
            eyebrow="Portfolio Templates"
            title="Pick your perfect template"
            highlight="perfect"
            description="Professional, responsive, and fully customizable templates for every industry."
          />

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active === cat.id
                    ? 'bg-brand-600 text-white border border-brand-500/40'
                    : 'glass text-white/60 hover:text-white border border-white/10 hover:border-brand-500/20'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.label}
              </motion.button>
            ))}
          </div>

          {/* Template Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((template, i) => (
                <motion.div
                  key={template.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  onHoverStart={() => setHovered(template.id)}
                  onHoverEnd={() => setHovered(null)}
                  className="group relative"
                >
                  <TemplateCard
                    template={template}
                    hovered={hovered === template.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-white/40 text-sm mb-4">
              Can&apos;t find what you&apos;re looking for? Request a custom template.
            </p>
            <Button variant="outline" size="sm">
              Request Custom Template
            </Button>
          </motion.div>
        </Section>
      </div>

      <Footer />
    </main>
  )
}

function TemplateCard({ template, hovered }: { template: Template; hovered: boolean }) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/5 hover:border-brand-500/30 transition-all duration-300 group cursor-pointer"
      style={{ boxShadow: hovered ? `0 20px 60px ${template.color}15, 0 0 0 1px ${template.color}20` : undefined }}
    >
      {/* Preview Area */}
      <div
        className="h-52 relative overflow-hidden"
        style={{ background: template.preview }}
      >
        {/* Simulated portfolio content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
          {/* Header bar */}
          <div className="w-full h-6 rounded-full opacity-20 flex items-center gap-2 px-3" style={{ background: template.color }}>
            {[1,2,3].map(d=><div key={d} className="w-1 h-1 rounded-full bg-white/60"/>)}
          </div>
          {/* Hero mockup */}
          <div className="w-full flex-1 rounded-xl opacity-10" style={{ background: template.color }} />
          {/* Grid mockup */}
          <div className="w-full grid grid-cols-3 gap-1.5">
            {[1,2,3].map(d=><div key={d} className="h-8 rounded-lg opacity-10" style={{ background: template.color }}/>)}
          </div>
        </div>

        {/* Overlay on hover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 flex items-center justify-center gap-3 z-10"
          style={{ background: 'rgba(5,5,16,0.85)' }}
        >
          <Link href={`/alexchen`}>
            <Button size="sm" variant="outline" className="backdrop-blur">
              Preview
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm">
              Use Template
            </Button>
          </Link>
        </motion.div>

        {/* Popular badge */}
        {template.popular && (
          <div className="absolute top-3 left-3 z-20">
            <Badge variant="yellow" dot>Popular</Badge>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="p-5 glass-strong">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-white text-base">{template.name}</h3>
          <div className="w-3 h-3 rounded-full" style={{ background: template.color }} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {template.tags.map((tag) => (
            <span key={tag} className="text-white/35 text-xs bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
