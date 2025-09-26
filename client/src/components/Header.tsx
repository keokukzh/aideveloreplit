import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import mainLogoImage from "@assets/IMG_0948_1758859780928.png";
import signatureLogoImage from "@assets/IMG_0950_1758859780928.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl">
        <nav className="flex h-20 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src={mainLogoImage} 
              alt="AIDevelo.AI Logo" 
              className="h-12 w-auto"
              data-testid="img-logo"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="link-features"
            >
              Funktionen
            </a>
            <a 
              href="#pricing" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="link-pricing"
            >
              Preise
            </a>
            <a 
              href="#cases" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
              data-testid="link-cases"
            >
              Referenzen
            </a>
            <Button size="lg" data-testid="button-cta-header">
              Kostenlos testen
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-card p-4" data-testid="menu-mobile">
            <div className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-features-mobile"
              >
                Funktionen
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-pricing-mobile"
              >
                Preise
              </a>
              <a 
                href="#cases" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-cases-mobile"
              >
                Referenzen
              </a>
              <Button 
                className="w-full" 
                onClick={() => setIsMenuOpen(false)}
                data-testid="button-cta-mobile"
              >
                Kostenlos testen
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}