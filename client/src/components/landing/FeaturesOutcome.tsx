import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HolographicCard } from "@/components/HolographicUI";
import { Sparkles, Headphones, MessageCircle, BarChart3 } from "lucide-react";
import { track } from "@/lib/analytics";

const features = [
  {
    id: "outcome-leads",
    icon: MessageCircle,
    title: "Mehr qualifizierte Leads",
    desc: "Chat-Agent qualifiziert Website-Besucher 24/7, bucht Termine & sammelt Kontaktdaten.",
    metric: "+200% Leads"
  },
  {
    id: "outcome-costs",
    icon: Headphones,
    title: "Support-Kosten senken",
    desc: "Phone-Agent beantwortet Standardanfragen automatisch – dein Team fokussiert sich auf komplexe Fälle.",
    metric: "-60% Kosten"
  },
  {
    id: "outcome-reach",
    icon: BarChart3,
    title: "Reichweite skalieren",
    desc: "Social-Agent plant & veröffentlicht Inhalte kanalübergreifend – konsistente Präsenz, mehr Sichtbarkeit.",
    metric: "+150% Reichweite"
  }
];

export default function FeaturesOutcome() {
  const scrollToContact = () => {
    track("cta_click", { location: "features_outcome", cta: "talk_to_expert" });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4" id="outcomes">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-outcomes">
            Ergebnisse statt Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-outcomes-description">
            Wähle die Module, die deinen Engpass lösen – und sieh in Tagen statt Monaten echte Effekte.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <HolographicCard key={f.id} data-testid={`feature-${f.id}`}>
                <CardContent className="p-6 space-y-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-lg font-semibold">{f.title}</div>
                    <p className="text-sm text-muted-foreground mt-1">{f.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-2 text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                    <Sparkles className="h-4 w-4" /> {f.metric}
                  </div>
                </CardContent>
              </HolographicCard>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" onClick={scrollToContact} data-testid="button-outcomes-cta">
            Mit Expert:in sprechen
          </Button>
        </div>
      </div>
    </section>
  );
}


