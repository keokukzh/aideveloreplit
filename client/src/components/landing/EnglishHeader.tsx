import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import mainLogoImage from "@assets/IMG_0948_1758859780928.png";

export default function EnglishHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-intense border-b border-white/10">
      <div className="container mx-auto max-w-6xl">
        <nav className="flex h-20 items-center justify-between px-4">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <a 
              href="#products" 
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              data-testid="link-products"
            >
              Products
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a 
              href="#pricing-summary" 
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              data-testid="link-pricing"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          
          {/* Centered Logo */}
          <div className="flex items-center">
            <img 
              src={mainLogoImage} 
              alt="AIDevelo.AI Logo" 
              className="h-12 w-auto transition-opacity duration-300 hover:opacity-90"
              data-testid="img-logo"
            />
          </div>
          
          {/* Right Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <a 
              href="#references" 
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium relative group"
              data-testid="link-references"
            >
              References
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <Button size="lg" className="" data-testid="button-cta-header">
              Start Free Trial
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </nav>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 glass p-4" data-testid="menu-mobile">
            <div className="flex flex-col gap-4">
              <a 
                href="#products" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 py-2 px-3 rounded-lg hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-products-mobile"
              >
                Products
              </a>
              <a 
                href="#pricing-summary" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 py-2 px-3 rounded-lg hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-pricing-mobile"
              >
                Pricing
              </a>
              <a 
                href="#references" 
                className="text-muted-foreground hover:text-primary transition-all duration-300 py-2 px-3 rounded-lg hover-elevate"
                onClick={() => setIsMenuOpen(false)}
                data-testid="link-references-mobile"
              >
                References
              </a>
              <Button 
                className="w-full" 
                onClick={() => setIsMenuOpen(false)}
                data-testid="button-cta-mobile"
              >
                Start Free Trial
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}