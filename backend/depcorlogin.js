const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Import CORS middleware

// Create an express app
const app = express();

// Enable CORS for all origins
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

app.post('/coordinatorlogin', (req, res) => {
  const { coordinatorid, password1, department } = req.body;

  // Query the depcorlogin table to check if the coordinatorid exists along with the department
  const query = 'SELECT * FROM depcorlogin WHERE coordinatorid = ? AND department = ?';
  
  connection.query(query, [coordinatorid, department], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err.stack);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length > 0) {
      // If coordinator exists, check if the password matches
      const coordinator = results[0];
      if (coordinator.password === password1) {
        // Password matches, login successful
        res.status(200).json({ success: true, coordinatorid: coordinator.coordinatorid });
      } else {
        // Password doesn't match
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      // Coordinator ID or department doesn't exist
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});


// Start the server
app.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});
