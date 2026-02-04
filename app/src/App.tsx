import { useState, Suspense, lazy } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/sections/Hero';
import { TranslationInterface } from '@/sections/TranslationInterface';
import { Features } from '@/sections/Features';
import { Footer, PrivacyModal, TermsModal } from '@/sections/Footer';

// Lazy load the Three.js background for performance
const MedicalBackground = lazy(() => 
  import('@/components/three/MedicalBackground').then(module => ({ 
    default: module.MedicalBackground 
  }))
);

// Loading fallback for 3D background
const BackgroundFallback = () => (
  <div className="fixed inset-0 z-0 bg-gradient-to-br from-black via-gray-900 to-black">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,255,0.05),transparent_50%)]" />
  </div>
);

function App() {
  const [activeModal, setActiveModal] = useState<'none' | 'privacy' | 'terms'>('none');

  return (
    <div className="min-h-screen bg-background text-foreground relative selection:bg-cyan-500/30 selection:text-white">
      {/* 3D Background */}
      <Suspense fallback={<BackgroundFallback />}>
        <MedicalBackground />
      </Suspense>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Translation Interface */}
        <TranslationInterface />

        {/* Features Section */}
        <Features />

        {/* Footer */}
        <Footer 
          onOpenPrivacy={() => setActiveModal('privacy')} 
          onOpenTerms={() => setActiveModal('terms')} 
        />
      </main>

      {/* Modals */}
      <PrivacyModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal('none')} 
      />
      
      <TermsModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal('none')} 
      />
    </div>
  );
}

export default App;
