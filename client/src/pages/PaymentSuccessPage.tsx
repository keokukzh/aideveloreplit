import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ArrowLeft, Download, Mail } from "lucide-react";

export default function PaymentSuccessPage() {
  const [, setLocation] = useLocation();
  const [paymentDetails, setPaymentDetails] = useState<{
    modules: string[];
    total: string;
  } | null>(null);

  useEffect(() => {
    // Get payment details from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const modules = urlParams.get('modules')?.split(',') || [];
    const total = urlParams.get('total') || '0';
    
    if (modules.length > 0) {
      setPaymentDetails({ modules, total });
    }
  }, []);

  const handleBackToHome = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl" data-testid="card-payment-success">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" data-testid="icon-success" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-green-600 dark:text-green-400" data-testid="title-success">
              Payment Successful!
            </CardTitle>
            <CardDescription className="text-lg mt-2" data-testid="text-success-description">
              Thank you for choosing AIDevelo.AI. Your AI modules are being set up.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {paymentDetails && (
            <div className="bg-muted/50 rounded-lg p-4" data-testid="section-payment-details">
              <h3 className="font-semibold mb-3" data-testid="title-order-summary">Order Summary</h3>
              <div className="space-y-2">
                {paymentDetails.modules.map((moduleId) => (
                  <div key={moduleId} className="flex justify-between text-sm" data-testid={`item-purchased-${moduleId}`}>
                    <span className="capitalize">{moduleId.replace('-', ' ')} Agent</span>
                    <span className="font-medium">€{moduleId === 'phone' ? '79' : moduleId === 'chat' ? '49' : '59'}/month</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between font-semibold" data-testid="total-paid">
                    <span>Total Paid</span>
                    <span>€{paymentDetails.total}/month</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 text-center" data-testid="section-next-steps">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100" data-testid="title-email-confirmation">
                Check Your Email
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1" data-testid="text-email-details">
                Setup instructions and login details have been sent to your email.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-950/20 rounded-lg p-4 text-center" data-testid="section-support">
              <Download className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-purple-900 dark:text-purple-100" data-testid="title-resources">
                Resources Ready
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300 mt-1" data-testid="text-resources-details">
                API documentation and integration guides are available in your dashboard.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4" data-testid="section-important-info">
            <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2" data-testid="title-important">
              Important Information
            </h4>
            <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
              <li data-testid="info-billing">• Your subscription will be billed monthly starting today</li>
              <li data-testid="info-cancellation">• You can cancel anytime from your account settings</li>
              <li data-testid="info-support">• 24/7 support is available via email or chat</li>
              <li data-testid="info-setup">• AI module setup typically takes 5-10 minutes</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              onClick={handleBackToHome}
              className="flex-1"
              data-testid="button-back-home"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Homepage
            </Button>
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.open('mailto:support@aidevelo.ai', '_blank')}
              data-testid="button-contact-support"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}