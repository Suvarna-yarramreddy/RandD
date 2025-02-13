import React, { useState, useEffect } from 'react';

const SeedMoneyPage = () => {
    const [seedMoneyApplications, setSeedMoneyApplications] = useState([]);
    const faculty_id = sessionStorage.getItem("faculty_id");
    const [visibleDetails, setVisibleDetails] = useState(null);

    useEffect(() => {
        const fetchSeedMoneyApplications = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getSeedMoney/${faculty_id}`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    throw new Error("Failed to fetch seed money applications");
                }
                let data = await response.json();
    
                setSeedMoneyApplications(data);
            } catch (error) {
                console.error("Error fetching seed money applications:", error);
            }
        };
        fetchSeedMoneyApplications();
    }, [faculty_id]);
    

    const handleToggleDetails = (id) => {
        setVisibleDetails(visibleDetails === id ? null : id);
    };

    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Your Seed Money Applications</h2>
            {seedMoneyApplications.length > 0 ? (
                <div className="row">
                    {seedMoneyApplications.map(app => (
                        <div className="col-md-6 mb-4" key={app.id}>
                            <div className="card">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">
                                        <strong>Project Title: </strong>
                                        <a
                                            href="#!"
                                            onClick={() => handleToggleDetails(app.id)}
                                            className="text-primary"
                                        >
                                            {app.projectTitle}
                                        </a>
                                    </h5>
                                    {visibleDetails === app.id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                <div>
                                                {app.financialYear && <p><strong>Financial Year:</strong> {app.financialYear}</p>}
                                                    {app.facultyName && <p><strong>Faculty Name:</strong> {app.facultyName}</p>}
                                                    {app.department && <p><strong>Department:</strong> {app.department}</p>}
                                                    {app.numStudents!==0 && <p><strong>Number of Students:</strong> {app.numStudents}</p>}
                                                    {app.students && app.students.length > 0 && (
                                                        <div>
                                                            <strong>Students Involved:</strong>
                                                            <ul>
                                                                {app.students.map((student, index) => (
                                                                    <li key={index}>{student.name} (RegNo: {student.registration})</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    {app.projectTitle && <p><strong>Project Title:</strong> {app.projectTitle}</p>}
                                                    {app.amountSanctioned && <p><strong>Amount Sanctioned:</strong> {app.amountSanctioned}</p>}
                                                    {app.amountReceived && <p><strong>Amount Received:</strong> {app.amountReceived}</p>}
                                                    {app.objectives && <p><strong>Objectives:</strong> {app.objectives}</p>}
                                                    {app.outcomes && <p><strong>Expected Outcomes:</strong> {app.outcomes}</p>}
                                                    {app.proof && app.proof.length > 0 && (
                                                        <p><strong>Proof Documents:</strong> 
                                                            {app.proof.map((file, index) => (
                                                                <span key={index}>
                                                                    <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                                                        View Proof {index + 1}
                                                                    </a>{' '}
                                                                </span>
                                                            ))}
                                                        </p>
                                                    )}
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No seed money applications available.</p>
            )}
        </div>
    );
};

export default SeedMoneyPage;