import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddPublicationPage = () => {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const [formData, setFormData] = useState({
    natureOfPublication: "",
    typeOfPublication: "",
    titleOfPaper: "",
    nameOfJournalConference: "",
    titleofChapter: "",
    nameofbook: "",
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
    citeAs: "",
    proofOfPublication:""
  });

  const [errors, setErrors] = useState({});
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
        if (formData.typeOfPublication !== "Book Chapter") {
          if (!value) error = "Enter the title of your paper (minimum 5 characters).";
          else if (value.length < 5) error = "The title must be at least 5 characters long.";
        }
        break;

      case "titleofChapter":
        if (formData.typeOfPublication === "Book Chapter") {
          if (!value) error = "Enter the title of your chapter (minimum 5 characters).";
          else if (value.length < 5) error = "The title must be at least 5 characters long.";
        }
        break;

      case "nameofbook":
        if (formData.typeOfPublication === "Book Chapter" && !value)
          error = "Provide the name of the book where your chapter was published.";
        break;

      case "nameOfJournalConference":
        if (formData.typeOfPublication !== "Book Chapter" && !value)
          error = "Provide the name of the journal or conference where your paper was published.";
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
        case "proofOfPublication":
          if (!value) error = "Please upload proof of publication.";
        break;
        case "quartile":
    case "impactFactor":
      if (formData.typeOfPublication === "Journal") {
        if (!value) {
          error = `${key === "quartile" ? "Quartile" : "Impact Factor"} is required for Journal publications.`;
        }
      }
      break;
      default:
        if (!value && key !== "volume" && key !== "pageNo"){
           error = `Please fill out the ${key.replace(/([A-Z])/g, " $1").toLowerCase()}.`;
        }
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      proofOfPublication: file, // Changed to proofOfPublication
    });

    let newErrors = { ...errors };

    if (file) {
      if (!["application/pdf", "image/png", "image/jpeg"].includes(file.type)) {
        newErrors.proofOfPublication = "Please upload a valid file (PDF, PNG, JPEG).";
      } else {
        delete newErrors.proofOfPublication;
      }
    } else {
      newErrors.proofOfPublication = "Please upload a proof of publication (e.g., PDF, image file).";
    }

    setErrors(newErrors);
};

const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent default form submission

  let newErrors = {};

  // Validate all form fields except file input
  Object.keys(formData).forEach((key) => {
    if (key !== "proofOfPublication") { // Ignore file input for now
      const fieldError = validateField(key, formData[key]);
      if (fieldError) {
        newErrors[key] = fieldError;
      }
    }
  });

  // Check proofOfPublication separately
  if (!formData.proofOfPublication) {
    newErrors.proofOfPublication = "Please upload a proof of publication (PDF, PNG, JPEG).";
  }

  // If any validation errors exist, set errors and stop submission
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    const formDataToSend = new FormData();

    // Append all form data to FormData
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Append faculty_id
    formDataToSend.append("faculty_id", faculty_id);

    const response = await axios.post("http://localhost:5000/addPublication", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 200) {
      alert("Publication added successfully!");
      navigate("/viewpublications");
    }
  } catch (error) {
    if (error.response) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: error.response.data.message || "An error occurred.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Network error. Please check your connection.",
      }));
    }
  }
};

  
  
  return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Add Publication</h2>
      <form onSubmit={handleSubmit}>
        {/* Row 1 - Nature of Publication and Type of Publication */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Nature of Publication<span style={{ color: "red" }}>*</span></label>
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
            <label className="form-label">Type of Publication<span style={{ color: "red" }}>*</span></label>
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

        {/* Title of Paper or Chapter */}
        {formData.typeOfPublication !== "Book Chapter" ? (
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of Paper<span style={{ color: "red" }}>*</span></label>
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
              <label className="form-label">Name of Journal/Conference<span style={{ color: "red" }}>*</span></label>
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
          
        ) : (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Title of Chapter<span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                name="titleofChapter"
                className="form-control"
                onChange={handleInputChange}
                value={formData.titleofChapter}
              />
              {errors.titleofChapter && <div className="text-danger">{errors.titleofChapter}</div>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Name of Book<span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                name="nameofbook"
                className="form-control"
                onChange={handleInputChange}
                value={formData.nameofbook}
              />
              {errors.nameofbook && <div className="text-danger">{errors.nameofbook}</div>}
            </div>
          </div>
        )}

            {/* Row 3 - Name of Publisher and ISSN/ISBN */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name of Publisher<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">ISSN/ISBN Number<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Are you First Author/Corresponding Author?<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Name of the First Author<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Affiliation of First Author<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Details of  all the Co-Authors with Affiliation<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Indexed<span style={{ color: "red" }}>*</span></label>
                <select
                  name="indexed"
                  className="form-select"
                  onChange={handleInputChange}
                  value={formData.indexed}
                >
                  <option value="">Select Indexed</option>
                  <option value="Q1">Scopus</option>
                  <option value="Q2">WOS-ESCI</option>
                  <option value="Q3">WOS-SCI</option>
                  <option value="Q4">WOS-SCIE</option>
                </select>
                {errors.indexed && <div className="text-danger">{errors.indexed}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">DOI<span style={{ color: "red" }}>*</span></label>
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
              
            {/* Row 6 - Indexed and Quartile (Only for Journal) */}
            {formData.typeOfPublication === "Journal" && (
                <div className="row">
                  {/* Quartile */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quartile<span style={{ color: "red" }}>*</span></label>
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
                      <option value="N/A">N/A</option>
                    </select>
                    {errors.quartile && <div className="text-danger">{errors.quartile}</div>}
                  </div>

                  {/* Impact Factor */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Impact Factor{" "}
                      <a
                        href="https://www.bioxbio.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ marginLeft: "5px", textDecoration: "none", color: "blue" }}
                      >
                        (https://www.bioxbio.com/)
                      </a><span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="impactFactor"
                      className="form-control"
                      onChange={handleInputChange}
                      value={formData.impactFactor}
                    />
                    {errors.impactFactor && <div className="text-danger">{errors.impactFactor}</div>}
                  </div>
                </div>
              )}


            {/* Row 8 - Link of Paper and Scopus Link */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Link of the Paper<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Scopus Paper Link<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Year & Month<span style={{ color: "red" }}>*</span></label>
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
                <label className="form-label">Cite As(IEEE format)<span style={{ color: "red" }}>*</span></label>
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
            <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Proof of Publication (Upload File)<span style={{ color: "red" }}>*</span></label>
                  <input
                    type="file"
                    name="proofOfPublication"
                    className="form-control"
                    onChange={handleFileChange}
                  />
                  {errors.proofOfPublication && <div className="text-danger">{errors.proofOfPublication}</div>}
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