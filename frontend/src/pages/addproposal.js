import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ProposalForm = () => {
    const faculty_id = sessionStorage.getItem("faculty_id");
    const [formData, setFormData] = useState({
    referenceNumber: "",
    agencyScheme: "",
    submissionYear: "",
    submissionDate: "",
    piName: "",
    piDepartment: "",
    piDesignation: "",
    piPhone: "",
    piEmail: "",
    projectTitle: "",
    amountRequested: "",
    projectStatus: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
        case "referenceNumber":
            if (!value.trim()) error = "Reference number/Application number is required.";
            break;
        case "agencyScheme":
            if (!value.trim()) error = "Agency&schema is required.";
            break;
        case "piName":
            if (!value.trim()) error = "Name of PI is required.";
            break;
        case "piDepartment":
            if (!value.trim()) error = "Department of PI is required.";
            break;
        case "piDesignation":
            if (!value.trim()) error = "Designation of PI is required.";
            break;
        case "projectTitle":
            if (!value.trim()) error = "Title of project is required.";
            break;
        case "projectStatus":
            if (!value.trim()) error = "Status of project is required.";
            break;
        case "submissionYear":
            if (!value) error = "Please select a submission year.";
            break;
        case "submissionDate":
            if (!value) error = "Submission date is required.";
            break;
        case "piPhone":
            if (!/^[0-9]{10}$/.test(value)) error = "Enter a valid 10-digit phone number.";
            break;
        case "piEmail":
            if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) error = "Enter a valid email address.";
            break;
        case "amountRequested":
            if (!/^[0-9]+$/.test(value)) error = "Enter a valid amount.";
            break;
        default:
            break;
    }
    return error;
  };

  const validate = () => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("Please fill in all required fields before submitting.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/addProposal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, faculty_id }),
      });

      if (response.ok) {
        alert("Form submitted successfully.");
        navigate("/viewproposals");
        setFormData({
          referenceNumber: "",
          agencyScheme: "",
          submissionYear: "",
          submissionDate: "",
          piName: "",
          piDepartment: "",
          piDesignation: "",
          piPhone: "",
          piEmail: "",
          projectTitle: "",
          amountRequested: "",
          projectStatus: "",
        });
        setErrors({});
      } else {
        alert("Error submitting form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    }
  };


  return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Project Proposal Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Reference Number / Application Number<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="referenceNumber" className="form-control" value={formData.referenceNumber} onChange={handleChange} />
            {errors.referenceNumber && <div className="text-danger">{errors.referenceNumber}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Agency & Scheme<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="agencyScheme" className="form-control" value={formData.agencyScheme} onChange={handleChange} />
            {errors.agencyScheme && <div className="text-danger">{errors.agencyScheme}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Year of Submission<span style={{ color: "red" }}>*</span></label>
            <select name="submissionYear" className="form-control" value={formData.submissionYear} onChange={handleChange}>
              <option value="">Select Year</option>
              {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {errors.submissionYear && <div className="text-danger">{errors.submissionYear}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Date of the Project Submitted<span style={{ color: "red" }}>*</span></label>
            <input type="date" name="submissionDate" className="form-control" value={formData.submissionDate} onChange={handleChange} />
            {errors.submissionDate && <div className="text-danger">{errors.submissionDate}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name of the PI<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="piName" className="form-control" value={formData.piName} onChange={handleChange} />
            {errors.piName && <div className="text-danger">{errors.piName}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Department of the PI<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="piDepartment" className="form-control" value={formData.piDepartment} onChange={handleChange} />
            {errors.piDepartment && <div className="text-danger">{errors.piDepartment}</div>}
          </div>
        </div>


        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Designation of PI<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="piDesignation" className="form-control" value={formData.piDesignation} onChange={handleChange} />
            {errors.piDesignation && <div className="text-danger">{errors.piDesignation}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Phone Number of PI<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="piPhone" className="form-control" value={formData.piPhone} onChange={handleChange} />
            {errors.piPhone && <div className="text-danger">{errors.piPhone}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Mail ID of PI<span style={{ color: "red" }}>*</span></label>
            <input type="email" name="piEmail" className="form-control" value={formData.piEmail} onChange={handleChange} />
            {errors.piEmail && <div className="text-danger">{errors.piEmail}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Title of the Project<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="projectTitle" className="form-control" value={formData.projectTitle} onChange={handleChange} />
            {errors.projectTitle && <div className="text-danger">{errors.projectTitle}</div>}
          </div>
        </div>
        
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Amount Requested in Rs.<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="amountRequested" className="form-control" value={formData.amountRequested} onChange={handleChange} />
            {errors.amountRequested && <div className="text-danger">{errors.amountRequested}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Status of the Project<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="projectStatus" className="form-control" value={formData.projectStatus} onChange={handleChange} />
            {errors.projectStatus && <div className="text-danger">{errors.projectStatus}</div>}
          </div>
        </div>


        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ProposalForm;