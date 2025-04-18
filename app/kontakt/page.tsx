import Navbar from '@/components/Navbar';
import ContactForm from '@/components/ContactForm';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata = {
  title: 'Kontakt oss | KarakterKalk',
  description: 'Ta kontakt med KarakterKalk teamet',
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Kontakt oss</h1>
          
          <div className="mb-12">
            <p className="text-lg text-foreground/80 mb-8">
              Har du spørsmål, tilbakemeldinger eller trenger hjelp med KarakterKalk? 
              Fyll ut skjemaet under, så kommer vi tilbake til deg så snart som mulig.
            </p>
            
            <ContactForm />
          </div>
          
          <div className="mt-16">
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-6">Ofte stilte spørsmål</h2>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b border-border">
                  <AccordionTrigger className="font-medium text-foreground hover:no-underline hover:text-primary">
                    Hvordan beregnes gjennomsnittskarakteren?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Vi bruker en vektet beregning basert på studiepoeng og karakterer hvor A=5, B=4, C=3, D=2, E=1 og F=0.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="border-b border-border">
                  <AccordionTrigger className="font-medium text-foreground hover:no-underline hover:text-primary">
                    Er mine data trygge?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Vi lagrer ikke dine karakterutskrifter etter at analysen er fullført. Les vår{" "}
                    <a href="/personvern" className="text-primary hover:underline">
                      personvernerklæring
                    </a>{" "}
                    for mer informasjon.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="border-b border-border">
                  <AccordionTrigger className="font-medium text-foreground hover:no-underline hover:text-primary">
                    Kan jeg bruke dette for alle universiteter?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Tjenesten er optimalisert for norske universiteter og høyskoler, men støtter også engelske 
                    karakterutskrifter fra internasjonale institusjoner.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="border-b-0">
                  <AccordionTrigger className="font-medium text-foreground hover:no-underline hover:text-primary">
                    Støtter KarakterKalk &quot;bestått&quot; emner?
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    Ja, vi støtter både &quot;bestått&quot;/&quot;passed&quot; og bokstavkarakterer (A-F). 
                    Bestått emner telles med i totale studiepoeng, men påvirker ikke ditt karaktersnitt.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-8 px-6 bg-card text-card-foreground dark:bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">KarakterKalk</h2>
              <p className="text-sm text-muted-foreground">© 2024 KarakterKalk. Alle rettigheter reservert.</p>
            </div>
            <div className="flex gap-6">
              <a href="/personvern" className="text-foreground/80 hover:text-primary">Personvern</a>
              <a href="/vilkar" className="text-foreground/80 hover:text-primary">Vilkår</a>
              <a href="/kontakt" className="text-foreground/80 hover:text-primary">Kontakt</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 