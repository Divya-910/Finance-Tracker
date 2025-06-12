import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './FilterTransactions.css';

const categories = [
  "Rent", "Food", "Groceries", "Travel", "Shopping",
  "Utilities", "Entertainment", "Health", "Education", "Other"
];

const FilterTransactions = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState({});
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([...categories]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser && firebaseUser.emailVerified) {
        setUser(firebaseUser);
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

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

  const handleFilter = () => {
    if (!startDate || !endDate) return;

    const grouped = {};
    transactions.forEach(tx => {
      if (
        tx.date >= startDate &&
        tx.date <= endDate &&
        selectedCategories.includes(tx.category)
      ) {
        if (!grouped[tx.category]) grouped[tx.category] = [];
        grouped[tx.category].push(tx);
      }
    });

    setFilteredTransactions(grouped);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(cat => cat !== category)
        : [...prev, category]
    );
  };

  return (
    <>
      <Navbar user={user} />
      <div className="filter-page">
        <h2>Filter Transactions</h2>
        <div className="filter-controls">
          <label>
            Start Date: <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label>
            End Date: <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <div className="category-filters">
            {categories.map(cat => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryChange(cat)}
                />
                {cat}
              </label>
            ))}
          </div>
          <button onClick={handleFilter}>Apply Filters</button>
        </div>

        <div className="results">
          {Object.keys(filteredTransactions).length === 0 ? (
            <p>No transactions to display.</p>
          ) : (
            Object.entries(filteredTransactions).map(([category, txns]) => (
              <div key={category} className="category-group">
                <h3>{category} ({txns.length} transaction{txns.length > 1 ? 's' : ''})</h3>
                <ul>
                  {txns.map(tx => (
                    <li key={tx.id}>
                      ₹{tx.amount} — {tx.description || "No description"} on {tx.date}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FilterTransactions;
