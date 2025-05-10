"use client";

import React from 'react';
import { Button } from './ui/button'; // Assuming you have a Button component
import { signInWithGoogle } from '@/lib/auth-actions'; // Import existing Google sign-in
import { signInWithMicrosoft } from '@/lib/auth-actions'; // Import signInWithMicrosoft
import { useTranslations } from 'next-intl';
import Link from 'next/link';

// We'll need to create these actions later
// import { signInWithApple } from '@/lib/auth-actions';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, locale }) => {
  const t = useTranslations('auth');

  if (!isOpen) {
    return null;
  }

  // Force the correct title based on locale
  const modalTitle = locale === 'no' ? 'SNITT KALK' : 'UNI GPA CALC';

  const handleGoogleSignIn = async () => {
    await signInWithGoogle(locale);
    onClose(); // Close modal after initiating sign-in
  };

  const handleMicrosoftSignIn = async () => {
    await signInWithMicrosoft(locale); // Correctly call Microsoft sign-in
    onClose();
  };

  // Placeholder for Apple Sign-In if you re-add it
  // const handleAppleSignIn = async () => {
  //   alert(t('appleSignInNotImplemented'));
  //   onClose();
  // };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center h-screen w-screen p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        // Only close if clicking the overlay (not the modal content)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white text-text p-6 rounded-lg shadow-xl w-full max-w-md dark:bg-gray-900">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">{modalTitle}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('closeModal')}> {/* Added alt text for close button */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </Button>
        </div>
        <div className="space-y-4">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-200"
            onClick={handleGoogleSignIn}
          >
            {/* Actual Google multi-color logo SVG */}
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }} width="18" height="18">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            {t('signInWithGoogle')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500 hover:text-white transition-all duration-200"
            onClick={handleMicrosoftSignIn}
            // disabled // You can enable this once implemented
          >
            {/* Microsoft Blue (for the simplified logo) */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <rect x="1" y="1" width="10" height="10" fill="#F25022"/> {/* Red */}
              <rect x="13" y="1" width="10" height="10" fill="#7FBA00"/> {/* Green */}
              <rect x="1" y="13" width="10" height="10" fill="#00A4EF"/> {/* Blue */}
              <rect x="13" y="13" width="10" height="10" fill="#FFB900"/> {/* Yellow */}
            </svg>
            {t('signInWithMicrosoft')}
          </Button>
         
        </div>
        <p className="text-xs text-muted-foreground mt-6 text-center">
          {t.rich('termsAgreement', {
            terms: (chunks) => (
              <Link 
                href={`/${locale}/${locale === 'no' ? 'vilkar' : 'terms'}`} 
                onClick={onClose} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-medium"
              >
                {chunks}
              </Link>
            ),
            privacy: (chunks) => (
              <Link 
                href={`/${locale}/${locale === 'no' ? 'personvern' : 'privacy'}`} 
                onClick={onClose} 
                className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-medium"
              >
                {chunks}
              </Link>
            )
          })}
        </p>
      </div>
    </div>
  );

  
};

export default AuthModal; 