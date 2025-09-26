import { useEffect, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import IntroOverlay from "@/components/IntroOverlay";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import IntelligentPricing from "@/components/IntelligentPricing";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

export default function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  // Set dark mode by default for AIDevelo.AI design
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    // Disable scroll during intro
    if (showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showIntro]);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setContentReady(true);
  };

  return (
    <LayoutGroup>
      {/* Intro Overlay */}
      {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}
      
      {/* Main Content */}
      <motion.div 
        className="min-h-screen bg-background text-foreground"
        initial={{ filter: "blur(4px)", opacity: 0.3 }}
        animate={{ 
          filter: contentReady ? "blur(0px)" : "blur(4px)",
          opacity: contentReady ? 1 : 0.3
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Header />
        <main>
          <Hero />
          <Features />
          <Pricing />
          <IntelligentPricing />
          <CaseStudies />
          <Testimonials />
          <ContactForm />
        </main>
        <Footer />
      </motion.div>
    </LayoutGroup>
  );
}