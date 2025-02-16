import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditConsultancy = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { project } = location.state || {};

    const [formData, setFormData] = useState({
        financialYear: "",
        department: "",
        startdateofProject: "",
        numoffaculty: "",
        titleofconsultancy: "",
        domainofconsultancy: "",
        clientorganization: "",
        clientaddress: "",
        amountreceived: "",
        dateofamountreceived: "",
        facilities: "",
        report: [], // Multiple files
        faculties: [{ name: "", designation: "", mailid: "" }]
    });

    useEffect(() => {
        if (project) {
            setFormData({
                financialYear: project.financialYear || "",
                department: project.department || "",
                startdateofProject: project.startdateofProject ? project.startdateofProject.split("T")[0] : "",  // Format Date
                numoffaculty: project.numoffaculty || "",
                titleofconsultancy: project.titleofconsultancy || "",
                domainofconsultancy: project.domainofconsultancy || "",
                clientorganization: project.clientorganization || "",
                clientaddress: project.clientaddress || "",
                amountreceived: project.amountreceived || "",
                dateofamountreceived: project.dateofamountreceived ? project.dateofamountreceived.split("T")[0] : "",  // Format Date
                facilities: project.facilities || "",
                report: project.report ? (typeof project.report === "string" ? JSON.parse(project.report) : project.report) : [],
                faculties: project.faculties ? (typeof project.faculties === "string" ? JSON.parse(project.faculties) : project.faculties) : [{ name: "", designation: "", mailid: "" }]
            });
        }
    }, [project]);
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFacultyChange = (index, field, value) => {
        const updatedFaculties = [...formData.faculties];
        updatedFaculties[index][field] = value;
        setFormData({ ...formData, faculties: updatedFaculties });
    };

    const addFaculty = () => {
        setFormData({ ...formData, faculties: [...formData.faculties, { name: "", designation: "", mailid: "" }] });
    };

    const removeFaculty = (index) => {
        const updatedFaculties = [...formData.faculties];
        updatedFaculties.splice(index, 1);
        setFormData({ ...formData, faculties: updatedFaculties });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, report: [...formData.report, ...files] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        Object.keys(formData).forEach((key) => {
            if (key === "report") {
                formData[key].forEach((file) => formDataToSend.append("report", file));
            } else if (key === "faculties") {
                formDataToSend.append("faculties", JSON.stringify(formData.faculties));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch(`http://localhost:5000/updateConsultancy/${project.consultancy_id}`, {
                method: "PUT",
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error("Failed to update consultancy project");
            }

            alert("Consultancy project updated successfully!");
            navigate("/viewconsultants");
        } catch (error) {
            console.error("Error updating consultancy project:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-dark mb-4">Edit Consultancy Project</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="row">
                    {[
                        { label: "Financial Year", name: "financialYear" },
                        { label: "Department", name: "department" },
                        { label: "Start Date", name: "startdateofProject", type: "date" },
                        { label: "Number of Faculty Involved", name: "numoffaculty", type: "number" },
                        { label: "Title of Consultancy", name: "titleofconsultancy" },
                        { label: "Domain of Consultancy", name: "domainofconsultancy" },
                        { label: "Client Organization", name: "clientorganization" },
                        { label: "Client Address", name: "clientaddress" },
                        { label: "Amount Received", name: "amountreceived", type: "number" },
                        { label: "Date of Amount Received", name: "dateofamountreceived", type: "date" },
                        { label: "Facilities Used", name: "facilities" }
                    ].map(({ label, name, type = "text" }, index) => (
                        <div className="col-md-6 mb-3" key={index}>
                            <label><strong>{label}:</strong></label>
                            <input type={type} className="form-control" name={name} value={formData[name]} onChange={handleChange} required />
                        </div>
                    ))}
                </div>

                {/* Faculty Members */}
                <div className="mt-4">
                    <h5>Faculty Members Involved</h5>
                    {formData.faculties.map((faculty, index) => (
                        <div key={index} className="row mb-2">
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder="Name" value={faculty.name} onChange={(e) => handleFacultyChange(index, "name", e.target.value)} required />
                            </div>
                            <div className="col-md-4">
                                <input type="text" className="form-control" placeholder="Designation" value={faculty.designation} onChange={(e) => handleFacultyChange(index, "designation", e.target.value)} required />
                            </div>
                            <div className="col-md-3">
                                <input type="email" className="form-control" placeholder="Mail ID" value={faculty.mailid} onChange={(e) => handleFacultyChange(index, "mailid", e.target.value)} required />
                            </div>
                            <div className="col-md-1">
                                <button type="button" className="btn btn-danger" onClick={() => removeFaculty(index)}>-</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={addFaculty}>+ Add Faculty</button>
                </div>

                {/* Reports Upload */}
                <div className="mt-4">
    <label><strong>Reports:</strong></label>
    <input type="file" className="form-control" multiple onChange={handleFileChange} />
    
    {/* Display Existing Reports as Links */}
    {Array.isArray(formData.report) && formData.report.length > 0 && (
        <ul className="mt-2">
            {formData.report.map((file, index) => (
                <li key={index}>
                    {typeof file === 'string' ? (
                        // If file is an existing path, display a link
                        <a href={`http://localhost:5000/${file}`} target="_blank" rel="noopener noreferrer">
                            View Report {index + 1}
                        </a>
                    ) : (
                        // If file is a newly selected File object, just display the name
                        file.name
                    )}
                </li>
            ))}
        </ul>
    )}
</div>

                <div className="d-flex gap-2 mt-3 justify-content-center">
                    <button type="submit" className="btn btn-primary">
                        Update 
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/viewconsultants')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditConsultancy;
