import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Users } from "lucide-react";
import { HolographicCard, HolographicButton } from "@/components/HolographicUI";

export default function EnglishHero() {
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/3 to-chart-2/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto max-w-4xl text-center relative z-10">
        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Zap className="w-3 h-3 mr-1" />
            14-Day Free Trial
          </Badge>
          <Badge variant="secondary" className="text-xs">
            <Users className="w-3 h-3 mr-1" />
            SME Focused
          </Badge>
        </div>

        <div className="space-y-8">
          {/* Main headline */}
          <div className="space-y-4">
            <h1 
              className="text-4xl lg:text-7xl font-bold gradient-text leading-tight"
              data-testid="heading-hero"
            >
              Pick Your AI Agents.
              <br />
              <span className="text-primary">Pay Only for What You Use.</span>
            </h1>
            
            <p 
              className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              data-testid="text-hero-description"
            >
              Transform your business with modular AI solutions. Choose phone, chat, or social media agents individually. 
              <strong className="text-foreground"> No bundles, no waste, just results.</strong>
            </p>
          </div>

          {/* Value proposition */}
          <HolographicCard className="max-w-2xl mx-auto">
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">€49-79</div>
                  <div className="text-sm text-muted-foreground">Per agent/month</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">Always working</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">15%</div>
                  <div className="text-sm text-muted-foreground">Multi-agent discount</div>
                </div>
              </div>
            </div>
          </HolographicCard>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <HolographicButton 
              onClick={scrollToProducts}
              className="text-lg font-semibold"
              data-testid="button-explore-products"
            >
              <span className="flex items-center gap-2">
                Explore AI Agents
                <ArrowRight className="h-5 w-5" />
              </span>
            </HolographicButton>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={scrollToContact}
              className="text-lg backdrop-blur-sm bg-background/50"
              data-testid="button-talk-to-expert"
            >
              Talk to Expert
            </Button>
          </div>

          {/* Social proof teaser */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by SMEs across Europe
            </p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-xs font-medium">Manufacturing</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">Professional Services</div>
              <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
              <div className="text-xs font-medium">E-commerce</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}