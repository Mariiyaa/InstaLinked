import React from "react";
import "../style/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <input type="text" placeholder="Search" className="search-bar" />
      </div>
      <div className="navbar-right">
        <i className="icon home-icon">🏠</i>
        <i className="icon add-icon">➕</i>
        <i className="icon mail-icon">✉️</i>
        <i className="icon profile-icon">👤</i>
      </div>
    </nav>
  );
};

export default Navbar;
