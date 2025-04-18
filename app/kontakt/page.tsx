import Navbar from '@/components/Navbar';
// Import commented out until component is created
// import ContactForm from '@/components/ContactForm';

// Temporary placeholder until the real component is implemented
const ContactForm = () => {
  return (
    <div className="bg-card p-6 rounded-xl border border-border">
      <p className="text-center py-8 text-muted-foreground">
        Kontaktskjemaet er under utvikling. Vennligst kom tilbake senere.
      </p>
    </div>
  );
};

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
          
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4">Ofte stilte spørsmål</h2>
              <ul className="space-y-4">
                <li>
                  <h3 className="font-medium">Hvordan beregnes gjennomsnittskarakteren?</h3>
                  <p className="text-muted-foreground">Vi bruker en vektet beregning basert på studiepoeng og karakterer hvor A=5, B=4, C=3, D=2, E=1 og F=0.</p>
                </li>
                <li>
                  <h3 className="font-medium">Er mine data trygge?</h3>
                  <p className="text-muted-foreground">Vi lagrer ikke dine karakterutskrifter etter at analysen er fullført. Les vår <a href="/personvern" className="text-primary hover:underline">personvernerklæring</a> for mer informasjon.</p>
                </li>
                <li>
                  <h3 className="font-medium">Kan jeg bruke dette for alle universiteter?</h3>
                  <p className="text-muted-foreground">Tjenesten er optimalisert for norske universiteter og høyskoler, men støtter de fleste standardformater for karakterutskrifter.</p>
                </li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-xl border border-border">
              <h2 className="text-xl font-semibold mb-4">Følg oss</h2>
              <p className="text-muted-foreground mb-4">
                Hold deg oppdatert med de siste nyhetene og funksjonsoppdateringene ved å følge oss på sosiale medier.
              </p>
              <div className="flex space-x-4 mt-6">
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-muted hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-foreground"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
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