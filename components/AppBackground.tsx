export default function AppBackground({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen text-white bg-linear-to-br from-[#04140F] via-[#06281E] to-[#0B3B2E] overflow-hidden">

      <div className="absolute -top-32 -right-32 w-72 h-72 bg-emerald-500/30 blur-[120px] -z-10" />
      <div className="absolute -bottom-32 -left-32 w-72 h-72 bg-green-400/20 blur-[120px] -z-10" />

      {children}
    </div>
  )
}