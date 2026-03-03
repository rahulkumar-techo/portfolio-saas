import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/landing/Footer'
import { Divider } from '@/components/ui/index'

const page = () => {
  return (
    <div className='min-h-screen w-full overflow-x-hidden bg-background'>
      <Navbar />
      <HeroSection />
      <Divider />
      <FeaturesSection />
      <Divider />
      <PricingSection />
      <Footer />
    </div>
  )
}

export default page
