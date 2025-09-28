import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Phone, MessageCircle, Share2 } from "lucide-react";
import { MODULES } from "@/lib/pricing/config";
import { formatPrice } from "@/lib/pricing/calc";
import { HolographicCard } from "@/components/HolographicUI";

interface ProductCardsProps {
  selectedModuleIds: string[];
  onModuleToggle: (moduleId: string, enabled: boolean) => void;
}

const moduleIcons = {
  phone: Phone,
  chat: MessageCircle,
  social: Share2,
} as const;

export default function ProductCards({ selectedModuleIds, onModuleToggle }: ProductCardsProps) {
  return (
    <section className="py-20 px-4" id="products">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-products">
            Pick Exactly What You Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-products-description">
            Activate our AI agents individually or combine them. No unnecessary bundles, just the tools that drive results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {MODULES.map((module) => {
            const isSelected = selectedModuleIds.includes(module.id);
            const IconComponent = moduleIcons[module.id as keyof typeof moduleIcons];
            
            return (
              <HolographicCard 
                key={module.id} 
                className={`relative overflow-hidden transition-all duration-300 ${
                  isSelected 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/20' 
                    : 'hover:shadow-lg'
                }`}
                data-testid={`card-product-${module.id}`}
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(module.price)}/month
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={isSelected}
                        onCheckedChange={(checked) => onModuleToggle(module.id, checked)}
                        aria-label={`Toggle ${module.name}`}
                        data-testid={`switch-${module.id}`}
                      />
                      {isSelected && (
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Key Benefits:</h4>
                    <ul className="space-y-2">
                      {module.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <Button 
                      variant={isSelected ? "default" : "outline"}
                      className="w-full"
                      onClick={() => onModuleToggle(module.id, !isSelected)}
                      data-testid={`button-activate-${module.id}`}
                    >
                      {isSelected ? "✓ Activated" : "Activate"}
                    </Button>
                  </div>
                </CardContent>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </HolographicCard>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-sm text-muted-foreground">
            All prices exclude VAT • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
}