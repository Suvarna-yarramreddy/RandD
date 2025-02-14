const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require('bcrypt');
const multer = require("multer");
const path = require('path');

const fs = require('fs');
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
          db.query(query, [facultyId], (err, results) => {
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

  
  const storage = multer.diskStorage({
      destination: (req, file, cb) => {
          let dir;
  
          // Dynamically set upload directory based on the request URL
          if (req.url.includes('addPatent')) {
              dir = './uploads/patents/';
          } else if (req.url.includes('addPublication')) {
              dir = './uploads/publications/';
          } else if (req.url.includes('addSeedMoney') || (req.url.includes('/updateSeedMoney/:id'))) {
              dir = './uploads/seedmoney/';
          }  else if (req.url.includes('addConsultancy')) {
            dir = './uploads/consultancy/';
        } else if (req.url.includes('addResearch')) {
            dir = './uploads/research/';
        }  else {
              dir = './uploads/others/'; // Default directory
          }
  
          // Ensure the directory exists, if not, create it
          if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
          }
  
          cb(null, dir);
      },
      filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid name collisions
      }
  });
  
  // Initialize multer with the storage configuration
  const upload = multer({ storage });
  
  // Serve uploaded files statically
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));
  

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

app.get("/getPublications/:faculty_id", (req, res) => {
    const faculty_id = req.params.faculty_id;

    const query = `
        SELECT * FROM publications 
        WHERE faculty_id = ? 
        AND (status = 'Approved by Institute R&D Coordinator' 
        OR status = 'Rejected by Institute R&D Coordinator' 
        OR status = 'Rejected by Department R&D Coordinator')
    `;

    app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error fetching publications:", err);
            return res.status(500).json({ error: "Internal server error", details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No publications found" });
        }

        // Ensure correct file path format for client-side access
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
        status1,
        dateOfPublished,
        dateOfGranted,
    } = req.body;

    // Set default values to null if not provided
    const validDateOfPublished = dateOfPublished && dateOfPublished.trim() !== '' ? dateOfPublished : null;
    const validDateOfGranted = dateOfGranted && dateOfGranted.trim() !== '' ? dateOfGranted : null;

    // Check if a file was uploaded
    const proofOfPatent = req.file ? req.file.path : null;

    if (!proofOfPatent) {
        return res.status(400).send("Proof of patent file is required.");
    }

    // Check if numOfInventors is a valid number or default to 0
    const validNumOfInventors = numOfInventors && !isNaN(numOfInventors) ? numOfInventors : 0;

    // Ensure inventors is either a valid string or NULL
    const validInventors = (Array.isArray(inventors) && inventors.length > 0) ? JSON.stringify(inventors) : null;

    // Default status as "Applied"
    const status = "Applied";

    // SQL query to insert patent data into the database
    const query = `
        INSERT INTO patents (faculty_id, category, iprType, applicationNumber, applicantName, department, filingDate, 
        inventionTitle, numOfInventors, inventors, status1, dateOfPublished, dateOfGranted, proofOfPatent, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        faculty_id, category, iprType, applicationNumber, applicantName, department, filingDate, inventionTitle,
        validNumOfInventors, validInventors, status1, validDateOfPublished, validDateOfGranted, proofOfPatent, status
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
    const query = `SELECT * FROM patents 
    WHERE faculty_id = ? 
    AND (status = 'Approved by Institute R&D Coordinator' 
    OR status = 'Rejected by Institute R&D Coordinator' 
    OR status = 'Rejected by Department R&D Coordinator')`;
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Database error:", err);  // Log the full error for debugging
            return res.status(500).send('Error fetching patents.');
        }

        if (!results || results.length === 0) {
            return res.status(404).send('No patents found for this faculty.');
        }

        // Update proofOfPatent to include the public URL for file access
        results.forEach(patent => {
            if (patent.proofOfPatent) {
                patent.proofOfPatent = `${patent.proofOfPatent.replace(/\\/g, '/')}`;
            }
        });
        res.json(results);
    });
});



// Function to convert ISO date to MySQL date format (YYYY-MM-DD)
const formatDate = (date) => {
    return date ? new Date(date).toISOString().split('T')[0] : null;
};
app.put('/update-patent/:id', upload.single('proofOfPatent'), (req, res) => {
    const patent_id = req.params.id;

    // Fetch the existing patent details
    const fetchQuery = "SELECT * FROM patents WHERE patent_id = ?";
    db.query(fetchQuery, [patent_id], (err, results) => {
        if (err) {
            console.error("Error fetching patent:", err);
            return res.status(500).json({ message: "Error fetching patent", error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Patent not found" });
        }

        const existingData = results[0];

        // Extract request data, keeping existing values if not provided
        const {
            faculty_id = existingData.faculty_id,
            category = existingData.category,
            iprType = existingData.iprType,
            applicationNumber = existingData.applicationNumber,
            applicantName = existingData.applicantName,
            department = existingData.department,
            filingDate = existingData.filingDate,
            inventionTitle = existingData.inventionTitle,
            numOfInventors = existingData.numOfInventors,
            inventors = existingData.inventors,
            dateOfPublished = existingData.dateOfPublished,
            dateOfGranted = existingData.dateOfGranted
        } = req.body;

        // Convert dates to MySQL format
        const formattedFilingDate = formatDate(filingDate);
        const formattedDateOfPublished = formatDate(dateOfPublished) || existingData.dateOfPublished;
        const formattedDateOfGranted = formatDate(dateOfGranted);

        // Convert numOfInventors to integer
        const numInventorsParsed = parseInt(numOfInventors, 10);

        // Convert inventors to JSON if needed
        const formattedInventors = typeof inventors === 'string' ? inventors : JSON.stringify(inventors);

        // Handle file upload
        let proofOfPatent = existingData.proofOfPatent;
        if (req.file) {
            proofOfPatent = `uploads/patents/${req.file.filename}`;
        }
        proofOfPatent = proofOfPatent.replace(/\\/g, '/'); // Fix Windows file path

        // Override status to "Applied" on every update
        const updatedStatus = "Applied";

        // Update query
        const updateQuery = `
            UPDATE patents
            SET 
                faculty_id = ?,
                category = ?,
                iprType = ?,
                applicationNumber = ?,
                applicantName = ?,
                department = ?,
                filingDate = ?,
                inventionTitle = ?,
                numOfInventors = ?,
                inventors = ?,
                status = ?,
                dateOfPublished = ?,
                dateOfGranted = ?,
                proofOfPatent = ?
            WHERE patent_id = ?`;

        const values = [
            faculty_id,
            category,
            iprType,
            applicationNumber,
            applicantName,
            department,
            formattedFilingDate,
            inventionTitle,
            numInventorsParsed,
            formattedInventors,
            updatedStatus, // Always set to "Applied"
            formattedDateOfPublished,
            formattedDateOfGranted,
            proofOfPatent,
            patent_id
        ];

        // Execute the update query
        db.query(updateQuery, values, (updateErr, result) => {
            if (updateErr) {
                console.error("Error updating patent:", updateErr);
                return res.status(500).json({ message: "Failed to update patent", error: updateErr });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Patent not found" });
            }

            res.json({ message: "Patent updated successfully. Status set to 'Applied'." });
        });
    });
});


app.post("/addSeedMoney", upload.array("proof", 5), (req, res) => {
    try {
        const {
            faculty_id,
            financialYear,
            facultyName,
            department,
            numStudents,
            projectTitle,
            amountSanctioned,
            objectives,
            outcomes,
            students // Should be a JSON string or an array from frontend
        } = req.body;

        let proofUrls = req.files.map(file => `uploads/seedmoney/${file.filename}`);

        // Ensure amountReceived is valid
        const amountReceived = req.body.amountReceived && req.body.amountReceived.trim() !== ''
            ? req.body.amountReceived
            : null;

        // Ensure students is a valid JSON string
        let parsedStudents;
        try {
            parsedStudents = typeof students === "string" ? JSON.parse(students) : students;
        } catch (error) {
            console.error("Invalid students JSON:", students);
            return res.status(400).json({ error: "Invalid students format" });
        }

        const query = `INSERT INTO SeedMoney (faculty_id, financialYear, facultyName, department, numStudents, 
            projectTitle, amountSanctioned, amountReceived, objectives, outcomes, students, proof)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(query, [
            faculty_id, financialYear, facultyName, department, numStudents,
            projectTitle, amountSanctioned, amountReceived, objectives, outcomes,
            JSON.stringify(parsedStudents), JSON.stringify(proofUrls)
        ], (err, result) => {
            if (err) {
                console.error("Error inserting SeedMoney:", err);
                return res.status(500).json({ error: "Error while inserting SeedMoney" });
            }
            res.status(200).json({ message: "SeedMoney added successfully", seedMoneyId: result.insertId });
        });
    } catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ error: "Unexpected error occurred" });
    }
});

