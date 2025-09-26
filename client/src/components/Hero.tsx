import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import AIAssistantSimulation from "./AIAssistantSimulation";
import InteractiveParticles from "./InteractiveParticles";
import { HolographicButton, HolographicBadge } from "./HolographicUI";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center py-20 px-4 overflow-hidden">
      {/* Advanced animated backgrounds */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-chart-2/20 rounded-full blur-3xl float" style={{ animationDelay: '2s', animationDuration: '4s' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60" />
      </div>
      
      {/* Interactive Particle System */}
      <div className="absolute inset-0 z-5">
        <InteractiveParticles />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 scroll-reveal">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-4 scroll-reveal stagger-1">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>Revolutionäre KI-Lösungen für Ihr Unternehmen</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight scroll-reveal stagger-2" data-testid="heading-hero">
                <span className="block">Mehr Aufträge. Automatisch.</span>{" "}
                <span className="gradient-text-cyan-purple block">
                  Mit AI.
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg scroll-reveal stagger-3" data-testid="text-hero-description">
                Umfassende KI-Lösungen für Kundensupport, Prozessautomatisierung, Content-Erstellung, IT-Sicherheit und Vertriebsoptimierung – maßgeschneidert für dein Unternehmen.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 scroll-reveal stagger-4">
              <HolographicBadge data-testid="badge-feature-1">KI-Chat & Voice-Agenten</HolographicBadge>
              <HolographicBadge data-testid="badge-feature-2">Prozessautomatisierung</HolographicBadge>
              <HolographicBadge data-testid="badge-feature-3">IT-Sicherheitspaket</HolographicBadge>
              <HolographicBadge data-testid="badge-feature-4">14 Tage kostenlos</HolographicBadge>
            </div>
            
            <div className="space-y-4 scroll-reveal stagger-5">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 magnetic shadow-glow glow-border" data-testid="button-cta-hero">
                  Jetzt starten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 magnetic glass" data-testid="button-demo">
                  <Play className="mr-2 h-5 w-5" />
                  Demo ansehen
                </Button>
              </div>
              <p className="text-sm text-muted-foreground" data-testid="text-guarantee">
                ✅ 14 Tage Geld-zurück-Garantie • ✅ Keine Einrichtungsgebühren
              </p>
            </div>
          </div>
          
          <div className="lg:justify-self-end scroll-reveal stagger-3 relative">
            {/* AI Assistant Simulation */}
            <div className="relative z-20">
              <AIAssistantSimulation />
            </div>
            
            {/* Background holographic elements */}
            <div className="absolute -inset-4 pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-4 bg-primary/40 rounded-full blur-sm animate-pulse" />
              <div className="absolute top-8 right-4 w-2 h-2 bg-chart-2/60 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
              <div className="absolute bottom-4 left-8 w-3 h-3 bg-green-500/40 rounded-full blur-sm animate-pulse" style={{ animationDelay: '2s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}