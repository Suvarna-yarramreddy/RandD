import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import UniversalNavbar from "./navbar"; // Common navbar for all users
import FacultyTopbar from "./sidebar"; // Topbar for Faculty
import CoordinatorTopbar from "./depcorsidebar"; // Topbar for Department Coordinator
import InstituteCoordinatorTopbar from "./instcorsidebar"; // Topbar for Institute Coordinator

const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(""); 
  const location = useLocation();

  useEffect(() => {
    const loggedInStatus = sessionStorage.getItem("isLoggedIn") === "true";
    const userRole = sessionStorage.getItem("role")?.toLowerCase() || ""; 
    setIsLoggedIn(loggedInStatus);
    setRole(userRole);
  }, [location.pathname]);

  // Function to get the appropriate top bar based on role
  const getTopbar = () => {
    if (role === "institutecoordinator") return <InstituteCoordinatorTopbar />;
    if (role === "coordinator") return <CoordinatorTopbar />;
    return <FacultyTopbar />;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Universal Navbar (always present) */}
      <UniversalNavbar setIsLoggedIn={setIsLoggedIn} setRole={setRole} />

      {/* Role-specific Topbar (only for logged-in users) */}
      {isLoggedIn && getTopbar()}

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
