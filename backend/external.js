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

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Suvarna@123",  // Use .env for security
    database: "faculty_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/fundedProjects/';
        
        if (!fs.existsSync('./uploads')) {
            fs.mkdirSync('./uploads', { recursive: true });
        }

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Route to Add Externally Funded Project
app.post("/addFundedProject", upload.array("proof", 5), (req, res) => {
    const {
        faculty_id,
        financialYear,
        applicationNumber,
        agency,
        scheme,
        piName,
        piDept,
        piContact,
        piEmail,
        copiName,
        copiDept,
        copiContact,
        copiEmail,
        duration,
        title,
        status,
        startDate,
        objectives,
        outcomes,
        amountApplied,
        amountReceived,
        amountSanctioned
    } = req.body;

    let proofUrls = req.files.map(file => `uploads/fundedProjects/${file.filename}`);

    const query = `INSERT INTO FundedProjects (faculty_id, financialYear, applicationNumber, agency, scheme, 
        piName, piDept, piContact, piEmail, copiName, copiDept, copiContact, copiEmail, duration, 
        title, status, startDate, objectives, outcomes, amountApplied, amountReceived, amountSanctioned, proof)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    db.query(query, [
        faculty_id, financialYear, applicationNumber, agency, scheme, 
        piName, piDept, piContact, piEmail, copiName, copiDept, copiContact, copiEmail, duration, 
        title, status, startDate, objectives, outcomes, amountApplied, amountReceived, amountSanctioned,
        JSON.stringify(proofUrls)
    ], (err, result) => {
        if (err) {
            console.error("Error inserting funded project:", err);
            return res.status(500).send("Error inserting funded project.");
        }
        res.status(200).json({ message: "Funded project added successfully", projectId: result.insertId });
    });
});

// Route to Get Funded Projects by Faculty ID
app.get("/getFundedProjects/:faculty_id", (req, res) => {
    const { faculty_id } = req.params;

    const query = `SELECT * FROM FundedProjects WHERE faculty_id = ?`;
    db.query(query, [faculty_id], (err, results) => {
        if (err) {
            console.error("Error fetching funded projects:", err);
            return res.status(500).send("Error fetching funded projects.");
        }
        if (results.length === 0) {
            return res.status(404).send("No funded projects found.");
        }

        // Parse JSON fields before sending response
        results.forEach(record => {
            try {
                record.proof = JSON.parse(record.proof || "[]");
            } catch (e) {
                console.error("Invalid JSON in proof:", record.proof);
                record.proof = [];
            }
        });

        res.json(results);
    });
});

// Route to Update Funded Project
app.put("/updateFundedProject/:id", upload.array("proof", 5), (req, res) => {
    const { id } = req.params;
    const {
        faculty_id,
        financialYear,
        applicationNumber,
        agency,
        scheme,
        piName,
        piDept,
        piContact,
        piEmail,
        copiName,
        copiDept,
        copiContact,
        copiEmail,
        duration,
        title,
        status,
        startDate,
        objectives,
        outcomes,
        amountApplied,
        amountReceived,
        amountSanctioned
    } = req.body;

    let proofUrls = req.files.length > 0 ? req.files.map(file => `uploads/fundedProjects/${file.filename}`) : null;

    // Fetch existing record
    const fetchQuery = `SELECT * FROM FundedProjects WHERE id = ?`;
    db.query(fetchQuery, [id], (err, results) => {
        if (err) {
            console.error("Error fetching funded project:", err);
            return res.status(500).send("Error fetching funded project.");
        }
        if (results.length === 0) {
            return res.status(404).send("Funded project not found.");
        }

        const existingData = results[0];

        const updateQuery = `UPDATE FundedProjects SET faculty_id=?, financialYear=?, applicationNumber=?, 
            agency=?, scheme=?, piName=?, piDept=?, piContact=?, piEmail=?, copiName=?, copiDept=?, 
            copiContact=?, copiEmail=?, duration=?, title=?, status=?, startDate=?, objectives=?, 
            outcomes=?, amountApplied=?, amountReceived=?, amountSanctioned=?, proof=?, updatedAt=CURRENT_TIMESTAMP 
            WHERE id=?`;

        db.query(updateQuery, [
            faculty_id || existingData.faculty_id,
            financialYear || existingData.financialYear,
            applicationNumber || existingData.applicationNumber,
            agency || existingData.agency,
            scheme || existingData.scheme,
            piName || existingData.piName,
            piDept || existingData.piDept,
            piContact || existingData.piContact,
            piEmail || existingData.piEmail,
            copiName || existingData.copiName,
            copiDept || existingData.copiDept,
            copiContact || existingData.copiContact,
            copiEmail || existingData.copiEmail,
            duration || existingData.duration,
            title || existingData.title,
            status || existingData.status,
            startDate || existingData.startDate,
            objectives || existingData.objectives,
            outcomes || existingData.outcomes,
            amountApplied || existingData.amountApplied,
            amountReceived || existingData.amountReceived,
            amountSanctioned || existingData.amountSanctioned,
            JSON.stringify(proofUrls || JSON.parse(existingData.proof || "[]")),
            id
        ], (updateErr) => {
            if (updateErr) {
                console.error("Error updating funded project:", updateErr);
                return res.status(500).send("Error updating funded project.");
            }
            res.status(200).send("Funded project updated successfully.");
        });
    });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = 5003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
