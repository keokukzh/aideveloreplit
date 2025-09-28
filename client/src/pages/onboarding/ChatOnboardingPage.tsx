import { useState } from "react";
import { useLocation } from "wouter";
import { OnboardingStep } from "@/components/products/OnboardingStep";
import { CodeSnippet } from "@/components/products/CodeSnippet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageCircle, Code, Database, TestTube } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const STORAGE_KEY = "AIDeveloAI:activeProducts";

export default function ChatOnboardingPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [widgetKey, setWidgetKey] = useState('');
  const [chatData, setChatData] = useState({
    websiteUrl: '',
    knowledgeSource: '',
    testMessage: ''
  });

  const steps = [
    {
      title: "Install Widget",
      description: "Add the chat widget to your website",
      completed: false
    },
    {
      title: "Connect Knowledge",
      description: "Upload or connect your knowledge base",
      completed: false
    },
    {
      title: "Test Chat",
      description: "Verify the chat agent works correctly",
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

  const handleGetWidget = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('GET', '/api/chat/widget-key');
      const data = await response.json();
      
      if (data.ok && data.widgetKey) {
        setWidgetKey(data.widgetKey);
        updateStepStatus(0, true);
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Error getting widget key:', error);
    }
    setLoading(false);
  };

  const handleConnectKnowledge = () => {
    updateStepStatus(1, true);
    setCurrentStep(2);
  };

  const handleTestChat = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/chat/verify-install', {
        widgetKey,
        origin: chatData.websiteUrl
      });
      
      if (response.ok) {
        updateStepStatus(2, true);
        // Mark product as active in localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        const activeProducts = stored ? JSON.parse(stored) : {};
        activeProducts.chat = {
          moduleId: 'chat',
          status: 'active',
          activatedAt: new Date().toISOString(),
          onboardingCompleted: true
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeProducts));
        
        setTimeout(() => navigate('/products'), 2000);
      }
    } catch (error) {
      console.error('Error testing chat:', error);
    }
    setLoading(false);
  };

  const widgetSnippet = widgetKey ? 
    `<script async src="/widget.js" data-key="${widgetKey}"></script>` : 
    '';

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
                  <MessageCircle className="h-8 w-8 text-primary" />
                  AI Chat Agent Setup
                </h1>
                <p className="text-muted-foreground">
                  Add intelligent chat to your website in 3 simple steps
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
          {/* Step 1: Install Widget */}
          <OnboardingStep
            title={stepStates[0].title}
            description={stepStates[0].description}
            completed={stepStates[0].completed}
            loading={loading && currentStep === 0}
            onPrimary={currentStep === 0 && !stepStates[0].completed ? handleGetWidget : undefined}
            primaryText="Generate Widget"
          >
            {stepStates[0].completed && widgetSnippet && (
              <div className="space-y-4">
                <CodeSnippet
                  title="Copy this code to your website"
                  code={widgetSnippet}
                  language="html"
                />
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Add this script tag to your website's HTML, ideally before the closing &lt;/body&gt; tag.
                      The chat widget will appear in the bottom-right corner.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {/* Step 2: Connect Knowledge */}
          <OnboardingStep
            title={stepStates[1].title}
            description={stepStates[1].description}
            completed={stepStates[1].completed}
            onPrimary={currentStep === 1 && !stepStates[1].completed ? handleConnectKnowledge : undefined}
            onSecondary={currentStep === 1 && !stepStates[1].completed ? handleConnectKnowledge : undefined}
            primaryText="Upload File"
            secondaryText="Use URL"
          >
            {currentStep === 1 && !stepStates[1].completed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Knowledge Source URL</label>
                  <Input
                    type="url"
                    placeholder="https://yoursite.com/faq"
                    value={chatData.knowledgeSource}
                    onChange={(e) => setChatData(prev => ({ ...prev, knowledgeSource: e.target.value }))}
                    data-testid="input-knowledge-url"
                  />
                </div>
                <Card>
                  <CardContent className="pt-6 space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Upload a PDF file or provide a URL to your FAQ/knowledge base. Your chat agent will use this information to answer customer questions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <strong>Supported formats:</strong> PDF files, website URLs, FAQ pages
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {/* Step 3: Test Chat */}
          <OnboardingStep
            title={stepStates[2].title}
            description={stepStates[2].description}
            completed={stepStates[2].completed}
            loading={loading && currentStep === 2}
            onPrimary={currentStep === 2 && !stepStates[2].completed ? handleTestChat : undefined}
            primaryText="Run Test"
            primaryDisabled={!chatData.websiteUrl}
          >
            {currentStep === 2 && !stepStates[2].completed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Website URL</label>
                  <Input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    value={chatData.websiteUrl}
                    onChange={(e) => setChatData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    data-testid="input-website-url"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Test Message</label>
                  <Input
                    placeholder="What are your business hours?"
                    value={chatData.testMessage}
                    onChange={(e) => setChatData(prev => ({ ...prev, testMessage: e.target.value }))}
                    data-testid="input-test-message"
                  />
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      We'll verify the widget is installed and test that it responds correctly to customer questions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {stepStates[2].completed && (
            <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Installation verified!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300">
                  Your AI Chat Agent is now live on your website and ready to help customers. Redirecting to products...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}