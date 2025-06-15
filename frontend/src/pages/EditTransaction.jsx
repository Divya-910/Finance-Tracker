import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditTransaction.css';

const EditTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { transaction, categoryName } = location.state || {};
  const [form, setForm] = useState({
    amount: '',
    date: '',
    category: '',
    description: '',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount,
        date: transaction.date,
        category: transaction.category,
        description: transaction.description || '',
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5002/transactions/${transaction.id}`, form);
      navigate('/user_home', {
        state: { reopenCategory: categoryName },
      });
    } catch (err) {
      console.error('Error updating transaction:', err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5002/transactions/${transaction.id}`);
      navigate('/user_home', {
        state: { reopenCategory: categoryName },
      });
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  return (
    <div className="edit-page">
      <h2>Edit Transaction</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <input type="number" name="amount" value={form.amount} onChange={handleChange} required />
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {[
            'Rent', 'Food', 'Groceries', 'Travel', 'Shopping', 'Utilities',
            'Entertainment', 'Health', 'Education', 'Other'
          ].map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
        />
        <button type="submit">Update</button>
        <button type="button" onClick={handleDelete} style={{ marginLeft: '10px' }}>Delete</button>
      </form>
    </div>
  );
};

export default EditTransaction;
