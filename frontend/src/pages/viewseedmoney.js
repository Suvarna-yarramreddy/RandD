import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SeedMoneyPage = () => {
    const [seedMoneyApplications, setSeedMoneyApplications] = useState([]);
    const faculty_id = sessionStorage.getItem("faculty_id");
    const [visibleDetails, setVisibleDetails] = useState(null);
    const navigate = useNavigate();

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
    
                // Ensure students field is parsed as an array
                data = data.map(app => ({
                    ...app,
                    students: typeof app.students === "string" ? JSON.parse(app.students) : app.students
                }));
    
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

    const handleEdit = (app) => {
        navigate('/editseedmoney', { state: { application: app } });
    };
    const handleDelete = async (seedmoneyId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this seedmoney?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:5000/deleteSeedmoney/${seedmoneyId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete seedmoney');
            }

            setSeedMoneyApplications(seedMoneyApplications.filter(app => app.id !== seedmoneyId));
            alert("Seedmoney deleted successfully!");
        } catch (error) {
            console.error('Error deleting seedmoney:', error);
            alert("Failed to delete the seedmoney.");
        }
    };


    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Your Seed Money</h2>
            {seedMoneyApplications.length > 0 ? (
                <div className="row">
                    {seedMoneyApplications.map(app => (
                        <div className="col-md-6 mb-4" key={app.id}>
                            <div className="card">
                                <div className="card-body flex-column">
                                    <div className='d-flex justify-content-between align-items-center mb-3'>
                                    <h5 className="card-title">
                                        <strong>Project Title: </strong>
                                        <a href="#!" onClick={() => handleToggleDetails(app.id)} className="text-primary">
                                            {app.projectTitle}
                                        </a>
                                    </h5>
                                    <div className="d-flex gap-2">
                                    <button className="btn btn-warning mt-2" onClick={() => handleEdit(app)}>Edit</button>
                                    <button className="btn btn-danger mt-2" onClick={() => handleDelete(app.id)}>
                                                Delete
                                            </button>
                                            </div>
                                    </div>

                                    {visibleDetails === app.id && (
                                        <div className="overflow-auto" style={{ maxHeight: '200px' }}>
                                            <div className="card-details">
                                                {app.financialYear && <p><strong>Financial Year:</strong> {app.financialYear}</p>}
                                                {app.facultyName && <p><strong>Faculty Name:</strong> {app.facultyName}</p>}
                                                {app.department && <p><strong>Department:</strong> {app.department}</p>}
                                                {app.numStudents !== 0 && <p><strong>Number of Students:</strong> {app.numStudents}</p>}
                                                {Array.isArray(app.students) && app.students.length > 0 ? (
                                                    <div>
                                                        <strong>Students Involved:</strong>
                                                        <table className="table table-bordered mt-2">
                                                            <thead>
                                                                <tr>
                                                                    <th>S. No</th>
                                                                    <th>Student Name</th>
                                                                    <th>Registration Number</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {app.students.map((student, index) => (
                                                                    <tr key={index}>
                                                                        <td>{index + 1}</td>
                                                                        <td>{student.name}</td>
                                                                        <td>{student.registration}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p>No students added</p>
                                                )}

                                                {app.amountSanctioned && <p><strong>Amount Sanctioned:</strong> {app.amountSanctioned}</p>}
                                                {app.amountReceived && <p><strong>Amount Received:</strong> {app.amountReceived}</p>}
                                                {app.objectives && <p><strong>Objectives:</strong> {app.objectives}</p>}
                                                {app.outcomes && <p><strong>Expected Outcomes:</strong> {app.outcomes}</p>}
                                                {Array.isArray(app.proof) && app.proof.length > 0 && (
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
