// server.js
const express = require("express");
const cors = require("cors");
const db = require("./db/db");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

// Example table creation (run once)
// Create `users` table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    uid TEXT PRIMARY KEY,
    email TEXT,
    created_at TEXT
  )
`);

// Create `expenses` table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    category TEXT,
    amount REAL,
    date TEXT,
    description TEXT,
    FOREIGN KEY (user_id) REFERENCES users(uid)
  )
`);

  // Create `limits` table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS limits (
    user_id TEXT,
    category TEXT,
    limit_amount REAL,
    PRIMARY KEY (user_id, category),
    FOREIGN KEY (user_id) REFERENCES users(uid)
  )
`);

app.post('/add-transaction', (req, res) => {
  const { user_id, category, amount, date, description } = req.body;

  if (!user_id || !category || !amount || !date) {
    return res.status(400).json({ error: 'All fields except description are required.' });
  }

  const query = `
    INSERT INTO expenses (user_id, category, amount, date, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(query, [user_id, category, amount, date, description], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to add transaction' });
    }

    res.status(200).json({ message: 'Transaction added successfully', id: this.lastID });
  });
});

app.get('/transactions/:user_id', (req, res) => {
  const { user_id } = req.params;

  const query = `
    SELECT * FROM expenses
    WHERE user_id = ?
    ORDER BY date DESC
  `;

  db.all(query, [user_id], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }

    res.status(200).json(rows);
  });
});

app.get('/limits/:userId', (req, res) => {
  const userId = req.params.userId;
  db.all(`SELECT category, limit_amount FROM limits WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch limits' });
    }
    res.json(rows);
  });
});

app.post('/set-limit', (req, res) => {
  const { user_id, category, limit_amount } = req.body;

  if (!user_id || !category || limit_amount == null) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const query = `
    INSERT INTO limits (user_id, category, limit_amount)
    VALUES (?, ?, ?)
    ON CONFLICT(user_id, category) DO UPDATE SET limit_amount = excluded.limit_amount
  `;

  db.run(query, [user_id, category, limit_amount], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to set limit' });
    }
    res.json({ message: 'Limit set successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
