import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditSeedMoney = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const application = location.state?.application || {};

    const [formData, setFormData] = useState({
        financialYear: application.financialYear || '',
        facultyName: application.facultyName || '',
        department: application.department || '',
        numStudents: application.numStudents || '',
        projectTitle: application.projectTitle || '',
        amountSanctioned: application.amountSanctioned || '',
        amountReceived: application.amountReceived || '',
        objectives: application.objectives || '',
        outcomes: application.outcomes || '',
        students: Array.isArray(application.students) ? application.students : [{ registration: '', name: '' }],
        proof: Array.isArray(application.proof) ? application.proof : []
    });

    const [newProofFiles, setNewProofFiles] = useState([]); // To store new uploaded files

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle proof file uploads
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewProofFiles(files);
    };

    // Handle student data changes
    const handleStudentChange = (index, field, value) => {
        const updatedStudents = [...formData.students];
        updatedStudents[index][field] = value;
        setFormData({ ...formData, students: updatedStudents });
    };

    // Add a new student field
    const addStudent = () => {
        setFormData({ ...formData, students: [...formData.students, { registration: '', name: '' }] });
    };

    // Remove a student
    const removeStudent = (index) => {
        const updatedStudents = formData.students.filter((_, i) => i !== index);
        setFormData({ ...formData, students: updatedStudents });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append text fields
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "students" && key !== "proof") {
                formDataToSend.append(key, value);
            }
        });

        // Append students as JSON
        formDataToSend.append("students", JSON.stringify(formData.students));

        // Append new proof files
        newProofFiles.forEach(file => {
            formDataToSend.append("proof", file);
        });

        try {
            const response = await fetch(`http://localhost:5000/updateseedmoney/${application.id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Failed to update application");

            alert("Seed money application updated successfully!");
            navigate('/viewseedmoney');
        } catch (error) {
            console.error("Error updating application:", error);
            alert("Error updating seed money application.");
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Edit Seed Money Application</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row row-cols-1 row-cols-md-2 g-3">
                    {/* Input Fields */}
                    {["financialYear", "facultyName", "department", "numStudents", "projectTitle", "amountSanctioned", "amountReceived", "objectives", "outcomes"].map((key) => (
                        <div key={key} className="col">
                            <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                            <input
                                type={key.includes("amount") ? "number" : "text"}
                                className="form-control"
                                name={key}
                                value={formData[key]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}

                    {/* Students Section */}
                    <div className="col-12">
                        <label className="form-label"><strong>Students Involved</strong></label>
                        {formData.students.map((student, index) => (
                            <div key={index} className="d-flex gap-2 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Registration Number"
                                    value={student.registration}
                                    onChange={(e) => handleStudentChange(index, "registration", e.target.value)}
                                    required
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Student Name"
                                    value={student.name}
                                    onChange={(e) => handleStudentChange(index, "name", e.target.value)}
                                    required
                                />
                                {index > 0 && (
                                    <button type="button" className="btn btn-danger" onClick={() => removeStudent(index)}>X</button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="btn btn-secondary mt-2" onClick={addStudent}>+ Add Student</button>
                    </div>

                    {/* Existing Proof Documents */}
                    <div className="col-12">
                        <label className="form-label"><strong>Existing Proof Documents</strong></label>
                        {formData.proof.length > 0 ? (
                            formData.proof.map((file, index) => (
                                <p key={index}>
                                    <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                        View Proof {index + 1}
                                    </a>
                                </p>
                            ))
                        ) : (
                            <p>No proof documents uploaded</p>
                        )}
                    </div>

                    {/* Upload New Proof Files */}
                    <div className="col-12">
                        <label className="form-label"><strong>Upload New Proof Documents</strong></label>
                        <input
                            type="file"
                            className="form-control"
                            multiple
                            accept=".pdf,.doc,.docx,.jpg,.png"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3 justify-content-center">
                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/viewseedmoney')}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default EditSeedMoney;
