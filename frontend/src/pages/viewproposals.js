import React, { useState, useEffect } from 'react';

const ViewProposals = () => {
    const [proposals, setProposals] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    {proposals.map((proposal) => (
                        <div className="col-md-6 mb-4" key={proposal.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Project Title:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(proposal.id)}
                                                aria-expanded={visibleDetails === proposal.id}
                                                className="text-primary"
                                            >
                                                {proposal.projectTitle}
                                            </a>
                                        </h5>
                                    </div>
                                    {visibleDetails === proposal.id && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '250px' }}>
                                            {proposal.referenceNumber && <p><strong>Reference Number:</strong> {proposal.referenceNumber}</p>}
                                            {proposal.agencyScheme && <p><strong>Agency/Scheme:</strong> {proposal.agencyScheme}</p>}
                                            {proposal.submissionYear && <p><strong>Submission Year:</strong> {proposal.submissionYear}</p>}
                                            {proposal.submissionDate && <p><strong>Submission Date:</strong> {proposal.submissionDate}</p>}
                                            {proposal.piName && <p><strong>Principal Investigator:</strong> {proposal.piName}</p>}
                                            {proposal.piDepartment && <p><strong>PI Department:</strong> {proposal.piDepartment}</p>}
                                            {proposal.piDesignation && <p><strong>PI Designation:</strong> {proposal.piDesignation}</p>}
                                            {proposal.piPhone && <p><strong>PI Phone:</strong> {proposal.piPhone}</p>}
                                            {proposal.piEmail && <p><strong>PI Email:</strong> {proposal.piEmail}</p>}
                                            {proposal.amountRequested && <p><strong>Amount Requested:</strong> ₹{proposal.amountRequested}</p>}
                                            {proposal.projectStatus && <p><strong>Project Status:</strong> {proposal.projectStatus}</p>}
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