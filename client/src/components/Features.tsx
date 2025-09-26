import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Bot, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    badge: "Akquise",
    title: "Landingpages, die konvertieren",
    description: "Konversionsstarke Sektionen, A/B-Tests und schnelle Ladezeiten.",
  },
  {
    icon: Bot,
    badge: "Automation",
    title: "AI-Lead-Qualifizierung",
    description: "Antwortet in Sekunden, priorisiert Chancen und bucht Termine.",
  },
  {
    icon: TrendingUp,
    badge: "Trust",
    title: "Case-Studys & Reviews",
    description: "Zeig Ergebnisse mit Zahlen, Video-Testimonials und Logos.",
  },
];

export default function Features() {
  return (
    <section className="py-20 px-4" id="features">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold" data-testid="heading-features">
            Alles, was du für planbares Wachstum brauchst
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-features-description">
            Von der ersten Berührung bis zum Abschluss – sauber abgedeckt.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover-elevate" data-testid={`card-feature-${index + 1}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="secondary" data-testid={`badge-${feature.badge.toLowerCase()}`}>
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl" data-testid={`title-feature-${index + 1}`}>
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground" data-testid={`desc-feature-${index + 1}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}