import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <Button asChild variant="primary" className="mt-4 text-white">
        <Link href="/">Go back to the home page</Link>
      </Button>
    </div>
  );
} 