"use client"

/**
 * Services Section
 * Mobile First + Horizontal Scroll
 * Clean SaaS Architecture
 */

type Service = {
  title: string
  description: string
}

const services: Service[] = [
  {
    title: "AI Resume Conversion",
    description:
      "Upload your resume and instantly convert it into a professional portfolio website powered by AI.",
  },
  {
    title: "Customizable Templates",
    description:
      "Choose from modern, responsive templates tailored for developers and professionals.",
  },
  {
    title: "Analytics Dashboard",
    description:
      "Track visitors, engagement, and portfolio performance in real-time.",
  },
  {
    title: "One-Click Deployment",
    description:
      "Deploy your portfolio with a single click and get a live shareable link instantly.",
  },
  {
    title: "SEO Optimization",
    description:
      "Built-in SEO features to help your portfolio rank higher on search engines.",
  },
  {
    title: "Smart AI Suggestions",
    description:
      "Receive intelligent suggestions to improve content, structure, and design automatically.",
  },
]

export default function Services() {
  return (
    <section className="py-20 px-6 text-white bg-[#04140F]">
      <div className="max-w-7xl mx-auto">

        <SectionHeader />

        <ServicesContainer>
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </ServicesContainer>

      </div>
    </section>
  )
}

/* ================= HEADER ================= */

function SectionHeader() {
  return (
    <div className="text-center mb-14">
      <p className="text-emerald-400 text-xs tracking-wider mb-3">
        WHAT WE PROVIDE
      </p>

      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Powerful Tools to Build Your Portfolio
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
        Everything you need to create, optimize, and grow your digital presence — powered by AI.
      </p>
    </div>
  )
}

/* ================= CONTAINER ================= */

function ServicesContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="
      flex gap-5 overflow-x-auto pb-4
      snap-x snap-mandatory
      sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible
      lg:grid-cols-3
    ">
      {children}
    </div>
  )
}

/* ================= CARD ================= */

function ServiceCard({ title, description }: Service) {
  return (
    <div
      className="
        min-w-65 sm:min-w-0
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl p-6
        hover:border-emerald-400/40
        transition-all duration-300
        snap-start
      "
    >
      <ServiceIcon />

      <h3 className="text-lg font-semibold mb-2">
        {title}
      </h3>

      <p className="text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

/* ================= ICON ================= */

function ServiceIcon() {
  return (
    <div className="mb-4 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
      <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
    </div>
  )
}