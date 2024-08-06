import React from 'react';
import './styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="navbar-button">Button 1</button>
        <button className="navbar-button">Button 2</button>
        <button className="navbar-button">Button 3</button>
        <button className="navbar-button">Button 4</button>
      </div>
      <div className="navbar-right">
        <button className="profile-button">Profile</button>
      </div>
    </nav>
  );
};

export default Navbar;
