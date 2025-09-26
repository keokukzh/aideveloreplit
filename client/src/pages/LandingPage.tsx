import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import IntelligentPricing from "@/components/IntelligentPricing";
import CaseStudies from "@/components/CaseStudies";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function LandingPage() {
  // Set dark mode by default for AIDevelo.AI design
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  // Initialize scroll reveal animations
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background text-foreground">
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
    </div>
  );
}