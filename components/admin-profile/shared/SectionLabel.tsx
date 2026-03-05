/**
 * Decorative section divider label
 */

interface Props {
  label: string
}

export default function SectionLabel({ label }: Props) {

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 10
      }}
    >

      <div
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(108,99,255,0.4))"
        }}
      />

      <span
        style={{
          fontFamily: "'JetBrains Mono',monospace",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.25em",
          color: "#6C63FF",
          background: "rgba(108,99,255,0.1)",
          border: "1px solid rgba(108,99,255,0.25)",
          padding: "4px 12px",
          borderRadius: 20
        }}
      >
        {label}
      </span>

      <div
        style={{
          flex: 1,
          height: 1,
          background: "linear-gradient(to left, transparent, rgba(108,99,255,0.4))"
        }}
      />

    </div>
  )
}