import EnglishHeader from "@/components/landing/EnglishHeader";
import EnglishHero from "@/components/landing/EnglishHero";
import ProductCards from "@/components/landing/ProductCards";
import PricingSummary from "@/components/landing/PricingSummary";
import References from "@/components/landing/References";
import FAQ from "@/components/landing/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useProductSelection } from "@/hooks/useProductSelection";

export default function ModularLandingPage() {
  const { selectedModuleIds, toggleModule } = useProductSelection();

  return (
    <div className="min-h-screen bg-background">
      <EnglishHeader />
      
      <main>
        <EnglishHero />
        
        <ProductCards 
          selectedModuleIds={selectedModuleIds}
          onModuleToggle={toggleModule}
        />
        
        <PricingSummary selectedModuleIds={selectedModuleIds} />
        
        <References />
        
        <FAQ />
        
        <ContactForm />
      </main>
      
      <Footer />
    </div>
  );
}