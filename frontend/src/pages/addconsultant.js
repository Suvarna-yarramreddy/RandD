import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
function ConsultancyForm() {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const navigate = useNavigate();
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
    report: [], // Allow multiple files
    faculties: [{ name: "", designation: "", mailid: "" }],
  });

  const [errors, setErrors] = useState({});

  // Define validateField before using it
  const validateField = (name, value) => {
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      switch (name) {
        case "financialYear":
          newErrors.financialYear = value ? "" : "Financial Year is required.";
          break;

        case "department":
          if (!value.trim()) newErrors.department = "Department is required.";
          else if (!/^[A-Za-z\s]+$/.test(value))
            newErrors.department =
              "Department must contain only letters and spaces.";
          else delete newErrors.department;
          break;

        case "startdateofProject":
          newErrors.startdateofProject = value ? "" : "Start Date is required.";
          break;

        case "titleofconsultancy":
          newErrors.titleofconsultancy = value.trim()
            ? ""
            : "Title Of Consultancy is required.";
          break;

        case "domainofconsultancy":
          newErrors.domainofconsultancy = value.trim()
            ? ""
            : "Domain Of Consultancy is required.";
          break;

        case "clientorganization":
          newErrors.clientorganization = value.trim()
            ? ""
            : "Client Organization is required.";
          break;

        case "clientaddress":
          newErrors.clientaddress = value.trim() ? "" : "Client Address is required.";
          break;

        case "amountreceived":
          newErrors.amountreceived =
            value && !isNaN(value) ? "" : "Amount Received must be a valid number.";
          break;

        case "dateofamountreceived":
          newErrors.dateofamountreceived = value ? "" : "Date Of Amount Received is required.";
          break;

        case "facilities":
          newErrors.facilities = value.trim() ? "" : "Facilities are required.";
          break;

        case "report":
          if (!value || value.length === 0) newErrors.report = "Report file is required.";
          else delete newErrors.report;
          break;

        default:
          if (formData.numoffaculty > 0) {
            if (name.startsWith("faculty-name")) {
              const index = parseInt(name.split("-")[2], 10);
              if (!value.trim())
                newErrors[`faculty-name-${index}`] = `Faculty ${index + 1}: Name is required.`;
              else if (!/^[A-Za-z\s]+$/.test(value))
                newErrors[`faculty-name-${index}`] =
                  `Faculty ${index + 1}: Name must contain only letters and spaces.`;
              else delete newErrors[`faculty-name-${index}`];
            }
            if (name.startsWith("faculty-designation")) {
              const index = parseInt(name.split("-")[2], 10);
              if (!value.trim())
                newErrors[`faculty-designation-${index}`] = `Faculty ${index + 1}: Designation is required.`;
              else delete newErrors[`faculty-designation-${index}`];  // ✅ Fix: Remove error when valid
            }

            if (name.startsWith("faculty-mailid")) {
              const index = parseInt(name.split("-")[2], 10);
              if (!value.trim())
                newErrors[`faculty-mailid-${index}`] = `Faculty ${index + 1}: Email is required.`;
              else if (!/^\S+@\S+\.\S+$/.test(value))
                newErrors[`faculty-mailid-${index}`] = `Faculty ${index + 1}: Enter a valid email.`;
              else delete newErrors[`faculty-mailid-${index}`];
            }
          }
          break;
      }

      return newErrors;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  const handleFacultyChange = (index, field, value) => {
    const updatedFaculties = [...formData.faculties];
    updatedFaculties[index][field] = value;
    setFormData((prevData) => ({ ...prevData, faculties: updatedFaculties }));
    validateField(`faculty-${field}-${index}`, value);
  };

  const handleNumFacultiesChange = (e) => {
    const value = parseInt(e.target.value) ;
    const faculties =
      value > 0 ? Array.from({ length: value }, () => ({ name: "", designation: "", mailid: "" })) : [];
    setFormData((prevData) => ({ ...prevData, numoffaculty: value, faculties }));
    validateField("numoffaculty", value);
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      report: [...prevData.report, ...newFiles],
    }));
    validateField("report", newFiles); // real-time validation for proof files
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
  
    let formIsValid = true;
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((key) => {
        const value = formData[key];
        validateField(key, value);

        // Manually collect errors for required fields
        if (!value || (typeof value === "string" && !value.trim())) {
            newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`; // Converts "titleofconsultancy" to "Title of consultancy"
            formIsValid = false;
        }
    });

    // Validate faculties if numoffaculty > 0
    if (formData.numoffaculty > 0) {
        formData.faculties.forEach((faculty, index) => {
            if (!faculty.name.trim()) {
                newErrors[`faculty-name-${index}`] = `Faculty ${index + 1}: Name is required.`;
                formIsValid = false;
            }
            if (!faculty.designation.trim()) {
                newErrors[`faculty-designation-${index}`] = `Faculty ${index + 1}: Designation is required.`;
                formIsValid = false;
            }
            if (!faculty.mailid.trim() || !/^\S+@\S+\.\S+$/.test(faculty.mailid)) {
                newErrors[`faculty-mailid-${index}`] = `Faculty ${index + 1}: Valid email is required.`;
                formIsValid = false;
            }
        });
    }

    // Validate report field (must have at least one file)
    if (!formData.report || formData.report.length === 0) {
        newErrors.report = "Please upload at least one report file.";
        formIsValid = false;
    }

    // Update errors state
    setErrors(newErrors);

    // If there are errors, prevent submission
    if (!formIsValid) {
        alert("Please fix errors before submitting.");
        return;
    }


    // ✅ Prepare FormData for API submission
    const formDataToSend = new FormData();
    
    // Append faculty_id
    formDataToSend.append("faculty_id",faculty_id);

    // Append other fields
    Object.keys(formData).forEach((key) => {
        if (key === "faculties") {
            formDataToSend.append(key, JSON.stringify(formData[key])); // Convert faculties array to JSON
        } else if (key === "report") {
            // Append multiple report files
            formData[key].forEach((file) => formDataToSend.append("report", file));
        } else {
            formDataToSend.append(key, formData[key]);
        }
    });

    // ✅ Make API request
    try {
        const response = await axios.post("http://localhost:5000/addConsultancy", formDataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        alert("Form submitted successfully!");
        navigate("/viewconsultants");
    } catch (error) {
        console.error("Error submitting form:", error.response?.data || error.message);
        alert("Error submitting form. Please try again.");
    }
};

  


  return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Consultancy Application</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Financial Year<span style={{ color: "red" }}>*</span></label>
            <select
            className="form-select"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            >
              <option value="">Select Financial Year</option>
              <option value="2020-21">2020-21</option>
              <option value="2021-22">2021-22</option>
              <option value="2022-23">2022-23</option>
              <option value="2024-25">2024-25</option>
              </select>
              {errors.financialYear && <div className="text-danger">{errors.financialYear}</div>}
            </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Department<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <div className="text-danger">{errors.department}</div>}
          </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Start Date Of Project<span style={{ color: "red" }}>*</span></label>
            <input
                type="date"
                className="form-control"
                name="startdateofProject"
                value={formData.startdateofProject}
                onChange={handleChange}
            />
            {errors.startdateofProject && <div className="text-danger">{errors.startdateofProject}</div>}
            </div>
        {/* Student Details */}
        
        <div className="col-md-6 mb-3">
          <label className="form-label">Number Of Faculty Involved<span style={{ color: "red" }}>*</span></label>
          <input
            type="number"
            className="form-control"
            name="numoffaculty"
            value={formData.numoffaculty}
            onChange={handleNumFacultiesChange}
            min="0"
          />
          {errors.numoffaculty && <div className="text-danger">{errors.numoffaculty}</div>}
        </div>
        </div>

{formData.numoffaculty > 0 &&
  formData.faculties?.map((faculty, index) => (
    <div className="row" key={index}>
      {/* Faculty Name */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Name (Faculty {index + 1})<span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          className="form-control"
          name="name"
          value={faculty.name}
          onChange={(e) => handleFacultyChange(index, "name", e.target.value)}
        />
        {errors[`faculty-name-${index}`] && (
          <div className="text-danger">{errors[`faculty-name-${index}`]}</div>
        )}
      </div>

      {/* Faculty Designation */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Designation (Faculty {index + 1})<span style={{ color: "red" }}>*</span></label>
        <input
          type="text"
          className="form-control"
          name="designation"
          value={faculty.designation}
          onChange={(e) => handleFacultyChange(index, "designation", e.target.value)}
        />
        {errors[`faculty-designation-${index}`] && (
          <div className="text-danger">{errors[`faculty-designation-${index}`]}</div>
        )}
      </div>

      {/* Faculty Email */}
      <div className="col-md-4 mb-3">
        <label className="form-label">Email ID (Faculty {index + 1})<span style={{ color: "red" }}>*</span></label>
        <input
          type="email"
          className="form-control"
          name="mailid"
          value={faculty.mailid}
          onChange={(e) => handleFacultyChange(index, "mailid", e.target.value)}
        />
        {errors[`faculty-mailid-${index}`] && (
          <div className="text-danger">{errors[`faculty-mailid-${index}`]}</div>
        )}
      </div>
    </div>
  ))}



        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the consultancy<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="titleofconsultancy"
              value={formData.titleofconsultancy}
              onChange={handleChange}
            />
            {errors.titleofconsultancy && <div className="text-danger">{errors.titleofconsultancy}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Domain of the consultancy<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="domainofconsultancy"
              value={formData.domainofconsultancy}
              onChange={handleChange}
            />
            {errors.domainofconsultancy && <div className="text-danger">{errors.domainofconsultancy}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Client Organization<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="clientorganization"
              value={formData.clientorganization}
              onChange={handleChange}
            />
            {errors.clientorganization && <div className="text-danger">{errors.clientorganization}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Client Address<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="clientaddress"
              value={formData.clientaddress}
              onChange={handleChange}
            />
            {errors.clientaddress && <div className="text-danger">{errors.clientaddress}</div>}
          </div>
          </div>
          <div className='row'>
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Received From Client<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="amountreceived"
              value={formData.amountreceived}
              onChange={handleChange}
            />
            {errors.amountreceived && <div className="text-danger">{errors.amountreceived}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Date Of Amount Received<span style={{ color: "red" }}>*</span></label>
            <input
                type="date"
                className="form-control"
                name="dateofamountreceived"
                value={formData.dateofamountreceived}
                onChange={handleChange}
            />
            {errors.dateofamountreceived && <div className="text-danger">{errors.dateofamountreceived}</div>}
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 mb-3">
            <label className="form-label">Facilities used to Do Consultancy<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
            />
            {errors.facilities && <div className="text-danger">{errors.facilities}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Report<span style={{ color: "red" }}>*</span></label>
            <div className="custom-file">
                <input
                type="file"
                name="report"
                className="form-control"
                onChange={handleFileChange}  // No 'multiple' attribute
                />
                {errors.report && <div className="text-danger">{errors.report}</div>}
            </div>
            {formData.report && formData.report.length > 0 && (
  <div className="mt-3">
    <label className="form-label">Selected Files:</label>
    <ul className="list-group">
      {formData.report.map((file, index) => (
        <li key={index} className="list-group-item">
          {file.name}
        </li>
      ))}
    </ul>
  </div>
)}

            </div>
        </div>
        
        <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultancyForm;