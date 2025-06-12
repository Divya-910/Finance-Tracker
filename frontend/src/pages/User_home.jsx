// src/pages/UserHome.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';

const UserHome = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  // Track current user from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
      } else {
        navigate('/login'); // Redirect to login if not verified
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch transactions
  useEffect(() => {
    if (!user) return;

    const fetchTransactions = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/transactions/${user.uid}`);
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };

    fetchTransactions();
  }, [user]);

  const handleAddTransaction = () => {
    navigate('/add_transaction');
  };
  const handleSetLimits= () => {
    navigate('/limits');
  };
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Welcome, {user?.displayName || user?.email}</h2>
      <button
        onClick={handleAddTransaction}
        style={{ padding: '10px 20px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ➕ Add Transaction
      </button>
    <button
        onClick={handleSetLimits}
        style={{ padding: '10px 20px', marginBottom: '20px', cursor: 'pointer' }}
      >
        ➕ Set Limits
      </button>
      <h3>Your Transactions:</h3>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {transactions.map((tx) => (
            <li key={tx.id} style={{ marginBottom: '10px' }}>
              <strong>{tx.category}</strong>: ₹{tx.amount} on {tx.date} — {tx.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserHome;
