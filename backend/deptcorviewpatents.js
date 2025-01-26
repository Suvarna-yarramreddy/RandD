const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection Setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Suvarna@123', // Use .env for password handling in production
    database: 'faculty_db', // Use .env for database name
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
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
                WHERE p.status IN ('filed', 'granted', 'published')
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


// Start the server
const PORT = 4002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
