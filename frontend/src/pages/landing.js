import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <div className="py-5">
      <div style={{ marginTop:"90px"}} >
        <h2 className="text-center text-secondary mb-4">
          Welcome to the Research and Development Portal
        </h2>
        <p className="text-center text-muted">
          Manage your academic and research details efficiently and effectively.
        </p>
        <div className="d-flex justify-content-center gap-4 mt-4">
          <button
            onClick={handleSignupClick}
            className="btn btn-primary btn-lg px-5"
          >
            Signup
          </button>
          <button
            onClick={handleLoginClick}
            className="btn btn-success btn-lg px-5"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
