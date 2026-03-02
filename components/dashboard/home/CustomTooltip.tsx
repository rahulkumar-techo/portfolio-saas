'use client'

type TooltipEntry = {
  name?: string | number
  value?: string | number | null
  color?: string
}

type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
}

export default function CustomTooltip(props: CustomTooltipProps) {
  const { active, payload, label } = props

  if (!active || !payload || payload.length === 0) return null

  return (
    <div className="glass rounded-xl p-3 text-xs border border-brand-500/20 shadow-xl">
      {label && (
        <p className="text-white/50 mb-2 font-medium">
          {label}
        </p>
      )}

      <div className="space-y-1.5">
        {payload.map((entry, index) => (
          <div
            key={`${String(entry.name ?? 'series')}-${index}`}
            className="flex items-center justify-between gap-4"
          >
            <span style={{ color: entry.color ?? '#94a3b8' }}>
              {entry.name ?? 'Value'}
            </span>

            <span className="font-medium text-white">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString()
                : (entry.value ?? '-')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
