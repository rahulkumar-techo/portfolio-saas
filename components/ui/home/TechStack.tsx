"use client"

/**
 * Tech Stack Section
 * Tools Used to Build Portfolio SaaS
 * Mobile First + Premium Green Theme
 */

type Tool = {
  name: string
  category: string
}

const tools: Tool[] = [
  { name: "Next.js", category: "Frontend Framework" },
  { name: "React", category: "UI Library" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "NextAuth", category: "Authentication" },
  { name: "Prisma", category: "ORM" },
  { name: "MongoDB", category: "Database" },
  { name: "OpenAI API", category: "AI Engine" },
  { name: "Vercel", category: "Deployment" },
]

export default function TechStack() {
  return (
    <section className="py-20 px-6 text-white bg-[#04140F]">
      <div className="max-w-7xl mx-auto">

        <SectionHeader />

        <ToolsContainer>
          {tools.map((tool, index) => (
            <ToolCard key={index} {...tool} />
          ))}
        </ToolsContainer>

      </div>
    </section>
  )
}

/* ================= HEADER ================= */

function SectionHeader() {
  return (
    <div className="text-center mb-14">
      <p className="text-emerald-400 text-xs tracking-wider mb-3">
        BUILT WITH
      </p>

      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Modern Technologies Powering Our Platform
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
        Portfolio SaaS is built using cutting-edge tools and frameworks to ensure performance, scalability, and reliability.
      </p>
    </div>
  )
}

/* ================= CONTAINER ================= */

function ToolsContainer({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="
        flex gap-5 overflow-x-auto pb-4
        snap-x snap-mandatory
        sm:grid sm:grid-cols-2 sm:overflow-visible
        lg:grid-cols-3
      "
    >
      {children}
    </div>
  )
}

/* ================= TOOL CARD ================= */

function ToolCard({ name, category }: Tool) {
  return (
    <div
      className="
        min-w-55 sm:min-w-0
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl p-6
        hover:border-emerald-400/40
        transition-all duration-300
        snap-start
      "
    >
      <div className="mb-4 w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
        <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
      </div>

      <h3 className="text-lg font-semibold mb-1">
        {name}
      </h3>

      <p className="text-gray-400 text-sm">
        {category}
      </p>
    </div>
  )
}