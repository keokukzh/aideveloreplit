import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import mainLogoImage from "@assets/IMG_0948_1758859780928.png";
import signatureLogoImage from "@assets/IMG_0950_1758859780928.png";
import aidLogoImage from "@assets/logo-wrdmark_1758869353800.png";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-intense border-b border-white/10">
      <div className="container mx-auto max-w-6xl">
        <nav className="flex h-20 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img 
              src={aidLogoImage} 
              alt="AID Logo" 
              className="h-8 w-auto magnetic hover:scale-110 transition-transform duration-300"
              data-testid="img-aid-logo"
            />
            <div className="hidden sm:block w-px h-8 bg-border"></div>
            <img 
              src={mainLogoImage} 
              alt="AIDevelo.AI" 
              className="h-10 w-auto magnetic hover:scale-110 transition-transform duration-300"
              data-testid="img-logo"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              data-testid="link-features"
            >
              Funktionen
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#pricing" 
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              data-testid="link-pricing"
            >
              Preise
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#cases" 
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              data-testid="link-cases"
            >
              Referenzen
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Button size="lg" className="magnetic shadow-glow glow-border" data-testid="button-cta-header">
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
          <div className="md:hidden border-t border-white/10 glass p-4 animate-slideDown" data-testid="menu-mobile">
            <div className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 py-2 px-3 rounded-lg hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-features-mobile"
              >
                Funktionen
              </a>
              <a 
                href="#pricing" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 py-2 px-3 rounded-lg hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-pricing-mobile"
              >
                Preise
              </a>
              <a 
                href="#cases" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 py-2 px-3 rounded-lg hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-cases-mobile"
              >
                Referenzen
              </a>
              <Button 
                className="w-full magnetic shadow-glow" 
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