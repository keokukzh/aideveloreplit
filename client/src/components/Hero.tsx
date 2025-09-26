import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="py-20 px-4">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-chart-2/5 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-tl from-chart-2/10 via-transparent to-primary/5 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight" data-testid="heading-hero">
                Mehr Aufträge. Automatisch.{" "}
                <span className="bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                  Mit AI.
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-lg" data-testid="text-hero-description">
                AIDevelo.AI hilft dir, konstant qualifizierte Leads zu gewinnen, Vertrauen aufzubauen und Abschlüsse zu beschleunigen – ohne mehr manuellen Aufwand.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" data-testid="badge-feature-1">Lead-Magnet & Landingpages</Badge>
              <Badge variant="outline" data-testid="badge-feature-2">AI-Antworten & Chat</Badge>
              <Badge variant="outline" data-testid="badge-feature-3">CRM-Ready</Badge>
              <Badge variant="outline" data-testid="badge-feature-4">14 Tage kostenlos</Badge>
            </div>
            
            <div className="space-y-4">
              <Button size="lg" className="text-lg px-8" data-testid="button-cta-hero">
                Jetzt starten →
              </Button>
              <p className="text-sm text-muted-foreground" data-testid="text-guarantee">
                Kein Risiko. Monatlich kündbar.
              </p>
            </div>
          </div>
          
          <div className="lg:justify-self-end">
            <Card className="p-6 bg-card/50 backdrop-blur-sm" data-testid="card-video">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/20 to-chart-2/20">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground" data-testid="text-video-title">Produktdemo</h3>
                      <p className="text-sm text-muted-foreground" data-testid="text-video-duration">2:30 Min</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}