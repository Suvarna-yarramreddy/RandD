import React, { useState, useEffect } from 'react';

const InstViewConsultancy = () => {
    const [consultancyProjects, setConsultancyProjects] = useState([]);
    const [visibleDetails, setVisibleDetails] = useState(null);

    useEffect(() => {
        const fetchConsultancyProjects = async () => {
            try {
                const response = await fetch(`http://localhost:5000/getAllConsultancyProjectsInstitute`);
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error("Error response:", errorText);
                    throw new Error("Failed to fetch consultancy projects");
                }
                let data = await response.json();
                setConsultancyProjects(data);
            } catch (error) {
                console.error("Error fetching consultancy projects:", error);
            }
        };
        fetchConsultancyProjects();
    }, []);

    const handleToggleDetails = (consultancy_id) => {
        setVisibleDetails(visibleDetails === consultancy_id ? null : consultancy_id);
    };

    return (
        <div className="container mt-2">
            <h2 className="text-center text-dark mb-4">Institute-Wise Consultancy Projects</h2>
            {consultancyProjects.length > 0 ? (
                <div className="row">
                    {consultancyProjects.map(project => (
                        <div className="col-md-6 mb-4" key={project.consultancy_id}>
                            <div className="card">
                                <div className="card-body flex-column">
                                    <h5 className="card-title">
                                        <strong>Title: </strong>
                                        <a
                                            href="#!"
                                            onClick={() => handleToggleDetails(project.consultancy_id)}
                                            className="text-primary"
                                        >
                                            {project.titleofconsultancy}
                                        </a>
                                    </h5>
                                    {visibleDetails === project.consultancy_id && (
                                        <div className="overflow-auto" style={{ maxHeight: '250px' }}>
                                            <div className="card-details">
                                            {project.financialYear && <p><strong>Financial Year:</strong> {project.financialYear}</p>}
                                                {project.department && <p><strong>Department:</strong> {project.department}</p>}
                                                {project.startdateofProject && <p><strong>Start Date:</strong> {project.startdateofProject}</p>}
                                                {project.numoffaculty && <p><strong>Number of Faculty Involved:</strong> {project.numoffaculty}</p>}
                                                {project.domainofconsultancy && <p><strong>Domain:</strong> {project.domainofconsultancy}</p>}
                                                {project.clientorganization && <p><strong>Client Organization:</strong> {project.clientorganization}</p>}
                                                {project.clientaddress && <p><strong>Client Address:</strong> {project.clientaddress}</p>}
                                                {project.amountreceived && <p><strong>Amount Received:</strong> {project.amountreceived}</p>}
                                                {project.dateofamountreceived && <p><strong>Date of Amount Received:</strong> {project.dateofamountreceived}</p>}
                                                {project.facilities && <p><strong>Facilities Used:</strong> {project.facilities}</p>}

                                                {project.faculties && typeof project.faculties === "string" ? (
                                                    <div>
                                                        <strong>Faculty Members Involved:</strong>
                                                        <table className="table table-bordered mt-2">
                                                            <thead className="thead-dark">
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Designation</th>
                                                                    <th>Mail ID</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {JSON.parse(project.faculties).map((faculty, index) => (
                                                                    <tr key={index}>
                                                                        <td>{faculty.name}</td>
                                                                        <td>{faculty.designation}</td>
                                                                        <td>{faculty.mailid}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : project.faculties && Array.isArray(project.faculties) ? (
                                                    <div>
                                                        <strong>Faculty Members Involved:</strong>
                                                        <table className="table table-bordered mt-2">
                                                            <thead className="thead-dark">
                                                                <tr>
                                                                    <th>Name</th>
                                                                    <th>Designation</th>
                                                                    <th>Mail ID</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {project.faculties.map((faculty, index) => (
                                                                    <tr key={index}>
                                                                        <td>{faculty.name}</td>
                                                                        <td>{faculty.designation}</td>
                                                                        <td>{faculty.mailid}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : null}

                                                {project.report && typeof project.report === "string" ? (
                                                    <p><strong>Reports:</strong> 
                                                        {JSON.parse(project.report).map((file, index) => (
                                                            <span key={index}>
                                                                <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                                                    View Report {index + 1}
                                                                </a>{' '}
                                                            </span>
                                                        ))}
                                                    </p>
                                                ) : project.report && Array.isArray(project.report) ? (
                                                    <p><strong>Reports:</strong> 
                                                        {project.report.map((file, index) => (
                                                            <span key={index}>
                                                                <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                                                                    View Report {index + 1}
                                                                </a>{' '}
                                                            </span>
                                                        ))}
                                                    </p>
                                                ) : null}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-muted">No consultancy projects available.</p>
            )}
        </div>
    );
};

export default InstViewConsultancy;