app.get("/getSeedMoney/:faculty_id", (req, res) => {
    const { faculty_id } = req.params;

    const query = `SELECT * FROM SeedMoney WHERE faculty_id = ?`;
    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error fetching SeedMoney records:", err);
            return res.status(500).json({ error: "Error fetching SeedMoney records" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "No SeedMoney records found." });
        }

        // ✅ Send data as plain text (comma-separated)
        results.forEach(record => {
            record.students = record.students || "No students";
            record.proof = record.proof || "No proof available";
        });

        res.json(results);
    });
});



// Route to Update SeedMoney
app.put("/updateSeedMoney/:id", upload.array("proof", 5), (req, res) => {
    const { id } = req.params;
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
        students // Updated students JSON array
    } = req.body;

    let proofUrls = req.files.length > 0 ? req.files.map(file => `uploads/seedmoney/${file.filename}`) : null;

    // Fetch existing record
    const fetchQuery = `SELECT * FROM SeedMoney WHERE id = ?`;
    db.query(fetchQuery, [id], (err, results) => {
        if (err) {
            console.error("Error fetching SeedMoney:", err);
            return res.status(500).send("Error fetching SeedMoney.");
        }
        if (results.length === 0) {
            return res.status(404).send("SeedMoney record not found.");
        }

        const existingData = results[0];

        const updateQuery = `UPDATE SeedMoney SET faculty_id=?, financialYear=?, facultyName=?, department=?, numStudents=?, 
            projectTitle=?, amountSanctioned=?, amountReceived=?, objectives=?, outcomes=?, students=?, proof=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?`;

        db.query(updateQuery, [
            faculty_id || existingData.faculty_id,
            financialYear || existingData.financialYear,
            facultyName || existingData.facultyName,
            department || existingData.department,
            numStudents || existingData.numStudents,
            projectTitle || existingData.projectTitle,
            amountSanctioned || existingData.amountSanctioned,
            amountReceived || existingData.amountReceived,
            objectives || existingData.objectives,
            outcomes || existingData.outcomes,
            JSON.stringify(students || JSON.parse(existingData.students || "[]")),
            JSON.stringify(proofUrls || JSON.parse(existingData.proof || "[]")),
            id
        ], (updateErr) => {
            if (updateErr) {
                console.error("Error updating SeedMoney:", updateErr);
                return res.status(500).send("Error updating SeedMoney.");
            }
            res.status(200).send("SeedMoney updated successfully.");
        });
    });
});
app.post('/addFundedProject', (req, res) => {
    const {
        faculty_id, financialYear, applicationNumber, agency, scheme, piName, piDept, piContact, piEmail,
        copiName, copiDept, copiContact, copiEmail, duration, title, status, startDate, objectives, outcomes,
        amountApplied, amountReceived, amountSanctioned, proof, totalExpenditure
    } = req.body;

    // Convert empty decimal values to NULL
    const sanitizedAmountSanctioned = amountSanctioned === '' ? null : amountSanctioned;
    const sanitizedAmountApplied = amountApplied === '' ? null : amountApplied;
    const sanitizedAmountReceived = amountReceived === '' ? null : amountReceived;
    const sanitizedTotalExpenditure = totalExpenditure === '' ? null : totalExpenditure;

    const sql = `
        INSERT INTO fundedprojects 
        (faculty_id, financialYear, applicationNumber, agency, scheme, piName, piDept, piContact, piEmail, 
         copiName, copiDept, copiContact, copiEmail, duration, title, status, startDate, objectives, outcomes, 
         amountApplied, amountReceived, amountSanctioned, proof, totalExpenditure) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        faculty_id, financialYear, applicationNumber, agency, scheme, piName, piDept, piContact, piEmail,
        copiName, copiDept, copiContact, copiEmail, duration, title, status, startDate, objectives, outcomes,
        sanitizedAmountApplied, sanitizedAmountReceived, sanitizedAmountSanctioned, proof, sanitizedTotalExpenditure
    ], (err, result) => {
        if (err) {
            console.error("Error inserting project:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(201).json({ message: "Project added successfully", projectId: result.insertId });
    });
});


app.get('/getFundedProjects/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM fundedprojects WHERE faculty_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching projects:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(result); // Return all projects
    });
});
app.post('/addConsultancy', upload.array('report', 10), (req, res) => {
    const {
        faculty_id, financialYear, department, startdateofProject, numoffaculty, titleofconsultancy,
        domainofconsultancy, clientorganization, clientaddress, amountreceived, dateofamountreceived,
        facilities, faculties
    } = req.body;

    if (!faculty_id) {
        return res.status(400).json({ error: "Faculty ID is required" });
    }

    // ✅ Fix file path formatting
    const reportJson = JSON.stringify(req.files.map(file => `uploads/consultancy/${file.filename}`));

    // ✅ Fix faculties JSON formatting
    let facultiesJson;
    try {
        facultiesJson = Array.isArray(faculties) ? JSON.stringify(faculties) : faculties;
    } catch (error) {
        return res.status(400).json({ error: "Invalid faculties data" });
    }

    const sanitizedAmountReceived = amountreceived === '' ? null : amountreceived;

    const sql = `
        INSERT INTO consultancy_projects 
        (faculty_id, financialYear, department, startdateofProject, numoffaculty, titleofconsultancy, 
         domainofconsultancy, clientorganization, clientaddress, amountreceived, dateofamountreceived, 
         facilities, report, faculties) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        faculty_id, financialYear, department, startdateofProject, numoffaculty, titleofconsultancy,
        domainofconsultancy, clientorganization, clientaddress, sanitizedAmountReceived, dateofamountreceived,
        facilities, reportJson, facultiesJson
    ], (err, result) => {
        if (err) {
            console.error("Error inserting consultancy project:", err);
            return res.status(500).json({ error: "Database error", details: err });
        }
        res.status(201).json({ message: "Consultancy project added successfully", consultancyId: result.insertId });
    });
});

