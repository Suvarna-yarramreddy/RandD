import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./svecw.jpg";
import Sidebar from "./sidebar"; // Import Sidebar component

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State to toggle sidebar
  const navigate = useNavigate();

  // Navigate to the landing page (Home)
  const handleHomeClick = () => {
    navigate("/");
  };

  // Navigate to the signup page
  const handleSignupClick = () => {
    navigate("/signup");
  };

  // Navigate to login as specific roles
  const handleRoleLogin = (role) => {
    navigate("/login");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: "#d3d3d3" }}> {/* Set light grey background */}
        <div className="container-fluid d-flex align-items-center"> {/* Changed to container-fluid */}
          {/* Sidebar Toggle Icon */}
          <button
            className="btn me-2"
            style={{
              backgroundColor: "grey",
              border: "none",
              outline: "none",
            }}
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars" style={{ fontSize: "25px", color: "white" }}></i> {/* FontAwesome icon */}
          </button>

          {/* Logo container */}
          <div className="navbar-brand d-flex align-items-center p-0">
            <img 
              src={logo} 
              alt="SVECW Logo" 
              style={{ height: "60px", border: "none", outline: "none", boxShadow: "none", display: "block" }} // Reset border, padding, and display block
            />
            <span className="ms-2">SVECW</span>
          </div>

          {/* Navbar toggler for mobile */}
          <button
            className="navbar-toggler ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar items */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Home Button */}
              <li className="nav-item">
                <button className="nav-link" onClick={handleHomeClick}>Home</button>
              </li>

              {/* Login Button (with dropdown options) */}
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle"
                  id="navbarDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Login
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><button className="dropdown-item" onClick={() => handleRoleLogin("professor")}>Login as Professor</button></li>
                  <li><button className="dropdown-item" onClick={() => handleRoleLogin("associate-professor")}>Login as Associate Professor</button></li>
                  <li><button className="dropdown-item" onClick={() => handleRoleLogin("assistant-professor")}>Login as Assistant Professor</button></li>
                  <li><button className="dropdown-item" onClick={() => handleRoleLogin("dean")}>Login as Dean</button></li>
                  <li><button className="dropdown-item" onClick={() => handleRoleLogin("vice-principal")}>Login as Vice Principal</button></li>
                  <li><button className="dropdown-item" onClick={() => handleRoleLogin("principal")}>Login as Principal</button></li>
                </ul>
              </li>

              {/* Signup Button */}
              <li className="nav-item">
                <button className="nav-link" onClick={handleSignupClick}>Signup</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      {isSidebarOpen && <Sidebar closeSidebar={toggleSidebar} />} {/* Pass closeSidebar function to Sidebar */}
    </>
  );
};

export default Navbar;
