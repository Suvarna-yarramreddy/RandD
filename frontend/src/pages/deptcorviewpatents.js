import React, { useState, useEffect } from 'react';

const CorViewPatents = () => {
    const [patents, setPatents] = useState([]);
    const [visiblepatent_id, setVisiblepatent_id] = useState(null); // Track which patlication's details are visible
    const [rejectionReason, setRejectionReason] = useState(''); // Store rejection reason
    const [patentToReject, setPatentToReject] = useState(null); // Track which patlication is being rejected
    const coordinatorId = sessionStorage.getItem("coordinatorid");
    useEffect(() => {
        const fetchPatents = async () => {
            if (!coordinatorId) {
                console.error('Coordinator ID is undefined');
                return;
            }
            try {
                const response = await fetch(`http://localhost:5000/getAllPatents?coordinatorid=${coordinatorId}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('Error response:', errorText);
                    throw new Error('Failed to fetch patents');
                }
                const data = await response.json();
                setPatents(data);
            } catch (error) {
                console.error('Error fetching patents:', error);
            }
        };
        fetchPatents();
    }, [coordinatorId]);
    

    // Toggle visibility of patlication details
    const togglePatentDetails = (patent_id) => {
        if (visiblepatent_id === patent_id) {
            setVisiblepatent_id(null); // Hide details if the same card is clicked
        } else {
            setVisiblepatent_id(patent_id); // Show clicked patlication's details
        }
    };

    // Approve the patlication and update the database
    const approvePatent = async (patent_id) => {
        try {
            const response = await fetch(`http://localhost:5000/approvePatent/${patent_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to approve patent');
            }

            // Remove the patlication from the list after approval
            setPatents(patents.filter(pat => pat.patent_id !== patent_id));
        } catch (error) {
            console.error('Error approving patent:', error);
        }
    };

    // Reject the patlication and update the database with the rejection reason
    const rejectPatent = async (patent_id) => {
        if (!rejectionReason.trim()) { // Check if rejection reason is empty or just spaces
            alert('Please provide a reason for rejection');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/rejectPatent/${patent_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason }),  // Pass rejectionReason directly
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Error response:', errorText);
                throw new Error('Failed to reject patent');
            }

            // If the rejection is successful, remove the rejected patlication from the list
            setPatents(patents.filter(pat => pat.patent_id !== patent_id));

            // Reset rejection reason and patlication to reject state
            setRejectionReason('');
            setPatentToReject(null);
        } catch (error) {
            console.error('Error rejecting patent:', error);
        }
    };

    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Patents Pending Approval</h2>
            {patents.length > 0 ? (
                <div className="row">
                    {patents.map(pat => (
                        <div className="col-md-6 mb-4" key={pat.patent_id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Title of Invention:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => togglePatentDetails(pat.patent_id)}
                                                className="text-primary"
                                            >
                                                {pat.inventionTitle}
                                            </a>
                                        </h5>
                                        <span className="badge bg-info text-dark">{pat.status1}</span>
                                    </div>

                                    {/* Only show details for the clicked patlication */}
                                    {visiblepatent_id === pat.patent_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                {pat.category && <p><strong>Category:</strong> {pat.category}</p>}
                                                {pat.iprType && <p><strong>Type of IPR:</strong> {pat.iprType}</p>}
                                                {pat.applicationNumber && <p><strong>Application Number:</strong> {pat.applicationNumber}</p>}
                                                {pat.applicantName && <p><strong>Name of Applicant:</strong> {pat.applicantName}</p>}
                                                {pat.department && <p><strong>Department:</strong> {pat.department}</p>}
                                                {pat.filingDate && <p><strong>Date of Filing:</strong> {pat.filingDate.split('T')[0]}</p>}
                                                {pat.dateOfPublished && <p><strong>Date of Published:</strong> {pat.dateOfPublished.split('T')[0]}</p>}
                                                {pat.dateOfGranted && <p><strong>Date of Granted:</strong> {pat.dateOfGranted.split('T')[0]}</p>}

                                                {pat.numOfInventors && <p><strong>Number of Inventors:</strong> {pat.numOfInventors}</p>}
                                                {pat.inventors && <p><strong>Name of Inventors:</strong> {pat.inventors}</p>}
                                                
                                                {pat.proofOfPatent && (
                                                    <p>
                                                        <strong>Proof of Patent:</strong>&nbsp;
                                                        <a href={`http://localhost:5000/${pat.proofOfPatent}`} target="_blank" rel="noopener noreferrer">
                                                            View Proof
                                                        </a>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="text-center mt-3">
                                    <button 
                                        className="btn btn-success w-49 mb-3" 
                                        onClick={() => approvePatent(pat.patent_id)}
                                    >
                                        Approve
                                    </button>

                                    {/* Reject button */}
                                    <button 
                                        className="btn btn-danger w-49 mb-3 ms-2" 
                                        onClick={() => setPatentToReject(pat.patent_id)} // Set the patlication ID to reject
                                    >
                                        Reject
                                    </button>
                                </div>

                                {/* If patlication is being rejected, show a text field for rejection reason */}
                                                                {patentToReject === pat.patent_id && (
                                    <div className="mt-3">
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={rejectionReason}
                                            onChange={(e) => setRejectionReason(e.target.value)}
                                            placeholder="Enter reason for rejection"
                                        />
                                        <div className="d-flex gap-2 mt-2">
                                            <button 
                                                className="btn btn-danger w-50" 
                                                onClick={() => rejectPatent(pat.patent_id)}
                                            >
                                                Submit Rejection
                                            </button>
                                            <button 
                                                className="btn btn-secondary w-50" 
                                                onClick={() => setPatentToReject(null)} // Cancel rejection
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No patents available for approval.</p>
            )}
        </div>
    );
};

export default CorViewPatents;
