import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Personvern | KarakterKalk',
  description: 'Personvernserklæring for KarakterKalk',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Personvernerklæring</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead text-lg text-foreground/80 mb-8">
              Vi i KarakterKalk tar personvern på alvor. Denne personvernerklæringen beskriver hvordan vi samler inn, 
              bruker og beskytter informasjonen du deler med oss.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Hvilke opplysninger vi samler inn</h2>
            <p>
              KarakterKalk er designet for å fungere uten å lagre personlige opplysninger. Vi samler 
              kun inn følgende informasjon:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Bilder av karakterutskrifter som du laster opp for analyse</li>
              <li>Anonymiserte bruksdata for å forbedre tjenesten</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Hvordan vi bruker informasjonen</h2>
            <p>
              Alle opplastede bilder brukes kun til å utføre den automatiske analysen av 
              dine karakterer. Vi bruker informasjonen til:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Å utføre OCR (tekstgjenkjenning) på ditt karakterutskrift</li>
              <li>Å beregne din gjennomsnittskarakter</li>
              <li>Å presentere resultatene til deg i en oversiktlig visning</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Lagring av data</h2>
            <p>
              Vi lagrer ingen karakterdata eller utskrifter permanent etter at analysen er fullført. 
              Bilder du laster opp slettes automatisk fra våre servere etter fullført analyse, 
              normalt innen 24 timer.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Informasjonsdeling</h2>
            <p>
              Vi deler ikke personlige opplysninger med tredjeparter. For å utføre OCR-analyse 
              bruker vi sikre, krypterte forbindelser til vår OCR-tjenesteleverandør.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Informasjonskapsler (cookies)</h2>
            <p>
              KarakterKalk bruker kun nødvendige informasjonskapsler for å forbedre brukeropplevelsen. 
              Vi bruker ikke informasjonskapsler til markedsføringsformål.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Dine rettigheter</h2>
            <p>
              I henhold til personvernlovgivningen har du rett til:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Innsyn i hvilke personopplysninger vi har om deg</li>
              <li>Retting av uriktige personopplysninger</li>
              <li>Sletting av personopplysninger</li>
              <li>Begrensning av behandling av personopplysninger</li>
              <li>Dataportabilitet</li>
              <li>Å protestere mot behandling av personopplysninger</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Endringer i personvernerklæringen</h2>
            <p>
              Vi kan oppdatere denne personvernerklæringen fra tid til annen. Den nyeste versjonen 
              vil alltid være tilgjengelig på denne siden.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">Kontakt oss</h2>
            <p>
              Hvis du har spørsmål eller bekymringer angående vår personvernerklæring eller 
              behandling av dine data, kan du kontakte oss via vårt <a href="/kontakt" className="text-primary hover:underline">kontaktskjema</a>.
            </p>
            
            <div className="border-t border-border mt-12 pt-8 text-sm text-muted-foreground">
              <p>Sist oppdatert: April 2024</p>
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