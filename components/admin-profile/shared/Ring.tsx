/**
 * Circular skill progress ring
 */

interface RingProps {
  value: number
  color: string
  size?: number
}

export default function Ring({
  value,
  color,
  size = 52
}: RingProps) {

  const r = (size - 6) / 2
  const circ = 2 * Math.PI * r
  const dash = (value / 100) * circ

  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>

      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={3.5}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 4px ${color})`,
          transition: "stroke-dasharray 1.2s ease"
        }}
      />

    </svg>
  )
}