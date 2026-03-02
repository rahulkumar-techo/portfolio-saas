'use client'

import { motion } from 'framer-motion'
import { Card } from '@/components/ui'

export default function StatsGrid() {
  const stats = [
    { label: 'Total Views', value: '24.8K', icon: '👁️', color: '#5b6cff', trend: '+18% this month' },
    { label: 'ATS Score', value: '92/100', icon: '🎯', color: '#22d3ee', trend: '+5 this week' },
    { label: 'Career Score', value: '87/100', icon: '⚡', color: '#fbbf24', trend: '+3 from last week' },
    { label: 'Job Applications', value: '34', icon: '📋', color: '#34d399', trend: '8 this week' },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="font-display font-bold text-2xl mb-1" style={{ color: stat.color }}>
              {stat.value}
            </div>
            <div className="text-white/50 text-xs">{stat.label}</div>
            <div className="text-emerald-400 text-xs mt-1">↑ {stat.trend}</div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}