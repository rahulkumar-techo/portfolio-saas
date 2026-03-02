'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Divider } from '@/components/ui/index'

const FOOTER_LINKS = {
  Product: ['Features', 'Templates', 'Pricing', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Docs', 'API Reference', 'Community', 'Status'],
  Legal: ['Privacy', 'Terms', 'Cookies', 'Security'],
}

export function Footer() {
  return (
    <footer className="relative border-t border-brand-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand col */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm font-display">P</span>
              </div>
              <span className="font-display font-bold text-white text-lg">
                Portfolio<span className="text-gradient-blue">AI</span>
              </span>
            </Link>
            <p className="text-white/35 text-sm leading-relaxed mb-5">
              The AI-powered platform for building stunning portfolios and landing jobs.
            </p>
            <div className="flex gap-3">
              {['𝕏', 'in', 'GH'].map((icon) => (
                <button
                  key={icon}
                  className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-brand-500/40 transition-all text-xs font-bold"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display font-semibold text-white/70 text-xs uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-white/40 hover:text-white/80 text-sm transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider className="mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © {new Date().getFullYear()} PortfolioAI Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-white/25 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  )
}
