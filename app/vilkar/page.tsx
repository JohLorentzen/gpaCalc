import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Vilkår for bruk | KarakterKalk',
  description: 'Vilkår for bruk av KarakterKalk tjenesten',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar />
      
      <main className="flex-1 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Vilkår for bruk</h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead text-lg text-foreground/80 mb-8">
              Velkommen til KarakterKalk. Ved å bruke vår tjeneste aksepterer du følgende vilkår og betingelser.
              Vennligst les disse nøye før du bruker tjenesten.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">1. Aksept av vilkår</h2>
            <p>
              Ved å få tilgang til eller bruke KarakterKalk, aksepterer du å være bundet av disse vilkårene for bruk. 
              Hvis du ikke godtar alle vilkårene, må du ikke bruke tjenesten.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">2. Tjenestebekrivelse</h2>
            <p>
              KarakterKalk er en nettbasert tjeneste som lar brukere laste opp bilder av karakterutskrifter 
              for automatisk analyse og beregning av gjennomsnittskarakterer.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">3. Bruksbegrensninger</h2>
            <p>
              Du godtar at du ikke vil:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Bruke tjenesten til ulovlige formål eller på en måte som krenker andres rettigheter</li>
              <li>Forsøke å få uautorisert tilgang til noen del av tjenesten</li>
              <li>Kopiere, modifisere eller distribuere innhold fra tjenesten uten skriftlig tillatelse</li>
              <li>Laste opp dokumenter som inneholder sensitive personopplysninger om andre personer</li>
              <li>Bruke automatiserte systemer eller programvare for å ekstrahere data fra tjenesten</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">4. Immaterielle rettigheter</h2>
            <p>
              KarakterKalk og alt innhold, funksjoner og funksjonalitet er og forblir vår eksklusive eiendom. 
              Tjenesten er beskyttet av opphavsrett, varemerke og andre lover både i Norge og internasjonalt.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">5. Ansvarsfraskrivelse</h2>
            <p>
              KarakterKalk tilbys "som den er" uten noen form for garanti. Vi garanterer ikke at:
            </p>
            <ul className="list-disc pl-6 my-4 space-y-2">
              <li>Tjenesten vil tilfredsstille dine spesifikke krav</li>
              <li>Tjenesten vil være uavbrutt, rettidig, sikker eller feilfri</li>
              <li>Resultatene som kan oppnås fra bruken av tjenesten vil være nøyaktige eller pålitelige</li>
            </ul>
            <p>
              Du bruker tjenesten på egen risiko. KarakterKalk er et hjelpemiddel, og alle beregninger bør 
              verifiseres manuelt for viktige formål.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">6. Ansvarsbegrensning</h2>
            <p>
              Vi er ikke under noen omstendigheter ansvarlige for indirekte, spesielle, tilfeldige, 
              følgeskader eller straffeerstatning som oppstår på grunn av din bruk av tjenesten.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">7. Endringer i tjenesten og vilkårene</h2>
            <p>
              Vi forbeholder oss retten til å endre eller avbryte tjenesten når som helst uten forvarsel. 
              Vi kan også oppdatere disse vilkårene fra tid til annen. Ved fortsatt bruk av tjenesten etter 
              at endringer er publisert, aksepterer du de reviderte vilkårene.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">8. Gjeldende lov</h2>
            <p>
              Disse vilkårene er underlagt og tolkes i samsvar med norsk lov, uten hensyn til lovkonfliktprinsipper.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4">9. Kontakt</h2>
            <p>
              Hvis du har spørsmål om disse vilkårene, kan du kontakte oss via vårt 
              <a href="/kontakt" className="text-primary hover:underline ml-1">kontaktskjema</a>.
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