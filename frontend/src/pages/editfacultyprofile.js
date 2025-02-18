import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const EditFacultyDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const defaultFacultyData = {
    institute_name: "",
    faculty_id: "",
    faculty_name: "",
    department: "",
    designation: "",
    research_domain: "",
    major_specialization: "",
    research_skills: "",
    qualification: "",
    phd_status: "",
    phd_registration_date: "",
    phd_university: "",
    phd_completed_year: "",
    guide_name: "",
    guide_phone_number: "",
    guide_mail_id: "",
    guide_department: "",
    date_of_joining_svecw: "",
    experience_in_svecw: "",
    previous_teaching_experience: "",
    total_experience: 0,
    industry_experience: "",
    ratified: "",
    official_mail_id: "",
    phone_number: "",
    course_network_id: "",
    faculty_profile_weblink: "",
    scopus_id: "",
    orcid: "",
    google_scholar_id: "",
    vidwan_portal: "",
    researcherid: "",
    password1: "",
  };

  const [facultyData, setFacultyData] = useState({
    ...defaultFacultyData,
    ...location.state?.facultyData, // Merge received data with defaults
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!facultyData.faculty_id) {
      setError("No faculty ID found.");
    }
  }, [facultyData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultyData((prev) => ({
      ...prev,
      [name]: value || "", // Avoid null values
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://localhost:5000/updatefacultyprofile/${facultyData.faculty_id}`,
        facultyData
      );
      alert("Details updated successfully");
      navigate("/profile");
    } catch (err) {
      setError("Failed to update faculty details. Please try again.");
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toISOString().split("T")[0];
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  const renderInputField = (key, value) => {
    let inputType = "text";
    let label = key.replace(/_/g, " ").toUpperCase();
  
    if (key.includes("date")) inputType = "date";
    if (key === "total_experience") inputType = "number";
    if (key === "password1") {
      
      label = "PASSWORD"; // Change label for password1 field
    }
  
    return (
      <div key={key} className="col-md-6 mb-3">
        <div className="form-group">
          <label htmlFor={key} className="fw-bold">
            {label}
          </label>
          <input
            type={inputType}
            id={key}
            name={key}
            className="form-control"
            value={inputType === "date" ? formatDate(value) : value}
            onChange={handleChange}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-primary text-center mb-4">Edit Faculty Details</h2>

      <form onSubmit={handleSubmit} className="card shadow-lg p-4">
        <div className="row">
          {Object.keys(facultyData)
            .filter((key) => key !== "faculty_id") // Ensure faculty_id is not duplicated
            .map((key) => renderInputField(key, facultyData[key]))}
        </div>

        <div className="text-center mt-4">
          <button type="submit" className="btn btn-success px-5" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditFacultyDetails;
