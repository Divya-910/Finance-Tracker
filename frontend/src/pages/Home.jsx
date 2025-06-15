import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { auth } from '../firebase';
import './Home.css';

const Home = () => {
  return (
    <>
      <Navbar user={auth.currentUser} />
      <div className="home-container">
        <div className="overlay">
          <h1 className="title">Welcome to Finance Tracker</h1>
          <p className="subtitle">Track your expenses. Set limits. Improve your savings.</p>
        </div>
      </div>
    </>
  );
};

export default Home;
