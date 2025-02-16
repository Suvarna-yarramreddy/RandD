import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const EditPublicationsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pub = location.state?.publication || {}; // Safely get publication data

    const [formData, setFormData] = useState({ ...pub });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files.length > 0) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0], // Store the new file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    formDataToSend.append(key, value);
                }
            });

            const response = await fetch(
                `http://localhost:5000/update-publication/${pub.publication_id}`,
                {
                    method: "PUT",
                    body: formDataToSend,
                }
            );

            if (!response.ok) {
                const errorDetails = await response.json();
                console.error("Error details:", errorDetails);
                throw new Error("Failed to update publication");
            }

            const result = await response.json();
            console.log(result.message);
            navigate("/viewpublications");
        } catch (error) {
            console.error("Error updating publication:", error);
            alert(error.message || "Failed to update publication");
        }
    };

    const handleCancel = () => navigate("/viewpublications");

    // List of input fields dynamically generated
    const publicationFields = [
        "natureOfPublication",
        "typeOfPublication",
        "titleOfPaper",
        "nameOfJournalConference",
        "titleofChapter",
        "nameofbook",
        "nameOfPublisher",
        "quartile",
        "issnIsbn",
        "authorStatus",
        "firstAuthorName",
        "firstAuthorAffiliation",
        "coAuthors",
        "indexed",
        "impactFactor",
        "doi",
        "linkOfPaper",
        "scopusLink",
        "volume",
       "monthYear",
        "pageNo",
        "citeAs",
    ];

    return (
        <div className="container my-4">
            <h2>Edit Publication</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {publicationFields.map(
                        (field) =>
                            pub[field] !== undefined && (
                                <div key={field} className="col-md-6 mb-3">
                                    <label className="form-label">
                                        {field.replace(/([A-Z])/g, " $1").trim()}
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name={field}
                                        value={formData[field]}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            )
                    )}
                    
                    {/* Proof of Publication File Upload */}
                    <div className="col-md-6 mb-3">
                        <label className="form-label">Proof of Publication</label>
                        {pub.proofOfPublication && (
                            <div>
                              <a href={`http://localhost:5000/${pub.proofOfPublication}`} target="_blank" rel="noopener noreferrer">View Proof</a>
                            </div>
                        )}
                        <input
                            type="file"
                            className="form-control"
                            name="proofOfPublication"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>

                <div className="d-flex gap-2 mt-3 justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        Update 
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        Cancel
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditPublicationsPage;
