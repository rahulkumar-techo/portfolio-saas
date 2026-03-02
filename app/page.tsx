import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/landing/Footer'
import { Divider } from '@/components/ui/index'


type Props = {}

const page = (props: Props) => {
  return (
    <div>
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