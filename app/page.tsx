'use client';

import dynamic from 'next/dynamic';
import Nav from '@/components/nav/Nav';
import HeroSection from '@/components/hero/HeroSection';

// const StackSection = dynamic(() => import('@/components/sections/StackSection'), { ssr: false });
const WhatIsSection = dynamic(() => import('@/components/sections/WhatIsSection'), { ssr: false });
const HowItWorksSection = dynamic(() => import('@/components/sections/HowItWorksSection'), { ssr: false });
const PricingSection = dynamic(() => import('@/components/sections/PricingSection'), { ssr: false });
// const SDKSection = dynamic(() => import('@/components/sections/SDKSection'), { ssr: false });
const FallbackSection = dynamic(() => import('@/components/sections/FallbackSection'), { ssr: false });
const TrustedBySection = dynamic(() => import('@/components/sections/TrustedBySection'), { ssr: false });
const CTASection = dynamic(() => import('@/components/sections/CTASection'), { ssr: false });
const Footer = dynamic(() => import('@/components/sections/Footer'), { ssr: false });

export default function Home() {
  return (
    <>
      {/* <WalkingCharacter /> */}
      <Nav />
      <main>

        <HeroSection />
        <WhatIsSection />
        {/* <StackSection /> */}
        <HowItWorksSection />
        <PricingSection />
        {/* <SDKSection /> */}
        <FallbackSection />
        {/* <TrustedBySection /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
