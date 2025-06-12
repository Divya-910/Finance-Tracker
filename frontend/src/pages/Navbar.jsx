// src/components/Navbar.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import './Navbar.css';

const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const goToAbout = () => {
    navigate('/about');
  };

  const goToHome = () => {
    if (user) {
      navigate('/user_home');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-title" onClick={goToHome}>
        💰 Finance Tracker
      </div>
      <div className="navbar-links">
        <button onClick={goToHome}>Home</button>
        <button onClick={goToAbout}>About</button>
        {user ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => navigate('/login')}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
