import React, { useState } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const categories = [
  'Rent', 'Food', 'Travel', 'Shopping', 'Utilities',
  'Entertainment', 'Health', 'Education', 'Savings', 'Other'
];

const AddTransaction = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to add a transaction.");
      return;
    }

    const transaction = {
      user_id: user.uid,
      category,
      amount: parseFloat(amount),
      date,
      description,
    };

    try {
      const res = await axios.post('http://localhost:5002/add-transaction', transaction);
      alert('Transaction added successfully!');
      // Reset form
      setCategory('');
      setAmount('');
      setDate('');
      setDescription('');
      setError('');
      navigate('/user_home');  // redirect after submission
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Add a New Transaction</h2>
      <form onSubmit={handleSubmit}>

        <select value={category} onChange={(e) => setCategory(e.target.value)} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select><br /><br />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        /><br /><br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        /><br /><br />

        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        /><br /><br />

        <button type="submit">Add Transaction</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default AddTransaction;
