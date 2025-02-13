import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";
const PatentForm = () => {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: "",
    iprType: "",
    applicationNumber: "",
    applicantName: "",
    department: "",
    filingDate: "",
    inventionTitle: "",
    numOfInventors: 0,
    inventors: [],
    status1: "",
    dateOfPublished: "",
    dateOfGranted: "",
    proofOfPatent: null,
  });

  const [errors, setErrors] = useState({});

  
  // Handle Number of Inventors Change
  const handleNumOfInventorsChange = (e) => {
    const value = parseInt(e.target.value);
    setFormData({
      ...formData,
      numOfInventors: value,
      inventors: Array(value).fill(""), // Reset inventors' fields
    });
  
    // After updating, validate the inventors
    validateInventors(value, Array(value).fill(""));
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
  
    // Real-time validation for the changed field
    let newErrors = { ...errors };
  
    // Validate the specific field that was changed
    newErrors = validateField(name, value, newErrors);
  
    // Set the errors state
    setErrors(newErrors);
  };
  
  const handleInventorChange = (index, e) => {
    const newInventors = [...formData.inventors];
    newInventors[index] = e.target.value; // Update the specific inventor's name
  
    // Update the form data
    setFormData({
      ...formData,
      inventors: newInventors,
    });
  
    // Validate the inventors and update the errors state
    const updatedErrors = validateInventors(formData.numOfInventors, newInventors);
    setErrors(updatedErrors);
  };
  
  
  const validateInventors = (numOfInventors, inventors) => {
    let errors = {};
  
    if (!numOfInventors || numOfInventors <= 0) {
      errors.numOfInventors = "Number of inventors must be greater than 0";
    }
  
    inventors.forEach((inventor, index) => {
      if (!inventor || inventor.trim() === "") {
        errors[`inventors[${index}]`] = "Inventor name is required";
      }
    });
  
    return errors;
  };
  
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      proofOfPatent: file,
    });

    let newErrors = { ...errors };

    if (file) {
      if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        newErrors.proofOfPatent = "Please upload a valid file (PDF, PNG, JPEG).";
      } else {
        delete newErrors.proofOfPatent;
      }
    } else {
      newErrors.proofOfPatent = "Please upload a proof of patent (e.g., PDF, image file).";
    }

    setErrors(newErrors);
  };

  

// Validate individual fields
const validateField = (name, value, newErrors) => {
  // Ensure newErrors is always initialized as an empty object
  newErrors = newErrors || {};

  switch (name) {
    case "category":
      if (!value) {
        newErrors.category = "Please select a category (National or International).";
      } else {
        delete newErrors.category;
      }
      break;

    case "iprType":
      if (!value) {
        newErrors.iprType = "Please select the type of IPR (Utility Patent, Design Patent, etc.).";
      } else {
        delete newErrors.iprType;
      }
      break;

    case "applicationNumber":
      if (!value) {
        newErrors.applicationNumber = "Please enter the application number (e.g., AP-12345).";
      } else {
        delete newErrors.applicationNumber;
      }
      break;

    case "applicantName":
      if (!value) {
        newErrors.applicantName = "Please enter the full name of the applicant.";
      } else {
        delete newErrors.applicantName;
      }
      break;

    case "department":
      if (!value) {
        newErrors.department = "Please enter the department where the patent is filed.";
      } else {
        delete newErrors.department;
      }
      break;

    case "filingDate":
      if (!value) {
        newErrors.filingDate = "Please select a valid filing date.";
      } else if (isNaN(new Date(value))) {
        newErrors.filingDate = "The filing date entered is not valid. Please select a valid date.";
      } else {
        delete newErrors.filingDate;
      }
      break;

    case "inventionTitle":
      if (!value) {
        newErrors.inventionTitle = "Please provide a title for your invention.";
      } else {
        delete newErrors.inventionTitle;
      }
      break;
    
      case "numOfInventors":
        if (value <= 0) {
          newErrors.numOfInventors = "Please enter a valid number of inventors (at least 1).";
        } else {
          delete newErrors.numOfInventors;
        }
        break;
      

    case "status1":
      if (!value) {
        newErrors.status1 = "Please select the status of the patent (Filed, Published, Granted).";
      } else {
        delete newErrors.status1;
      }
      break;

    case "dateOfPublished":
      if (formData.status1 === "published" && !value) {
        newErrors.dateOfPublished = "Please enter the date when the patent was published.";
      } else if (formData.status1 === "published" && isNaN(new Date(value))) {
        newErrors.dateOfPublished = "Please select a valid publication date.";
      } else {
        delete newErrors.dateOfPublished;
      }
      break;

    case "dateOfGranted":
      if (formData.status1=== "granted" && !value) {
        newErrors.dateOfGranted = "Please enter the date when the patent was granted.";
      } else if (formData.status1 === "granted" && isNaN(new Date(value))) {
        newErrors.dateOfGranted = "Please select a valid granted date.";
      } else {
        delete newErrors.dateOfGranted;
      }
      break;

      case "proofOfPatent":
        if (!value) {
          newErrors.proofOfPatent = "Please upload a proof of patent (e.g., PDF, image file).";
        } else if (!value.name) {
          newErrors.proofOfPatent = "It seems the file upload failed. Please try uploading the proof again.";
        } else if (!["application/pdf", "image/png", "image/jpeg"].includes(value.type)) {
          newErrors.proofOfPatent = "Please upload a valid file (PDF, PNG, JPEG).";
        } else {
          delete newErrors.proofOfPatent; // Remove error if the field is correct
        }
        break;
    default:
      break;
  }
  return newErrors;
};

