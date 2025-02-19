import React, { useState, useEffect } from 'react';

const InstViewProposals = () => {
    const [proposals, setProposals] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);

    useEffect(() => {
        const fetchProposals = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getProposalsByCoordinator`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch proposals');
                }
                const data = await response.json();
                setProposals(data);
            } catch (err) {
                console.log(err.message);
            } 
        };

        fetchProposals();
    }, []);

    const handleToggleDetails = (id) => {
        setVisibleDetails(visibleDetails === id ? null : id);
    };


    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Institute-Wise Proposals</h2>
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
                <p className="text-center text-muted">No proposals available for your department.</p>
            )}
        </div>
    );
};

export default InstViewProposals;
