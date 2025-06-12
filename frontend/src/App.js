// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User_Home from './pages/User_home';
import AddTransaction from './pages/AddTransaction';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/user_home" element={<User_Home />} />
          <Route path="/add_transaction" element={<AddTransaction />} />
      </Routes>
    </Router>
  );
}

export default App;