const validateForm = () => {
  let newErrors = {};

  Object.keys(formData).forEach((key) => {
    if (key !== "inventors") {
      newErrors = validateField(key, formData[key], newErrors);
    }
  });

  // Merge inventor errors correctly
  const inventorErrors = validateInventors(formData.numOfInventors, formData.inventors);
  newErrors = { ...newErrors, ...inventorErrors };

  return newErrors;
};


const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = validateForm();
  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    alert("Please fill in all required fields before submitting.");
    console.log("Form validation failed:", newErrors);
    return; // Stop submission
  }

  console.log("Form submitted successfully:", formData);
  try {
    const dataToSend = new FormData();
    dataToSend.append('faculty_id', faculty_id);
    Object.keys(formData).forEach(key => {
      if (key === 'inventors') {
        formData.inventors.forEach((inventor, index) => {
          dataToSend.append(`inventors[${index}]`, inventor);
        });
      } else {
        dataToSend.append(key, formData[key]);
      }
    });

    const response = await axios.post("http://localhost:5000/addPatent", dataToSend, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.status === 200) {
      console.log("Patent form submitted successfully", response.data);
      navigate("/viewpatents");
    } else {
      console.error("Patent form submission failed");
    }
  } catch (error) {
    console.error("Error submitting patent form:", error);
  }
};



  return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Patent Form</h2>
      <form onSubmit={handleSubmit}>
        {/* Category and IPR Type */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category<span style={{ color: "red" }}>*</span></label>
            <select
              name="category"
              className="form-control"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="national">National</option>
              <option value="international">International</option>
            </select>
            {errors.category && <div className="text-danger">{errors.category}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Type of IPR<span style={{ color: "red" }}>*</span></label>
            <select
              name="iprType"
              className="form-control"
              value={formData.iprType}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              <option value="utilityPatent">Utility Patent/Product</option>
              <option value="designPatent">Design Patent</option>
              <option value="copyright">Copyright</option>
              <option value="trademark">Trademark</option>
            </select>
            {errors.iprType && <div className="text-danger">{errors.iprType}</div>}
          </div>
        </div>

        {/* Application Number and Applicant Name */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Application Number<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="applicationNumber"
              className="form-control"
              value={formData.applicationNumber}
              onChange={handleChange}
            />
            {errors.applicationNumber && <div className="text-danger">{errors.applicationNumber}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Applicant Name<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="applicantName"
              className="form-control"
              value={formData.applicantName}
              onChange={handleChange}
            />
            {errors.applicantName && <div className="text-danger">{errors.applicantName}</div>}
          </div>
        </div>

        {/* Department and Filing Date */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Department<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="department"
              className="form-control"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <div className="text-danger">{errors.department}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Date of Filing<span style={{ color: "red" }}>*</span></label>
            <input
              type="date"
              name="filingDate"
              className="form-control"
              value={formData.filingDate}
              onChange={handleChange}
            />
            {errors.filingDate && <div className="text-danger">{errors.filingDate}</div>}
          </div>
        </div>

        {/* Title of Invention and Number of Inventors */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Title of Invention<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              name="inventionTitle"
              className="form-control"
              value={formData.inventionTitle}
              onChange={handleChange}
            />
            {errors.inventionTitle && <div className="text-danger">{errors.inventionTitle}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Number of Inventors<span style={{ color: "red" }}>*</span></label>
            <select
              name="numOfInventors"
              className="form-control"
              value={formData.numOfInventors}
              onChange={handleNumOfInventorsChange}
            >
              <option value={0}>Select Number</option>
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.numOfInventors && <div className="text-danger">{errors.numOfInventors}</div>}
          </div>
          </div>

          {/* Dynamically Render Inventor Fields */}
          {formData.numOfInventors > 0 &&
            Array.from({ length: Math.ceil(formData.numOfInventors / 2) }, (_, rowIndex) => (
              <div className="row" key={rowIndex}>
                {/* Render the first inventor in the pair */}
                <div className="col-md-6 mb-3">
                  <label>Inventor {rowIndex * 2 + 1} with affiliation<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.inventors?.[rowIndex * 2] || ""}
                    onChange={(e) => handleInventorChange(rowIndex * 2, e)}
                  />
                  {errors[`inventors[${rowIndex * 2}]`] && (
                    <div className="text-danger">{errors[`inventors[${rowIndex * 2}]`]}</div>
                  )}
                </div>

                {/* Render the second inventor in the pair, if it exists */}
                {rowIndex * 2 + 1 < formData.numOfInventors && (
                  <div className="col-md-6 mb-3">
                    <label>Inventor {rowIndex * 2 + 2} with affiliation<span style={{ color: "red" }}>*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.inventors?.[rowIndex * 2 + 1] || ""}
                      onChange={(e) => handleInventorChange(rowIndex * 2 + 1, e)}
                    />
                    {errors[`inventors[${rowIndex * 2 + 1}]`] && (
                      <div className="text-danger">{errors[`inventors[${rowIndex * 2 + 1}]`]}</div>
                    )}
                  </div>
                )}
              </div>
            ))}



        {/* Status1status and Conditional Date Fields */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Status<span style={{ color: "red" }}>*</span></label>
            <select
              name="status1"
              className="form-control"
              value={formData.status1}
              onChange={handleChange}
            >
              <option value="">Select status</option>
              <option value="filed">Filed</option>
              <option value="published">Published</option>
              <option value="granted">Granted</option>
            </select>
            {errors.status1 && <div className="text-danger">{errors.status1}</div>}
          </div>

          {formData.status1 === "published" && (
            <div className="col-md-6 mb-3">
              <label>Date of Publication<span style={{ color: "red" }}>*</span></label>
              <input
                type="date"
                name="dateOfPublished"
                className="form-control"
                value={formData.dateOfPublished}
                onChange={handleChange}
              />
              {errors.dateOfPublished && <div className="text-danger">{errors.dateOfPublished}</div>}
            </div>
          )}

          {formData.status1 === "granted" && (
            <div className="col-md-6 mb-3">
              <label>Date of Granted<span style={{ color: "red" }}>*</span></label>
              <input
                type="date"
                name="dateOfGranted"
                className="form-control"
                value={formData.dateOfGranted}
                onChange={handleChange}
              />
              {errors.dateOfGranted && <div className="text-danger">{errors.dateOfGranted}</div>}
            </div>
          )}

        {/* Proof of Patent Upload */}
        <div className="col-md-6 mb-3">
            <label>Proof of Patent (PDF, PNG, JPEG)<span style={{ color: "red" }}>*</span></label>
            <input
              type="file"
              name="proofOfPatent"
              className="form-control"
              onChange={handleFileChange}
            />
            {errors.proofOfPatent && <div className="text-danger">{errors.proofOfPatent}</div>}
      </div>

        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">
            Submit 
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatentForm;