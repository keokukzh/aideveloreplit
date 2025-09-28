import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { formatPrice } from "@/lib/pricing/calc";
import { type Module, type ProductActivation } from "@/lib/pricing/types";
import { MessageCircle, Phone, Share2, ArrowRight, Settings, Eye } from "lucide-react";

interface ProductCardProps {
  module: Module;
  activation?: ProductActivation;
  onActivate?: () => void;
  onConfigure?: () => void;
  onView?: () => void;
  className?: string;
}

const moduleIcons = {
  phone: Phone,
  chat: MessageCircle,
  social: Share2
};

export function ProductCard({ 
  module, 
  activation, 
  onActivate, 
  onConfigure, 
  onView, 
  className 
}: ProductCardProps) {
  const Icon = moduleIcons[module.id as keyof typeof moduleIcons] || MessageCircle;
  const isActive = activation?.status === 'active';
  const isProvisioning = activation?.status === 'provisioning';

  return (
    <Card className={`relative transition-all hover:shadow-lg ${className || ''}`} data-testid={`product-card-${module.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{module.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-sm font-semibold">
                  {formatPrice(module.price)}/month
                </Badge>
                {activation && (
                  <StatusBadge status={activation.status} />
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed">
          {module.description}
        </p>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Key Features:</h4>
          <ul className="space-y-1">
            {module.highlights.map((feature, index) => (
              <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {!isActive && !isProvisioning && onActivate && (
          <Button 
            onClick={onActivate}
            className="flex-1 flex items-center gap-2"
            data-testid={`button-activate-${module.id}`}
          >
            <ArrowRight className="h-4 w-4" />
            Activate
          </Button>
        )}
        
        {isProvisioning && (
          <Button 
            disabled
            variant="outline"
            className="flex-1"
            data-testid={`button-provisioning-${module.id}`}
          >
            Setting up...
          </Button>
        )}
        
        {isActive && (
          <>
            {onConfigure && (
              <Button 
                variant="outline"
                onClick={onConfigure}
                className="flex items-center gap-2"
                data-testid={`button-configure-${module.id}`}
              >
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            )}
            {onView && (
              <Button 
                onClick={onView}
                className="flex-1 flex items-center gap-2"
                data-testid={`button-view-${module.id}`}
              >
                <Eye className="h-4 w-4" />
                View Dashboard
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}