import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "€299",
    period: "/Monat",
    badge: "Starter",
    popular: false,
    features: [
      "KI-Chat Agent (1 Kanal)",
      "Basis Prozessautomatisierung",
      "Standard Support",
    ],
    cta: "Los geht's",
  },
  {
    name: "Professional",
    price: "€799",
    period: "/Monat",
    badge: "Beliebt",
    popular: true,
    features: [
      "Multichannel KI-Support",
      "Vollständige Prozessautomatisierung",
      "Content & Datenanalyse",
      "IT-Sicherheitspaket",
    ],
    cta: "Kostenlos testen",
  },
  {
    name: "Enterprise",
    price: "€1.999",
    period: "/Monat",
    badge: "Enterprise",
    popular: false,
    features: [
      "Alle KI-Module inklusive",
      "Individuelle Anpassungen",
      "Dedicated Account Manager",
      "24/7 Premium Support",
    ],
    cta: "Demo anfragen",
  },
];

export default function Pricing() {
  return (
    <section className="py-20 px-4" id="pricing">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold" data-testid="heading-pricing">
            Transparente Preise
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-pricing-description">
            Starte klein. Skaliere, wenn es sich lohnt.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <Card 
              key={index} 
              className={`relative hover-elevate ${tier.popular ? 'ring-2 ring-primary/50' : ''}`}
              data-testid={`card-pricing-${tier.name.toLowerCase()}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground" data-testid="badge-popular">
                    Beliebt
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-8">
                <Badge variant="outline" className="w-fit mx-auto" data-testid={`badge-tier-${tier.name.toLowerCase()}`}>
                  {tier.badge}
                </Badge>
                <div className="mt-4">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold" data-testid={`price-${tier.name.toLowerCase()}`}>
                      {tier.price}
                    </span>
                    <span className="text-muted-foreground" data-testid={`period-${tier.name.toLowerCase()}`}>
                      {tier.period}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm" data-testid={`feature-${tier.name.toLowerCase()}-${featureIndex}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={tier.popular ? "default" : "outline"}
                  data-testid={`button-cta-${tier.name.toLowerCase()}`}
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}