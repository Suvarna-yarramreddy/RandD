import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFaculty } from "./facultyContext";

const AddPublicationPage = () => {
  const { faculty_id} = useFaculty();
  const [formData, setFormData] = useState({
    natureOfPublication: "",
    typeOfPublication: "",
    titleOfPaper: "",
    nameOfJournalConference: "",
    nameOfPublisher: "",
    issnIsbn: "",
    authorStatus: "",
    firstAuthorName: "",
    firstAuthorAffiliation: "",
    coAuthors: "",
    indexed: "",
    quartile: "",
    impactFactor: "",
    doi: "",
    linkOfPaper: "",
    scopusLink: "",
    volume: "",
    pageNo: "",
    monthYear: "",
    citeAs: ""
  });

  const [errors, setErrors] = useState({
    natureOfPublication: "",
    typeOfPublication: "",
    titleOfPaper: "",
    nameOfJournalConference: "",
    nameOfPublisher: "",
    issnIsbn: "",
    authorStatus: "",
    firstAuthorName: "",
    firstAuthorAffiliation: "",
    coAuthors: "",
    indexed: "",
    quartile: "",
    impactFactor: "",
    doi: "",
    linkOfPaper: "",
    scopusLink: "",
    volume: "",
    pageNo: "",
    monthYear: "",
    citeAs: ""
  });
  const navigate = useNavigate();
  const validateField = (key, value) => {
    let error = "";
  
    switch (key) {
      case "natureOfPublication":
        if (!value) error = "Please select the nature of the publication (e.g., Journal, Conference).";
        break;
  
      case "typeOfPublication":
        if (!value) error = "Please specify the type of publication (e.g., Research Paper, Review).";
        break;
  
      case "titleOfPaper":
        if (!value) error = "Enter the title of your paper (minimum 5 characters).";
        else if (value.length < 5)
          error = "The title must be at least 5 characters long.";
        break;
  
      case "nameOfJournalConference":
        if (!value) error = "Provide the name of the journal or conference where your paper was published.";
        break;
  
      case "issnIsbn":
        if (!value) error = "Enter a valid ISSN (e.g., 1234-567X) or ISBN (e.g., 9781234567890).";
        else if (
          !/^(97(8|9))?\d{9}(\d|X)$/i.test(value) && // ISBN format
          !/^\d{4}-\d{3}[\dX]$/i.test(value) // ISSN format
        )
          error = "Invalid ISSN/ISBN format. ISSN should be like '1234-567X', ISBN like '9781234567890'.";
        break;
  
      case "doi":
        if (!value || !/^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(value))
          error = "Provide a valid DOI (e.g., 10.1000/xyz123).";
        break;
  
      case "linkOfPaper":
        if (!value || !/^(https?:\/\/[^\s]+)$/i.test(value))
          error = "Provide a valid URL for the paper (e.g., https://example.com).";
        break;
  
      case "scopusLink":
        if (!value || !/^(https?:\/\/[^\s]+)$/i.test(value))
          error = "Provide a valid Scopus link (e.g., https://www.scopus.com/...).";
        break;
  
      case "volume":
        if (!value || isNaN(value)) error = "Volume number must be a numeric value.";
        break;
  
      case "pageNo":
        if (!value || isNaN(value)) error = "Page number must be a numeric value.";
        break;
  
        case "monthYear":
          if (!value) {
            error = "Please select the publication date.";
          } else if (!/^\d{4}-\d{2}$/.test(value)) {
            error = "The date must follow the format YYYY-MM (e.g., 2023-08).";
          } else {
            const [year, month] = value.split("-");
            const yearInt = parseInt(year, 10);
            const monthInt = parseInt(month, 10);
            if (monthInt < 1 || monthInt > 12 || yearInt < 1900 || yearInt > new Date().getFullYear()) {
              error = "Invalid date. Ensure the month is between 01 and 12, and the year is reasonable.";
            }
          }
          break;
        
  
      default:
        if (!value) error = `Please fill out the ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`;
    }
  
    return error;
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  
    // Real-time validation for specific fields
    const fieldError = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: fieldError,
    }));
  };
  
  const handleSubmit = async (e) => {
    // Prevent default form submission behavior
    e.preventDefault();
  
    // Validate all fields before submission
    let newErrors = {};
    Object.keys(formData).forEach((key) => {
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    });
  
    // Update the errors state
    setErrors(newErrors);
  
    // Check if the form is valid
    const isValid = Object.values(newErrors).every((error) => error === "");
    if (!isValid) {
      // Exit if the form is not valid
      return;
    }
  
    try {
      // Prepare the data to send
      const dataToSend = {
        faculty_id, // Pass facultyId
        ...formData, // Spread the formData
      };
  
      // Make the POST request using axios
      const response = await axios.post("http://localhost:5000/addPublication", dataToSend);
  
      if (response.status === 200) {
        // Navigate to the publications page after successful submission
        navigate("/viewpublications");
      }
    } catch (error) {
      // Handle errors gracefully
      if (error.response) {
        setErrors({ form: error.response.data.message || "An error occurred." });
      }
    }
  };
  


  return (
    <div className="container mt-5">
          <h2 className="text-center mb-4">Add Publication Details</h2>
          <form onSubmit={handleSubmit}>
            {/* Row 1 - Nature of Publication and Type of Publication */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nature of Publication</label>
                <select
                  name="natureOfPublication"
                  className="form-select"
                  onChange={handleInputChange}
                  value={formData.natureOfPublication}
                >
                  <option value="">Select Nature</option>
                  <option value="International">International</option>
                  <option value="National">National</option>
                </select>
                {errors.natureOfPublication && <div className="text-danger">{errors.natureOfPublication}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Type of Publication</label>
                <select
                  name="typeOfPublication"
                  className="form-select"
                  onChange={handleInputChange}
                  value={formData.typeOfPublication}
                >
                  <option value="">Select Type</option>
                  <option value="Journal">Journal</option>
                  <option value="Conference">Conference</option>
                  <option value="Book Chapter">Book Chapter</option>
                  <option value="Book">Book</option>
                </select>
                {errors.typeOfPublication && <div className="text-danger">{errors.typeOfPublication}</div>}
              </div>
            </div>

            {/* Row 2 - Title of Paper and Name of Journal/Conference */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title of the Paper</label>
                <input
                  type="text"
                  name="titleOfPaper"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.titleOfPaper}
                />
                {errors.titleOfPaper && <div className="text-danger">{errors.titleOfPaper}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Name of Journal/Conference</label>
                <input
                  type="text"
                  name="nameOfJournalConference"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.nameOfJournalConference}
                />
                {errors.nameOfJournalConference && <div className="text-danger">{errors.nameOfJournalConference}</div>}
              </div>
            </div>

            {/* Row 3 - Name of Publisher and ISSN/ISBN */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name of Publisher</label>
                <input
                  type="text"
                  name="nameOfPublisher"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.nameOfPublisher}
                />
                {errors.nameOfPublisher && <div className="text-danger">{errors.nameOfPublisher}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">ISSN/ISBN Number</label>
                <input
                  type="text"
                  name="issnIsbn"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.issnIsbn}
                />
                {errors.issnIsbn && <div className="text-danger">{errors.issnIsbn}</div>}
              </div>
            </div>

            {/* Row 4 - Author Status and First Author Name */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Are you First Author/Corresponding Author?</label>
                <select
                  name="authorStatus"
                  className="form-select"
                  onChange={handleInputChange}
                  value={formData.authorStatus}
                >
                  <option value="">Select Author Status</option>
                  <option value="First Author">First Author</option>
                  <option value="Corresponding Author">Corresponding Author</option>
                </select>
                {errors.authorStatus && <div className="text-danger">{errors.authorStatus}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Name of the First Author</label>
                <input
                  type="text"
                  name="firstAuthorName"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.firstAuthorName}
                />
                {errors.firstAuthorName && <div className="text-danger">{errors.firstAuthorName}</div>}
              </div>
            </div>

            {/* Row 5 - First Author Affiliation and Co-Authors */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Affiliation of First Author</label>
                <input
                  type="text"
                  name="firstAuthorAffiliation"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.firstAuthorAffiliation}
                />
                {errors.firstAuthorAffiliation && <div className="text-danger">{errors.firstAuthorAffiliation}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Details of the Co-Authors</label>
                <input
                  type="text"
                  name="coAuthors"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.coAuthors}
                />
                {errors.coAuthors && <div className="text-danger">{errors.coAuthors}</div>}
              </div>
            </div>

            {/* Row 6 - Indexed and Quartile */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Indexed</label>
                <input
                  type="text"
                  name="indexed"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.indexed}
                />
                {errors.indexed && <div className="text-danger">{errors.indexed}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Quartile</label>
                <select
                  name="quartile"
                  className="form-select"
                  onChange={handleInputChange}
                  value={formData.quartile}
                >
                  <option value="">Select Quartile</option>
                  <option value="Q1">Q1</option>
                  <option value="Q2">Q2</option>
                  <option value="Q3">Q3</option>
                  <option value="Q4">Q4</option>
                </select>
                {errors.quartile && <div className="text-danger">{errors.quartile}</div>}
              </div>
            </div>

            {/* Row 7 - Impact Factor and DOI */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Impact Factor</label>
                <input
                  type="text"
                  name="impactFactor"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.impactFactor}
                />
                {errors.impactFactor && <div className="text-danger">{errors.impactFactor}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">DOI</label>
                <input
                  type="text"
                  name="doi"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.doi}
                />
                {errors.doi && <div className="text-danger">{errors.doi}</div>}
              </div>
            </div>

            {/* Row 8 - Link of Paper and Scopus Link */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Link of the Paper</label>
                <input
                  type="url"
                  name="linkOfPaper"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.linkOfPaper}
                />
                {errors.linkOfPaper && <div className="text-danger">{errors.linkOfPaper}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Scopus Paper Link</label>
                <input
                  type="url"
                  name="scopusLink"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.scopusLink}
                />
                {errors.scopusLink && <div className="text-danger">{errors.scopusLink}</div>}
              </div>
            </div>

            {/* Row 9 - Volume and Page Number */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Volume</label>
                <input
                  type="text"
                  name="volume"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.volume}
                />
                {errors.volume && <div className="text-danger">{errors.volume}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Page No</label>
                <input
                  type="text"
                  name="pageNo"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.pageNo}
                />
                {errors.pageNo && <div className="text-danger">{errors.pageNo}</div>}
              </div>
            </div>

            {/* Row 10 - Month & Year and Cite As */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Month & Year</label>
                <input
                  type="month"
                  name="monthYear"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.monthYear}
                />
                {errors.monthYear && <div className="text-danger">{errors.monthYear}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Cite As</label>
                <input
                  type="text"
                  name="citeAs"
                  className="form-control"
                  onChange={handleInputChange}
                  value={formData.citeAs}
                />
                {errors.citeAs && <div className="text-danger">{errors.citeAs}</div>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          </form>
        </div>
    
  );
};

export default AddPublicationPage;
