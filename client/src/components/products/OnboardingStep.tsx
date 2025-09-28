import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Loader2 } from "lucide-react";

interface OnboardingStepProps {
  title: string;
  description: string;
  completed?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onPrimary?: () => void;
  onSecondary?: () => void;
  primaryText?: string;
  secondaryText?: string;
  primaryDisabled?: boolean;
  className?: string;
}

export function OnboardingStep({
  title,
  description,
  completed = false,
  loading = false,
  children,
  onPrimary,
  onSecondary,
  primaryText = "Continue",
  secondaryText = "Skip for now",
  primaryDisabled = false,
  className
}: OnboardingStepProps) {
  return (
    <Card className={`${className || ''} ${completed ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' : ''}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          {completed ? (
            <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : '●'}
              </span>
            </div>
          )}
          <span className={completed ? 'text-green-800 dark:text-green-200' : ''}>
            {title}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className={`text-muted-foreground ${completed ? 'text-green-700 dark:text-green-300' : ''}`}>
          {description}
        </p>
        
        {children}
        
        {!completed && (
          <div className="flex gap-3 pt-4">
            {onPrimary && (
              <Button 
                onClick={onPrimary}
                disabled={primaryDisabled || loading}
                className="flex items-center gap-2"
                data-testid="button-onboarding-primary"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {primaryText}
              </Button>
            )}
            {onSecondary && (
              <Button 
                variant="outline"
                onClick={onSecondary}
                disabled={loading}
                data-testid="button-onboarding-secondary"
              >
                {secondaryText}
              </Button>
            )}
          </div>
        )}
        
        {completed && (
          <div className="flex items-center gap-2 text-green-700 dark:text-green-300 pt-4">
            <Check className="h-4 w-4" />
            <span className="text-sm font-medium">Completed</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}