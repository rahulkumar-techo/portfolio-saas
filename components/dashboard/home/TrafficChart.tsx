'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Badge } from '@/components/ui'
import { MOCK_ANALYTICS } from '@/lib/data'
import CustomTooltip from './CustomTooltip'

export default function TrafficChart() {
  return (
    <div className="lg:col-span-2 glass rounded-2xl p-6">
      <div className="flex justify-between mb-6">
        <h3 className="font-display font-bold text-white">Portfolio Traffic</h3>
        <Badge variant="blue">Last 8 months</Badge>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={MOCK_ANALYTICS.views}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="views" stroke="#5b6cff" fillOpacity={0.2} fill="#5b6cff" />
          <Area type="monotone" dataKey="visitors" stroke="#22d3ee" fillOpacity={0.2} fill="#22d3ee" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}