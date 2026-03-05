import type { Metadata } from 'next'
import { PortfolioClient } from './PortfolioClient'
import { MOCK_USER } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: `${MOCK_USER.name} — Portfolio`,
    description: MOCK_USER.bio,
    openGraph: {
      title: `${MOCK_USER.name} — Full Stack Developer`,
      description: MOCK_USER.bio,
    },
  }
}

export default function PortfolioPage() {
  return <PortfolioClient />
}
