import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const ViewProposals = () => {
    const [proposals, setProposals] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Initialize useNavigate

    const faculty_id = sessionStorage.getItem("faculty_id");

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getProposals/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch proposals');
                }
                const data = await response.json();
                setProposals(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProposals();
    }, [faculty_id]);

    const handleToggleDetails = (id) => {
        setVisibleDetails(visibleDetails === id ? null : id);
    };

    // Navigate to edit proposal page with ID
    const handleEdit = (proposal) => {
        navigate("/editproposal",{ state: {proposal } }); // Pass ID as route parameter
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this Project Proposal?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/deleteproposal/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete proposal');
            }

            setProposals(proposals.filter(proj => proj.id !== id));
            alert("Project proposal deleted successfully!");
        } catch (error) {
            console.error('Error deleting proposal:', error);
            alert("Failed to delete the project proposal.");
        }
    };
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Project Proposals</h2>
            {proposals.length > 0 ? (
                <div className="row">
                    {proposals.map((prop) => (
                        <div className="col-md-6 mb-4" key={prop.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Project Title:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(prop.id)}
                                                aria-expanded={visibleDetails === prop.id}
                                                className="text-primary"
                                            >
                                                {prop.projectTitle}
                                            </a>
                                        </h5>
                                        <div className="d-flex gap-2">
                                        <button className="btn btn-warning mt-2" onClick={() => handleEdit(prop)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-danger mt-2" onClick={() => handleDelete(prop.id)}>
                                                Delete
                                            </button>
                                            </div>
                                    </div>
                                    {visibleDetails === prop.id && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '250px' }}>
                                            {prop.referenceNumber && <p><strong>Reference Number:</strong> {prop.referenceNumber}</p>}
                                            {prop.agencyScheme && <p><strong>Agency/Scheme:</strong> {prop.agencyScheme}</p>}
                                            {prop.submissionYear && <p><strong>Submission Year:</strong> {prop.submissionYear}</p>}
                                            {prop.submissionDate && <p><strong>Submission Date:</strong> {prop.submissionDate}</p>}
                                            {prop.piName && <p><strong>PI Name:</strong> {prop.piName}</p>}
                                            {prop.piDepartment && <p><strong>PI Department:</strong> {prop.piDepartment}</p>}
                                            {prop.piDesignation && <p><strong>PI Designation:</strong> {prop.piDesignation}</p>}
                                            {prop.piPhone && <p><strong>PI Phone:</strong> {prop.piPhone}</p>}
                                            {prop.piEmail && <p><strong>PI Email:</strong> {prop.piEmail}</p>}
                                            {prop.amountRequested && <p><strong>Amount Requested:</strong> ₹{prop.amountRequested}</p>}
                                            {prop.projectStatus && <p><strong>Project Status:</strong> {prop.projectStatus}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No proposals available.</p>
            )}
        </div>
    );
};

export default ViewProposals;