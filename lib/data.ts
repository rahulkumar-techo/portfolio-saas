// ─── Types ───────────────────────────────────────────────────────────────────

export interface Template {
  id: string
  name: string
  category: 'developer' | 'designer' | 'corporate'
  preview: string
  color: string
  tags: string[]
  popular?: boolean
}

export interface Feature {
  id: string
  icon: string
  title: string
  description: string
  color: string
  badge?: string
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  period: string
  description: string
  features: string[]
  highlighted?: boolean
  badge?: string
}

export interface ProjectItem {
  id: string
  title: string
  description: string
  tech: string[]
  link: string
  image: string
  stars: number
}

export interface ExperienceItem {
  id: string
  role: string
  company: string
  period: string
  description: string
  tech: string[]
}

export interface SkillGroup {
  category: string
  color: string
  skills: Array<{ name: string; level: number }>
}

export interface AnalyticsData {
  views: Array<{ date: string; views: number; visitors: number }>
  topCountries: Array<{ country: string; visits: number; percentage: number }>
  topPages: Array<{ page: string; views: number }>
  devices: Array<{ name: string; value: number }>
}

// ─── Mock Templates ───────────────────────────────────────────────────────────

export const TEMPLATES: Template[] = [
  { id: 't1', name: 'Nebula Dev', category: 'developer', preview: 'linear-gradient(135deg, #1a1a3e 0%, #0f1a2e 100%)', color: '#5b6cff', tags: ['React', 'Dark', 'Minimal'], popular: true },
  { id: 't2', name: 'Aurora Design', category: 'designer', preview: 'linear-gradient(135deg, #1a0a2e 0%, #0a1a1a 100%)', color: '#22d3ee', tags: ['Creative', 'Gradient', 'Bold'] },
  { id: 't3', name: 'Executive Pro', category: 'corporate', preview: 'linear-gradient(135deg, #0a0a14 0%, #14141e 100%)', color: '#818cf8', tags: ['Professional', 'Clean', 'Classic'] },
  { id: 't4', name: 'Void Coder', category: 'developer', preview: 'linear-gradient(135deg, #030308 0%, #0a0a18 100%)', color: '#f472b6', tags: ['Terminal', 'Dark', 'Hacker'], popular: true },
  { id: 't5', name: 'Prism Studio', category: 'designer', preview: 'linear-gradient(135deg, #1a0a0a 0%, #0a1a0a 100%)', color: '#34d399', tags: ['Colorful', 'Portfolio', 'Creative'] },
  { id: 't6', name: 'Slate Finance', category: 'corporate', preview: 'linear-gradient(135deg, #0a0e1a 0%, #0e1424 100%)', color: '#fbbf24', tags: ['Finance', 'Trusted', 'Simple'] },
  { id: 't7', name: 'Cypher Code', category: 'developer', preview: 'linear-gradient(135deg, #080810 0%, #101020 100%)', color: '#22d3ee', tags: ['Matrix', 'Dark', 'Code'] },
  { id: 't8', name: 'Canvas Art', category: 'designer', preview: 'linear-gradient(135deg, #1a0d0d 0%, #0d0d1a 100%)', color: '#f472b6', tags: ['Artistic', 'Vibrant', 'Gallery'] },
  { id: 't9', name: 'Summit Corp', category: 'corporate', preview: 'linear-gradient(135deg, #05050f 0%, #0a0a1e 100%)', color: '#5b6cff', tags: ['Executive', 'Premium', 'Light'] },
]

// ─── Mock Features ────────────────────────────────────────────────────────────

