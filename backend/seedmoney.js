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
    password: "Suvarna@123",  // It's recommended to use .env for sensitive information like passwords
    database: "faculty_db",  // Use .env for the database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Set up multer storage configuration for handling file uploads (for proof)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/seedmoney/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file to avoid name collisions
    }
});

const upload = multer({ storage: storage });

app.post("/addSeedMoney", upload.single('proof'), (req, res) => {
    const {
        faculty_id,
        financialYear,
        facultyName,
        department,
        numStudents,
        projectTitle,
        amountSanctioned,
        amountReceived,
        objectives,
        outcomes,
        students
    } = req.body;

    // Handle proof file if provided
    const proof = req.file ? req.file.path : null; // Path to uploaded file if exists, otherwise null

    // SQL query to insert SeedMoney data into the database
    const query = `
        INSERT INTO seedmoney (faculty_id, financialYear, facultyName, department, numStudents, projectTitle, 
        amountSanctioned, amountReceived, objectives, outcomes, proof)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        faculty_id, financialYear, facultyName, department, numStudents, projectTitle, 
        amountSanctioned, amountReceived, objectives, outcomes, proof
    ], (err, result) => {
        if (err) {
            console.error("Error inserting seed money:", err);
            return res.status(500).send('Error while inserting seed money');
        }

        const seedmoney_id = result.insertId;  // Get the inserted seedmoney_id

        // Ensure students is an array and insert them into the database
        if (Array.isArray(students) && students.length > 0) {
            // SQL query to insert students associated with the seed money
            const studentQuery = `
                INSERT INTO students (seedmoney_id, registration, name) VALUES ?
            `;
            
            // Prepare values for each student
            const studentValues = students.map(student => [
                seedmoney_id,  // Associate students with the seedmoney_id
                student.registration,
                student.name
            ]);

            db.query(studentQuery, [studentValues], (err, result) => {
                if (err) {
                    console.error("Error inserting students:", err);
                    return res.status(500).send('Error while inserting students');
                }

                res.status(200).send('SeedMoney and Students added successfully');
            });
        } else {
            res.status(400).send("No students data provided.");
        }
    });
});
// Route to add Students associated with SeedMoney
app.post("/addStudents", (req, res) => {
    const { seedmoney_id, students } = req.body;

    // Ensure students is an array
    if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).send("No students data provided.");
    }

    // SQL query to insert students into the database
    const query = `INSERT INTO students (seedmoney_id, registration, name) VALUES ?`;

    // Prepare values array for the query
    const values = students.map(student => [seedmoney_id, student.registration, student.name]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error("Error inserting students:", err);
            return res.status(500).send('Error while inserting students');
        }
        res.status(200).send('Students added successfully');
    });
});

// Route to get SeedMoney data along with students for a specific faculty
app.get('/getSeedMoney/:faculty_id', (req, res) => {
    const faculty_id = req.params.faculty_id;

    // Query to fetch SeedMoney data for the specified faculty_id
    const query = `SELECT * FROM seedmoney WHERE faculty_id = ?`;
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).send('Error fetching seed money records.');
        }

        if (!results || results.length === 0) {
            console.log("No seed money found for faculty_id:", faculty_id);
            return res.status(404).send('No seed money found for this faculty.');
        }

        // For each SeedMoney record, fetch student data based on seedmoney_id
        const seedMoneyWithStudents = [];
        let completedResults = 0;

        results.forEach((seedMoney, index) => {
            // Query to fetch students based on seedmoney_id for each seedMoney record
            const studentsQuery = `SELECT * FROM students WHERE seedmoney_id = ?`;

            db.query(studentsQuery, [seedMoney.seedmoney_id], (err, students) => {
                if (err) {
                    console.error("Error fetching students:", err);
                    return res.status(500).send('Error fetching student records.');
                }

                // Include the students in the seedMoney record
                seedMoney.students = students;

                // Update proof to include public URL for file access
                if (seedMoney.proof) {
                    seedMoney.proof = `http://localhost:5002/${seedMoney.proof.replace(/\\/g, '/')}`;
                }

                seedMoneyWithStudents.push(seedMoney);

                // If all records have been processed, send the response
                completedResults++;
                if (completedResults === results.length) {
                    console.log("SeedMoney and student data found:", seedMoneyWithStudents);
                    res.json(seedMoneyWithStudents);
                }
            });
        });
    });
});



// Start the server
const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
