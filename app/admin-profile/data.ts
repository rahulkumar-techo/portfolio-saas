const portfolioData = {
  hero: {
    name: "Rahul Kumar",
    title: "Full Stack Engineer",
    tagline: "Building AI-powered SaaS products & scalable web platforms",
    avatar: "RK",
    location: "Bihar, India",
    available: true
  },

  about: {
    bio: "I build full-stack SaaS platforms and AI-driven products focused on real-world impact. I enjoy designing scalable architectures, building developer tools, and turning complex ideas into production-ready applications. Currently working on AI learning platforms and developer SaaS products.",
    highlights: [
      "SaaS Architecture",
      "AI Integration",
      "Microservices",
      "Full-Stack Development"
    ],
    years: 2,
    role: "Full Stack Developer"
  },

  skills: [
    { name: "React", level: 92, color: "#61DAFB", category: "Frontend" },
    { name: "Next.js", level: 94, color: "#A78BFA", category: "Frontend" },
    { name: "TypeScript", level: 88, color: "#3178C6", category: "Language" },
    { name: "Node.js", level: 90, color: "#68A063", category: "Backend" },
    { name: "MongoDB", level: 85, color: "#47A248", category: "Database" },
    { name: "Prisma", level: 87, color: "#A855F7", category: "ORM" },
    { name: "Redis", level: 78, color: "#DC382D", category: "Cache" },
    { name: "Docker", level: 75, color: "#2496ED", category: "DevOps" },
    { name: "AWS", level: 70, color: "#FF9900", category: "Cloud" },
    { name: "GraphQL", level: 72, color: "#E535AB", category: "API" },
    { name: "Expo (React Native)", level: 80, color: "#000020", category: "Mobile" },
    { name: "TailwindCSS", level: 92, color: "#38BDF8", category: "UI" }
  ],

  projects: [
    {
      id: 1,
      title: "Portfolio SaaS Platform",
      desc: "Multi-tenant SaaS platform where developers create professional portfolios, AI-generated resumes, and track analytics.",
      tech: ["Next.js", "Prisma", "OpenAI", "Stripe"],
      year: "2026",
      role: "Full Stack Developer",
      color: "#6C63FF"
    },
    {
      id: 2,
      title: "NoteMentor",
      desc: "AI learning platform that converts handwritten notes into summaries, quizzes, and exam preparation tools.",
      tech: ["Next.js", "Node.js", "MongoDB", "AI OCR"],
      year: "2025",
      role: "Founder & Developer",
      color: "#00D4FF"
    },
    {
      id: 3,
      title: "Microservices E-commerce Platform",
      desc: "Scalable e-commerce backend using microservices architecture for order management, payments, and analytics.",
      tech: ["Node.js", "Docker", "Redis", "MongoDB"],
      year: "2025",
      role: "Backend Developer",
      color: "#FF6B6B"
    },
    {
      id: 4,
      title: "Career AI Platform",
      desc: "AI powered career assistant providing resume generation, job matching and interview preparation.",
      tech: ["Next.js", "OpenAI", "MongoDB", "Redis"],
      year: "2025",
      role: "Full Stack Developer",
      color: "#FFD93D"
    }
  ],

  experience: [
    {
      id: 1,
      year: "2025–Now",
      company: "Independent Development",
      role: "Full Stack Developer",
      desc: "Building AI SaaS products, developer platforms and scalable web applications.",
      color: "#635BFF",
      abbr: "FD"
    },
    {
      id: 2,
      year: "2024–25",
      company: "Personal SaaS Projects",
      role: "Founder / Developer",
      desc: "Developed Portfolio SaaS, AI resume tools and developer productivity platforms.",
      color: "#6C63FF",
      abbr: "SP"
    },
    {
      id: 3,
      year: "2023–24",
      company: "Freelance Projects",
      role: "Full Stack Developer",
      desc: "Built multiple web applications focusing on performance and scalable architecture.",
      color: "#FF6B35",
      abbr: "FR"
    }
  ],

  stats: [
    { label: "Projects Built", value: 12, suffix: "+", color: "#6C63FF" },
    { label: "Active SaaS Products", value: 3, suffix: "", color: "#00D4FF" },
    { label: "GitHub Repositories", value: 40, suffix: "+", color: "#FFD93D" },
    { label: "Years Coding", value: 2, suffix: "+", color: "#FF6B6B" }
  ],

  testimonials: [
    {
      id: 1,
      name: "Client Feedback",
      role: "Startup Founder",
      text: "Rahul delivered a scalable and clean architecture for our web application. Highly reliable developer.",
      avatar: "CF",
      color: "#6C63FF"
    },
    {
      id: 2,
      name: "Developer Peer",
      role: "Software Engineer",
      text: "Strong problem solving skills and great understanding of modern web technologies.",
      avatar: "DP",
      color: "#00D4FF"
    },
    {
      id: 3,
      name: "Product Manager",
      role: "Tech Startup",
      text: "Rahul quickly converts ideas into working prototypes and production ready systems.",
      avatar: "PM",
      color: "#FF6B6B"
    }
  ],

  contact: {
    email: "rahulkumar9142684664@gmail.com",
    github: "https://github.com/rahulkumar-techo",
    linkedin: "https://www.linkedin.com/in/rahul-kumar-6a225127a",
    twitter: "https://x.com/@RahulKu90158909"
  }
};

export default portfolioData;

//