app.get('/getConsultancy/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM consultancy_projects WHERE faculty_id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching consultancy projects:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(result);
    });
});

app.put('/updateSeedMoney/:id', upload.array('proof', 10), async (req, res) => {
    const { id } = req.params;
    let updatedData = req.body;

    try {
        // Extract file paths from uploaded files
        if (req.files && req.files.length > 0) {
            const filePaths = req.files.map(file => file.path); // Store file paths
            updatedData.proof = JSON.stringify(filePaths); // Convert array to JSON for DB storage
        }

        // Update database
        db.query('UPDATE seedmoney SET ? WHERE id = ?', [updatedData, id], (err, result) => {
            if (err) {
                console.error("Error updating seed money:", err);
                return res.status(500).json({ error: "Failed to update" });
            }
            res.json({ message: "Seed money application updated successfully" });
        });

    } catch (error) {
        console.error("Error updating seed money:", error);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/addResearch", upload.fields([
    { name: "admissionLetter", maxCount: 1 },
    { name: "guideAllotmentLetter", maxCount: 1 },
    { name: "completionProceedings", maxCount: 1 }
]), (req, res) => {
    const {
        faculty_id,
        guideName,
        guideDepartment,
        scholarName,
        scholarDepartment,
        admissionDate,
        university,
        workTitle,
        admissionStatus,
        awardDate,
        fellowship
    } = req.body;

    const admissionLetter = req.files["admissionLetter"] ? req.files["admissionLetter"][0].path : null;
    const guideAllotmentLetter = req.files["guideAllotmentLetter"] ? req.files["guideAllotmentLetter"][0].path : null;
    const completionProceedings = req.files["completionProceedings"] ? req.files["completionProceedings"][0].path : null;

    // If awardDate is an empty string, set it to null
    const formattedAwardDate = awardDate && awardDate.trim() !== "" ? awardDate : null;

    const query = `
        INSERT INTO research (faculty_id, guideName, guideDepartment, scholarName, scholarDepartment, admissionDate, 
        university, workTitle, admissionStatus, awardDate, fellowship, admissionLetter, guideAllotmentLetter, completionProceedings)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        faculty_id, guideName, guideDepartment, scholarName, scholarDepartment, admissionDate,
        university, workTitle, admissionStatus, formattedAwardDate, fellowship, admissionLetter,
        guideAllotmentLetter, completionProceedings
    ], (err, result) => {
        if (err) {
            console.error("Error inserting research data:", err);
            return res.status(500).send("Error while inserting research data");
        }
        res.status(200).send("Research Scholar data added successfully");
    });
});

app.get('/getscholars/:faculty_id', (req, res) => {
    const faculty_id = req.params.faculty_id;
    const query = `SELECT * FROM research WHERE faculty_id = ?`;

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error('Error fetching scholars:', err);
            return res.status(500).json({ error: 'Failed to fetch research scholars' });
        }
        res.json(results);
    });
});

app.post("/addProposal",  (req, res) => {
    const {
        faculty_id,
        referenceNumber,
        agencyScheme,
        submissionYear,
        submissionDate,
        piName,
        piDepartment,
        piDesignation,
        piPhone,
        piEmail,
        projectTitle,
        amountRequested,
        projectStatus
    } = req.body;

    const query = `
        INSERT INTO proposals 
        (faculty_id,referenceNumber, agencyScheme, submissionYear, submissionDate, piName, piDepartment, piDesignation, piPhone, piEmail, projectTitle, amountRequested, projectStatus) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    db.query(query, [
        faculty_id,referenceNumber, agencyScheme, submissionYear, submissionDate, piName, piDepartment,
        piDesignation, piPhone, piEmail, projectTitle, amountRequested, projectStatus
    ], (err, result) => {
        if (err) {
            console.error("Error inserting proposal data:", err);
            return res.status(500).send("Error while inserting proposal data");
        }
        res.status(200).send("Proposal data added successfully");
    });
});

