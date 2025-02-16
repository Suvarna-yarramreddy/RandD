import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditScholar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const scholarData = location.state?.scholar || {};
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const dateObj = new Date(dateString);
        if (isNaN(dateObj.getTime())) return ""; // Invalid date check
        return dateObj.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    };
    
    const [formData, setFormData] = useState({
        guideName: scholarData.guideName || '',
        guideDepartment: scholarData.guideDepartment || '',
        workTitle: scholarData.workTitle || '',
        scholarName: scholarData.scholarName || '',
        scholarDepartment: scholarData.scholarDepartment || '',
        admissionDate: scholarData.admissionDate ? formatDate(scholarData.admissionDate) : '',

        university: scholarData.university || '',
        admissionStatus: scholarData.admissionStatus || '',
        awardDate: scholarData.awardDate || '',
        fellowship: scholarData.fellowship || '',
        admissionLetter: scholarData.admissionLetter || null,
        guideAllotmentLetter: scholarData.guideAllotmentLetter || null,
        completionProceedings: scholarData.completionProceedings || null,
    });
   

    const [fileInputs, setFileInputs] = useState({
        admissionLetter: null,
        guideAllotmentLetter: null,
        completionProceedings: null,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFileInputs({ ...fileInputs, [name]: files[0] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append text data
        Object.entries(formData).forEach(([key, value]) => {
            if (value !== null && value !== '') {
                formDataToSend.append(key, value);
            }
        });

        // Append files if new files are selected
        Object.entries(fileInputs).forEach(([key, file]) => {
            if (file) {
                formDataToSend.append(key, file);
            }
        });

        try {
            const response = await fetch(`http://localhost:5000/updatescholar/${scholarData.id}`, {
                method: 'PUT',
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to update scholar details');
            }

            alert('Scholar details updated successfully!');
            navigate('/viewscholars');
        } catch (error) {
            console.error('Error updating scholar:', error);
            alert('Error updating scholar details.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Edit Scholar Details</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row row-cols-1 row-cols-md-2 g-3">
                {Object.entries(formData).map(([key, value]) =>
    !["admissionLetter", "guideAllotmentLetter", "completionProceedings"].includes(key) ? (
        <div key={key} className="col">
            <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
            <input
                type={key.includes("Date") ? "date" : "text"}
                className="form-control"
                name={key}
                value={value || ''}  // Ensure value is always a string
                onChange={handleChange}
                required={key !== "awardDate" && key !== "fellowship"}
            />
        </div>
    ) : null
)}


                    {/* File Upload Fields with Existing File Links */}
                    {["admissionLetter", "guideAllotmentLetter", "completionProceedings"].map((key) => (
                        <div key={key} className="col">
                            <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                            
                            {/* Show Existing File as "View File" */}
                            {formData[key] && (
                                <p>
                                  
                                    <a href={`http://localhost:5000/${formData[key]}`} target="_blank" rel="noopener noreferrer">
            View 
        </a>
                                </p>
                            )}

                            {/* File Upload Field */}
                            <input
                                type="file"
                                className="form-control"
                                name={key}
                                accept=".pdf,.doc,.docx,.jpg,.png"
                                onChange={handleFileChange}
                            />
                        </div>
                    ))}
                </div>
                <div className="d-flex gap-2 mt-3 justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        Update 
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/viewscholars')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditScholar;
