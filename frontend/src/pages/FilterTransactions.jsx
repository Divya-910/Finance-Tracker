import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './FilterTransactions.css';

const categories = [
  'Rent', 'Food', 'Groceries', 'Travel', 'Shopping',
  'Utilities', 'Entertainment', 'Health', 'Education', 'Other'
];

const categoryIcons = {
  Rent: '🏠', Food: '🍽️', Groceries: '🛒', Travel: '✈️', Shopping: '🛍️',
  Utilities: '💡', Entertainment: '🎮', Health: '💊', Education: '📚', Other: '📦'
};

const FilterTransactions = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCats, setSelectedCats] = useState([...categories]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalTx, setModalTx] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged(u => {
      if (u?.emailVerified) setUser(u);
      else navigate('/');
    });
    return () => unsub();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
    axios.get(`https://finance-tracker-hvmu.onrender.com/transactions/${user.uid}`)
      .then(res => setTransactions(res.data))
      .catch(console.error);
  }, [user]);

  const applyFilter = () => {
    const grouped = {};
    transactions.forEach(tx => {
      if (
        tx.date >= startDate &&
        tx.date <= endDate &&
        selectedCats.includes(tx.category)
      ) {
        (grouped[tx.category] ||= []).push(tx);
      }
    });
    setFiltered(grouped);
  };

  const toggleCat = cat =>
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );

  const getTotal = txs =>
    txs.reduce((sum, t) => sum + t.amount, 0).toFixed(2);

  return (
    <>
      <Navbar user={user} />
      <div className="filter-page">
        <h2>Filter Transactions</h2>

        <div className="filter-bar">
          <div className="dates">
            <label>
              From: <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </label>
            <label>
              To: <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
            <button onClick={applyFilter}>Apply</button>
          </div>

          <div className="cats">
            {categories.map(cat => (
              <button
                key={cat}
                className={selectedCats.includes(cat) ? 'cat-btn active' : 'cat-btn'}
                onClick={() => toggleCat(cat)}
              >
                {categoryIcons[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="category-grid">
          {[...selectedCats]
            .map(cat => ({ cat, txs: filtered[cat] || [] }))
            .sort((a, b) => getTotal(b.txs) - getTotal(a.txs))
            .map(({ cat, txs }) => (
              <div
                key={cat}
                className={`category-box ${txs.length === 0 ? 'disabled' : ''}`}
                onClick={() => txs.length > 0 && setSelectedCategory({ name: cat, txs })}
              >
                <div className="cat-icon">{categoryIcons[cat]}</div>
                <div className="cat-name">{cat}</div>
                <div className="cat-amount">₹{getTotal(txs)}</div>
              </div>
            ))}
        </div>

        {/* Transactions Modal */}
        {selectedCategory && (
          <div className="modal-overlay" onClick={() => setSelectedCategory(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>
                {categoryIcons[selectedCategory.name]} {selectedCategory.name}
              </h3>
              <div className="card-grid">
                {selectedCategory.txs.map(tx => (
                  <div
                    className="tx-card"
                    key={tx.id}
                    onClick={() => setModalTx(tx)}
                  >
                    <div className="tx-amount">₹{tx.amount}</div>
                    <div className="tx-desc">{tx.description || 'No description'}</div>
                    <div className="tx-date">{tx.date}</div>
                  </div>
                ))}
              </div>
              <button className="close-btn" onClick={() => setSelectedCategory(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Transaction Modal */}
        {modalTx && (
          <div className="modal-overlay" onClick={() => setModalTx(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3>Transaction Details</h3>
              <p><strong>Amount:</strong> ₹{modalTx.amount}</p>
              <p><strong>Category:</strong> {modalTx.category}</p>
              <p><strong>Date:</strong> {modalTx.date}</p>
              <p><strong>Description:</strong> {modalTx.description || 'N/A'}</p>
              <div className="modal-actions">
                <button onClick={() => navigate('/edit_transaction', { state: { transaction: modalTx } })}>Edit</button>
                <button onClick={() => setModalTx(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FilterTransactions;
