import { useState } from "react";
import { useLocation } from "wouter";
import { OnboardingStep } from "@/components/products/OnboardingStep";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Share2, Facebook, Linkedin, Calendar, TestTube } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

const STORAGE_KEY = "AIDeveloAI:activeProducts";

export default function SocialOnboardingPage() {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [socialData, setSocialData] = useState({
    connectedPlatforms: [] as string[],
    postingCadence: '',
    draftContent: '',
    scheduleTime: ''
  });

  const steps = [
    {
      title: "Connect Accounts",
      description: "Link your social media platforms",
      completed: false
    },
    {
      title: "Choose Posting Cadence",
      description: "Set how often you want to post",
      completed: false
    },
    {
      title: "Create First Draft",
      description: "Let AI create your first post",
      completed: false
    },
    {
      title: "Schedule Test Post",
      description: "Queue your first automated post",
      completed: false
    }
  ];

  const [stepStates, setStepStates] = useState(steps);

  const platforms = [
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'instagram', name: 'Instagram', icon: Share2 },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin }
  ];

  const updateStepStatus = (stepIndex: number, completed: boolean) => {
    setStepStates(prev => 
      prev.map((step, index) => 
        index === stepIndex ? { ...step, completed } : step
      )
    );
  };

  const handleConnectPlatform = async (platform: string) => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/social/connect', {
        provider: platform
      });
      
      if (response.ok) {
        setSocialData(prev => ({
          ...prev,
          connectedPlatforms: [...prev.connectedPlatforms, platform]
        }));
        
        if (socialData.connectedPlatforms.length >= 0) {
          updateStepStatus(0, true);
          setCurrentStep(1);
        }
      }
    } catch (error) {
      console.error('Error connecting platform:', error);
    }
    setLoading(false);
  };

  const handleSetCadence = () => {
    updateStepStatus(1, true);
    setCurrentStep(2);
  };

  const handleCreateDraft = () => {
    if (socialData.draftContent) {
      updateStepStatus(2, true);
      setCurrentStep(3);
    }
  };

  const handleSchedulePost = async () => {
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/social/schedule-draft', {
        text: socialData.draftContent,
        when: socialData.scheduleTime
      });
      
      if (response.ok) {
        updateStepStatus(3, true);
        // Mark product as active in localStorage
        const stored = localStorage.getItem(STORAGE_KEY);
        const activeProducts = stored ? JSON.parse(stored) : {};
        activeProducts.social = {
          moduleId: 'social',
          status: 'active',
          activatedAt: new Date().toISOString(),
          onboardingCompleted: true
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(activeProducts));
        
        setTimeout(() => navigate('/products'), 2000);
      }
    } catch (error) {
      console.error('Error scheduling post:', error);
    }
    setLoading(false);
  };

  const generateDraftContent = () => {
    const sampleContent = "🚀 Excited to share that we're transforming how businesses connect with customers through AI automation! From intelligent chat support to automated social media management, the future of customer engagement is here. What's your biggest challenge in customer communication? #AI #Automation #Business";
    setSocialData(prev => ({ ...prev, draftContent: sampleContent }));
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
                  <Share2 className="h-8 w-8 text-primary" />
                  AI Social Media Agent Setup
                </h1>
                <p className="text-muted-foreground">
                  Automate your social media presence in 4 simple steps
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
          {/* Step 1: Connect Accounts */}
          <OnboardingStep
            title={stepStates[0].title}
            description={stepStates[0].description}
            completed={stepStates[0].completed}
            loading={loading && currentStep === 0}
          >
            {currentStep === 0 && !stepStates[0].completed && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {platforms.map((platform) => {
                    const Icon = platform.icon;
                    const isConnected = socialData.connectedPlatforms.includes(platform.id);
                    
                    return (
                      <Card key={platform.id} className={isConnected ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : ''}>
                        <CardContent className="p-4 text-center">
                          <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                          <h4 className="font-medium mb-2">{platform.name}</h4>
                          {isConnected ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                              Connected
                            </Badge>
                          ) : (
                            <Button 
                              size="sm"
                              onClick={() => handleConnectPlatform(platform.id)}
                              disabled={loading}
                              data-testid={`button-connect-${platform.id}`}
                            >
                              Connect
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                {socialData.connectedPlatforms.length > 0 && (
                  <Button 
                    onClick={() => { updateStepStatus(0, true); setCurrentStep(1); }}
                    className="w-full"
                    data-testid="button-continue-step1"
                  >
                    Continue with {socialData.connectedPlatforms.length} platform(s)
                  </Button>
                )}
              </div>
            )}
          </OnboardingStep>

          {/* Step 2: Choose Posting Cadence */}
          <OnboardingStep
            title={stepStates[1].title}
            description={stepStates[1].description}
            completed={stepStates[1].completed}
            onPrimary={currentStep === 1 && !stepStates[1].completed ? handleSetCadence : undefined}
            primaryDisabled={!socialData.postingCadence}
          >
            {currentStep === 1 && !stepStates[1].completed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Posting Frequency</label>
                  <Select onValueChange={(value) => setSocialData(prev => ({ ...prev, postingCadence: value }))}>
                    <SelectTrigger data-testid="select-posting-cadence">
                      <SelectValue placeholder="How often should we post?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (7 posts/week)</SelectItem>
                      <SelectItem value="business-days">Business Days (5 posts/week)</SelectItem>
                      <SelectItem value="3x-week">3 times per week</SelectItem>
                      <SelectItem value="weekly">Weekly (1 post/week)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      Your AI agent will automatically create and schedule posts based on your industry, target audience, and trending topics.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {/* Step 3: Create First Draft */}
          <OnboardingStep
            title={stepStates[2].title}
            description={stepStates[2].description}
            completed={stepStates[2].completed}
            onPrimary={currentStep === 2 && !stepStates[2].completed ? handleCreateDraft : undefined}
            primaryDisabled={!socialData.draftContent}
          >
            {currentStep === 2 && !stepStates[2].completed && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium">Post Content</label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateDraftContent}
                      data-testid="button-generate-content"
                    >
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Create your first post or let AI generate one for you..."
                    value={socialData.draftContent}
                    onChange={(e) => setSocialData(prev => ({ ...prev, draftContent: e.target.value }))}
                    rows={4}
                    data-testid="textarea-draft-content"
                  />
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      This will be your first automated post. Our AI will learn from this style to create future content.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </OnboardingStep>

          {/* Step 4: Schedule Test Post */}
          <OnboardingStep
            title={stepStates[3].title}
            description={stepStates[3].description}
            completed={stepStates[3].completed}
            loading={loading && currentStep === 3}
            onPrimary={currentStep === 3 && !stepStates[3].completed ? handleSchedulePost : undefined}
            primaryText="Schedule Draft"
            primaryDisabled={!socialData.scheduleTime}
          >
            {currentStep === 3 && !stepStates[3].completed && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Schedule Time</label>
                  <Input
                    type="datetime-local"
                    value={socialData.scheduleTime}
                    onChange={(e) => setSocialData(prev => ({ ...prev, scheduleTime: e.target.value }))}
                    min={new Date().toISOString().slice(0, 16)}
                    data-testid="input-schedule-time"
                  />
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      This post will be queued as a draft. You can review and approve it before it goes live.
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
                  Draft scheduled!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-300">
                  Your AI Social Media Agent is now active and your first post is scheduled. Redirecting to products...
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}