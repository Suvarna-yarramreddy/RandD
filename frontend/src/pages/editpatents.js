import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditPatentsPage = () => {
   const location = useLocation();
       const navigate = useNavigate();
       const pat = location.state.patents; // Get the patlication data passed via state
   
       const [formData, setFormData] = useState({
           ...pat // Set initial form data with the patlication details
       });
   
       const handleInputChange = (e) => {
           const { name, value } = e.target;
           setFormData(prev => ({ ...prev, [name]: value }));
       };
       const handleFileChange = (e) => {
           const { name, files } = e.target;
           if (files.length > 0) {
               setFormData(prev => ({
                   ...prev,
                   [name]: files[0], // Update with the new file
               }));
           }
       };
       const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Form Data:", formData); // Debugging log
    
        try {
            const formDataToSend = new FormData();
            for (const [key, value] of Object.entries(formData)) {
                if (value !== undefined && value !== null) {
                        formDataToSend.append(key, value);
                    }
            }
    
            console.log("Sending to API:", formDataToSend); // Debugging log
    
            const response = await fetch(`http://localhost:5000/update-patent/${pat.patent_id}`, {
                method: 'PUT',
                body: formDataToSend,
            });
    
    
            if (!response.ok) {
                const errorDetails = await response.json();
                console.error('Server Error:', errorDetails);
                alert(`Failed to update patent`);
                return;
            }
    
            const result = await response.json();
            console.log(result.message);
            alert("Patent updated successfully!");
            navigate('/viewpatents');
        } catch (error) {
            console.error('Error updating patent:', error);
            alert(error.message || 'Failed to update patent');
        }
    };
    
       
       const handleCancel = () => {
           navigate('/viewpatents'); // Navigate to view patlications page on cancel
       };
    return (
        <div className="container my-4">
            <h2>Edit Patent</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {pat.category && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Category</label>
                            <input
                                type="text"
                                className="form-control"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.iprType && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Type of IPR</label>
                            <input
                                type="text"
                                className="form-control"
                                name="iprType"
                                value={formData.iprType}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.applicationNumber && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Application Number</label>
                            <input
                                type="text"
                                className="form-control"
                                name="applicationNumber"
                                value={formData.applicationNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.applicantName && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Applicant Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="applicantName"
                                value={formData.applicantName}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.department && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Department</label>
                            <input
                                type="text"
                                className="form-control"
                                name="department"
                                value={formData.department}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.filingDate && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Filing Date</label>
                            <input
                                type="text"
                                className="form-control"
                                name="filingDate"
                                value={formData.filingDate.split('T')[0]}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.inventionTitle && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Invention Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="inventionTitle"
                                value={formData.inventionTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.numOfInventors && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Num Of Inventors</label>
                            <input
                                type="text"
                                className="form-control"
                                name="numOfInventors"
                                value={formData.numOfInventors}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.inventors && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Inventors</label>
                            <input
                                type="text"
                                className="form-control"
                                name="inventors"
                                value={formData.inventors}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.status1 && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Status</label>
                            <input
                                type="text"
                                className="form-control"
                                name="status1"
                                value={formData.status1}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.dateOfPublished && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Date Of published</label>
                            <input
                                type="text"
                                className="form-control"
                                name="dateOfPublished"
                                value={formData.dateOfPublished.split('T')[0]}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                    {pat.dateOfGranted && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Date Of Granted</label>
                            <input
                                type="text"
                                className="form-control"
                                name="dateOfGranted"
                                value={formData.dateOfGranted.split('T')[0]}
                                onChange={handleInputChange}
                            />
                        </div>
                    )}
                   
                    {pat.proofOfPatent && (
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Proof of Patent</label>
                            <div>
                                <small>Existing file:</small>
                            <a href={`http://localhost:5000/${pat.proofOfPatent}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                            </div>
                            <input
                                type="file"
                                className="form-control"
                                name="proofOfPatent"
                                onChange={handleFileChange}
                            />
                        </div>
                    )}
                </div>

                <button type="submit" className="btn btn-primary">Save Changes</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default EditPatentsPage;
