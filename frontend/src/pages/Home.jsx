// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import { auth } from '../firebase';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Navbar user={auth.currentUser} />
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1>Welcome to Finance Tracker</h1>
        <p>Track your expenses. Set limits. Improve your savings.</p>
      </div>
    </>
  );
};

export default Home;