app.get('/getProposals/:faculty_id', (req, res) => {
    const faculty_id = req.params.faculty_id;
    const query = `SELECT * FROM proposals WHERE faculty_id = ?`;

    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error('Error fetching proposals:', err);
            return res.status(500).json({ error: 'Failed to fetch proposals' });
        }
        res.json(results);
    });
});

app.post('/coordinatorlogin', (req, res) => {
    const { coordinatorid, password1, department } = req.body;
  
    // Query the depcorlogin table to check if the coordinatorid exists along with the department
    const query = 'SELECT * FROM depcorlogin WHERE coordinatorid = ? AND department = ?';
    
    db.query(query, [coordinatorid, department], (err, results) => {
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
  
  app.get('/getAllPublications', (req, res) => {
    const coordinatorId = req.query.coordinatorid;  // Get coordinatorId from the request query

    if (!coordinatorId) {
        return res.status(400).send('Coordinator ID is required.');
    }

    // Step 1: Fetch the coordinator's department
    const coordinatorDepartmentQuery = `
        SELECT department
        FROM depcorlogin
        WHERE coordinatorid = ?;
    `;
    db.query(coordinatorDepartmentQuery, [coordinatorId], (err, coordinatorResults) => {
        if (err) {
            console.error('Error fetching coordinator department:', err);
            return res.status(500).send('Error fetching coordinator department.');
        }

        if (coordinatorResults.length === 0) {
            return res.status(404).send('Coordinator not found.');
        }

        const coordinatorDepartment = coordinatorResults[0].department;

        // Step 2: Fetch publications where status is "Applied" and faculty department matches the coordinator's department
        const publicationsQuery = `
            SELECT p.*
            FROM publications p
            JOIN faculty f ON p.faculty_id = f.faculty_id
            WHERE p.status = "Applied" AND f.department = ?;
        `;
        db.query(publicationsQuery, [coordinatorDepartment], (err, publicationsResults) => {
            if (err) {
                console.error('Error fetching publications:', err);
                return res.status(500).send('Error fetching publications.');
            }

            if (publicationsResults.length === 0) {
                return res.status(404).send('No publications applied for approval.');
            }

            // Modify the proofOfPublication path if it exists
            publicationsResults.forEach(pub => {
                if (pub.proofOfPublication) {
                    pub.proofOfPublication = `${pub.proofOfPublication.replace(/\\/g, '/')}`;
                }
            });

            // Send the publications as a JSON response
            res.json(publicationsResults);
        });
    });
});


// Route to approve a publication
app.put('/approvePublication/:id', (req, res) => {
    const publicationId = req.params.id;

    const query = 'UPDATE publications SET status = ? WHERE publication_id = ?';

    db.query(query, ['Approved by Department R&D Coordinator', publicationId], (err, result) => {
        if (err) {
            // Log the error for debugging
            console.error('Error during approval:', err);
            return res.status(500).json({ error: 'Failed to approve publication' });
        }

        if (result.affectedRows > 0) {
            // Successfully updated publication
            return res.status(200).json({ message: 'Publication approved successfully' });
        } else {
            // If no rows were affected, the publication ID might be invalid
            return res.status(404).json({ error: 'Publication not found' });
        }
    });
});
app.put('/rejectPublication/:publicationId', (req, res) => {
    const publicationId = req.params.publicationId;
    const rejectionReason = req.body.rejectionReason;  // Get the rejection reason from the request body

    // Check if the rejectionReason is empty or undefined
    if (!rejectionReason) {
        return res.status(400).json({ message: 'Rejection reason is required' });
    }

    // SQL query to update the status and rejection reason
    const query = 'UPDATE publications SET status = ?, rejection_reason = ? WHERE publication_id = ?';

    db.query(query, ['Rejected by Department R&D Coordinator', rejectionReason, publicationId], (error, result) => {
        if (error) {
            console.error('Error during rejection:', error);
            return res.status(500).json({ message: 'Failed to reject publication' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Publication not found' });
        }

        res.status(200).json({ message: 'Publication rejected successfully' });
    });
});

app.get('/getAllPatents', (req, res) => {
    const coordinatorId = req.query.coordinatorid;  // Get coordinatorId from the request query

    if (!coordinatorId) {
        return res.status(400).send('Coordinator ID is required.');
    }

    // Step 1: Fetch the coordinator's department
    const coordinatorDepartmentQuery = `
        SELECT department
        FROM depcorlogin
        WHERE coordinatorid = ?;
    `;
    db.query(coordinatorDepartmentQuery, [coordinatorId], (err, coordinatorResults) => {
        if (err) {
            console.error('Error fetching coordinator department:', err);
            return res.status(500).send('Error fetching coordinator department.');
        }

        if (coordinatorResults.length === 0) {
            return res.status(404).send('Coordinator not found.');
        }

        const coordinatorDepartment = coordinatorResults[0].department;

        // Step 2: Fetch publications where status is "Applied" and faculty department matches the coordinator's department
        const patentsQuery = `
                SELECT p.*
                FROM patents p
                JOIN faculty f ON p.faculty_id = f.faculty_id
                WHERE p.status IN ('Applied')
                AND f.department = ?;`;
        db.query(patentsQuery, [coordinatorDepartment], (err, patentsResults) => {
            if (err) {
                console.error('Error fetching patents:', err);
                return res.status(500).send('Error fetching patents.');
            }

            if (patentsResults.length === 0) {
                return res.status(404).send('No patents applied for approval.');
            }

            // Modify the proofOfPublication path if it exists
            patentsResults.forEach(pub => {
                if (pub.proofOfPatent) {
                    pub.proofOfPatent = `${pub.proofOfPatent.replace(/\\/g, '/')}`;
                }
            });

            // Send the publications as a JSON response
            res.json(patentsResults);
        });
    });
});


// Route to approve a publication
app.put('/approvePatent/:id', (req, res) => {
    const patentId = req.params.id;

    const query = 'UPDATE patents SET status = ? WHERE patent_id = ?';

    db.query(query, ['Approved by Department R&D Coordinator', patentId], (err, result) => {
        if (err) {
            // Log the error for debugging
            console.error('Error during approval:', err);
            return res.status(500).json({ error: 'Failed to approve patent' });
        }

        if (result.affectedRows > 0) {
            // Successfully updated publication
            return res.status(200).json({ message: 'Patent approved successfully' });
        } else {
            // If no rows were affected, the publication ID might be invalid
            return res.status(404).json({ error: 'Patent not found' });
        }
    });
});
app.put('/rejectPatent/:patentId', (req, res) => {
    const patentId = req.params.patentId;
    const rejectionReason = req.body.rejectionReason;  // Get the rejection reason from the request body

    // Check if the rejectionReason is empty or undefined
    if (!rejectionReason) {
        return res.status(400).json({ message: 'Rejection reason is required' });
    }

    // SQL query to update the status and rejection reason
    const query = 'UPDATE patents SET status = ?, rejection_reason = ? WHERE patent_id = ?';

    db.query(query, ['Rejected by Department R&D Coordinator', rejectionReason, patentId], (error, result) => {
        if (error) {
            console.error('Error during rejection:', error);
            return res.status(500).json({ message: 'Failed to reject patent' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Patent not found' });
        }

        res.status(200).json({ message: 'Patent rejected successfully' });
    });
});

app.post("/institute_coordinator_login", (req, res) => {
    const { coordinatorid, password } = req.body;
  
    const sql = "SELECT * FROM InstituteCoordinators WHERE coordinatorid = ?";
    db.query(sql, [coordinatorid], async (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });
  
      if (result.length === 0) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      if (!password) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }
  
      res.json({ success: true, coordinatorid: result[0].coordinatorid });
    });
  });
  
  app.get("/getAllPublicationsOfInst", (req, res) => {
    const sql = `
        SELECT * FROM publications 
        WHERE status = 'Approved by Department R&D Coordinator'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        res.json(results);
    });
});

app.put("/approvePublicationOfInst/:publicationId", (req, res) => {
    const { publicationId } = req.params;

    if (!publicationId) {
        return res.status(400).json({ success: false, message: "Publication ID is required" });
    }

    const sql = `
        UPDATE publications 
        SET status = 'Approved by Institute R&D Coordinator' 
        WHERE publication_id = ?
    `;

    db.query(sql, [publicationId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Publication not found" });
        }
        res.json({ success: true, message: "Publication approved successfully" });
    });
});
app.put("/rejectPublicationOfInst/:publicationId", (req, res) => {
    const { publicationId } = req.params;
    const { rejectionReason } = req.body;

    if (!publicationId || !rejectionReason.trim()) {
        return res.status(400).json({ success: false, message: "Publication ID and rejection reason are required" });
    }

    const sql = `
        UPDATE publications 
        SET status = 'Rejected by Institute R&D Coordinator', rejection_reason = ? 
        WHERE publication_id = ?
    `;

    db.query(sql, [rejectionReason, publicationId], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Publication not found" });
        }
        res.json({ success: true, message: "Publication rejected successfully" });
    });
});

app.get("/getAllPatentsbyInst", (req, res) => {
    const sql = `
        SELECT * FROM patents 
        WHERE status = 'Approved by Department R&D Coordinator'
    `;

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        res.json(results);
    });
});
app.put("/approvePatentbyInst/:patent_id", (req, res) => {
    const { patent_id } = req.params;

    if (!patent_id) {
        return res.status(400).json({ success: false, message: "Patent ID is required" });
    }

    const sql = `
        UPDATE patents
        SET status = 'Approved by Institute R&D Coordinator' 
        WHERE patent_id = ?
    `;

    db.query(sql, [patent_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Patent not found" });
        }
        res.json({ success: true, message: "Patent approved successfully" });
    });
});
app.put("/rejectPatentbyInst/:patent_id", (req, res) => {
    const { patent_id } = req.params;
    const { rejectionReason } = req.body;

    if (!patent_id || !rejectionReason.trim()) {
        return res.status(400).json({ success: false, message: "Patent ID and rejection reason are required" });
    }

    const sql = `
        UPDATE patents 
        SET status = 'Rejected by Institute R&D Coordinator', rejection_reason = ? 
        WHERE patent_id = ?
    `;

    db.query(sql, [rejectionReason, patent_id], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Patent not found" });
        }
        res.json({ success: true, message: "Patent rejected successfully" });
    });
});

// Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
