'use client'

import { PieChart, Pie, Cell } from 'recharts'
import { MOCK_ANALYTICS } from '@/lib/data'

const COLORS = ['#5b6cff', '#22d3ee', '#34d399']

export default function DeviceSplit() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-display font-bold text-white mb-4">Device Split</h3>

      <div className="flex justify-center">
        <PieChart width={160} height={160}>
          <Pie data={MOCK_ANALYTICS.devices} dataKey="value" cx={80} cy={80} innerRadius={45} outerRadius={70}>
            {MOCK_ANALYTICS.devices.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
        </PieChart>
      </div>
          <div className="space-y-2 mt-4">
              {MOCK_ANALYTICS.devices.map((d, i) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="text-white font-medium">{d.value}%</span>
                </div>
              ))}
            </div>
    </div>
  )
}