export const FEATURES: Feature[] = [
  {
    id: 'f1',
    icon: '🧠',
    title: 'AI Resume Parser',
    description: 'Paste your resume and watch our AI extract, structure, and format every detail with 99.2% accuracy.',
    color: '#5b6cff',
    badge: 'Powered by GPT-4',
  },
  {
    id: 'f2',
    icon: '🎯',
    title: 'ATS Optimization Engine',
    description: 'Real-time keyword gap analysis and scoring against job descriptions to guarantee you pass ATS filters.',
    color: '#22d3ee',
    badge: 'Beat 85% of filters',
  },
  {
    id: 'f3',
    icon: '🎨',
    title: 'Portfolio Templates',
    description: '50+ designer-crafted templates for developers, designers, and executives. Fully customizable.',
    color: '#f472b6',
  },
  {
    id: 'f4',
    icon: '📊',
    title: 'Performance Analytics',
    description: 'Track who views your portfolio, which sections engage most, and where your visitors come from.',
    color: '#34d399',
    badge: 'Real-time',
  },
  {
    id: 'f5',
    icon: '⚡',
    title: 'AI Career Score',
    description: 'Get a holistic score across your resume, portfolio, and LinkedIn presence with actionable improvement tips.',
    color: '#fbbf24',
  },
  {
    id: 'f6',
    icon: '🔗',
    title: 'Custom Domain',
    description: 'Connect your own domain and publish your portfolio at yourname.com in one click.',
    color: '#818cf8',
    badge: 'Pro Feature',
  },
]

