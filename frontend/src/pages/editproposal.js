import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditProposal = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const proposal = location.state?.proposal || {};  // Get project details from navigation state

    const [formData, setFormData] = useState({
        projectTitle: proposal.projectTitle || '',
        referenceNumber: proposal.referenceNumber || '',
        agencyScheme: proposal.agencyScheme || '',
        submissionYear :proposal.submissionYear||'',
        submissionDate: proposal.submissionDate ? proposal.submissionDate.split("T")[0] :'',
        piName: proposal.piName || '',
        piDepartment: proposal.piDepartment || '',
        piDesignation: proposal.piDesignation || '',
        piPhone: proposal.piPhone || '',
        piEmail: proposal.piEmail || '',
        amountRequested: proposal.amountRequested || '',
        projectStatus: proposal.projectStatus || ''
    });

    const labelMapping = {
        projectTitle: "Project Title",
        referenceNumber: "Reference Number",
        agencyScheme: "Agency/Scheme",
        submissionYear: "Submission Year",
        submissionDate: "Submission Date",
        piName: "Principal Investigator Name",
        piDepartment: "Department",
        piDesignation: "Designation",
        piPhone: "Phone Number",
        piEmail: "Email Address",
        amountRequested: "Amount Requested",
        projectStatus: "Project Status"
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure startDate is properly formatted
        const formattedsubmissionDate = formData.submissionDate
            ? new Date(formData.submissionDate).toISOString().split("T")[0] // Convert to YYYY-MM-DD
            : null;

        const updatedData = {
            ...formData,
            submissionDate: formattedsubmissionDate, // Use formatted date
        };

        try {
            const response = await fetch(`http://localhost:5000/updateProposal/${proposal.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData) // Send updatedData instead of formData
            });

            if (!response.ok) {
                throw new Error('Failed to update project');
            }

            alert('Project updated successfully!');
            navigate('/viewproposals'); // Redirect back to the projects page
        } catch (error) {
            console.error(error);
            alert('Error updating project');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Edit Proposal Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {Object.keys(formData).map((key) => (
                        <div className="col-md-6 mb-3" key={key}>
                            <label className="form-label">{labelMapping[key] || key}</label>
                            <input
                                type="text"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                    ))}
                </div>
                <div className="d-flex gap-2 mt-3 justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        Update 
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/viewproposals')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProposal;