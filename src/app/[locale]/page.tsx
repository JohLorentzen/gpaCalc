import type { Metadata } from "next";
import dynamic from 'next/dynamic';
import { generateHomeMetadata } from '@/lib/metadata';

// Import the client component (remove ssr:false from Server Component)
const PageContent = dynamic(() => import('./PageContent'));

export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Ensure locale is properly awaited
  const { locale } = await params;
  
  // Use the centralized metadata generator
  return generateHomeMetadata({ locale });
}

export default function Page() {
  return <PageContent />;
} 