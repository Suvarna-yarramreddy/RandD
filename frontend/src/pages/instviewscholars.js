import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InstViewScholars = () => {
    const [scholars, setScholars] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchScholars = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getAllScholarsInstitute`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Failed to fetch scholars');
                }
                const data = await response.json();
                setScholars(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchScholars();
    }, []);

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
            <h2 className="text-center text-dark mb-4">Research Scholars</h2>
            {scholars.length > 0 ? (
                <div className="row">
                    {scholars.map((scholar) => (
                        <div className="col-md-6 mb-4" key={scholar.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="justify-content-between align-items-center mb-3">
                                        <h5 className="card-title">
                                            Title of Work:&nbsp;
                                            <a
                                                href="#!"
                                                onClick={() => handleToggleDetails(scholar.id)}
                                                aria-expanded={visibleDetails === scholar.id}
                                                className="text-primary"
                                            >
                                                {scholar.workTitle}
                                            </a>
                                        </h5>
                                    </div>
                                    {visibleDetails === scholar.id && (
                                        <div className="card-details overflow-auto" style={{ maxHeight: '200px' }}>
                                            {scholar.guideName && <p><strong>Guide Name:</strong> {scholar.guideName}</p>}
                                            {scholar.guideDepartment && <p><strong>Guide Department:</strong> {scholar.guideDepartment}</p>}
                                            {scholar.scholarName && <p><strong>Scholar Name:</strong> {scholar.scholarName}</p>}
                                            {scholar.scholarDepartment && <p><strong>Scholar Department:</strong> {scholar.scholarDepartment}</p>}
                                            {scholar.admissionDate && <p><strong>Admission Date:</strong> {scholar.admissionDate.split('T')[0]}</p>}
                                            {scholar.university && <p><strong>University:</strong> {scholar.university}</p>}
                                            {scholar.workTitle && <p><strong>Work Title:</strong> {scholar.workTitle}</p>}
                                            {scholar.admissionStatus && <p><strong>Admission Status:</strong> {scholar.admissionStatus}</p>}
                                            {scholar.awardDate && <p><strong>Award Date:</strong> {scholar.awardDate.split('T')[0]}</p>}
                                            {scholar.fellowship && <p><strong>Fellowship:</strong> {scholar.fellowship}</p>}

                                            {/* Uploaded Documents */}
                                            {scholar.admissionLetter && (
                                                <p>
                                                    <strong>Admission Letter:</strong>&nbsp;
                                                    <a href={`http://localhost:5000/${scholar.admissionLetter}`} target="_blank" rel="noopener noreferrer">
                                                        View Admission Letter
                                                    </a>
                                                </p>
                                            )}
                                            {scholar.guideAllotmentLetter && (
                                                <p>
                                                    <strong>Guide Allotment Letter:</strong>&nbsp;
                                                    <a href={`http://localhost:5000/${scholar.guideAllotmentLetter}`} target="_blank" rel="noopener noreferrer">
                                                        View Guide Allotment Letter
                                                    </a>
                                                </p>
                                            )}
                                            {scholar.completionProceedings && (
                                                <p>
                                                    <strong>Completion Proceedings:</strong>&nbsp;
                                                    <a href={`http://localhost:5000/${scholar.completionProceedings}`} target="_blank" rel="noopener noreferrer">
                                                        View Completion Proceedings
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
                <p className="text-center text-muted">No scholars available.</p>
            )}
        </div>
    );
};

export default InstViewScholars;
