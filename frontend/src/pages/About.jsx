// src/pages/About.js
import React from 'react';
import './About.css';
import aboutImage from '../assets/about.png';
import Navbar from './Navbar';
const About = () => {
  return (
    <>
    <Navbar/>
    <div className="about-container">
      <img src={aboutImage} alt="About Page Visual" className="about-image" />
    </div>
    </>
  );
};

export default About;
