import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, user, logout, isAdmin } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <nav>
        <div className="nav-brand">
          <Link to="/" onClick={closeMenu}>
            <span className="logo-icon">🐾</span>
            <span className="logo-text">Pet Heaven</span>
          </Link>
        </div>

        <button className="hamburger" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <div className="nav-links">
            <Link to="/" onClick={closeMenu}>Home</Link>
            <Link to="/about" onClick={closeMenu}>About</Link>
            <Link to="/funcat" onClick={closeMenu}>Cats</Link>
            <Link to="/fundog" onClick={closeMenu}>Dogs</Link>
            <Link to="/adopt" onClick={closeMenu}>Adopt</Link>
            <Link to="/release" onClick={closeMenu}>Release</Link>
            {isLoggedIn && isAdmin() && (
              <Link to="/admin" onClick={closeMenu} className="admin-link">Admin</Link>
            )}
          </div>
          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <Link to="/profile" className="btn btn-nav" onClick={closeMenu}>
                  {user?.name ? `Hi, ${user.name}` : 'Profile'}
                </Link>
                <button className="btn btn-nav btn-logout" onClick={() => { logout(); closeMenu(); }}>
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-nav" onClick={closeMenu}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;