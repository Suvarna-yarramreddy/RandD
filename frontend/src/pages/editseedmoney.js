import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditSeedMoney = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { application } = location.state || {};
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [formData, setFormData] = useState(application ? { ...application } : {
        projectTitle: "",
        financialYear: "",
        facultyName: "",
        department: "",
        numStudents: "",
        amountSanctioned: "",
        amountReceived: "",
        objectives: "",
        outcomes: "",
        students: [],
        proof: []
    });
    const [deletedFiles, setDeletedFiles] = useState([]);

const handleFileDelete = (index) => {
    const updatedProofs = [...formData.proof];
    const removedFile = updatedProofs.splice(index, 1)[0];

    // Track deleted files
    setDeletedFiles(prevDeleted => [...prevDeleted, removedFile]);

    setFormData(prevState => ({
        ...prevState,
        proof: updatedProofs
    }));
};

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        setSelectedFiles([...selectedFiles, ...e.target.files]);
    };


    const handleStudentChange = (index, e) => {
        const { name, value } = e.target;
        const updatedStudents = [...formData.students];
        updatedStudents[index] = { ...updatedStudents[index], [name]: value };
        setFormData(prevState => ({
            ...prevState,
            students: updatedStudents
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
    
        // Append form fields (excluding proof)
        Object.keys(formData).forEach(key => {
            if (key !== "proof" && key !== "students") {
                data.append(key, formData[key]);
            }
        });
    
        // Handle amountReceived as null if nothing is provided
        if (!formData.amountReceived) {
            data.append("amountReceived", null);
        } else {
            data.append("amountReceived", formData.amountReceived);
        }
    
        // ✅ Append students safely
        data.append("students", JSON.stringify(formData.students));
    
        // ✅ Append deleted proofs safely
        data.append("deletedProofs", JSON.stringify(deletedFiles));
    
        // ✅ Append new proof files
        selectedFiles.forEach(file => {
            data.append("proof", file);
        });
    
        try {
            const response = await fetch(`http://localhost:5000/updateSeedMoney/${application.id}`, {
                method: "PUT",
                body: data,
            });
    
            if (!response.ok) {
                throw new Error("Failed to update application");
            }
    
            alert("Application updated successfully");
            navigate("/viewseedmoney");
        } catch (error) {
            console.error("Error updating application:", error);
        }
    };
    

    // Fields to be displayed
    const fields = [
        { name: "projectTitle", label: "Project Title", type: "text" },
        { name: "financialYear", label: "Financial Year", type: "text" },
        { name: "facultyName", label: "Faculty Name", type: "text" },
        { name: "department", label: "Department", type: "text" },
        { name: "numStudents", label: "Number of Students", type: "number" },
        { name: "amountSanctioned", label: "Amount Sanctioned", type: "number" },
        { name: "amountReceived", label: "Amount Received", type: "number" },
        { name: "objectives", label: "Objectives", type: "textarea" },
        { name: "outcomes", label: "Expected Outcomes", type: "textarea" }
    ];

    return (
        <div className="container mt-4">
            <h2 className="text-center text-dark mb-4">Edit Seed Money Application</h2>
            <form onSubmit={handleSubmit}>
                
                {/* Form Fields (Always 2 per row) */}
                <div className="row">
                    {fields.map((field, index) => (
                        <div className="col-md-6 mb-3" key={index}>
                            <label className="form-label"><strong>{field.label}</strong></label>
                            {field.type === "textarea" ? (
                                <textarea name={field.name} className="form-control" value={formData[field.name] || ""} onChange={handleChange}  />
                            ) : (
                                <input type={field.type} name={field.name} className="form-control" value={formData[field.name] || ""} onChange={handleChange}/>
                            )}
                        </div>
                    ))}
                </div>

                {/* Students Section (Always 2 per row) */}
                {formData.students.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label"><strong>Students Involved</strong></label>
                        <div className="row">
                            {formData.students.map((student, index) => (
                                <div className="col-md-6 mb-3" key={index}>
                                    <div className="p-3 border rounded">
                                        <label className="form-label"><strong>Student {index + 1}</strong></label>
                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control mb-2"
                                            placeholder="Student Name"
                                            value={student.name || ""}
                                            onChange={(e) => handleStudentChange(index, e)}
                                        />
                                        <input
                                            type="text"
                                            name="registration"
                                            className="form-control"
                                            placeholder="Registration Number"
                                            value={student.registration || ""}
                                            onChange={(e) => handleStudentChange(index, e)}
                                        
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Proof Documents Section */}
                {formData.proof.length > 0 && (
                    <div className="mb-3">
                        <label className="form-label"><strong>Proof Documents</strong></label>
                        {formData.proof.map((file, index) => (
                            <div key={index} className="d-flex align-items-center">
                                <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                    View Proof {index + 1}
                                </a>
                                <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => handleFileDelete(index)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}

                {/* File Upload Input */}
                <div className="mb-3">
                    <label className="form-label"><strong>Upload Proof Documents</strong></label>
                    <input type="file" className="form-control" multiple onChange={handleFileChange} />
                </div>

                <button type="submit" className="btn btn-success">Update</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => navigate('/viewseedmoney')}>
                        Cancel
                    </button>
            </form>
        </div>
    );
};

export default EditSeedMoney;
