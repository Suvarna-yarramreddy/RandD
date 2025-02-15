import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditFundedProject = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const project = location.state?.project || {};  // Get project details from navigation state

    const [formData, setFormData] = useState({
        title: project.title || '',
        financialYear: project.financialYear || '',
        applicationNumber: project.applicationNumber || '',
        status :project.status||'',
        agency: project.agency || '',
        scheme: project.scheme || '',
        piName: project.piName || '',
        piDept: project.piDept || '',
        piContact: project.piContact || '',
        piEmail: project.piEmail || '',
        copiName: project.copiName || '',
        copiDept: project.copiDept || '',
        copiContact: project.copiContact || '',
        copiEmail: project.copiEmail || '',
        duration: project.duration || '',
        startDate: project.startDate ? project.startDate.split("T")[0] : '',  // Convert to YYYY-MM-DD
        objectives: project.objectives || '',
        outcomes: project.outcomes || '',
        amountApplied: project.amountApplied || '',
        amountReceived: project.amountReceived || '',
        amountSanctioned: project.amountSanctioned || '',
        totalExpenditure: project.totalExpenditure || ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure startDate is properly formatted
        const formattedStartDate = formData.startDate
            ? new Date(formData.startDate).toISOString().split("T")[0] // Convert to YYYY-MM-DD
            : null;

        const updatedData = {
            ...formData,
            startDate: formattedStartDate, // Use formatted date
        };

        try {
            const response = await fetch(`http://localhost:5000/updateFundedProject/${project.id}`, {
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
            navigate('/viewprojects'); // Redirect back to the projects page
        } catch (error) {
            console.error(error);
            alert('Error updating project');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Edit Funded Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {Object.keys(formData).map((key) => (
                        <div className="col-md-6 mb-3" key={key}>
                            <label className="form-label">{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
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
                <div className="text-center mt-3">
                    <button type="submit" className="btn btn-success">Update Project</button>
                    <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/viewprojects')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditFundedProject;
