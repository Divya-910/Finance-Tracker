// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Welcome to Finance Tracker</h1>
      <p>Track your expenses. Set limits. Improve your savings.</p>
      <button onClick={handleLoginClick} style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        Login
      </button>
    </div>
  );
};

export default Home;
