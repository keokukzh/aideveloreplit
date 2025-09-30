import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, MessageCircle } from "lucide-react";
import { HolographicCard } from "@/components/HolographicUI";
import { track } from "@/lib/analytics";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "pricing" | "technical" | "business";
}

const faqItems: FAQItem[] = [
  {
    id: "what-are-ai-agents",
    question: "What exactly are AI agents and how do they work?",
    answer: "AI agents are intelligent software programs that can understand, learn, and act on behalf of your business. Our phone agent answers calls using natural language processing, our chat agent handles website inquiries in real-time, and our social media agent creates content and engages with your audience automatically. They operate 24/7 and integrate seamlessly with your existing systems.",
    category: "general"
  },
  {
    id: "modular-pricing",
    question: "How does the modular pricing work?", 
    answer: "Unlike traditional bundled solutions, you pay only for the AI agents you actually need. Each agent has its own monthly fee: Phone Agent (€79), Chat Agent (€49), Social Media Agent (€59). Select multiple agents and get automatic discounts: 10% off for 2 agents, 15% off for 3 agents. No long-term contracts, cancel anytime.",
    category: "pricing"
  },
  {
    id: "setup-time",
    question: "How long does it take to set up and see results?",
    answer: "Most customers see initial results within 48 hours. Phone and chat agents can be configured in under 2 hours with our guided setup process. Social media agents need 3-5 days for content planning and audience analysis. We provide dedicated onboarding support to ensure smooth implementation.",
    category: "technical"
  },
  {
    id: "data-security",
    question: "Is my business data secure and GDPR compliant?",
    answer: "Absolutely. All data is processed in EU data centers, fully encrypted, and we maintain strict GDPR compliance. Your customer data never leaves our secure infrastructure, and you maintain full control over data retention and deletion. We undergo regular security audits and provide detailed compliance documentation.",
    category: "technical"
  },
  {
    id: "human-handover",
    question: "What happens when the AI can't handle a request?",
    answer: "Our AI agents are designed to recognize their limitations. When they encounter complex requests, they seamlessly transfer to your human team with full context and conversation history. You can set custom escalation rules and the handover process is completely transparent to your customers.",
    category: "business"
  },
  {
    id: "integration",
    question: "Can the agents integrate with my existing business tools?",
    answer: "Yes! Our agents integrate with popular CRM systems (Salesforce, HubSpot), calendar applications (Google Calendar, Outlook), communication tools (Slack, Teams), and e-commerce platforms (Shopify, WooCommerce). We also provide API access for custom integrations with your specific business systems.",
    category: "technical"
  },
  {
    id: "scaling",
    question: "How do the agents scale as my business grows?",
    answer: "Our AI agents scale automatically with your business volume. There are no per-interaction fees or volume limits. Whether you have 10 customers or 10,000, the monthly price remains the same. As your needs evolve, you can easily add or remove agents from your subscription.",
    category: "business"
  },
  {
    id: "roi-timeline",
    question: "What kind of ROI can I expect and when?",
    answer: "Most customers see positive ROI within 30-60 days. Typical savings include: 60-80% reduction in routine inquiry handling costs, 3x faster response times leading to higher conversion rates, and 200%+ increase in qualified leads. The exact ROI depends on your current volume and industry, but our team provides ROI projections during onboarding.",
    category: "business"
  }
];

const categories = [
  { id: "general", label: "General", count: faqItems.filter(item => item.category === "general").length },
  { id: "pricing", label: "Pricing", count: faqItems.filter(item => item.category === "pricing").length },
  { id: "technical", label: "Technical", count: faqItems.filter(item => item.category === "technical").length },
  { id: "business", label: "Business", count: faqItems.filter(item => item.category === "business").length }
];

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState<string>("general");

  const filteredFAQs = faqItems.filter(item => 
    selectedCategory === "all" || item.category === selectedCategory
  );

  const scrollToContact = () => {
    track("cta_click", { location: "faq", cta: "contact_expert" });
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4" id="faq">
      <div className="container mx-auto max-w-4xl">
        {/* Section header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-faq">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-faq-description">
            Everything you need to know about our AI agents and modular pricing model.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-sm"
              data-testid={`button-category-${category.id}`}
            >
              {category.label} ({category.count})
            </Button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <HolographicCard className="mb-12">
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((item) => (
                <AccordionItem key={item.id} value={item.id} data-testid={`faq-${item.id}`}>
                  <AccordionTrigger className="text-left hover:text-primary">
                    <div className="flex items-center gap-3">
                      <HelpCircle className="h-5 w-5 flex-shrink-0 text-primary" />
                      <span>{item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pt-2 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </HolographicCard>

        {/* Still have questions CTA */}
        <HolographicCard className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <MessageCircle className="h-6 w-6 text-primary" />
              Still Have Questions?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Our AI experts are here to help you choose the right combination of agents for your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={scrollToContact}
                data-testid="button-contact-expert"
              >
                Talk to an Expert
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => window.open('mailto:support@aidevelo.ai', '_blank')}
                data-testid="button-email-support"
              >
                Email Support
              </Button>
            </div>
          </CardContent>
        </HolographicCard>
      </div>
    </section>
  );
}