import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import AuthBtn from './AuthBtn';
  
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
        <AuthBtn locale={locale} />
      </div>
    </nav>
  );
};

export default Navbar;
