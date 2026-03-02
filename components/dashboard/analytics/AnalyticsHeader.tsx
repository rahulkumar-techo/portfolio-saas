'use client'

export default function AnalyticsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mb-1">
          Analytics
        </h1>
        <p className="text-white/40 text-sm">
          Track your portfolio performance and visitor insights
        </p>
      </div>

      <div className="flex gap-2">
        {['7D', '30D', '90D', '1Y'].map((period, i) => (
          <button
            key={period}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === 1
                ? 'bg-brand-600 text-white'
                : 'glass text-white/50 hover:text-white'
            }`}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  )
}