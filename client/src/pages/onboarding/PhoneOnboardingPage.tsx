import { useState } from "react";
import { useLocation } from "wouter";
import { OnboardingStep } from "@/components/products/OnboardingStep";
import { CodeSnippet } from "@/components/products/CodeSnippet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Calendar, Clock, TestTube } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const STORAGE_KEY = "AIDeveloAI:activeProducts";

export default function PhoneOnboardingPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phoneData, setPhoneData] = useState({
    calendarProvider: '',
    businessHours: {
      start: '09:00',
      end: '17:00',
      timezone: 'Europe/Berlin'
    },
    testPhoneNumber: ''
  });

  const steps = [
    {
      title: "Connect Phone Provider",
      description: "Set up your phone system integration",
      completed: false
    },
    {
      title: "Connect Calendar",
      description: "Link your calendar for appointment booking",
      completed: false
    },
    {
      title: "Set Business Hours",
      description: "Configure when your phone agent is active",
      completed: false
    },
    {
      title: "Run Test Call",
      description: "Verify everything works correctly",
      completed: false
    }
  ];

  const [stepStates, setStepStates] = useState(steps);

  const updateStepStatus = (stepIndex: number, completed: boolean) => {
    setStepStates(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, completed } : step
      )
    );
  };

  const handleProvisionPhone = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/phone/provision', {
        calendarProvider: phoneData.calendarProvider
      });
      
      if (response.ok) {
        updateStepStatus(0, true);
        updateStepStatus(1, true);
        setCurrentStep(2);
      }
    } catch (error) {
      console.error('Error provisioning phone:', error);
    }
    setLoading(false);
  };

  const handleConfigureHours = () => {
    updateStepStatus(2, true);
    setCurrentStep(3);
  };

  const handleTestCall = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/phone/test-call', {
        to: phoneData.testPhoneNumber
      });
      
      if (response.ok) {
        updateStepStatus(3, true);
        // Mark product as active in localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        const activeProducts = stored ? JSON.parse(stored) : {};
        activeProducts.phone = {
          moduleId: 'phone',
          status: 'active',
          activatedAt: new Date().toISOString(),
          onboardingCompleted: true
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeProducts));
        
        setTimeout(() => navigate('/products'), 2000);
      }
    } catch (error) {
      console.error('Error running test call:', error);
    }
    setLoading(false);
  };

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
                onClick={() => navigate('/products')}
                className="flex items-center gap-2"
                data-testid="button-back-products"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Products
              </Button>
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Phone className="h-8 w-8 text-primary" />
                  AI Phone Agent Setup
                </h1>
                <p className="text-muted-foreground">
                  Configure your AI phone assistant in 4 simple steps
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">AIDevelo.AI</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Step 1: Connect Phone Provider */}
          <OnboardingStep
            title={stepStates[0].title}
            description={stepStates[0].description}
            completed={stepStates[0].completed}
            loading={loading && currentStep === 0}
            onPrimary={currentStep === 0 && !stepStates[0].completed ? handleProvisionPhone : undefined}
            primaryDisabled={!phoneData.calendarProvider}
          >
            {currentStep === 0 && !stepStates[0].completed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Calendar Provider</label>
                  <Select onValueChange={(value) => setPhoneData(prev => ({ ...prev, calendarProvider: value }))}>
                    <SelectTrigger data-testid="select-calendar-provider">
                      <SelectValue placeholder="Choose your calendar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google Calendar</SelectItem>
                      <SelectItem value="microsoft">Microsoft Outlook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Your phone agent will integrate with Twilio for call handling and automatically sync appointments to your calendar.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {/* Step 2: Connect Calendar (Auto-completed with step 1) */}
          <OnboardingStep
            title={stepStates[1].title}
            description={stepStates[1].description}
            completed={stepStates[1].completed}
          />

          {/* Step 3: Set Business Hours */}
          <OnboardingStep
            title={stepStates[2].title}
            description={stepStates[2].description}
            completed={stepStates[2].completed}
            onPrimary={currentStep === 2 && !stepStates[2].completed ? handleConfigureHours : undefined}
          >
            {currentStep === 2 && !stepStates[2].completed && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <Input
                      type="time"
                      value={phoneData.businessHours.start}
                      onChange={(e) => setPhoneData(prev => ({
                        ...prev,
                        businessHours: { ...prev.businessHours, start: e.target.value }
                      }))}
                      data-testid="input-start-time"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <Input
                      type="time"
                      value={phoneData.businessHours.end}
                      onChange={(e) => setPhoneData(prev => ({
                        ...prev,
                        businessHours: { ...prev.businessHours, end: e.target.value }
                      }))}
                      data-testid="input-end-time"
                    />
                  </div>
                </div>
              </div>
            )}
          </OnboardingStep>

          {/* Step 4: Run Test Call */}
          <OnboardingStep
            title={stepStates[3].title}
            description={stepStates[3].description}
            completed={stepStates[3].completed}
            loading={loading && currentStep === 3}
            onPrimary={currentStep === 3 && !stepStates[3].completed ? handleTestCall : undefined}
            primaryText="Run Test"
            primaryDisabled={!phoneData.testPhoneNumber}
          >
            {currentStep === 3 && !stepStates[3].completed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Test Phone Number</label>
                  <Input
                    type="tel"
                    placeholder="+49 123 456 7890"
                    value={phoneData.testPhoneNumber}
                    onChange={(e) => setPhoneData(prev => ({ ...prev, testPhoneNumber: e.target.value }))}
                    data-testid="input-test-phone"
                  />
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      We'll make a test call to verify your setup. The call will last about 30 seconds.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {stepStates[3].completed && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  You're live!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300">
                  Your AI Phone Agent is now active and ready to handle calls. Redirecting to products...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}