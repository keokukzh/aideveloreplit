import signatureLogoImage from "@assets/IMG_0831 (3)_1758861135123.png";
import { track } from "@/lib/analytics";

export default function Footer() {
  return (
    <footer className="border-t bg-card/30">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Central logo section - much larger and prominent */}
        <div className="flex flex-col items-center gap-8 py-8">
          <div className="flex flex-col items-center">
            <img 
              src={signatureLogoImage} 
              alt="AIDevelo.AI Signature" 
              className="h-24 lg:h-32 w-auto invert dark:invert-0 transition-opacity duration-300 hover:opacity-90"
              data-testid="img-footer-signature"
            />
            <div className="w-24 lg:w-32 h-0.5 bg-primary mt-4"></div>
          </div>
          
          {/* Tagline prominently displayed under logo */}
          <p className="text-lg font-medium text-center text-muted-foreground max-w-md" data-testid="text-footer-description">
            Modular AI solutions for growing businesses.
          </p>
          
          {/* Contact information prominently displayed */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center">
            <a 
              href="mailto:hello@aidevelo.ai" 
              className="text-base font-medium text-primary hover:text-primary/80 transition-colors" 
              data-testid="link-email"
              onClick={() => track("cta_click", { location: "footer", cta: "email" })}
            >
              hello@aidevelo.ai
            </a>
            <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground"></div>
            <p className="text-base text-muted-foreground" data-testid="text-gdpr">
              GDPR Compliant
            </p>
          </div>
        </div>
        
        {/* Navigation links in one line under logo */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-4" data-testid="title-product">Products</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#products" onClick={() => track("nav_click", { location: "footer", link: "products" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-products-footer">AI Agents</a></li>
              <li><a href="#pricing-summary" onClick={() => track("nav_click", { location: "footer", link: "pricing" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing-footer">Pricing</a></li>
              <li><a href="#references" onClick={() => track("nav_click", { location: "footer", link: "references" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-references-footer">References</a></li>
            </ul>
          </div>
          
          <div className="text-center">
            <h3 className="font-semibold mb-4" data-testid="title-company">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={() => track("nav_click", { location: "footer", link: "about" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">About</a></li>
              <li><a href="#contact" onClick={() => track("nav_click", { location: "footer", link: "contact" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">Contact</a></li>
              <li><a href="#" onClick={() => track("nav_click", { location: "footer", link: "blog" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-blog">Blog</a></li>
            </ul>
          </div>
          
          <div className="text-right">
            <h3 className="font-semibold mb-4" data-testid="title-legal">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" onClick={() => track("nav_click", { location: "footer", link: "privacy" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">Privacy Policy</a></li>
              <li><a href="#" onClick={() => track("nav_click", { location: "footer", link: "imprint" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-imprint">Imprint</a></li>
              <li><a href="#" onClick={() => track("nav_click", { location: "footer", link: "terms" })} className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">Terms</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="border-t pt-8">
          <p className="text-sm text-center text-muted-foreground" data-testid="text-copyright">
            © 2024 AIDevelo.AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}