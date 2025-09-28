import EnglishHeader from "@/components/landing/EnglishHeader";
import EnglishHero from "@/components/landing/EnglishHero";
import ProductCards from "@/components/landing/ProductCards";
import PricingSummary from "@/components/landing/PricingSummary";
import References from "@/components/landing/References";
import FAQ from "@/components/landing/FAQ";
import ContactForm from "@/components/ContactForm";
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
      
      {/* Footer */}
      <footer className="border-t border-border py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">AIDevelo.AI</h3>
              <p className="text-sm text-muted-foreground">
                Modular AI solutions for growing businesses. Pay only for what you use.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Products</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#products" className="hover:text-primary transition-colors">AI Phone Agent</a></li>
                <li><a href="#products" className="hover:text-primary transition-colors">AI Chat Agent</a></li>
                <li><a href="#products" className="hover:text-primary transition-colors">AI Social Media Agent</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="mailto:support@aidevelo.ai" className="hover:text-primary transition-colors">Email Support</a></li>
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/imprint" className="hover:text-primary transition-colors">Imprint</a></li>
                <li><a href="#references" className="hover:text-primary transition-colors">Customer Stories</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 AIDevelo.AI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>🇪🇺 EU Data Centers</span>
              <span>🔒 GDPR Compliant</span>
              <span>🚀 99.9% Uptime</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}