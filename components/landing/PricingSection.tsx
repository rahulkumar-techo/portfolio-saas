'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Section, SectionHeader, Badge } from '@/components/ui/index'
import { Button } from '@/components/ui/Button'
import { PRICING_PLANS } from '@/lib/data'

export function PricingSection() {
  const [annual, setAnnual] = useState(false)

  return (
    <Section id="pricing" className="relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[500px] lg:h-[500px] bg-cyan-500/4 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />

      <SectionHeader
        eyebrow="Simple Pricing"
        title="Start free, scale when ready"
        highlight="free"
        description="No hidden fees. No complicated tiers. Just tools that get you hired."
      />

      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mb-10 sm:mb-12">
        <span className={`text-xs sm:text-sm font-medium ${!annual ? 'text-white' : 'text-white/40'}`}>Monthly</span>
        <button
          onClick={() => setAnnual(!annual)}
          aria-pressed={annual}
          aria-label="Toggle annual pricing"
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${annual ? 'bg-brand-600' : 'bg-white/10'}`}
        >
          <motion.div
            animate={{ x: annual ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
          />
        </button>
        <span className={`text-xs sm:text-sm font-medium inline-flex items-center ${annual ? 'text-white' : 'text-white/40'}`}>
          Annual
          <Badge variant="green" className="ml-2 whitespace-nowrap">Save 40%</Badge>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRICING_PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`relative rounded-2xl p-6 sm:p-8 ${
              plan.highlighted
                ? 'bg-gradient-to-b from-brand-600/20 to-brand-900/20 border-2 border-brand-500/40'
                : 'glass border border-white/5'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <Badge variant="blue" className="px-4 py-1 text-xs shadow-lg shadow-brand-500/20">
                  {plan.badge}
                </Badge>
              </div>
            )}

            {plan.highlighted && (
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-brand-600/5" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-display font-bold text-white text-xl mb-1">{plan.name}</h3>
              <p className="text-white/40 text-sm">{plan.description}</p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-white/40 text-lg">$</span>
                <span className="font-display font-bold text-4xl text-white">
                  {annual ? Math.floor(plan.price * 0.6) : plan.price}
                </span>
                {plan.price > 0 && (
                  <span className="text-white/40 text-sm">/{plan.period}</span>
                )}
              </div>
              {annual && plan.price > 0 && (
                <p className="text-emerald-400 text-xs mt-1">
                  ${(plan.price * 12 * 0.4).toFixed(0)}/yr savings
                </p>
              )}
            </div>

            <Button
              variant={plan.highlighted ? 'primary' : 'outline'}
              fullWidth
              glow={plan.highlighted}
              className="mb-8"
            >
              {plan.price === 0 ? 'Get Started Free' : 'Start Free Trial'}
            </Button>

            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm">
                  <span className="w-4 h-4 rounded-full bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 text-xs flex-shrink-0">✓</span>
                  <span className="text-white/65">{f}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-white/30 text-sm mt-8"
      >
        All plans include a 14-day free trial. Cancel anytime. No questions asked.
      </motion.p>
    </Section>
  )
}
