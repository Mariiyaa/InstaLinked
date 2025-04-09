import React from 'react';
import '../style/Navbar.css';
import logo from '../assets/logo.svg'

const Navbar = () => {
  return (
    <div className="navbar">

        {/* Insert your SVG logo here */}
        <img src={logo} alt="InstaLinked Logo"  className="logo"/>
     
      <nav>
        {/* <ul className="nav-links">
          <li><a href="/login">About Us</a></li>
          <li><a href="/login">Menu item 2</a></li>
          <li><a href="/login">Menu item 3</a></li>
          <li><a href="login">Menu item 4</a></li>
        </ul> */}
        <div className="auth-links">
          <a href="/login" className="login">Login</a>
          <a href="/" className="signup">Sign Up</a>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
