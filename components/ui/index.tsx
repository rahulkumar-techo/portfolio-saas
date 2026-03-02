'use client'

import { motion } from 'framer-motion'
import clsx from 'clsx'

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'blue' | 'cyan' | 'green' | 'pink' | 'yellow'
  className?: string
  dot?: boolean
}

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  const variants = {
    default: 'bg-white/5 text-white/60 border-white/10',
    blue: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  }
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', variants[variant], className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  glowColor?: string
  onClick?: () => void
}

export function Card({ children, className, hover, glow, glowColor = '#5b6cff', onClick }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      onClick={onClick}
      className={clsx(
        'glass rounded-2xl p-6',
        hover && 'cursor-pointer',
        className
      )}
      style={glow ? {
        boxShadow: `0 0 0 1px ${glowColor}20, 0 4px 20px ${glowColor}15`,
        transition: 'box-shadow 0.3s ease',
      } : undefined}
      onHoverStart={() => {
        if (glow) {
          // handled via CSS
        }
      }}
    >
      {children}
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
interface SectionProps {
  id?: string
  children: React.ReactNode
  className?: string
}

export function Section({ id, children, className }: SectionProps) {
  return (
    <section id={id} className={clsx('relative py-24 px-4 sm:px-6 lg:px-8', className)}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────
interface SectionHeaderProps {
  eyebrow?: string
  title: string
  highlight?: string
  description?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ eyebrow, title, highlight, description, centered = true, className }: SectionHeaderProps) {
  const words = title.split(' ')
  const rendered = highlight
    ? title.replace(highlight, `<span class="text-gradient">${highlight}</span>`)
    : title

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={clsx('mb-16', centered && 'text-center', className)}
    >
      {eyebrow && (
        <Badge variant="blue" className="mb-5" dot>
          {eyebrow}
        </Badge>
      )}
      <h2
        className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-5"
        dangerouslySetInnerHTML={{ __html: rendered }}
      />
      {description && (
        <p className="text-white/55 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ className }: { className?: string }) {
  return (
    <div className={clsx('h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent', className)} />
  )
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('rounded-xl bg-white/5 animate-pulse', className)} />
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
interface StatCardProps {
  value: string
  label: string
  icon?: string
  color?: string
  trend?: string
}

export function StatCard({ value, label, icon, color = '#5b6cff', trend }: StatCardProps) {
  return (
    <Card hover className="text-center">
      {icon && <div className="text-2xl mb-3">{icon}</div>}
      <div className="font-display text-3xl font-bold mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-white/50 text-sm">{label}</div>
      {trend && (
        <div className="mt-2 text-xs text-emerald-400 font-medium">↑ {trend}</div>
      )}
    </Card>
  )
}
