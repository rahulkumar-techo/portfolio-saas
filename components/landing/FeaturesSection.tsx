'use client'

import { motion } from 'framer-motion'
import { Section, SectionHeader, Card, Badge } from '@/components/ui/index'
import { FEATURES } from '@/lib/data'

export function FeaturesSection() {
  return (
    <Section id="features" className="relative">
      {/* Bg glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/4 rounded-full blur-[150px] pointer-events-none" />

      <SectionHeader
        eyebrow="Platform Features"
        title="Everything you need to land"
        highlight="land"
        description="From AI-powered resume parsing to real-time ATS scoring — we cover every step of your job search journey."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          >
            <FeatureCard feature={feature} />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-16 p-8 rounded-2xl glass border border-brand-500/15 text-center"
      >
        <p className="text-white/50 text-sm mb-3">Trusted by engineers at</p>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {['Google', 'Meta', 'Stripe', 'Vercel', 'Linear', 'Notion'].map((co) => (
            <span key={co} className="text-white/25 font-display font-semibold text-base tracking-wide hover:text-white/50 transition-colors">
              {co}
            </span>
          ))}
        </div>
      </motion.div>
    </Section>
  )
}

function FeatureCard({ feature }: { feature: typeof FEATURES[number] }) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative h-full glass rounded-2xl p-6 border border-white/5 overflow-hidden cursor-pointer transition-all duration-300"
      style={{
        '--glow-color': feature.color,
      } as React.CSSProperties}
    >
      {/* Hover glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 0 1px ${feature.color}30, 0 0 30px ${feature.color}10` }}
      />

      {/* Corner accent */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-5 group-hover:opacity-15 transition-opacity"
        style={{ background: feature.color }}
      />

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 relative"
        style={{ background: `${feature.color}15`, border: `1px solid ${feature.color}25` }}
      >
        {feature.icon}
        <div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ boxShadow: `0 0 20px ${feature.color}30` }}
        />
      </div>

      {/* Badge */}
      {feature.badge && (
        <div className="mb-3">
          <Badge
            variant={feature.color === '#22d3ee' ? 'cyan' : feature.color === '#f472b6' ? 'pink' : feature.color === '#34d399' ? 'green' : 'blue'}
          >
            {feature.badge}
          </Badge>
        </div>
      )}

      <h3 className="font-display font-bold text-white text-lg mb-2 group-hover:text-gradient transition-all">
        {feature.title}
      </h3>
      <p className="text-white/50 text-sm leading-relaxed">
        {feature.description}
      </p>

      {/* Arrow */}
      <div className="mt-4 text-white/25 group-hover:text-brand-400 transition-colors text-sm font-medium">
        Learn more →
      </div>
    </motion.div>
  )
}
