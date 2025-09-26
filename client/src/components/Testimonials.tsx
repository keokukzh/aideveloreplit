import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "In 6 Wochen von 0 auf 40 qualifizierte Leads/Monat – ohne Ads hochzudrehen.",
    author: "Lara M.",
    role: "Agenturinhaberin",
  },
  {
    id: 2,
    quote: "Der AI-Responder beantwortet 80% der Anfragen in < 60 Sekunden. Kunden lieben es.",
    author: "Jonas M.",
    role: "SaaS-Gründer",
  },
  {
    id: 3,
    quote: "Die Landingpages sind richtig schnell und sehen top aus. Conversion +38%.",
    author: "Deniz M.",
    role: "E‑Commerce",
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="hover-elevate" data-testid={`testimonial-${testimonial.id}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Quote className="h-8 w-8 text-primary/60" />
                  <blockquote className="text-lg font-medium leading-relaxed" data-testid={`quote-${testimonial.id}`}>
                    {testimonial.quote}
                  </blockquote>
                  <footer className="text-sm text-muted-foreground" data-testid={`author-${testimonial.id}`}>
                    — {testimonial.author}, {testimonial.role}
                  </footer>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}