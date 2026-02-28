import Hero from '@/components/ui/home/HeroSection';
import React from 'react';;
import AppBackground from '@/components/AppBackground';
import Services from '@/components/ui/home/ServiceSection';
import Reviews from '@/components/ui/home/Reviews';
import TechStack from '@/components/ui/home/TechStack';
import Footer from '@/components/ui/Footer';


type Props = {}

const page = (props: Props) => {
  return (
    <div>
      <AppBackground>
        <Hero />
        <Reviews/>
        <Services/>
        <TechStack/>
        <Footer/>
      </AppBackground>
    </div>
  )
}

export default page