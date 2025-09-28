import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Sparkles } from "lucide-react";
import { calculatePricing, formatPrice, formatDiscountPercent } from "@/lib/pricing/calc";
import { startCheckout } from "@/lib/checkout/stripeStub";
import { HolographicCard, HolographicButton } from "@/components/HolographicUI";

interface PricingSummaryProps {
  selectedModuleIds: string[];
}

export default function PricingSummary({ selectedModuleIds }: PricingSummaryProps) {
  const pricing = useMemo(() => calculatePricing(selectedModuleIds), [selectedModuleIds]);
  
  const handleCheckout = () => {
    if (selectedModuleIds.length === 0) return;
    startCheckout(selectedModuleIds, pricing.total);
  };
  
  if (selectedModuleIds.length === 0) {
    return (
      <section className="py-12 px-4" id="pricing-summary">
        <div className="container mx-auto max-w-4xl">
          <HolographicCard className="text-center">
            <CardContent className="py-12">
              <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Ready to get started?</h3>
              <p className="text-muted-foreground">
                Select the AI agents you need above to see your custom pricing.
              </p>
            </CardContent>
          </HolographicCard>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4" id="pricing-summary">
      <div className="container mx-auto max-w-4xl">
        <HolographicCard data-testid="pricing-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Your Custom AI Solution
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Selected modules */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Selected Modules
              </h4>
              <div className="space-y-2">
                {pricing.selectedModules.map((module) => (
                  <div 
                    key={module.id} 
                    className="flex items-center justify-between py-2"
                    data-testid={`summary-item-${module.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="text-xs">
                        Active
                      </Badge>
                      <span className="font-medium">{module.name}</span>
                    </div>
                    <span className="font-mono text-sm">
                      {formatPrice(module.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            {/* Pricing breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-mono" data-testid="subtotal">
                  {formatPrice(pricing.subtotal)}
                </span>
              </div>
              
              {pricing.discountPercent > 0 && (
                <div className="flex items-center justify-between text-green-600">
                  <div className="flex items-center gap-2">
                    <span>Multi-module discount</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {formatDiscountPercent(pricing.discountPercent)} off
                    </Badge>
                  </div>
                  <span className="font-mono" data-testid="discount-amount">
                    -{formatPrice(pricing.discountAmount)}
                  </span>
                </div>
              )}
              
              <Separator />
              
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total per month</span>
                <span className="font-mono text-primary" data-testid="total">
                  {formatPrice(pricing.total)}
                </span>
              </div>
            </div>
            
            <div className="pt-4">
              <HolographicButton 
                className="w-full text-lg"
                onClick={handleCheckout}
                data-testid="button-checkout"
              >
                <span className="flex items-center justify-center gap-2">
                  Continue to Checkout
                  <ArrowRight className="h-5 w-5" />
                </span>
              </HolographicButton>
              
              <div className="text-center mt-4 space-y-1">
                <p className="text-xs text-muted-foreground">
                  All prices exclude VAT
                </p>
              </div>
            </div>
            
            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-6 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                ✅ Money-back guarantee
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                ✅ No setup fees
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                ✅ GDPR compliant
              </div>
            </div>
          </CardContent>
        </HolographicCard>
      </div>
    </section>
  );
}