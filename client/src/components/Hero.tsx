import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowRight, Play, Sparkles } from "lucide-react";

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
              <Badge variant="outline" className="glass hover-elevate" data-testid="badge-feature-1">KI-Chat & Voice-Agenten</Badge>
              <Badge variant="outline" className="glass hover-elevate" data-testid="badge-feature-2">Prozessautomatisierung</Badge>
              <Badge variant="outline" className="glass hover-elevate" data-testid="badge-feature-3">IT-Sicherheitspaket</Badge>
              <Badge variant="outline" className="glass hover-elevate" data-testid="badge-feature-4">14 Tage kostenlos</Badge>
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
          
          <div className="lg:justify-self-end scroll-reveal stagger-3">
            <Card className="p-6 glass-intense card-3d shadow-glow group cursor-pointer" data-testid="card-video">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/30 to-chart-2/30 relative">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-primary/30 rounded-full flex items-center justify-center shadow-glow pulse-glow magnetic">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-lg" data-testid="text-video-title">Produktdemo</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-video-duration">2:30 Min • Jetzt ansehen</p>
                    </div>
                  </div>
                  
                  {/* Animated background elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full pulse-glow" />
                  <div className="absolute bottom-6 left-6 w-3 h-3 bg-chart-2 rounded-full pulse-glow" style={{ animationDelay: '1s' }} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}