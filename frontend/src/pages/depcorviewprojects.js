import React, { useState, useEffect } from 'react';

const CorFundedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);

    const coordinatorId = sessionStorage.getItem("coordinatorid");
    useEffect(() => {
        const fetchFundedProjects = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getAllFundedProjects?coordinatorid=${coordinatorId}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch funded projects');
                }
                const data = await response.json();
                setProjects(data);
            } catch (err) {
                console.log(err.message);
            } 
        };
    
        if (coordinatorId) {
            fetchFundedProjects();
        }
    }, [coordinatorId]);
    

    const handleToggleDetails = (id) => {
        setVisibleDetails(visibleDetails === id ? null : id);
    };


    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Department-Wise Externally Funded Projects</h2>
            {projects.length > 0 ? (
                <div className="row">
                    {projects.map((proj) => (
                        <div className="col-md-6 mb-4" key={proj.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Project Title:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(proj.id)}
                                                aria-expanded={visibleDetails === proj.id}
                                                className="text-primary"
                                            >
                                                {proj.title}
                                            </a>
                                        </h5>
                                        <div className="text-right">
                                            <strong>Status:</strong>
                                            <span className="text-dark ms-2">{proj.status}</span>
                                            {proj.status === 'Rejected' && proj.rejection_reason && (
                                                <div className="mt-2">
                                                    <strong>Reason:</strong> {proj.rejection_reason}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {visibleDetails === proj.id && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '250px' }}>
                                            {proj.financialYear && <p><strong>Financial Year:</strong> {proj.financialYear}</p>}
                                            {proj.applicationNumber && <p><strong>Application Number:</strong> {proj.applicationNumber}</p>}
                                            {proj.agency && <p><strong>Funding Agency:</strong> {proj.agency}</p>}
                                            {proj.scheme && <p><strong>Scheme:</strong> {proj.scheme}</p>}
                                            {proj.piName && <p><strong>Principal Investigator:</strong> {proj.piName}</p>}
                                            {proj.piDept && <p><strong>PI Department:</strong> {proj.piDept}</p>}
                                            {proj.piContact && <p><strong>PI Contact:</strong> {proj.piContact}</p>}
                                            {proj.piEmail && <p><strong>PI Email:</strong> {proj.piEmail}</p>}
                                            {proj.copiName && <p><strong>Co-PI Name:</strong> {proj.copiName}</p>}
                                            {proj.copiDept && <p><strong>Co-PI Department:</strong> {proj.copiDept}</p>}
                                            {proj.copiContact && <p><strong>Co-PI Contact:</strong> {proj.copiContact}</p>}
                                            {proj.copiEmail && <p><strong>Co-PI Email:</strong> {proj.copiEmail}</p>}
                                            {proj.duration && <p><strong>Duration:</strong> {proj.duration}</p>}
                                            {proj.startDate && <p><strong>Start Date:</strong> {proj.startDate}</p>}
                                            {proj.objectives && <p><strong>Objectives:</strong> {proj.objectives}</p>}
                                            {proj.outcomes && <p><strong>Expected Outcomes:</strong> {proj.outcomes}</p>}
                                            {proj.amountApplied && <p><strong>Amount Applied:</strong> ₹{proj.amountApplied}</p>}
                                            {proj.amountReceived && <p><strong>Amount Received:</strong> ₹{proj.amountReceived}</p>}
                                            {proj.amountSanctioned && <p><strong>Amount Sanctioned:</strong> ₹{proj.amountSanctioned}</p>}
                                            {proj.totalExpenditure && <p><strong>Total Expenditure:</strong> ₹{proj.totalExpenditure}</p>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No funded projects available.</p>
            )}
        </div>
    );
};

export default CorFundedProjects;
