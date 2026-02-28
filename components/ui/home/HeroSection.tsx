"use client"

/**
 * Premium Portfolio SaaS Hero
 * Clean Refactored Architecture
 * Mobile First + Green Theme
 */

export default function Hero() {
  return (
    <section className="relative overflow-hidden text-white bg-[#04140F]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col gap-14 lg:grid lg:grid-cols-2 lg:items-center">
          <HeroContent />
          <ProductPreview />
        </div>
      </div>
    </section>
  )
}

/* ================= LEFT SIDE ================= */

function HeroContent() {
  return (
    <div className="text-center lg:text-left">
      <p className="text-emerald-400 text-xs tracking-wider mb-3">
        BUILD YOUR DIGITAL IDENTITY
      </p>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5">
        Portfolio SaaS
      </h1>

      <p className="text-gray-300 text-sm sm:text-base max-w-md mx-auto lg:mx-0 mb-8">
        AI-powered portfolio builder that converts your resume into
        a premium website instantly.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
        <button className="w-full sm:w-auto px-6 py-3 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition font-medium">
          Get Started
        </button>

        <button className="w-full sm:w-auto px-6 py-3 border border-emerald-400/40 rounded-lg hover:bg-white/5 transition">
          Learn More
        </button>
      </div>
    </div>
  )
}

/* ================= RIGHT SIDE ================= */

function ProductPreview() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:max-w-md mt-10 lg:mt-0">
      <div className="relative aspect-square">

        <DashboardCard />
        <ResumeCard />
        <AnalyticsCard />
        <AIBadge />

      </div>
    </div>
  )
}

/* ================= REUSABLE GLASS CARD ================= */

function GlassCard({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl ${className}`}
    >
      {children}
    </div>
  )
}

/* ================= CARDS ================= */

function DashboardCard() {
  return (
    <GlassCard className="absolute inset-8 p-4">
      <p className="text-xs text-emerald-400 mb-2">
        Dashboard Overview
      </p>

      <div className="space-y-2">
        <Stat label="Visitors" value="1,245" width="w-3/4" />
        <Stat label="Portfolio Score" value="92%" width="w-5/6" />
      </div>
    </GlassCard>
  )
}

function ResumeCard() {
  return (
    <GlassCard className="absolute -left-6 top-24 w-2/3 p-3">
      <p className="text-xs text-emerald-400 mb-2">
        Resume Preview
      </p>

      <div className="space-y-2">
        <Line width="w-3/4" />
        <Line width="w-full" />
        <Line width="w-5/6" />
      </div>
    </GlassCard>
  )
}

function AnalyticsCard() {
  return (
    <div className="absolute -right-6 bottom-8 w-2/3 bg-emerald-500/20 backdrop-blur-xl border border-emerald-400/30 rounded-xl p-3 shadow-lg">
      <p className="text-xs text-emerald-300 mb-2">
        Performance
      </p>

      <div className="flex items-end gap-2 h-14">
        <Bar height="h-6" />
        <Bar height="h-10" />
        <Bar height="h-12" />
      </div>
    </div>
  )
}

function AIBadge() {
  return (
    <div className="absolute top-2 right-2 bg-emerald-500/20 border border-emerald-400/40 backdrop-blur-xl rounded-lg px-3 py-1 shadow-md">
      <p className="text-[10px] text-emerald-300 font-medium">
        AI Engine
      </p>
    </div>
  )
}

/* ================= SMALL REUSABLE ELEMENTS ================= */

function Stat({
  label,
  value,
  width,
}: {
  label: string
  value: string
  width: string
}) {
  return (
    <>
      <div className="flex justify-between text-xs text-gray-300">
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div className="h-2 bg-white/10 rounded-full">
        <div className={`h-2 bg-emerald-400 rounded-full ${width}`} />
      </div>
    </>
  )
}

function Line({ width }: { width: string }) {
  return (
    <div className={`h-2 bg-white/20 rounded ${width}`} />
  )
}

function Bar({ height }: { height: string }) {
  return (
    <div className={`w-2 bg-emerald-400 rounded ${height}`} />
  )
}