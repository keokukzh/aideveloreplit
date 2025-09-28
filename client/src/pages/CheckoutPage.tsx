// Checkout page implementation based on javascript_stripe integration
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import { type Module } from "@/lib/pricing/types";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ modules, total }: { modules: Module[], total: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?modules=${modules.map(m => m.id).join(',')}&total=${total.toFixed(2)}`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful", 
        description: "Thank you for your purchase!",
      });
      // Redirect will be handled by Stripe's return_url
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setLocation('/')}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold" data-testid="title-checkout">Complete Your Purchase</h1>
          <p className="text-muted-foreground" data-testid="text-checkout-description">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <Card data-testid="card-order-summary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Order Summary
            </CardTitle>
            <CardDescription>
              Your selected AI modules
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {modules.map((module) => (
              <div key={module.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50" data-testid={`item-module-${module.id}`}>
                <div>
                  <h4 className="font-medium" data-testid={`text-module-name-${module.id}`}>{module.name}</h4>
                  <p className="text-sm text-muted-foreground" data-testid={`text-module-description-${module.id}`}>
                    {module.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold" data-testid={`text-module-price-${module.id}`}>€{module.price}</p>
                  <p className="text-xs text-muted-foreground">per month</p>
                </div>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span data-testid="text-total-label">Total</span>
                <span data-testid="text-total-amount">€{total.toFixed(2)}/month</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1" data-testid="text-billing-info">
                Billed monthly • Cancel anytime
              </p>
            </div>

            {/* Security Features */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span data-testid="text-security-ssl">256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CreditCard className="h-4 w-4" />
                <span data-testid="text-security-pci">PCI DSS compliant</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card data-testid="card-payment-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Enter your payment information below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-4 border rounded-lg bg-background">
                <PaymentElement />
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold" 
                disabled={!stripe || !elements || isLoading}
                data-testid="button-complete-payment"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                    Processing...
                  </div>
                ) : (
                  `Complete Payment - €${total.toFixed(2)}`
                )}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground" data-testid="text-terms">
                By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                You can cancel your subscription at any time.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");
  const [modules, setModules] = useState<Module[]>([]);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Get URL params for checkout data
    const urlParams = new URLSearchParams(window.location.search);
    const moduleIds = urlParams.get('modules')?.split(',') || [];
    const amount = parseFloat(urlParams.get('total') || '0');

    if (!moduleIds.length || !amount) {
      setLocation('/');
      return;
    }

    // Load module configs from the pricing config
    import('@/lib/pricing/config').then((config) => {
      const selectedModules = config.MODULES.filter((m: Module) => moduleIds.includes(m.id));
      setModules(selectedModules);
    });

    // Create PaymentIntent
    apiRequest("POST", "/api/create-payment-intent", { 
      amount, 
      selectedModuleIds: moduleIds 
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setClientSecret(data.clientSecret);
        } else {
          throw new Error(data.message || 'Failed to create payment intent');
        }
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        setLocation('/');
      });
  }, [setLocation]);

  if (!clientSecret || !modules.length) {
    return (
      <div className="h-screen flex items-center justify-center" data-testid="loading-checkout">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" aria-label="Loading"/>
          <p className="text-muted-foreground">Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  // Calculate total from modules
  const calculatedTotal = modules.reduce((sum, module) => sum + module.price, 0);

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm modules={modules} total={calculatedTotal} />
    </Elements>
  );
}