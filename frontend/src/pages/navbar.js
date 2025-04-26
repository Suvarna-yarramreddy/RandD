import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min"; // Ensure Bootstrap JS is imported
import logo from "./svecw.png";

const Navbar = ({ setIsLoggedIn, setRole }) => {
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    const userRole = sessionStorage.getItem("role") || "";
    setLocalIsLoggedIn(loggedInStatus);
    setIsLoggedIn(loggedInStatus);
    setRole(userRole);
  }, [location.pathname, setIsLoggedIn, setRole]);

  useEffect(() => {
    // Ensure Bootstrap Dropdown is initialized
    if (window.bootstrap) {
      document.querySelectorAll(".dropdown-toggle").forEach((dropdown) => {
        new window.bootstrap.Dropdown(dropdown);
      });
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.clear();
    setLocalIsLoggedIn(false);
    setIsLoggedIn(false);
    setRole("");
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg text-white" style={{ background: "linear-gradient(135deg, #00a8e8, #0077b6)", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}>
      <div className="container-fluid">
        
        {/* Logo */}
        <div className="navbar-brand d-flex align-items-center" >
          <img src={logo} alt="SVECW Logo" style={{ width: "65px", objectFit: "cover", display: "block" }} />
        </div>

        {/* Centered College Name */}
        <div className="mx-auto text-center d-none d-lg-block">
          <h2 className="fw-bold mb-0 text-white">Shri Vishnu Engineering College For Women</h2>
        </div>

        {/* Navbar Toggle */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <>
                {/* Login Dropdown */}
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle text-white" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Login
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><button className="dropdown-item text-dark" onClick={() => navigate("/login")}>Login as Faculty</button></li>
                    <li><button className="dropdown-item text-dark" onClick={() => navigate("/coordinatorlogin")}>Login as Department R&D Coordinator</button></li>
                    <li><button className="dropdown-item text-dark" onClick={() => navigate("/instcorlogin")}>Login as Institute R&D Coordinator</button></li>
                  </ul>
                </li>

                {/* Signup Button */}
                <li className="nav-item">
                  <button className="nav-link text-white" onClick={() => navigate("/signup")}>Signup</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="nav-link text-white" onClick={handleLogout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
