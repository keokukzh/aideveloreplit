import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Settings, BarChart3, Shield, Plus } from "lucide-react";
import { HolographicCard, HolographicBadge } from "./HolographicUI";
import InteractiveParticles from "./InteractiveParticles";

const productPortfolio = [
  {
    icon: MessageCircle,
    badge: "Support",
    title: "Multichannel-Kundensupport",
    description: "KI-Chat- & Voice-Agenten, branchenspezifisch anpassbar.",
    features: [
      "KI-Chat- & Voice-Agenten",
      "Branchenspezifisch anpassbar", 
      "Lernt aus Interaktionen und optimiert Antworten automatisch"
    ]
  },
  {
    icon: Settings,
    badge: "Automation",
    title: "Prozessautomatisierung",
    description: "Rechnungsverarbeitung, Terminplanung & Workflow-Automation.",
    features: [
      "Rechnungsverarbeitung (Erfassung, Prüfung, Buchung)",
      "Terminplanung & Workflow-Automation",
      "Dokumentenverwaltung (Kategorisierung, Archivierung, Suche)"
    ]
  },
  {
    icon: BarChart3,
    badge: "Analytics",
    title: "Content & Datenanalyse",
    description: "Marketing-Content-Erstellung und datengetriebene Entscheidungen.",
    features: [
      "Automatisierte Marketing-Content-Erstellung",
      "Datenanalyse mit automatisch generierten Berichten",
      "Unterstützung für datengetriebene Entscheidungen"
    ]
  },
  {
    icon: Shield,
    badge: "Security",
    title: "IT-Sicherheitspaket",
    description: "Bedrohungserkennung, Patch-Management und Sicherheits-Dashboard.",
    features: [
      "Automatische Bedrohungserkennung & Alarme",
      "Patch- & Update-Management",
      "Sicherheits-Dashboard mit klaren Handlungsempfehlungen"
    ]
  },
  {
    icon: Plus,
    badge: "Extras",
    title: "Zusatzmodule",
    description: "Kundenfeedback-Analyse und intelligente Vertriebsunterstützung.",
    features: [
      "Kundenfeedback-Analyse (Auswertung von Bewertungen & Trends)",
      "Vertriebsunterstützung (Lead-Priorisierung, personalisierte E-Mails)"
    ]
  }
];

export default function Features() {
  return (
    <section className="py-20 px-4 relative overflow-hidden" id="features">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background to-background/50" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-chart-2/5 rounded-full blur-3xl" />
      
      {/* Interactive Particle System */}
      <div className="absolute inset-0 z-5 opacity-50">
        <InteractiveParticles />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-4 mb-16 scroll-reveal">
          <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-features">
            Dein KI-Produktportfolio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto scroll-reveal stagger-1" data-testid="text-features-description">
            Umfassende KI-Lösungen für jeden Bereich deines Unternehmens.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {productPortfolio.map((product, index) => {
            const Icon = product.icon;
            return (
              <HolographicCard key={index} className="group scroll-reveal" data-testid={`card-product-${index + 1}`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-primary/20 shadow-glow group-hover:shadow-purple-glow transition-all duration-300">
                      <Icon className="h-6 w-6 text-primary group-hover:text-chart-2 transition-colors duration-300" />
                    </div>
                    <HolographicBadge data-testid={`badge-${product.badge.toLowerCase()}`}>
                      {product.badge}
                    </HolographicBadge>
                  </div>
                  <CardTitle className="text-xl mb-2" data-testid={`title-product-${index + 1}`}>
                    {product.title}
                  </CardTitle>
                  <p className="text-muted-foreground" data-testid={`desc-product-${index + 1}`}>
                    {product.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-sm text-muted-foreground flex items-start gap-2" data-testid={`feature-${index + 1}-${featureIndex + 1}`}>
                        <span className="w-1 h-1 rounded-full bg-primary mt-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </HolographicCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}