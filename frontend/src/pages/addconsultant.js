import React, { useState } from 'react';
// import { useNavigate } from "react-router-dom";

function ConsultancyForm() {
  const faculty_id = sessionStorage.getItem("faculty_id");
// const navigate = useNavigate();
  const [formData, setFormData] = useState({
    financialYear: '',
    department: '',
    startdateofProject:'',
    numoffaculty: 0,
    titleofconsultancy: '',
    domainofconsultancy: '',
    clientorganization: '',
    clientaddress: '',
    amountreceived: '',
    dateofamountreceived:'',
    facilities:'',
    report: '', // Store multiple files
    faculties: [{ name: '', designation: '',mailid:''}]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value); // real-time validation after each change
  };

  const handleFacultyChange = (index, field, value) => {
    const updatedFaculties = [...formData.faculties];
    updatedFaculties[index][field] = value;
    setFormData((prevData) => ({ ...prevData, faculties: updatedFaculties }));
    validateField(`faculty-${field}-${index}`, value); // real-time validation for faculty fields
  };
  
  const handleNumFacultiesChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const faculties =
      value > 0 ? Array.from({ length: value }, () => ({ name: "", designation: "", mailid: "" })) : [];
    setFormData((prevData) => ({ ...prevData, numoffaculty: value, faculties }));
    validateField("numoffaculty", value); // real-time validation
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first (single) file
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        report: file, // Store only one file
      }));
    }
  };
  

  const validateForm = () => {
    let isValid = true;
    const newErrors = {}; // Initialize an empty error object
  
    // Validate each field in formData
    Object.keys(formData).forEach((key) => {
      const value = formData[key];
      console.log(`Validating ${key}: ${value}`);  // Log each key and value
  
      // Skip optional fields
      if (key === "proof") return;
  
      // Check if the field is empty or invalid
      if (!value || (Array.isArray(value) && value.length === 0) || (typeof value === 'string' && value.trim() === '')) {
        newErrors[key] = `${key} is required.`;  // Populate error message
        isValid = false; // Mark the form as invalid
      }
    });
  
    // Validate faculty details only if numoffaculty > 0
    if (formData.numoffaculty > 0) {
      formData.faculties.forEach((faculty, index) => {
        console.log(`Validating faculty ${index}:, faculty`);  // Log faculty details
  
        if (!faculty.name.trim()) {
          newErrors[`faculty-name-${index}`] = `Faculty ${index + 1}: Name is required.`;
          isValid = false;
        }
  
        if (!faculty.designation.trim()) {
          newErrors[`faculty-designation-${index}`] = `Faculty ${index + 1}: Designation is required.`;
          isValid = false;
        }
  
        if (!faculty.mailid.trim()) {
          newErrors[`faculty-mailid-${index}`] =`Faculty ${index + 1}: Mail ID is required.`;
          isValid = false;
        }
      });
    }
  
    // Log the errors object for debugging
    console.log('Validation errors:', newErrors);
  
    setErrors(newErrors);  // Update the error state
    return isValid;
  };
  
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
            newErrors.department = "Department must contain only letters and spaces.";
          else delete newErrors.department;
          break;
  
        case "startdateofProject":
          newErrors.startdateofProject = value ? "" : "Start Date is required.";
          break;
  
        case "titleofconsultancy":
          newErrors.titleofconsultancy = value.trim() ? "" : "Title Of Consultancy is required.";
          break;
  
        case "domainofconsultancy":
          newErrors.domainofconsultancy = value.trim() ? "" : "Domain Of Consultancy is required.";
          break;
  
        case "clientorganization":
          newErrors.clientorganization = value.trim() ? "" : "Client Organization is required.";
          break;
  
        case "clientaddress":
          newErrors.clientaddress = value.trim() ? "" : "Client Address is required.";
          break;
  
        case "amountreceived":
          newErrors.amountreceived = value && !isNaN(value) ? "" : "Amount Received must be a valid number.";
          break;
  
        case "dateofamountreceived":
          newErrors.dateofamountreceived = value ? "" : "Date Of Amount Received is required.";
          break;
  
        case "facilities":
          newErrors.facilities = value.trim() ? "" : "Facilities are required.";
          break;
  
        default:
          if (formData.numoffaculty > 0) {
            if (name.startsWith("faculty-name")) {
              const index = parseInt(name.split("-")[2], 10);
              if (!value.trim()) 
                newErrors[`faculty-name-${index}`] = `Faculty ${index + 1}: Name is required.`;
              else if (!/^[A-Za-z\s]+$/.test(value))
                newErrors[`faculty-name-${index}`] = `Faculty ${index + 1}: Name must contain only letters and spaces.`;
              else delete newErrors[`faculty-name-${index}`];
            }
  
            if (name.startsWith("faculty-designation")) {
              const index = parseInt(name.split("-")[2], 10);
              newErrors[`faculty-designation-${index}`] = `value.trim() ? "" : Faculty ${index + 1}: Designation is required.`;
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validateForm()) {
      const formDataToSend = new FormData();
      formDataToSend.append("faculty_id", faculty_id);
      formDataToSend.append("financialYear", formData.financialYear);
      formDataToSend.append("department", formData.department);
      formDataToSend.append("startdateofProject", formData.startdateofProject);
      formDataToSend.append("numoffaculty", formData.numoffaculty);
      formDataToSend.append("titleofconsultancy", formData.titleofconsultancy);
      formDataToSend.append("domainofconsultancy", formData.domainofconsultancy);
      formDataToSend.append("clientorganization", formData.clientorganization);
      formDataToSend.append("clientaddress", formData.clientaddress);
      formDataToSend.append("amountreceived", formData.amountreceived);
      formDataToSend.append("dateofamountreceived", formData.dateofamountreceived);
      formDataToSend.append("facilities", formData.facilities);
  
      if (formData.report && formData.report.length > 0) {
        formData.report.forEach((file) => {
          if (file instanceof File) {
            formDataToSend.append("report", file);
          }
        });
      } else {
        formDataToSend.append("report", null);
      }
  
      formData.faculties.forEach((faculty, index) => {
        formDataToSend.append(`faculties[${index}][name], faculty.name`);
        formDataToSend.append(`faculties[${index}][designation], faculty.designation`);
        formDataToSend.append(`faculties[${index}][mailid], faculty.mailid`);
      });
  
      try {
        const response = await fetch("http://localhost:9001/addConsultancy", {
          method: "POST",
          body: formDataToSend,
        });
  
        const contentType = response.headers.get("Content-Type");
        let data;
  
        if (contentType && contentType.includes("application/json")) {
          data = await response.json();
        } else {
          data = await response.text();
        }
  
        if (response.ok) {
          if (data.message === "Form submitted successfully!") {
            setFormData({
              financialYear: "",
              department: "",
              startdateofProject: "",
              numoffaculty: 0,
              titleofconsultancy: "",
              domainofconsultancy: "",
              clientorganization: "",
              clientaddress: "",
              amountreceived: "", // Fix typo
              dateofamountreceived: "",
              facilities: "",
              report: null,
              faculties: [{ name: "", designation: "", mailid: "" }],
            });
            alert("Form submitted successfully!");
          }
        } else {
          alert("Failed to submit the form: " + (data.message || data));
        }
      } catch (error) {
        alert("Failed to submit the form due to network issues.");
      }
    }
  };



  return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Consultancy Application</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Financial Year</label>
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
            <label className="form-label">Department</label>
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
            <label className="form-label">Start Date Of Project</label>
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
            <label className="form-label">Number Of Faculty Involved</label>
            <input
              type="number"
              className="form-control"
              name="numoffaculty"
              value={formData.numoffaculty}
              onChange={handleNumFacultiesChange}
              min="0"
            />
          </div>
        </div>

        {formData.numoffaculty > 0 && formData.faculties?.map((faculty, index) => (
            <div className="row" key={index}>
            <div className="col-md-4 mb-3">
                <label className="form-label">Name (Faculty {index + 1})</label>
                <input
                type="text"
                className="form-control"
                name="name"
                value={faculty.name}
                onChange={(e) => handleFacultyChange(index, 'name', e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Designation (Faculty {index + 1})</label>
                <input
                type="text"
                className="form-control"
                name="designation"
                value={faculty.designation}
                onChange={(e) => handleFacultyChange(index, 'designation', e.target.value)}
                />
            </div>
            <div className="col-md-4 mb-3">
                <label className="form-label">Email ID (Faculty {index + 1})</label>
                <input
                type="email"
                className="form-control"
                name="mailid"
                value={faculty.mailid}
                onChange={(e) => handleFacultyChange(index, 'mailid', e.target.value)}
                />
            </div>
            </div>
            ))}


        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the consultancy</label>
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
            <label className="form-label">Domain of the consultancy</label>
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
            <label className="form-label">Client Organization</label>
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
            <label className="form-label">Client Address</label>
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
            <label className="form-label">Amount Received From Client</label>
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
            <label className="form-label">Date Of Amount Received</label>
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
            <label className="form-label">Facilities used to Do Consultancy</label>
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
            <label className="form-label">Report</label>
            <div className="custom-file">
                <input
                type="file"
                name="report"
                className="form-control"
                onChange={handleFileChange}  // No 'multiple' attribute
                />
            </div>
            {formData.report && (
                <div className="mt-3">
                <label className="form-label">Selected File:</label>
                <div className="list-group-item">
                    <span className="file-name">{formData.report.name}</span>
                </div>
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