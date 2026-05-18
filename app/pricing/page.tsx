import React from 'react';
import Nav from '@/components/nav/Nav';
import Footer from '@/components/sections/Footer';
import PricingSection from '@/components/sections/PricingSection';

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main
        style={{
          minHeight: '100vh',
          backgroundColor: 'var(--bg-void)',
          color: 'var(--text-primary)',
          paddingTop: '64px',
        }}
      >
        {/* Main Pricing Cards extracted from homepage section */}
        <PricingSection />

      </main>
      <Footer />
    </>
  );
}
