'use client'

import { motion } from 'framer-motion'
import { Card, Badge } from '@/components/ui'

export default function KPISection() {
  const KPIS = [
    { label: 'Total Views', value: '24,800', change: '+18%', color: '#5b6cff' },
    { label: 'Unique Visitors', value: '16,200', change: '+12%', color: '#22d3ee' },
    { label: 'Avg. Time on Page', value: '3m 42s', change: '+8%', color: '#34d399' },
    { label: 'Contact Clicks', value: '847', change: '+24%', color: '#fbbf24' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {KPIS.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
        >
          <Card className="relative overflow-hidden">
            <div
              className="absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-5"
              style={{ background: kpi.color }}
            />
            <div className="font-display font-bold text-2xl text-white mb-0.5">
              {kpi.value}
            </div>
            <div className="text-white/40 text-xs mb-1.5">{kpi.label}</div>
            <Badge variant="green">{kpi.change} ↑</Badge>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}