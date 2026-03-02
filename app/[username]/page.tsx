import type { Metadata } from 'next'
import { PortfolioClient } from './PortfolioClient'
import { MOCK_USER } from '@/lib/data'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  return {
    title: `${MOCK_USER.name} — Portfolio`,
    description: MOCK_USER.bio,
    openGraph: {
      title: `${MOCK_USER.name} — Full Stack Developer`,
      description: MOCK_USER.bio,
    },
  }
}

export default function PortfolioPage({ params }: { params: { username: string } }) {
  return <PortfolioClient username={params.username} />
}
