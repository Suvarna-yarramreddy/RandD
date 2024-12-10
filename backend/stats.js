// Importing required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS middleware

// Create an express app
const app = express();

// Enable CORS for all origins (or specify only your frontend origin if needed)
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// Database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Update with your MySQL username
  password: 'Suvarna@123', // Update with your MySQL password
  database: 'faculty_db' // Your database name
});

// Check the connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database');
});

// API endpoint to fetch overall statistics
// API endpoint to fetch overall statistics
app.get('/api/stats', async (req, res) => {
  const queries = {
    total_faculty: 'SELECT COUNT(*) AS count FROM faculty',
    total_publications: 'SELECT COUNT(*) AS count FROM publications',
    total_patents: 'SELECT COUNT(*) AS count FROM patents',
    total_seedmoney: 'SELECT COUNT(*) AS count FROM seedmoney'
  };

  try {
    const executeQuery = (query) =>
      new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
        });
      });

    const stats = await Promise.all(Object.entries(queries).map(([key, query]) => executeQuery(query)));

    const response = {
      total_faculty: stats[0],
      total_publications: stats[1],
      total_patents: stats[2],
      total_seedmoney: stats[3]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(5003, () => {
  console.log('Server running on http://localhost:5003');
});
