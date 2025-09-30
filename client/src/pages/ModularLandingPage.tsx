import EnglishHeader from "@/components/landing/EnglishHeader";
import EnglishHero from "@/components/landing/EnglishHero";
import ProductCards from "@/components/landing/ProductCards";
import PricingSummary from "@/components/landing/PricingSummary";
import References from "@/components/landing/References";
import FAQ from "@/components/landing/FAQ";
import FeaturesOutcome from "@/components/landing/FeaturesOutcome";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useProductSelection } from "@/hooks/useProductSelection";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

export default function ModularLandingPage() {
  const { selectedModuleIds, toggleModule } = useProductSelection();
  const [demoDataCreated, setDemoDataCreated] = useState(false);
  const [showChatDemo, setShowChatDemo] = useState(false);

  const createDemoData = async () => {
    try {
      const response = await apiRequest('POST', '/api/demo-data', {});
      const data = await response.json();
      if (data.success) {
        setDemoDataCreated(true);
        alert('Demo data created! You can now visit the dashboard to see your AI agents.');
      }
    } catch (error) {
      console.error('Error creating demo data:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <EnglishHeader />
      
      <main>
        <EnglishHero />
        
        <div id="products">
          <ProductCards 
            selectedModuleIds={selectedModuleIds}
            onModuleToggle={toggleModule}
          />
        </div>
        
        <FeaturesOutcome />

        <PricingSummary selectedModuleIds={selectedModuleIds} />
        
        <References />
        
        <FAQ />
        
        <div id="contact">
          <ContactForm />
        </div>
        
        {/* Demo Section */}
        <section className="py-20 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Try Our AI Agents</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Experience the power of AI automation with live demos
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  onClick={createDemoData}
                  disabled={demoDataCreated}
                  variant="outline"
                  className="font-semibold"
                  data-testid="button-create-demo-data"
                >
                  {demoDataCreated ? '✅ PRO Account Active - All Products Unlocked!' : '🚀 Create PRO Account (All AI Products)'}
                </Button>
                
                <Button 
                  onClick={() => window.open('/dashboard', '_blank')}
                  variant="default"
                  data-testid="button-view-dashboard"
                >
                  View Dashboard
                </Button>
                
                <Button 
                  onClick={() => setShowChatDemo(!showChatDemo)}
                  variant="secondary"
                  data-testid="button-toggle-chat-demo"
                >
                  {showChatDemo ? 'Hide Chat Demo' : 'Try Chat Agent'}
                </Button>
              </div>
            </div>
            
            {showChatDemo && (
              <div className="max-w-md mx-auto">
                <ChatWidget 
                  agentConfigId="demo-chat-agent"
                  position="embedded"
                  welcomeMessage="Hello! I'm your AI assistant. I can help you learn about our AI automation services. What would you like to know?"
                  companyName="AIDevelo.AI"
                  brandColor="#00cfff"
                />
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Floating Chat Widget for website visitors */}
      <ChatWidget 
        agentConfigId="demo-chat-agent"
        position="bottom-right"
        welcomeMessage="Hi! I'm here to help you learn about our AI automation solutions. How can I assist you today?"
        companyName="AIDevelo.AI"
        brandColor="#00cfff"
      />
    </div>
  );
}
