const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Suvarna@123", // It's recommended to use .env for sensitive information like passwords
    database: "faculty_db", // Use .env for the database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Set up multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/patents/';
        // Ensure the directory exists, if not create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);  // Directory where patent files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file to avoid name collisions
    }
});

const upload = multer({ storage: storage });

// Route to add patent with file upload
app.post("/addPatent", upload.single('proofOfPatent'), (req, res) => {
    const {
        faculty_id,
        category,
        iprType,
        applicationNumber,
        applicantName,
        department,
        filingDate,
        inventionTitle,
        numOfInventors,
        inventors,
        status,
        dateOfPublished,
        dateOfGranted,
    } = req.body;

    // Set default values to null if not provided
    const validDateOfPublished = dateOfPublished && dateOfPublished.trim() !== '' ? dateOfPublished : null;
    const validDateOfGranted = dateOfGranted && dateOfGranted.trim() !== '' ? dateOfGranted : null;

    // Check if a file was uploaded
    const proofOfPatent = req.file ? req.file.path : null; // Path to uploaded file, if exists

    if (!proofOfPatent) {
        return res.status(400).send("Proof of patent file is required.");
    }

    // Check if numOfInventors is a valid number or default to 0
    const validNumOfInventors = numOfInventors && !isNaN(numOfInventors) ? numOfInventors : 0;

    // Ensure inventors is either a valid string or NULL
    const validInventors = (Array.isArray(inventors) && inventors.length > 0) ? JSON.stringify(inventors) : null;

    // SQL query to insert patent data into the database
    const query = `
        INSERT INTO patents (faculty_id, category, iprType, applicationNumber, applicantName, department, filingDate, 
        inventionTitle, numOfInventors, inventors, status, dateOfPublished, dateOfGranted, proofOfPatent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        faculty_id, category, iprType, applicationNumber, applicantName, department, filingDate, inventionTitle,
        validNumOfInventors, validInventors, status, validDateOfPublished, validDateOfGranted, proofOfPatent
    ], (err, result) => {
        if (err) {
            console.error("Error inserting patent:", err);
            return res.status(500).send('Error while inserting patent');
        }
        res.status(200).send('Patent added successfully');
    });
});


app.get('/getPatents/:faculty_id', (req, res) => {
    const faculty_id = req.params.faculty_id;

    // Query to fetch all patents for the specified faculty_id
    const query = `SELECT * FROM patents WHERE faculty_id = ?`;
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);  // Log the full error for debugging
            return res.status(500).send('Error fetching patents.');
        }

        if (!results || results.length === 0) {
            console.log("No patents found for faculty_id:", faculty_id);  // Log if no results
            return res.status(404).send('No patents found for this faculty.');
        }

        // Update proofOfPatent to include the public URL for file access
        results.forEach(patent => {
            if (patent.proofOfPatent) {
                patent.proofOfPatent = `http://localhost:5001/${patent.proofOfPatent.replace(/\\/g, '/')}`;
            }
        });

        console.log("Patents found:", results); // Log the results before sending
        res.json(results);
    });
});



// Start the server
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
