import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import axios from 'axios';

const categories = [
  'Rent', 'Food', 'Travel', 'Shopping', 'Utilities',
  'Entertainment', 'Health', 'Education', 'Groceries', 'Other'
];


const Limits = () => {
  const [limits, setLimits] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;
    const fetchLimits = async () => {
      try {
        const res = await axios.get(`http://localhost:5002/limits/${user.uid}`);
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
        axios.post('http://localhost:5002/set-limit', {
          user_id: user.uid,
          category,
          limit_amount: parseFloat(limit_amount)
        })
      );
      await Promise.all(updates);
      alert("Limits updated successfully!");
    } catch (err) {
      console.error("Error updating limits:", err);
      setError("Failed to update limits.");
    }
  };

  if (loading) return <p>Loading limits...</p>;

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Set Category Limits</h2>
      <form onSubmit={handleSubmit}>
        {categories.map(category => (
          <div key={category} style={{ marginBottom: '1rem' }}>
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
        <button type="submit">Save Limits</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Limits;
