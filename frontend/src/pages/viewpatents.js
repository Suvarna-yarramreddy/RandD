import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PatentsPage = () => {
    const [patents, setPatents] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);

    const faculty_id = sessionStorage.getItem("faculty_id");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatents = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getpatents/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch patents');
                }
                const data = await response.json();
                setPatents(data);
            } catch (err) {
                console.error('Error fetching patents:', err);
            }
        };

        fetchPatents();
    }, [faculty_id]);

    const handleToggleDetails = (patentId) => {
        setVisibleDetails(visibleDetails === patentId ? null : patentId);
    };

    const handleEditClick = (patent) => {
        navigate('/editpatents', { state: { patents: patent } });
    };


    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Your Patents</h2>
            {patents.length > 0 ? (
                <div className="row">
                    {patents.map((pat) => (
                        <div className="col-md-6 mb-4" key={pat.patent_id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                <div className=" justify-content-between align-items-center mb-3">
                                    <h5 className="card-title">
                                        Title of Invention:&nbsp;
                                        <a
                                            href="#!"
                                            onClick={() => handleToggleDetails(pat.patent_id)}
                                            aria-expanded={visibleDetails === pat.patent_id}
                                            className="text-primary"
                                        >
                                            {pat.inventionTitle}
                                        </a>
                                    </h5>
                                    <div className="text-right">
                                            <strong>Status:</strong>
                                            <span className="text-dark ms-2">{pat.status}</span>

                                            {/* Conditionally display rejection reason */}
                                            {pat.status === 'Rejected by Department R&D Coordinator' && pat.rejection_reason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {pat.rejection_reason}
                                                </div>
                                            )}
                                            
                                            {/* Show "Edit" button only for rejected publications */}
                                            {pat.status === 'Rejected by Department R&D Coordinator' && (
                                                <button
                                                    className="btn btn-warning mt-2"
                                                    onClick={() => handleEditClick(pat)} // Handle edit button click
                                                >
                                                    Edit
                                                </button>
                                            )}
                                            {pat.status === 'Rejected by Institute R&D Coordinator' && pat.rejection_reason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {pat.rejection_reason}
                                                </div>
                                            )}
                                            {pat.status === 'Rejected by Institute R&D Coordinator' && (
                                                <button
                                                    className="btn btn-warning mt-2"
                                                    onClick={() => handleEditClick(pat)} // Handle edit button click
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>
                                        </div>
                                    {visibleDetails === pat.patent_id && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '200px' }}>
                                                {pat.category && <p><strong>Category:</strong> {pat.category}</p>}
                                                {pat.iprType && <p><strong>Type of IPR:</strong> {pat.iprType}</p>}
                                                {pat.applicationNumber && <p><strong>Application Number:</strong> {pat.applicationNumber}</p>}
                                                {pat.applicantName && <p><strong>Name of Applicant:</strong> {pat.applicantName}</p>}
                                                {pat.department && <p><strong>Department:</strong> {pat.department}</p>}
                                                {pat.numOfInventors && <p><strong>Number of Inventors:</strong> {pat.numOfInventors}</p>}
                                                {pat.inventors && <p><strong>Name of Inventors:</strong> {pat.inventors}</p>}
                                                {pat.filingDate && <p><strong>Date of Filing:</strong> {pat.filingDate.split('T')[0]}</p>}
                                                {pat.dateOfPublished && <p><strong>Date of Published:</strong> {pat.dateOfPublished.split('T')[0]}</p>}
                                                {pat.dateOfGranted && <p><strong>Date of Granted:</strong> {pat.dateOfGranted.split('T')[0]}</p>}

                                                {pat.status1 && <p><strong>status:</strong> {pat.status1}</p>}
                                                {pat.proofOfPatent && (
                                                    <p>
                                                        <strong>Proof of Patent:</strong>&nbsp;
                                                        <a href={`http://localhost:5000/${pat.proofOfPatent}`} target="_blank" rel="noopener noreferrer">
                                                            View Proof
                                                        </a>
                                                    </p>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No patents available.</p>
            )}
        </div>
    );
};

export default PatentsPage;
