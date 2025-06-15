import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import axios from 'axios';
import './Limits.css';
import Navbar from './Navbar';
import { 
  FaHome, FaUtensils, FaPlane, FaShoppingBag, FaBolt, FaFilm, FaHeartbeat, FaBook, FaAppleAlt, FaEllipsisH 
} from 'react-icons/fa';

const categoryIcons = {
  Rent: <FaHome />,
  Food: <FaUtensils />,
  Travel: <FaPlane />,
  Shopping: <FaShoppingBag />,
  Utilities: <FaBolt />,
  Entertainment: <FaFilm />,
  Health: <FaHeartbeat />,
  Education: <FaBook />,
  Groceries: <FaAppleAlt />,
  Other: <FaEllipsisH />
};

const categories = Object.keys(categoryIcons);

const Limits = () => {
  const [limits, setLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchLimits = async () => {
      try {
        const res = await axios.get(`https://finance-tracker-hvmu.onrender.com/limits/${user.uid}`);
        const fetchedLimits = {};
        res.data.forEach(lim => {
          fetchedLimits[lim.category] = lim.limit_amount;
        });
        setLimits(fetchedLimits);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching limits:", err);
        setError("Failed to load limits.");
        setLoading(false);
      }
    };

    fetchLimits();
  }, [user]);

  const handleChange = (category, value) => {
    setLimits(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError("You must be logged in.");
      return;
    }

    try {
      const updates = Object.entries(limits).map(([category, limit_amount]) =>
        axios.post('https://finance-tracker-hvmu.onrender.com/set-limit', {
          user_id: user.uid,
          category,
          limit_amount: parseFloat(limit_amount)
        })
      );
      await Promise.all(updates);
      alert("🎉 Limits updated successfully!");
    } catch (err) {
      console.error("Error updating limits:", err);
      setError("Failed to update limits.");
    }
  };

  if (loading) return <p>Loading limits...</p>;

  return (
    <>
    <Navbar/>
    <div className="limits-container">
      <div className="limits-card">
        <h2>🎯 Set Your Monthly Limits</h2>
        <form onSubmit={handleSubmit}>
          {categories.map(category => (
            <div key={category} className="limit-input-group">
              <span className="category-icon">{categoryIcons[category]}</span>
              <label>
                {category}: ₹
                <input
                  type="number"
                  value={limits[category] || ''}
                  onChange={(e) => handleChange(category, e.target.value)}
                  min="0"
                  required
                />
              </label>
            </div>
          ))}
          <button type="submit">💾 Save Limits</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
    </>
  );
};

export default Limits;
