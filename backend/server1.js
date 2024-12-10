const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password:  "Suvarna@123", // Use .env for sensitive info
    database: "faculty_db", // Use .env for the database name
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to MySQL database.");
});
app.get("/", (req, res) => {
    res.send("Server is running! Access the /signup endpoint with a POST request.");
});

// API Endpoint for Signup
app.post("/signup", (req, res) => {
    const {
        faculty_id,
        institute_name,
        faculty_name,
        department,
        designation,
        research_domain,
        major_specialization,
        research_skills,
        qualification,
        phd_status,
        phd_registration_date,
        phd_university,
        phd_completed_year,
        guide_name,
        guide_phone_number,
        guide_mail_id,
        guide_department,
        date_of_joining_svecw,
        experience_in_svecw,
        previous_teaching_experience,
        total_experience,
        industry_experience,
        ratified,
        official_mail_id,
        phone_number,
        course_network_id,
        faculty_profile_weblink,
        scopus_id,
        orcid,
        google_scholar_id,
        vidwan_portal,
        password1
    } = req.body;
    const phdUniversity = phd_university || null;
    const phdRegistrationDate = phd_registration_date || null;
    const phdCompletedYear = phd_completed_year || null;
    // Validate required fields
    if (!faculty_id || !faculty_name || !official_mail_id || !department) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const query = `INSERT INTO faculty ( 
        faculty_id,
        institute_name,
        faculty_name,
        department,
        designation,
        research_domain,
        major_specialization,
        research_skills,
        qualification,
        phd_status,
        phd_registration_date,
        phd_university,
        phd_completed_year,
        guide_name,
        guide_phone_number,
        guide_mail_id,
        guide_department,
        date_of_joining_svecw,
        experience_in_svecw,
        previous_teaching_experience,
        total_experience,
        industry_experience,
        ratified,
        official_mail_id,
        phone_number,
        course_network_id,
        faculty_profile_weblink,
        scopus_id,
        orcid,
        google_scholar_id,
        vidwan_portal,
        password1
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

    db.query(
        query,
        [
            faculty_id,
            institute_name,
            faculty_name,
            department,
            designation,
            research_domain,
            major_specialization,
            research_skills,
            qualification,
            phd_status,
            phdRegistrationDate,
            phdUniversity,
            phdCompletedYear,
            guide_name,
            guide_phone_number,
            guide_mail_id,
            guide_department,
            date_of_joining_svecw,
            experience_in_svecw,
            previous_teaching_experience,
            total_experience,
            industry_experience,
            ratified,
            official_mail_id,
            phone_number,
            course_network_id,
            faculty_profile_weblink,
            scopus_id,
            orcid,
            google_scholar_id,
            vidwan_portal,
            password1
        ],
        (err, result) => {
            if (err) {
                console.log(err);
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).json({ message: "Faculty ID or Official Mail ID already exists." });
                } else {
                    console.error("Database error:", err);
                    res.status(500).json({ message: "Database error." });
                }
            } else {
                res.status(201).json({ message: "Signup successful!", faculty_name,faculty_id });
            }
        }
    );
});

app.post("/login", (req, res) => {
    const { faculty_id, password1 } = req.body;

    // Validate required fields
    if (!faculty_id || !password1) {
        return res.status(400).json({ message: "Faculty ID and password are required." });
    }

    // First, check if the faculty_id exists in the faculty table
    const facultyQuery = `SELECT * FROM faculty WHERE faculty_id = ?`;

    db.query(facultyQuery, [faculty_id], (err, facultyResult) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Database error." });
        }

        // If the faculty_id does not exist in the faculty table
        if (facultyResult.length === 0) {
            return res.status(400).json({ message: "Faculty ID not found. You must register to login." });
        }

        // Now, check if the faculty_id exists in the login table
        const loginQuery = `SELECT * FROM login WHERE faculty_id = ?`;

        db.query(loginQuery, [faculty_id], (err, loginResult) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error." });
            }

            // If the faculty_id does not exist in the login table
            if (loginResult.length === 0) {
                // Faculty exists in the faculty table but not in the login table, so insert into the login table
                const insertQuery = `INSERT INTO login (faculty_id, password) VALUES (?, ?)`;

                db.query(insertQuery, [faculty_id, password1], (err, insertResult) => {
                    if (err) {
                        console.error("Insert error:", err);
                        return res.status(500).json({ message: "Error inserting faculty into login table." });
                    }

                    return res.status(200).json({ message: "Faculty registered in login table, login successful.", faculty_name: facultyResult[0].faculty_name, faculty_id });
                });
            } else {
                // Faculty exists in both tables, now check the password
                if (loginResult[0].password === password1) {
                    // Password matches, login successful
                    return res.status(200).json({ message: "Login successful.", faculty_name: facultyResult[0].faculty_name, faculty_id });
                } else {
                    // Incorrect password
                    return res.status(400).json({ message: "Incorrect password." });
                }
            }
        });
    });
});

app.post("/addPublication", (req, res) => {
    const {
        faculty_id,
        natureOfPublication,
        typeOfPublication,
        titleOfPaper,
        nameOfJournalConference,
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

    const query = `
        INSERT INTO publications (
        faculty_id, natureOfPublication, typeOfPublication, titleOfPaper, nameOfJournalConference, nameOfPublisher, issnIsbn,
        authorStatus,firstAuthorName,firstAuthorAffiliation,coAuthors,indexed,quartile,impactFactor,doi,linkOfPaper,scopusLink,volume,
        pageNo,monthYear,citeAs
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [
        faculty_id, natureOfPublication, typeOfPublication, titleOfPaper, nameOfJournalConference, nameOfPublisher, issnIsbn,
        authorStatus,firstAuthorName,firstAuthorAffiliation,coAuthors,indexed,quartile,impactFactor,doi,linkOfPaper,scopusLink,volume,
        pageNo,monthYear,citeAs
    ], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error while inserting publication');
        }
        res.status(200).send('Publication added successfully');
    });
});
app.get('/getPublications/:faculty_id', (req, res) => {
    const faculty_id = req.params.faculty_id;

    console.log(`Fetching publications for faculty ID: ${faculty_id}`);

    const query = 'SELECT * FROM publications WHERE faculty_id = ?';
    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error('Error fetching publications:', err);
            return res.status(500).json({ error: 'Internal server error', details: err });
        }

        if (results.length === 0) {
            console.log('No publications found for this faculty ID.');
            return res.status(404).json({ message: 'No publications found' });
        }

        console.log('Publications fetched successfully:', results);
        res.json(results);
    });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
