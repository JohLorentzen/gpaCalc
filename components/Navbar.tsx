import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";
import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">
        UNIGPACALC
      </Link>
      <div className="navbar-links">
        <ModeToggle />
      </div>
    </nav>
  );
};


export default Navbar;
