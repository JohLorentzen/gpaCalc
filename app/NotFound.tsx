"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">404</h1>
        <p className="text-xl text-foreground/80 mb-4">Oops! Siden ble ikke funnet</p>
        <Link href="/" className="text-primary hover:text-primary-hover underline">
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
