"use client"

/**
 * Reviews Section
 * Portfolio SaaS Testimonials
 * Mobile First + Premium Green Theme
 */

type Review = {
  name: string
  role: string
  review: string
  rating: number
}

const reviews: Review[] = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    review:
      "Portfolio SaaS transformed my resume into a stunning personal website within minutes. The AI suggestions are incredibly accurate.",
    rating: 5,
  },
  {
    name: "Ananya Gupta",
    role: "UI/UX Designer",
    review:
      "The templates are modern and highly customizable. I deployed my portfolio in one click!",
    rating: 5,
  },
  {
    name: "Amit Verma",
    role: "Computer Science Student",
    review:
      "Analytics dashboard helped me track recruiters visiting my portfolio. Game changer.",
    rating: 4,
  },
  {
    name: "Priya Singh",
    role: "Full Stack Developer",
    review:
      "The AI resume conversion saved me hours of work. Super clean and professional output.",
    rating: 5,
  },
]

export default function Reviews() {
  return (
    <section className="py-20 px-6 text-white bg-[#04140F]">
      <div className="max-w-7xl mx-auto">

        <SectionHeader />

        <ReviewsContainer>
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </ReviewsContainer>

      </div>
    </section>
  )
}

/* ================= HEADER ================= */

function SectionHeader() {
  return (
    <div className="text-center mb-14">
      <p className="text-emerald-400 text-xs tracking-wider mb-3">
        USER REVIEWS
      </p>

      <h2 className="text-3xl sm:text-4xl font-bold mb-4">
        Trusted by Professionals & Students
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
        See how our AI-powered platform is helping users build powerful digital identities.
      </p>
    </div>
  )
}

/* ================= CONTAINER ================= */

function ReviewsContainer({
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

/* ================= CARD ================= */

function ReviewCard({ name, role, review, rating }: Review) {
  return (
    <div
      className="
        min-w-70 sm:min-w-0
        bg-white/5 backdrop-blur-xl
        border border-white/10
        rounded-2xl p-6
        hover:border-emerald-400/40
        transition-all duration-300
        snap-start
      "
    >
      {/* Stars */}
      <div className="flex mb-3">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-emerald-400 text-sm">★</span>
        ))}
      </div>

      {/* Review Text */}
      <p className="text-gray-300 text-sm leading-relaxed mb-6">
        "{review}"
      </p>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-semibold">
          {name.charAt(0)}
        </div>

        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  )
}