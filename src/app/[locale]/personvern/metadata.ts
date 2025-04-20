import type { Metadata } from "next";
import { generatePrivacyMetadata } from '@/lib/metadata';

// Generate metadata for privacy policy page
export async function generateMetadata({
  params
}: {
  params: { locale: string }
}): Promise<Metadata> {
  // Ensure locale is properly awaited
  const { locale } = await params;
  
  // Use the centralized metadata generator
  return generatePrivacyMetadata({ locale });
} 