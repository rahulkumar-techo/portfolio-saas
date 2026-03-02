'use client'

import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { motion } from 'framer-motion'
import { MOCK_ANALYTICS } from '@/lib/data'
import CustomTooltip from './CustomTooltip'

export default function TrafficChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="font-display font-bold text-white text-base mb-6">
        Traffic Overview
      </h3>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={MOCK_ANALYTICS.views}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="views" stroke="#5b6cff" fillOpacity={0.2} fill="#5b6cff" />
          <Area type="monotone" dataKey="visitors" stroke="#22d3ee" fillOpacity={0.2} fill="#22d3ee" />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  )
}