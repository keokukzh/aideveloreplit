import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calculator, TrendingUp, Users, CheckCircle, MessageCircle, Settings, BarChart3, Shield, Plus, Zap, Target, TrendingUp as TrendingUpIcon } from "lucide-react";
import { HolographicCard, HolographicButton, HolographicBadge } from "./HolographicUI";
import InteractiveParticles from "./InteractiveParticles";

const modules = [
  {
    id: "support",
    name: "Multichannel-Kundensupport", 
    basePrice: 150,
    pricePerUser: 25,
    savings: "40% weniger Support-Tickets",
    Icon: MessageCircle
  },
  {
    id: "automation", 
    name: "Prozessautomatisierung",
    basePrice: 200,
    pricePerUser: 30,
    savings: "60% Zeitersparnis bei Routineaufgaben",
    Icon: Settings
  },
  {
    id: "analytics",
    name: "Content & Datenanalyse", 
    basePrice: 120,
    pricePerUser: 20,
    savings: "3x schnellere Entscheidungsfindung",
    Icon: BarChart3
  },
  {
    id: "security",
    name: "IT-Sicherheitspaket",
    basePrice: 180,
    pricePerUser: 15,
    savings: "90% weniger Sicherheitsvorfälle",
    Icon: Shield
  },
  {
    id: "extras",
    name: "Zusatzmodule",
    basePrice: 100,
    pricePerUser: 10,
    savings: "25% höhere Conversion-Rate", 
    Icon: Plus
  }
];

const companySizes = [
  { range: "1-10", multiplier: 1.0, label: "Startup", min: 1, max: 10 },
  { range: "11-50", multiplier: 0.9, label: "Klein", min: 11, max: 50 },
  { range: "51-200", multiplier: 0.8, label: "Mittel", min: 51, max: 200 },
  { range: "201-999", multiplier: 0.7, label: "Groß", min: 201, max: 999 },
  { range: "1000+", multiplier: 0.6, label: "Enterprise", min: 1000, max: Infinity }
];

