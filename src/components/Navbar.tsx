import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
  
interface NavbarProps {
  locale: string;
}

const Navbar = ({ locale }: NavbarProps) => {
  return (
    <nav className="navbar">
      <Link href={`/${locale}`} className="navbar-brand">
        UNIGPACALC
      </Link>
      <div className="navbar-links">
        <ModeToggle />
        <LanguageSwitcher currentLocale={locale} />
      </div>
    </nav>
  );
};

export default Navbar;
