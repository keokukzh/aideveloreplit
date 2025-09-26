import signatureLogoImage from "@assets/IMG_0831 (3)_1758861135123.png";

export default function Footer() {
  return (
    <footer className="border-t bg-card/30">
      <div className="container mx-auto max-w-6xl px-4 py-16">
        {/* Top section with navigation links arranged around central concept */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <h3 className="font-semibold mb-4" data-testid="title-product">Produkt</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-features-footer">Funktionen</a></li>
              <li><a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-pricing-footer">Preise</a></li>
              <li><a href="#cases" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-cases-footer">Referenzen</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4" data-testid="title-company">Unternehmen</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-about">Über uns</a></li>
              <li><a href="#kontakt" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-contact">Kontakt</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-blog">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4" data-testid="title-legal">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">Datenschutz</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-imprint">Impressum</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">AGB</a></li>
            </ul>
          </div>
        </div>
        
        {/* Central logo section - much larger and prominent */}
        <div className="flex flex-col items-center gap-8 py-8">
          <div className="flex justify-center">
            <img 
              src={signatureLogoImage} 
              alt="AIDevelo.AI Signature" 
              className="h-24 lg:h-32 w-auto invert dark:invert-0 transition-all duration-300 hover:scale-105"
              data-testid="img-footer-signature"
            />
          </div>
          
          {/* Tagline prominently displayed under logo */}
          <p className="text-lg font-medium text-center text-muted-foreground max-w-md" data-testid="text-footer-description">
            Mehr Aufträge. Automatisch. Mit AI.
          </p>
          
          {/* Contact information prominently displayed */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center">
            <a 
              href="mailto:hello@aidevelo.ai" 
              className="text-base font-medium text-primary hover:text-primary/80 transition-colors" 
              data-testid="link-email"
            >
              hello@aidevelo.ai
            </a>
            <div className="hidden md:block w-1 h-1 rounded-full bg-muted-foreground"></div>
            <p className="text-base text-muted-foreground" data-testid="text-gdpr">
              DSGVO-konform
            </p>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="border-t pt-8">
          <p className="text-sm text-center text-muted-foreground" data-testid="text-copyright">
            © 2025 AIDevelo.AI. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}