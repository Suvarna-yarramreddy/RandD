const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Set up multer storage configuration for handling file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/publications/';
        
        // Ensure the "uploads" directory exists, if not create it
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads', { recursive: true });
        }

        // Ensure the "uploads/publications" directory exists, if not create it
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);  // Directory where patent files will be saved
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Rename file to avoid name collisions
    }
});

// Initialize multer with storage configuration
const upload = multer({ storage: storage });

// MySQL Connection (Directly using the values instead of dotenv)
const db = mysql.createConnection({
    host: "localhost",  // Replace with your MySQL server host
    user: "root",       // Replace with your MySQL username
    password: "Suvarna@123",  // Replace with your MySQL password
    database: "faculty_db",   // Replace with your MySQL database name
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
    const proofOfPublication = req.file ? req.file.path : null; // URL of the uploaded file

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
    app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error fetching publications:", err);
            return res.status(500).json({ error: "Internal server error", details: err });
        }

        if (results.length === 0) {
            console.log("No publications found for this faculty ID.");
            return res.status(404).json({ message: "No publications found" });
        }

        // Correct file path format for client-side access
        results.forEach(pub => {
            if (pub.proofOfPublication) {
                pub.proofOfPublication = `${pub.proofOfPublication.replace(/\\/g, '/')}`;
            }
        });
        res.json(results);
    });
});

// Update Publication Endpoint
app.put('/update-publication/:id', upload.single('proofOfPublication'), (req, res) => {
    const publicationId = req.params.id; // Extract the ID from the route parameter

    // Fetch the existing publication details
    const fetchQuery = "SELECT * FROM publications WHERE publication_id = ?";
    db.query(fetchQuery, [publicationId], (err, results) => {
        if (err) {
            console.error("Error fetching publication:", err);
            return res.status(500).json({ message: "Error fetching publication", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Publication not found" });
        }

        const existingData = results[0]; // Existing details of the publication

        // Extract new data from request body, or use the existing values if not provided
        const {
            faculty_id = existingData.faculty_id,
            natureOfPublication = existingData.natureOfPublication,
            typeOfPublication = existingData.typeOfPublication,
            titleOfPaper = existingData.titleOfPaper,
            nameOfJournalConference = existingData.nameOfJournalConference,
            titleofChapter = existingData.titleofChapter,
            nameofbook = existingData.nameofbook,
            nameOfPublisher = existingData.nameOfPublisher,
            issnIsbn = existingData.issnIsbn,
            authorStatus = existingData.authorStatus,
            firstAuthorName = existingData.firstAuthorName,
            firstAuthorAffiliation = existingData.firstAuthorAffiliation,
            coAuthors = existingData.coAuthors,
            indexed = existingData.indexed,
            quartile = existingData.quartile,
            impactFactor = existingData.impactFactor,
            doi = existingData.doi,
            linkOfPaper = existingData.linkOfPaper,
            scopusLink = existingData.scopusLink,
            volume = existingData.volume,
            pageNo = existingData.pageNo,
            monthYear = existingData.monthYear,
            citeAs = existingData.citeAs
        } = req.body;

        // Handle file upload or retain the existing proofOfPublication
        let proofOfPublication = existingData.proofOfPublication;  // Default to the existing value

        if (req.file) {
            // If a new file is uploaded, store the new path
            proofOfPublication = `uploads/publications/${req.file.filename}`; // Updated file path
        }

        // Update query
        const updateQuery = `
            UPDATE publications
            SET 
                faculty_id = ?,
                natureOfPublication = ?,
                typeOfPublication = ?,
                titleOfPaper = ?,
                nameOfJournalConference = ?,
                titleofChapter = ?,
                nameofbook = ?,
                nameOfPublisher = ?,
                issnIsbn = ?,
                authorStatus = ?,
                firstAuthorName = ?,
                firstAuthorAffiliation = ?,
                coAuthors = ?,
                indexed = ?,
                quartile = ?,
                impactFactor = ?,
                doi = ?,
                linkOfPaper = ?,
                scopusLink = ?,
                volume = ?,
                pageNo = ?,
                monthYear = ?,
                citeAs = ?,
                proofOfPublication = ?,
                status = 'Applied'
            WHERE publication_id = ?`;

        const values = [
            faculty_id, natureOfPublication, typeOfPublication, titleOfPaper,
            nameOfJournalConference, titleofChapter, nameofbook, nameOfPublisher,
            issnIsbn, authorStatus, firstAuthorName, firstAuthorAffiliation, coAuthors,
            indexed, quartile, impactFactor, doi, linkOfPaper, scopusLink, volume,
            pageNo, monthYear, citeAs, proofOfPublication, publicationId
        ];

        // Execute the update query
        db.query(updateQuery, values, (updateErr, result) => {
            if (updateErr) {
                console.error("Error updating publication:", updateErr);
                return res.status(500).json({ message: "Failed to update publication", error: updateErr });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Publication not found" });
            }

            res.json({ message: "Publication updated successfully" });
        });
    });
});

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
