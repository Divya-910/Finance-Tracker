// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import User_Home from './pages/User_home';
import AddTransaction from './pages/AddTransaction';
import Limits from './pages/Limits';
import FilterTransactions from './pages/FilterTransactions';
import About from './pages/About';
import EditTransaction from './pages/EditTransaction';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
         <Route path="/user_home" element={<User_Home />} />
          <Route path="/add_transaction" element={<AddTransaction />} />
          <Route path="/limits" element={<Limits />} />
         <Route path="/filter_transactions" element={<FilterTransactions />} />
         <Route path="/about" element={<About/>} />
         <Route path = "/edit_transaction" element = {<EditTransaction/>}/>
      </Routes>
    </Router>
  );
}

export default App;
