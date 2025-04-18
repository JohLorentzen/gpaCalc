import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        UNIGPACALC
      </div>
      <div className="navbar-links">
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
