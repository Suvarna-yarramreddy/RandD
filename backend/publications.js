const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config(); // For environment variables

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Ensure the 'uploads' directory exists, create it if not
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("'uploads' directory created.");
}

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Save files in the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with extension
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "Suvarna@123", // Replace 'password' with a placeholder
    database: process.env.DB_NAME || "faculty_db",
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Default route
app.get("/", (req, res) => {
    res.send("Server is running! Access the /addPublication and /getPublications endpoints.");
});

// Add Publication Endpoint
app.post("/addPublication", upload.single("proofOfPublication"), (req, res) => {
    const {
        faculty_id,
        natureOfPublication,
        typeOfPublication,
        titleOfPaper,
        nameOfJournalConference,
        titleofChapter,
        nameofbook,
        nameOfPublisher,
        issnIsbn,
        authorStatus,
        firstAuthorName,
        firstAuthorAffiliation,
        coAuthors,
        indexed,
        quartile,
        impactFactor,
        doi,
        linkOfPaper,
        scopusLink,
        volume,
        pageNo,
        monthYear,
        citeAs
    } = req.body;

    // File uploaded will be saved as filename
    const proofOfPublication = req.file ? `/uploads/${req.file.filename}` : null; // URL of the uploaded file

    // Include status with default value 'Applied'
    const status = "Applied";

    const query = `
        INSERT INTO publications (
        faculty_id, natureOfPublication, typeOfPublication, titleOfPaper, nameOfJournalConference, titleofChapter, nameofbook, 
        nameOfPublisher, issnIsbn, authorStatus, firstAuthorName, firstAuthorAffiliation, coAuthors, indexed, quartile, impactFactor, 
        doi, linkOfPaper, scopusLink, volume, pageNo, monthYear, citeAs, status, proofOfPublication
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        faculty_id, natureOfPublication, typeOfPublication, titleOfPaper, nameOfJournalConference, titleofChapter, nameofbook,
        nameOfPublisher, issnIsbn, authorStatus, firstAuthorName, firstAuthorAffiliation, coAuthors, indexed, quartile, impactFactor,
        doi, linkOfPaper, scopusLink, volume, pageNo, monthYear, citeAs, status, proofOfPublication
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error while inserting publication");
        }
        res.status(200).send("Publication added successfully");
    });
});


// Get Publications Endpoint
app.get("/getPublications/:faculty_id", (req, res) => {
    const faculty_id = req.params.faculty_id;

    const query = "SELECT * FROM publications WHERE faculty_id = ?";
    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error fetching publications:", err);
            return res.status(500).json({ error: "Internal server error", details: err });
        }

        if (results.length === 0) {
            console.log("No publications found for this faculty ID.");
            return res.status(404).json({ message: "No publications found" });
        }

        res.json(results);
    });
});
app.put('/updatePublication', upload.single('proofFile'), (req, res) => {
    const { publication_id } = req.body;
    const proofFile = req.file ? '/uploads/' + req.file.filename : null;

    const query = 'UPDATE publications SET proofOfPublication = ? WHERE publication_id = ?';
    db.query(query, [proofFile, publication_id], (err, result) => {
        if (err) {
            return res.status(500).send('Error updating publication');
        }
        res.send('Publication updated successfully');
    });
});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
