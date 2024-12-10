import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useFaculty } from "./facultyContext";
const Loginpage = () => {
  const { faculty_id, setFacultyId } = useFaculty();
  const [loginData, setLoginData] = useState({
    faculty_id: "",
    password1: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();  // For navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post("http://localhost:5000/login", loginData);

        if (response.status === 200) {
            // Save faculty_name and faculty_id in state or localStorage
            const { faculty_name, faculty_id } = response.data;

            console.log("Login successful");
            // Save faculty_id and faculty_name in localStorage or state
            localStorage.setItem("faculty_name", faculty_name);
            localStorage.setItem("faculty_id", faculty_id);
            setFacultyId(faculty_id);
            // Navigate to home page
            navigate("/home");
        }
    } catch (error) {
        if (error.response) {
            setErrorMessage(error.response.data.message || "An error occurred. Please try again.");
        } else {
            setErrorMessage("Network error. Please try again.");
        }
    }
};

  
  

  return (
    <div className="container mt-3" style={{ maxWidth: "500px" }}>
      <h1
        className="text-center mb-4"
        style={{ fontSize: "1.8rem", fontWeight: "bold" }}
      >
        Faculty Login
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Faculty ID:</label>
          <input
            type="text"
            className="form-control"
            name="faculty_id"
            value={loginData.faculty_id}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password1"
            value={loginData.password1}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
        {errorMessage && (
          <div className="alert alert-danger mt-3">{errorMessage}</div>
        )}
      </form>
    </div>
  );
};

export default Loginpage;