export default function IntelligentPricing() {
  const [employeeCount, setEmployeeCount] = useState([50]);
  const [selectedModules, setSelectedModules] = useState<string[]>(["support", "automation"]);
  const [contractLength, setContractLength] = useState(12);

  const employees = employeeCount[0];
  const sizeCategory = companySizes.find(size => {
    return employees >= size.min && employees <= size.max;
  }) || companySizes[0];

  const calculatePrice = () => {
    const modulesCost = selectedModules.reduce((total, moduleId) => {
      const module = modules.find(m => m.id === moduleId);
      if (!module) return total;
      return total + module.basePrice + (module.pricePerUser * employees);
    }, 0);

    const sizeDiscount = modulesCost * sizeCategory.multiplier;
    const contractDiscount = contractLength >= 24 ? 0.85 : contractLength >= 12 ? 0.9 : 1.0;
    
    return Math.round(sizeDiscount * contractDiscount);
  };

  const calculateROI = () => {
    const monthlyPrice = calculatePrice();
    const yearlyPrice = monthlyPrice * 12;
    
    // Guard against division by zero
    if (yearlyPrice <= 0) {
      return 0;
    }
    
    // Conservative ROI calculation based on time savings and efficiency gains
    const avgSalary = 50000; // Average German employee salary
    const timeSavingsPerEmployee = 0.15; // 15% time savings
    const yearlySavings = employees * avgSalary * timeSavingsPerEmployee;
    
    const roi = ((yearlySavings - yearlyPrice) / yearlyPrice) * 100;
    return Math.round(roi);
  };

  const monthlyPrice = calculatePrice();
  const roi = calculateROI();

  return (
    <section className="py-20 px-4 relative overflow-hidden" id="intelligent-pricing">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl float" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-chart-2/10 rounded-full blur-3xl float" style={{ animationDelay: '3s' }} />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-4 mb-16 scroll-reveal">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calculator className="h-8 w-8 text-primary pulse-glow" />
            <h2 className="text-3xl lg:text-5xl font-bold gradient-text" data-testid="heading-intelligent-pricing">
              Intelligenter Preisrechner
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto scroll-reveal stagger-1" data-testid="text-pricing-description">
            Finde die perfekte KI-Lösung für dein Unternehmen. Preis und ROI werden automatisch berechnet.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Configuration Panel */}
          <HolographicCard className="" data-testid="card-pricing-config">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Konfiguration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Employee Count */}
              <div>
                <label className="text-sm font-medium mb-4 block" data-testid="label-employees">
                  Anzahl Mitarbeiter: {employees}
                </label>
                <Slider
                  value={employeeCount}
                  onValueChange={setEmployeeCount}
                  max={2000}
                  min={1}
                  step={5}
                  className="w-full"
                  data-testid="slider-employees"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1</span>
                  <span>2000+</span>
                </div>
                <Badge variant="outline" className="mt-2" data-testid="badge-company-size">
                  {sizeCategory.label} ({sizeCategory.range} MA) - {Math.round((1 - sizeCategory.multiplier) * 100)}% Mengenrabatt
                </Badge>
              </div>

              {/* Contract Length */}
              <div>
                <label className="text-sm font-medium mb-4 block" data-testid="label-contract">
                  Vertragslaufzeit
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[6, 12, 24].map((months) => (
                    <Button
                      key={months}
                      variant={contractLength === months ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContractLength(months)}
                      data-testid={`button-contract-${months}`}
                    >
                      {months} Monate
                      {months >= 12 && (
                        <Badge variant="secondary" className="ml-1 text-xs">
                          -{months >= 24 ? '15' : '10'}%
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Module Selection */}
              <div>
                <label className="text-sm font-medium mb-4 block" data-testid="label-modules">
                  KI-Module auswählen
                </label>
                <div className="space-y-3">
                  {modules.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={selectedModules.includes(module.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedModules([...selectedModules, module.id]);
                            } else {
                              setSelectedModules(selectedModules.filter(id => id !== module.id));
                            }
                          }}
                          data-testid={`switch-module-${module.id}`}
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <module.Icon className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{module.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{module.savings}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          €{module.basePrice + (module.pricePerUser * employees)}/Monat
                        </p>
                        <p className="text-xs text-muted-foreground">
                          €{module.basePrice} + €{module.pricePerUser} × {employees} MA
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </HolographicCard>

          {/* Results Panel */}
          <HolographicCard className="scroll-reveal stagger-3" data-testid="card-pricing-results">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Ihr Angebot
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Display */}
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary" data-testid="text-monthly-price">
                  €{monthlyPrice.toLocaleString()}
                </div>
                <p className="text-muted-foreground" data-testid="text-price-period">pro Monat</p>
                <p className="text-lg font-semibold" data-testid="text-yearly-price">
                  €{(monthlyPrice * 12).toLocaleString()} / Jahr
                </p>
              </div>

              {/* ROI Display */}
              {monthlyPrice > 0 ? (
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-roi">
                        {roi >= 0 ? '+' : ''}{roi}% ROI
                      </div>
                      <p className="text-sm text-muted-foreground mt-1" data-testid="text-roi-description">
                        Erwartete Rendite im ersten Jahr
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-lg text-muted-foreground" data-testid="text-no-modules">
                        Wählen Sie Module für ROI-Berechnung
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Selected Features */}
              <div>
                <h4 className="font-medium mb-3" data-testid="title-included-features">Enthaltene Module:</h4>
                <div className="space-y-2">
                  {selectedModules.map((moduleId) => {
                    const module = modules.find(m => m.id === moduleId);
                    if (!module) return null;
                    return (
                      <div key={moduleId} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div className="flex items-center gap-2">
                          <module.Icon className="h-4 w-4 text-primary" />
                          <span>{module.name}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Call to Action */}
              <div className="space-y-3 pt-4 border-t">
                <Button 
                  className="w-full" 
                  size="lg" 
                  onClick={() => {
                    const contactSection = document.getElementById('kontakt');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  data-testid="button-request-quote"
                >
                  Kostenloses Angebot anfordern
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    const contactSection = document.getElementById('kontakt');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  data-testid="button-demo"
                >
                  Live-Demo vereinbaren
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  14 Tage kostenlos testen • Keine Einrichtungsgebühren
                </p>
              </div>
            </CardContent>
          </HolographicCard>
        </div>

        {/* Value Propositions */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card className="text-center hover-elevate" data-testid="card-value-1">
            <CardContent className="pt-6">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Sofortiger Start</h3>
              <p className="text-sm text-muted-foreground">
                Implementation in 24-48h. Erste Ergebnisse sofort sichtbar.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-elevate" data-testid="card-value-2">
            <CardContent className="pt-6">
              <Target className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Maßgeschneidert</h3>
              <p className="text-sm text-muted-foreground">
                Jede Lösung wird individuell an Ihre Branche angepasst.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover-elevate" data-testid="card-value-3">
            <CardContent className="pt-6">
              <TrendingUpIcon className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-2">Garantierte Einsparungen</h3>
              <p className="text-sm text-muted-foreground">
                Geld-zurück-Garantie, wenn keine 20% Effizienzsteigerung erreicht wird.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}