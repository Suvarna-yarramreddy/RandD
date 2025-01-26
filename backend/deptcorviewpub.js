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


// Start the server
const PORT = 4001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
