"use client"; // Make this a client component

import React, { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Import useRouter and useParams
import { signout } from '@/lib/auth-actions'; // Import the signout server action

export default function LoggingOutPage() {
  const router = useRouter();
  const params = useParams(); // Get locale from params
  const locale = typeof params.locale === 'string' ? params.locale : 'en'; // Default to 'en' if locale is not string

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const performSignoutAndRedirect = async () => {
      try {
        const result = await signout(locale);
        if (result.error) {
          console.error("Signout failed:", result.error);
          // Optionally show an error message to the user on this page
          // or redirect to an error page if absolutely necessary.
        }
        // Regardless of server action success/failure for signOut itself,
        // the user expects to be redirected. The auth state will eventually clear.
      } catch (e) {
        console.error("Error calling signout action from logging-out page:", e);
      }

      // Wait for 2 seconds then redirect
      timer = setTimeout(() => {
        router.push(`/${locale}/`);
      }, 2000);
    };

    performSignoutAndRedirect();

    return () => {
      clearTimeout(timer); // Clean up the timer if the component unmounts prematurely
    };
  }, [router, locale]); // Add locale to dependency array

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-8"></div>
      <h1 className="text-3xl font-semibold mb-4">Logging Out</h1>
      <p className="text-muted-foreground">Please wait while we securely log you out...</p>
      {/* This page will be brief as the server action will redirect away from it. */}
    </div>
  );
} 