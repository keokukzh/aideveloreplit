import signatureLogoImage from "@assets/IMG_0831 (3)_1758861135123.png";

export default function Footer() {
  return (
    <footer className="border-t bg-card/30">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src={signatureLogoImage} 
                alt="AIDevelo.AI Signature" 
                className="h-8 w-auto invert"
                data-testid="img-footer-logo"
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium" data-testid="text-footer-description">
              Mehr Aufträge. Automatisch. Mit AI.
            </p>
          </div>
          
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
        
        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col items-center gap-6">
            {/* Logo in center */}
            <div className="flex justify-center">
              <img 
                src={signatureLogoImage} 
                alt="AIDevelo.AI Signature" 
                className="h-12 w-auto invert dark:invert-0"
                data-testid="img-footer-signature"
              />
            </div>
            
            {/* Copyright and contact info below logo */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              <p className="text-sm text-muted-foreground" data-testid="text-copyright">
                © 2025 AIDevelo.AI. Alle Rechte vorbehalten.
              </p>
              <div className="flex gap-6">
                <a href="mailto:hello@aidevelo.ai" className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-email">
                  hello@aidevelo.ai
                </a>
                <p className="text-sm text-muted-foreground" data-testid="text-gdpr">
                  DSGVO-konform
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}