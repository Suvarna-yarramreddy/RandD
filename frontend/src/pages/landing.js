import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import picture from "../pages/picture.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid d-flex flex-column flex-md-row align-items-center justify-content-center">
      
      {/* Left Section - Image (Hidden on Small Screens) */}
      <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0">
        <img 
          src={picture} 
          alt="Illustration" 
          className="img-fluid" 
          style={{ maxWidth: "100%", height: "auto" }} 
        />
      </div>

      {/* Right Section - Text Content */}
      <div className="col-md-6 d-flex flex-column align-items-center justify-content-center px-5">
        <h2 className="text-primary display-6 fw-bold mt-3 mb-5" >
          👤 Welcome to R&D Portal
        </h2>
        <button 
          onClick={() => navigate("/signup")} 
          className="btn btn-primary rounded-5 mt-3 py-2 w-50"
        >
          Signup
        </button>
        <button 
          onClick={() => navigate("/login")} 
          className="btn btn-primary rounded-5 mt-3 py-2 w-50"
        >
          Login
        </button>
      </div>
      
    </div>
  );
};

export default LandingPage;