// ─── Mock Pricing ─────────────────────────────────────────────────────────────

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'Starter',
    price: 0,
    period: 'forever',
    description: 'Perfect for getting started',
    features: [
      '1 Portfolio template',
      'Basic ATS scanner',
      'Portfolio subdomain',
      '100 views/month',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 12,
    period: 'month',
    description: 'For serious job seekers',
    features: [
      'All templates unlocked',
      'Full ATS optimization',
      'Custom domain support',
      'Unlimited views',
      'AI Career Score',
      'Analytics dashboard',
      'Priority support',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'team',
    name: 'Agency',
    price: 49,
    period: 'month',
    description: 'For teams and agencies',
    features: [
      'Everything in Pro',
      '10 team members',
      'White-label portfolios',
      'Bulk resume parsing',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
]

// ─── Mock Portfolio Data (Alex Chen) ─────────────────────────────────────────

export const MOCK_USER = {
  name: 'Alex Chen',
  username: 'alexchen',
  title: 'Full Stack Engineer & Open Source Contributor',
  location: 'San Francisco, CA',
  email: 'alex@devworld.io',
  github: 'github.com/alexchen',
  linkedin: 'linkedin.com/in/alexchen',
  twitter: '@alexchen_dev',
  avatar: 'https://avatars.githubusercontent.com/u/1?v=4',
  bio: `I build scalable systems and beautiful UIs. 5+ years crafting digital products at the intersection of engineering and design. Passionate about open source, AI tooling, and developer experience.`,
  careerScore: 87,
  atsScore: 92,
}

export const MOCK_SKILLS: SkillGroup[] = [
  {
    category: 'Frontend',
    color: '#5b6cff',
    skills: [
      { name: 'React / Next.js', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'Three.js / R3F', level: 78 },
      { name: 'Tailwind CSS', level: 92 },
    ],
  },
  {
    category: 'Backend',
    color: '#22d3ee',
    skills: [
      { name: 'Node.js', level: 88 },
      { name: 'Python / FastAPI', level: 82 },
      { name: 'PostgreSQL', level: 85 },
      { name: 'Redis', level: 75 },
    ],
  },
  {
    category: 'DevOps & Cloud',
    color: '#34d399',
    skills: [
      { name: 'AWS / GCP', level: 80 },
      { name: 'Docker / K8s', level: 76 },
      { name: 'CI/CD Pipelines', level: 82 },
      { name: 'Terraform', level: 68 },
    ],
  },
]

export const MOCK_PROJECTS: ProjectItem[] = [
  {
    id: 'p1',
    title: 'Nexus AI Platform',
    description: 'Enterprise AI workspace with real-time collaboration, custom model fine-tuning, and usage analytics.',
    tech: ['Next.js', 'Python', 'OpenAI', 'WebSockets'],
    link: 'github.com/alexchen/nexus',
    image: 'linear-gradient(135deg, #1a1a4e 0%, #0a0a2e 100%)',
    stars: 2847,
  },
  {
    id: 'p2',
    title: 'DevFlow CLI',
    description: 'Blazing-fast terminal tool for managing monorepos, automating deployments, and team workflows.',
    tech: ['Rust', 'Shell', 'WASM', 'Node.js'],
    link: 'github.com/alexchen/devflow',
    image: 'linear-gradient(135deg, #0a1e1e 0%, #041414 100%)',
    stars: 1203,
  },
  {
    id: 'p3',
    title: 'Prism UI Kit',
    description: 'A fully accessible component library with 200+ components, dark mode, and Figma tokens.',
    tech: ['React', 'TypeScript', 'Radix UI', 'Storybook'],
    link: 'github.com/alexchen/prism-ui',
    image: 'linear-gradient(135deg, #1e0a1e 0%, #100410 100%)',
    stars: 4561,
  },
]

export const MOCK_EXPERIENCE: ExperienceItem[] = [
  {
    id: 'e1',
    role: 'Senior Software Engineer',
    company: 'Vercel',
    period: '2022 – Present',
    description: 'Leading frontend infrastructure for Next.js edge runtime. Shipped 12 major features, reduced TTFB by 40%.',
    tech: ['Next.js', 'Rust', 'Edge Runtime', 'TypeScript'],
  },
  {
    id: 'e2',
    role: 'Full Stack Engineer',
    company: 'Linear',
    period: '2020 – 2022',
    description: 'Built real-time collaborative features, custom rich-text editor, and GitHub integration layer.',
    tech: ['React', 'Node.js', 'WebSockets', 'PostgreSQL'],
  },
  {
    id: 'e3',
    role: 'Frontend Developer',
    company: 'Figma',
    period: '2018 – 2020',
    description: 'Developed plugin ecosystem infrastructure, canvas performance optimizations, and design token system.',
    tech: ['TypeScript', 'WebGL', 'Web Workers', 'WASM'],
  },
]

// ─── Mock Analytics ───────────────────────────────────────────────────────────

export const MOCK_ANALYTICS: AnalyticsData = {
  views: [
    { date: 'Jan', views: 1200, visitors: 840 },
    { date: 'Feb', views: 1890, visitors: 1200 },
    { date: 'Mar', views: 2400, visitors: 1680 },
    { date: 'Apr', views: 2100, visitors: 1500 },
    { date: 'May', views: 3200, visitors: 2100 },
    { date: 'Jun', views: 4100, visitors: 2800 },
    { date: 'Jul', views: 3800, visitors: 2600 },
    { date: 'Aug', views: 5200, visitors: 3400 },
  ],
  topCountries: [
    { country: '🇺🇸 United States', visits: 3240, percentage: 42 },
    { country: '🇬🇧 United Kingdom', visits: 1240, percentage: 16 },
    { country: '🇮🇳 India', visits: 980, percentage: 13 },
    { country: '🇩🇪 Germany', visits: 640, percentage: 8 },
    { country: '🇨🇦 Canada', visits: 480, percentage: 6 },
  ],
  topPages: [
    { page: '/projects', views: 4120 },
    { page: '/about', views: 3210 },
    { page: '/experience', views: 2840 },
    { page: '/contact', views: 1930 },
    { page: '/skills', views: 1540 },
  ],
  devices: [
    { name: 'Desktop', value: 58 },
    { name: 'Mobile', value: 34 },
    { name: 'Tablet', value: 8 },
  ],
}

// ─── Dashboard Nav Items ───────────────────────────────────────────────────────

export const DASHBOARD_NAV = [
  { id: 'portfolio', label: 'My Portfolio', icon: '🌐', href: '/dashboard' },
  { id: 'resume', label: 'Resume Builder', icon: '📄', href: '/dashboard/resume' },
  { id: 'ats', label: 'ATS Score', icon: '🎯', href: '/dashboard/ats' },
  { id: 'analytics', label: 'Analytics', icon: '📊', href: '/dashboard/analytics' },
  { id: 'settings', label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
]
