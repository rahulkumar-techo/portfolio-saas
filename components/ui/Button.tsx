'use client'

import { motion } from 'framer-motion'
import { type ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  glow?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    glow = false,
    loading = false,
    icon,
    iconRight,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
  }, ref) => {
    const base = clsx(
      'relative inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-surface-900',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'select-none cursor-pointer',
      { 'w-full': fullWidth }
    )

    const variants = {
      primary: 'bg-brand-600 hover:bg-brand-500 text-white rounded-xl border border-brand-500/30',
      secondary: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-xl',
      ghost: 'bg-transparent hover:bg-white/5 text-white/70 hover:text-white rounded-xl',
      outline: 'bg-transparent border border-brand-500/40 hover:border-brand-400 text-brand-400 hover:bg-brand-500/5 rounded-xl',
      danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl',
    }

    const sizes = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-5 py-2.5 text-sm',
      lg: 'px-7 py-3.5 text-base',
      xl: 'px-10 py-4.5 text-lg',
    }

    const glowStyle = glow ? {
      boxShadow: '0 0 24px rgba(91,108,255,0.4), 0 0 48px rgba(91,108,255,0.15)',
    } : {}

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        className={clsx(base, variants[variant], sizes[size], className)}
        style={glowStyle}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {!loading && icon}
        {children}
        {!loading && iconRight}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
