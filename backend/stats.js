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
app.get('/api/stats/:facultyId', async (req, res) => {
  const { facultyId } = req.params;

  // Queries to fetch statistics based on facultyId
  const queries = {
    total_faculty: 'SELECT COUNT(*) AS count FROM faculty WHERE faculty_id = ?',
    total_publications: 'SELECT COUNT(*) AS count FROM publications WHERE faculty_id = ?',
    total_patents: 'SELECT COUNT(*) AS count FROM patents WHERE faculty_id = ?',
  };

  try {
    // Execute each query and pass the facultyId as a parameter
    const executeQuery = (query, facultyId) =>
      new Promise((resolve, reject) => {
        connection.query(query, [facultyId], (err, results) => {
          if (err) return reject(err);
          resolve(results[0].count);
        });
      });

    // Fetch statistics based on facultyId
    const stats = await Promise.all(
      Object.entries(queries).map(([key, query]) => executeQuery(query, facultyId))
    );

    const response = {
      total_faculty: stats[0],
      total_publications: stats[1],
      total_patents: stats[2],
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Start the server
app.listen(5009, () => {
  console.log('Server running on http://localhost:5003');
});
