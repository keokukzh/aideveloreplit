import case1Image from "@assets/stock_images/professional_busines_8402bf79.jpg";
import case2Image from "@assets/stock_images/professional_busines_144a79ff.jpg";
import case3Image from "@assets/stock_images/professional_busines_c54d25b6.jpg";
import case4Image from "@assets/stock_images/modern_website_landi_d9439cdb.jpg";
import case5Image from "@assets/stock_images/modern_website_landi_862c8977.jpg";
import case6Image from "@assets/stock_images/modern_website_landi_e8681405.jpg";

const cases = [
  { id: 1, image: case1Image, alt: "Analytics Dashboard" },
  { id: 2, image: case2Image, alt: "Business Interface" },
  { id: 3, image: case3Image, alt: "Dashboard Overview" },
  { id: 4, image: case4Image, alt: "Landing Page Design" },
  { id: 5, image: case5Image, alt: "Website Interface" },
  { id: 6, image: case6Image, alt: "Modern Website" },
];

export default function CaseStudies() {
  return (
    <section className="py-20 px-4" id="cases">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-bold" data-testid="heading-cases">
            Ergebnisse, die für sich sprechen
          </h2>
          <p className="text-xl text-muted-foreground" data-testid="text-cases-description">
            Ein Blick in ausgewählte Kundenprojekte.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((caseStudy) => (
            <div 
              key={caseStudy.id} 
              className="group cursor-pointer" 
              data-testid={`case-${caseStudy.id}`}
              onClick={() => console.log(`Case ${caseStudy.id} clicked`)} // todo: remove mock functionality
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-card hover-elevate">
                <img 
                  src={caseStudy.image} 
                  alt={caseStudy.alt} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  data-testid={`img-case-${caseStudy.id}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}