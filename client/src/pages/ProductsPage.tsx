import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MODULES } from "@/lib/pricing/config";
import { calculatePricing, formatPrice } from "@/lib/pricing/calc";
import { type ActiveProducts, type ProductActivation } from "@/lib/pricing/types";
import { ProductCard } from "@/components/products/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingCart } from "lucide-react";

const STORAGE_KEY = "AIDeveloAI:activeProducts";

function getActiveProducts(): ActiveProducts {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function setActiveProducts(products: ActiveProducts): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export default function ProductsPage() {
  const [, navigate] = useLocation();
  const [activeProducts, setActiveProductsState] = useState<ActiveProducts>(getActiveProducts);

  useEffect(() => {
    setActiveProducts(activeProducts);
  }, [activeProducts]);

  const updateProductStatus = (moduleId: string, updates: Partial<ProductActivation>) => {
    setActiveProductsState(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        moduleId,
        ...updates
      }
    }));
  };

  const handleActivate = (moduleId: string) => {
    updateProductStatus(moduleId, {
      status: 'provisioning',
      activatedAt: new Date().toISOString()
    });
    navigate(`/onboarding/${moduleId}`);
  };

  const handleConfigure = (moduleId: string) => {
    navigate(`/onboarding/${moduleId}`);
  };

  const handleViewDashboard = () => {
    navigate('/dashboard');
  };

  // Calculate pricing for active products
  const activeModuleIds = Object.entries(activeProducts)
    .filter(([, activation]) => activation.status === 'active')
    .map(([moduleId]) => moduleId);
  
  const pricing = calculatePricing(activeModuleIds);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
                data-testid="button-back-home"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div>
                <h1 className="text-3xl font-bold" data-testid="title-products">
                  AI Products
                </h1>
                <p className="text-muted-foreground" data-testid="text-products-subtitle">
                  Activate and manage your AI automation tools
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">AIDevelo.AI</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Pricing Summary */}
        {activeModuleIds.length > 0 && (
          <Card className="mb-8" data-testid="pricing-summary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Active Products Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active products:</span>
                    <Badge variant="outline">
                      {activeModuleIds.length} of {MODULES.length}
                    </Badge>
                  </div>
                  {pricing.discountPercent > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Discount:</span>
                      <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        {pricing.discountPercent}% off
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {pricing.discountPercent > 0 && (
                    <div className="text-sm text-muted-foreground line-through">
                      {formatPrice(pricing.subtotal)}/month
                    </div>
                  )}
                  <div className="text-2xl font-bold">
                    {formatPrice(pricing.total)}/month
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((module) => (
            <ProductCard
              key={module.id}
              module={module}
              activation={activeProducts[module.id]}
              onActivate={() => handleActivate(module.id)}
              onConfigure={() => handleConfigure(module.id)}
              onView={handleViewDashboard}
            />
          ))}
        </div>

        {/* Getting Started */}
        {Object.keys(activeProducts).length === 0 && (
          <Card className="mt-8">
            <CardContent className="text-center py-8">
              <h3 className="text-lg font-semibold mb-2">Get Started with AI Automation</h3>
              <p className="text-muted-foreground mb-4">
                Choose your first AI product to start automating your business processes.
                You can activate multiple products and get volume discounts.
              </p>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">2 products</Badge>
                  <span>10% discount</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">3 products</Badge>
                  <span>15% discount</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}