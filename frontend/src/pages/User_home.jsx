// src/pages/UserHome.js

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../firebase';
import axios from 'axios';
import './UserHome.css';
import Navbar from './Navbar';

const categoryIcons = {
  Rent: '🏠',
  Food: '🍽️',
  Groceries: '🛒',
  Travel: '✈️',
  Shopping: '🛍️',
  Utilities: '💡',
  Entertainment: '🎮',
  Health: '💊',
  Education: '📚',
  Other: '🔖',
};

const categories = Object.keys(categoryIcons);

const UserHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [categoryModal, setCategoryModal] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [limits, setLimits] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const txRes = await axios.get(`http://localhost:5002/transactions/${user.uid}`);
        const currentMonth = new Date().toISOString().slice(0, 7);
        const filtered = txRes.data.filter(tx => tx.date.startsWith(currentMonth));
        setTransactions(filtered);

        const totals = {};
        categories.forEach(cat => (totals[cat] = 0));
        filtered.forEach(tx => {
          totals[tx.category] += tx.amount;
        });
        setCategoryTotals(totals);

        const limitsRes = await axios.get(`http://localhost:5002/limits/${user.uid}`);
        const limitsMap = {};
        limitsRes.data.forEach(({ category, limit_amount }) => {
          limitsMap[category] = limit_amount;
        });
        setLimits(limitsMap);

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, [user]);

  const handleAddTransaction = () => navigate('/add_transaction');
  const handleSetLimits = () => navigate('/limits');
  const handlefilterTransactions = () => navigate('/filter_transactions');

  const handleDelete = async () => {
    if (!selectedTransaction) return;
    const confirm = window.confirm("Are you sure you want to delete this transaction?");
    if (!confirm) return;
    try {
      await axios.delete(`http://localhost:5002/transactions/${selectedTransaction.id}`);
      setTransactions(prev => prev.filter(tx => tx.id !== selectedTransaction.id));
      setSelectedTransaction(null);
      setCategoryModal(null);
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const grouped = useMemo(() => {
    return transactions.reduce((acc, tx) => {
      acc[tx.category] = acc[tx.category] || [];
      acc[tx.category].push(tx);
      return acc;
    }, {});
  }, [transactions]);

  useEffect(() => {
    const reopenCategory = location.state?.reopenCategory;
    if (reopenCategory) {
      setCategoryModal({ name: reopenCategory, transactions: grouped[reopenCategory] || [] });
      window.history.replaceState({}, document.title);
    }
  }, [location.state?.reopenCategory, grouped]);

  return (
    <>
      <Navbar user={auth.currentUser} />
      <div className="user-home">
        <h2>Welcome, {user?.displayName || user?.email}</h2>
        <div className="buttons">
          <button onClick={handleAddTransaction}>➕ Add Transaction</button>
          <button onClick={handlefilterTransactions}>📊 Expense History</button>
          <button onClick={handleSetLimits}>📊 Set Limits</button>
        </div>

        <h3>This Month's Spending by Category:</h3>
        <div className="categories-grid">
          {categories.map(category => (
            <div
              key={category}
              className="category-card"
              onClick={() => setCategoryModal({ name: category, transactions: grouped[category] || [] })}
            >
              <div className="category-header">
                <span className="icon">{categoryIcons[category]}</span>
                <span className="category-name" style={{ color: 'black' }}>{category}</span>
              </div>
              <div className={`category-total ${limits[category] && categoryTotals[category] > limits[category] ? 'over-limit' : ''}`}>
                ₹{(categoryTotals[category] || 0).toFixed(2)}
                {limits[category] !== undefined && (
                  <span className="limit-amount"> / ₹{limits[category].toFixed(2)}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Category Modal */}
        {categoryModal && (
          <div className="modal-overlay" onClick={() => setCategoryModal(null)}>
            <div className="modal wide" onClick={(e) => e.stopPropagation()}>
              <h3>{categoryIcons[categoryModal.name]} {categoryModal.name} Transactions</h3>
              {categoryModal.transactions.length === 0 ? (
                <p>No transactions in this category.</p>
              ) : (
                <ul className="modal-transaction-list">
                  {categoryModal.transactions.map(tx => (
                    <li
                      key={tx.id}
                      onClick={() => setSelectedTransaction(tx)}
                      className="modal-transaction-item"
                    >
                      ₹{tx.amount} — {tx.date}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={() => setCategoryModal(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Transaction Detail Modal */}
        {selectedTransaction && (
          <div className="modal-overlay" onClick={() => setSelectedTransaction(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Transaction Details</h3>
              <p><strong>Amount:</strong> ₹{selectedTransaction.amount}</p>
              <p><strong>Category:</strong> {selectedTransaction.category}</p>
              <p><strong>Date:</strong> {selectedTransaction.date}</p>
              <p><strong>Description:</strong> {selectedTransaction.description || "No description"}</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  onClick={() =>
                    navigate('/edit_transaction', {
                      state: {
                        transaction: selectedTransaction,
                        categoryName: selectedTransaction.category,
                      },
                    })
                  }
                >
                  Edit
                </button>
                <button onClick={handleDelete} style={{ backgroundColor: 'red', color: 'white' }}>
                  Delete
                </button>
                <button onClick={() => setSelectedTransaction(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserHome;
