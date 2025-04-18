import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        UNIGPACALC
      </div>
      <div className="navbar-links">
        <button className="btn btn-secondary">
          Hvordan det fungerer
        </button>
        <button className="btn btn-secondary">
          Om oss
        </button>
        <ModeToggle />
        <button className="btn btn-primary">
          Logg inn
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
