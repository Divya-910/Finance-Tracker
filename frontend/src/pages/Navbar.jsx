import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import './Navbar.css';

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Track auth state reliably
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user && user.emailVerified ? user : null);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const goToAbout = () => {
    if (location.pathname !== '/about') {
      navigate('/about');
    }
  };

  const goToHome = () => {
    if (currentUser) {
      if (location.pathname !== '/user_home') {
        navigate('/user_home');
      }
    } else {
      if (location.pathname !== '/') {
        navigate('/');
      }
    }
  };

  const handleLogin = () => {
    if (location.pathname !== '/login') {
      navigate('/login');
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
        {currentUser ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
