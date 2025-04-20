'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function TermsPage() {
  const t = useTranslations('navigation');
  const { locale } = useParams();
  
  return (
    <main className="flex-1 container max-w-4xl mx-auto px-4 py-8 pt-20">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">{t('terms')}</h1>
        <nav className="flex mb-6 text-sm text-muted-foreground">
          <Link href={`/${locale}`} className="hover:text-primary">
            {t('home')}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{t('terms')}</span>
        </nav>
      </div>
      
      <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
        <h2 className="text-2xl font-medium tracking-tight">Terms of Service</h2>
        <p className="text-muted-foreground">Last updated: June 1, 2023</p>
        
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using UniGPACalc, you agree to be bound by these Terms of Service. If you do not agree to these terms, 
          please do not use our service.
        </p>
        
        <h3>2. Description of Service</h3>
        <p>
          UniGPACalc provides a web-based GPA calculation service that allows users to calculate their grade point average based on 
          the Norwegian grading system. The service includes manual grade entry and transcript image processing.
        </p>
        
        <h3>3. User Responsibilities</h3>
        <p>
          When using our service, you agree to:
        </p>
        <ul>
          <li>Provide accurate information when using the calculator</li>
          <li>Not use the service for any illegal or unauthorized purpose</li>
          <li>Not attempt to interfere with or disrupt the service or its servers</li>
          <li>Not try to access data that is not intended for you</li>
        </ul>
        
        <h3>4. Intellectual Property</h3>
        <p>
          All content, features, and functionality on UniGPACalc, including but not limited to text, graphics, logos, icons, 
          and software, are owned by or licensed to us and are protected by copyright, trademark, and other intellectual property laws.
        </p>
        
        <h3>5. Disclaimer of Warranties</h3>
        <p>
          The service is provided "as is" and "as available" without warranties of any kind, either express or implied. 
          We do not guarantee the accuracy of GPA calculations and recommend that users verify results through their educational institution.
        </p>
        
        <h3>6. Limitation of Liability</h3>
        <p>
          In no event shall UniGPACalc or its affiliates be liable for any indirect, incidental, special, consequential or punitive damages, 
          including but not limited to loss of profits, data, or other intangible losses, resulting from your use of or inability to use the service.
        </p>
        
        <h3>7. Changes to Terms</h3>
        <p>
          We reserve the right to modify these terms at any time. If we make changes, we will provide notice by updating the date at the top of these terms. 
          Your continued use of the service after such changes constitutes your acceptance of the new terms.
        </p>
        
        <h3>8. Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us through our 
          <Link href={`/${locale}/kontakt`} className="text-primary hover:underline">
            {" "}contact form
          </Link>.
        </p>
      </div>
    </main>
  );
} 