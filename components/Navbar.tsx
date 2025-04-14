import React from 'react';
import { ModeToggle } from "@/components/ui/mode-toggle";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        KarakterKalk
      </div>
      <div className="navbar-links">
        <button className="btn btn-ghost text-muted">
          Hvordan det fungerer
        </button>
        <button className="btn btn-ghost text-muted">
          Om oss
        </button>
        <ModeToggle />
        <button className="btn btn-gradient">
          Logg inn
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
