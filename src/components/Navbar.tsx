import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from 'next/link';
import LanguageSwitcherWrapper from './LanguageSwitcherWrapper';
import AuthBtnWrapper from './AuthBtnWrapper';

interface NavbarProps {
  locale: string;
}

const Navbar = async ({ locale }: NavbarProps) => {
  // Force the correct title based on locale
  const navTitle = locale === 'no' ? 'SNITT KALK' : 'UNI GPA CALC';
  
  return (
    <nav className="navbar">
      <Link href={`/${locale}`} className="navbar-brand">
        {navTitle}
      </Link>
      <div className="navbar-links">
        <ModeToggle />
        <LanguageSwitcherWrapper currentLocale={locale} />
        <AuthBtnWrapper locale={locale} />
      </div>
    </nav>
  );
};

export default Navbar;
