import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginInstCoordinator = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    coordinatorid: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginData.coordinatorid || !loginData.password) {
      setErrorMessage("All fields are required.");
    } else if (loginData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
    } else {
      setErrorMessage("");

      try {
        const response = await axios.post(
          "http://localhost:5000/institute_coordinator_login",
          loginData
        );

        if (response.data.success) {
          // Store session data
          sessionStorage.setItem("isLoggedIn", "true");
          sessionStorage.setItem("coordinatorid", response.data.coordinatorid);
          sessionStorage.setItem("role", "institutecoordinator");

          // Redirect to dashboard
          navigate("/instcorwelcome");
        } else {
          setErrorMessage("Invalid credentials.");
        }
      } catch (error) {
        setErrorMessage("ID or password is incorrect.");
      }
    }
  };

  return (
    <div className="container mt-3" style={{ maxWidth: "600px" }}>
        <div>
      <h1 className="text-center mb-4">Institute Coordinator Login</h1>
      </div>
      <div className="container mt-3" style={{ maxWidth: "500px" }}>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Institute Coordinator ID:</label>
          <input
            type="text"
            className="form-control"
            name="coordinatorid"
            value={loginData.coordinatorid}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password:</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={loginData.password}
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
    </div>
  );
};

export default LoginInstCoordinator;
