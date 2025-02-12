import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./svecw.png";

const Navbar = ({ setIsLoggedIn, setRole }) => {
  const [isLoggedIn, setLocalIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    const userRole = sessionStorage.getItem("role") || "";
    setLocalIsLoggedIn(loggedInStatus);
    setIsLoggedIn(loggedInStatus);  // Update state in Layout
    setRole(userRole);  // Update role in Layout
  }, [location.pathname, setIsLoggedIn, setRole]);

  const handleLogout = () => {
    sessionStorage.clear();
    setLocalIsLoggedIn(false);
    setIsLoggedIn(false);  // Sync the logout state
    setRole("");  // Clear the role on logout
    navigate("/", { replace: true });
  };

  const handleHomeClick = () => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      alert("Please log in to access the welcome page.");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg text-white" 
     style={{ background: "linear-gradient(135deg, #2C3E50, #3498DB)", height: "100px" }}>
  <div className="container-fluid d-flex align-items-center" style={{ height: "100%" }}>
    
    {/* Logo (Left - Fully Filling Navbar Height) */}
    <div className="navbar-brand d-flex align-items-center" style={{ height: "100%" }}>
      <img 
        src={logo} 
        alt="SVECW Logo" 
        style={{ 
          height: "100%",  // Fills navbar height
          width: "auto",   // Maintains aspect ratio
          objectFit: "cover",
          display: "block"
        }} 
      />
    </div>

    {/* Centered College Name */}
    <div className="mx-auto text-center" style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
      <h2 className="fw-bold mb-0">Shri Vishnu Engineering College for Women</h2>
    </div>

    {/* Navbar Toggle (For Mobile View) */}
    <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span className="navbar-toggler-icon"></span>
    </button>

    {/* Navbar Links (Right) */}
    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
      <ul className="navbar-nav">
        <li className="nav-item">
          <button className="nav-link text-white" onClick={handleHomeClick}>Home</button>
        </li>
        {!isLoggedIn ? (
          <>
            <li className="nav-item dropdown">
              <button className="nav-link dropdown-toggle text-white" data-bs-toggle="dropdown">
                Login
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><button className="dropdown-item" onClick={() => navigate("/login")}>Login as Faculty</button></li>
                <li><button className="dropdown-item" onClick={() => navigate("/coordinatorlogin")}>Login as Department R&D Coordinator</button></li>
              </ul>
            </li>
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



  )};
export default Navbar;