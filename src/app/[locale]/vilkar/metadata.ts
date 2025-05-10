import type { Metadata } from "next";
import { generateTermsMetadata } from '@/lib/metadata';

// Generate metadata for terms page
export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Ensure locale is properly awaited
  const { locale } = await params;
  
  // Use the centralized metadata generator
  return generateTermsMetadata({ locale });
} 