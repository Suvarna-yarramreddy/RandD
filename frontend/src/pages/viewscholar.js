import React, { useState, useEffect } from 'react';

const Viewscholars = () => {
    const [scholars, setScholars] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const faculty_id = sessionStorage.getItem("faculty_id");

    useEffect(() => {
        const fetchScholars = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getscholars/${faculty_id}`);
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
            <h2 className="text-center text-dark mb-4">Research Scholars</h2>
            {scholars.length > 0 ? (
                <div className="row">
                    {scholars.map((scholar) => (
                        <div className="col-md-6 mb-4" key={scholar.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
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
                                        <div className="card-details overflow-auto" style={{ maxHeight: '250px' }}>
                                            {scholar.guideName && <p><strong>Guide Name:</strong> {scholar.guideName}</p>}
                                            {scholar.guideDepartment && <p><strong>Guide Department:</strong> {scholar.guideDepartment}</p>}
                                            {scholar.scholarName && <p><strong>Scholar Name:</strong> {scholar.scholarName}</p>}
                                            {scholar.scholarDepartment && <p><strong>Scholar Department:</strong> {scholar.scholarDepartment}</p>}
                                            {scholar.admissionDate && <p><strong>Admission Date:</strong> {scholar.admissionDate}</p>}
                                            {scholar.university && <p><strong>University:</strong> {scholar.university}</p>}
                                            {scholar.admissionStatus && <p><strong>Admission Status:</strong> {scholar.admissionStatus}</p>}
                                            {scholar.awardDate && <p><strong>Award Date:</strong> {scholar.awardDate}</p>}
                                            {scholar.fellowship && <p><strong>Fellowship:</strong> {scholar.fellowship}</p>}
                                            {scholar.admissionLetter && (
                                                <p><strong>Admission Letter:</strong>
                                                <a href={`http://localhost:5000/${scholar.admissionLetter}`} target="_blank" rel="noopener noreferrer">View</a>
                                                </p>
                                            )}
                                           {scholar.guideAllotmentLetter && (
                                            <p><strong>Guide Allotment Letter:</strong>
                                            <a href={`http://localhost:5000/${scholar.guideAllotmentLetter}`} target="_blank" rel="noopener noreferrer">View</a>
                                            </p>
                                             )}
                                            {scholar.completionProceedings && (
                                             <p><strong>Completion Proceedings:</strong>
                                            <a href={`http://localhost:5000/${scholar.completionProceedings}`} target="_blank" rel="noopener noreferrer">View</a>
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

export default Viewscholars;