import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Building2, Users, TrendingUp } from "lucide-react";
import { HolographicCard } from "@/components/HolographicUI";

interface Reference {
  id: string;
  company: string;
  industry: string;
  testimonial: string;
  author: string;
  role: string;
  results: string;
  rating: number;
}

const references: Reference[] = [
  {
    id: "manufacturing-co",
    company: "TechManu GmbH",
    industry: "Manufacturing",
    testimonial: "Our phone agent handles 85% of customer inquiries automatically. We've reduced response time from hours to seconds while our team focuses on complex technical support.",
    author: "Michael Schmidt",
    role: "Operations Director",
    results: "85% automation rate",
    rating: 5
  },
  {
    id: "consulting-firm",
    company: "Strategic Partners Ltd",
    industry: "Consulting",
    testimonial: "The chat agent has transformed our lead qualification process. We capture 3x more qualified leads and book appointments directly through our website, even outside business hours.",
    author: "Sarah Chen",
    role: "Managing Partner",
    results: "3x more qualified leads",
    rating: 5
  },
  {
    id: "retail-business",
    company: "Fashion Forward",
    industry: "E-commerce",
    testimonial: "Our social media agent maintains consistent engagement across all platforms. Our reach has grown 200% while we focus on product development and customer service.",
    author: "Lisa Weber",
    role: "Marketing Director", 
    results: "200% reach increase",
    rating: 5
  },
  {
    id: "professional-services",
    company: "Legal Associates",
    industry: "Professional Services",
    testimonial: "The modular approach was perfect for us. We started with the chat agent, saw great results, then added the phone agent. Total cost of ownership is 60% less than hiring additional staff.",
    author: "Dr. Thomas Mueller",
    role: "Senior Partner",
    results: "60% cost reduction",
    rating: 5
  }
];

const stats = [
  { label: "SME Customers", value: "500+", icon: Building2 },
  { label: "Automation Rate", value: "82%", icon: TrendingUp },
  { label: "Customer Satisfaction", value: "4.9/5", icon: Star },
  { label: "Support Requests Handled", value: "1M+", icon: Users }
];

export default function References() {
  return (
    <section className="py-20 px-4 bg-muted/30" id="references">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-references">
            Trusted by SMEs Across Europe
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-references-description">
            See how businesses like yours are automating operations and growing revenue with our AI agents.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <HolographicCard key={stat.label} className="text-center">
                <CardContent className="p-6">
                  <IconComponent className="h-8 w-8 text-primary mx-auto mb-3" />
                  <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </HolographicCard>
            );
          })}
        </div>

        {/* Customer testimonials */}
        <div className="grid md:grid-cols-2 gap-8">
          {references.map((reference) => (
            <HolographicCard key={reference.id} data-testid={`reference-${reference.id}`}>
              <CardHeader className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{reference.company}</h3>
                    <Badge variant="secondary" className="text-xs mt-1">
                      {reference.industry}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: reference.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="relative">
                  <Quote className="h-6 w-6 text-primary opacity-50 absolute -top-2 -left-2" />
                  <p className="text-muted-foreground leading-relaxed pl-4">
                    {reference.testimonial}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div>
                    <div className="font-medium">{reference.author}</div>
                    <div className="text-sm text-muted-foreground">{reference.role}</div>
                  </div>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {reference.results}
                  </Badge>
                </div>
              </CardContent>
            </HolographicCard>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center mt-16">
          <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm">EU Data Centers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm">99.9% Uptime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}