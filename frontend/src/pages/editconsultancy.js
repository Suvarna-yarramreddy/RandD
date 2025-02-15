import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const EditConsultancyProjectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Initialize state with project details passed via navigation
    const [consultancyProject, setConsultancyProject] = useState({
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
        report: [],
        faculties: [{ name: "", designation: "", mailid: "" }],
    });

    useEffect(() => {
        if (location.state && location.state.project) {
            setConsultancyProject(location.state.project);
        }
    }, [location]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setConsultancyProject((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFacultyChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFaculties = [...consultancyProject.faculties];
        updatedFaculties[index][name] = value;
        setConsultancyProject((prevState) => ({
            ...prevState,
            faculties: updatedFaculties,
        }));
    };

    const handleAddFaculty = () => {
        setConsultancyProject((prevState) => ({
            ...prevState,
            faculties: [...prevState.faculties, { name: "", designation: "", mailid: "" }],
        }));
    };

    const handleRemoveFaculty = (index) => {
        const updatedFaculties = [...consultancyProject.faculties];
        updatedFaculties.splice(index, 1);
        setConsultancyProject((prevState) => ({
            ...prevState,
            faculties: updatedFaculties,
        }));
    };

    const handleFileChange = (e) => {
        const files = e.target.files;
        const updatedFiles = [...consultancyProject.report];
        for (let i = 0; i < files.length; i++) {
            updatedFiles.push(files[i]);
        }
        setConsultancyProject((prevState) => ({
            ...prevState,
            report: updatedFiles,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here, such as sending data to backend
        console.log("Consultancy Project Details:", consultancyProject);
        navigate('/consultancyprojects'); // Redirect after save
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center text-dark mb-4">Edit Consultancy Project</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label htmlFor="financialYear">Financial Year</label>
                    <input
                        type="text"
                        id="financialYear"
                        name="financialYear"
                        value={consultancyProject.financialYear}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter financial year"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="department">Department</label>
                    <input
                        type="text"
                        id="department"
                        name="department"
                        value={consultancyProject.department}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter department"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="startdateofProject">Start Date</label>
                    <input
                        type="date"
                        id="startdateofProject"
                        name="startdateofProject"
                        value={consultancyProject.startdateofProject}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="numoffaculty">Number of Faculty Involved</label>
                    <input
                        type="number"
                        id="numoffaculty"
                        name="numoffaculty"
                        value={consultancyProject.numoffaculty}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter number of faculty"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="titleofconsultancy">Title of Consultancy</label>
                    <input
                        type="text"
                        id="titleofconsultancy"
                        name="titleofconsultancy"
                        value={consultancyProject.titleofconsultancy}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter title of consultancy"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="domainofconsultancy">Domain of Consultancy</label>
                    <input
                        type="text"
                        id="domainofconsultancy"
                        name="domainofconsultancy"
                        value={consultancyProject.domainofconsultancy}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter domain of consultancy"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="clientorganization">Client Organization</label>
                    <input
                        type="text"
                        id="clientorganization"
                        name="clientorganization"
                        value={consultancyProject.clientorganization}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter client organization"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="clientaddress">Client Address</label>
                    <input
                        type="text"
                        id="clientaddress"
                        name="clientaddress"
                        value={consultancyProject.clientaddress}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter client address"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="amountreceived">Amount Received</label>
                    <input
                        type="text"
                        id="amountreceived"
                        name="amountreceived"
                        value={consultancyProject.amountreceived}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter amount received"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="dateofamountreceived">Date of Amount Received</label>
                    <input
                        type="date"
                        id="dateofamountreceived"
                        name="dateofamountreceived"
                        value={consultancyProject.dateofamountreceived}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="facilities">Facilities Used</label>
                    <input
                        type="text"
                        id="facilities"
                        name="facilities"
                        value={consultancyProject.facilities}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="Enter facilities used"
                    />
                </div>

                <div className="form-group mb-3">
                    <label htmlFor="report">Reports (Upload files)</label>
                    <input
                        type="file"
                        id="report"
                        name="report"
                        multiple
                        onChange={handleFileChange}
                        className="form-control"
                    />
                    {consultancyProject.report.length > 0 && (
                        <div className="mt-2">
                            <h5>Uploaded Files:</h5>
                            <ul>
                                {consultancyProject.report.map((file, index) => (
                                    <li key={index}>{file.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="form-group mb-3">
                    <label>Faculty Members Involved</label>
                    {consultancyProject.faculties.map((faculty, index) => (
                        <div key={index} className="faculty-entry mb-3">
                            <div className="row">
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        name="name"
                                        value={faculty.name}
                                        onChange={(e) => handleFacultyChange(index, e)}
                                        className="form-control"
                                        placeholder="Faculty Name"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input
                                        type="text"
                                        name="designation"
                                        value={faculty.designation}
                                        onChange={(e) => handleFacultyChange(index, e)}
                                        className="form-control"
                                        placeholder="Faculty Designation"
                                    />
                                </div>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <input
                                        type="email"
                                        name="mailid"
                                        value={faculty.mailid}
                                        onChange={(e) => handleFacultyChange(index, e)}
                                        className="form-control"
                                        placeholder="Faculty Email"
                                    />
                                </div>
                                <div className="col-md-6">
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            onClick={() => handleRemoveFaculty(index)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary mt-2" onClick={handleAddFaculty}>
                        Add Faculty
                    </button>
                </div>

                <div className="text-center mt-4">
                    <button type="submit" className="btn btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditConsultancyProjectPage;
