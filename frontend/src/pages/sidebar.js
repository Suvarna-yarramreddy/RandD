import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BsChevronDown, BsChevronUp, BsX } from "react-icons/bs"; // Importing Bootstrap icons for arrows and close button
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const CollapsibleSection = ({ title, items, closeSidebar }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  // Toggle the section when the title or button is clicked
  const toggleSection = () => setIsOpen(!isOpen);

  return (
    <li>
      <div
        className="d-flex justify-content-between align-items-center w-100"
        style={{
          padding: "10px 15px",
          borderBottom: "1px solid #ddd", // Border for each section
          cursor: "pointer", // Make the section clickable
        }}
        onClick={toggleSection} // Trigger toggle when clicking anywhere on the line
      >
        <span style={{ color: "#333", fontWeight: "500", fontSize: "16px" }}>{title}</span>
        <button
          onClick={e => { // Prevent event propagation to avoid triggering toggleSection twice
            e.stopPropagation();
            toggleSection();
          }}
          style={{
            border: "none",
            backgroundColor: "transparent",
            padding: "0",
            cursor: "pointer",
          }}
        >
          {isOpen ? <BsChevronUp /> : <BsChevronDown />}
        </button>
      </div>
      {isOpen && (
        <ul className="list-unstyled ms-3">
          {items.map((item, index) => (
            <li key={index} style={{ marginBottom: "10px" }}>
              <Link
                to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
                style={{
                  color: "#333", // Slightly dark color for better contrast
                  backgroundColor: "transparent",
                  textDecoration: "none",
                  fontWeight: "400",
                  fontSize: "14px",
                }}
                onClick={closeSidebar} // Close sidebar when item is clicked
                className="d-flex justify-content-between align-items-center"
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const Sidebar = ({ closeSidebar }) => {
  const sections = [
    { title: "Publications", items: ["Add Publication", "View Publications"] },
    { title: "Patents", items: ["Add Patent", "View Patents"] },
    { title: "Seed Money", items: ["Add Seed Money", "View Seed Money"] },
    { title: "External Funded Projects", items: ["Add External Project", "View External Projects"] },
    { title: "Consultant", items: ["Add Consultant", "View Consultants"] },
    { title: "Research Scholars", items: ["Add Research Scholar", "View Research Scholars"] },
    { title: "Funded Proposals Submitted", items: ["Add Funded Proposal", "View Funded Proposals"] },
  ];

  return (
    <div
      className="sidebar bg-light border-end"
      style={{
        width: "250px",
        position: "fixed",
        top: "70px",
        left: "0",
        bottom: "0",
        overflowY: "auto",
        zIndex: "1000",
        boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)", // Add a subtle shadow to make it pop
        borderRadius: "5px 0 0 5px", // Rounded corners
        transition: "transform 0.3s ease-in-out", // Smooth sliding effect
      }}
    >
      <div
        className="d-flex justify-content-between align-items-center p-3"
        style={{
          backgroundColor: "#f8f9fa",
          borderRadius: "5px 5px 0 0",
        }}
      >
        <h5 style={{ margin: 0, fontWeight: "bold", color: "#333" }}>Sidebar</h5>
        <button
          onClick={closeSidebar}
          style={{
            border: "none",
            backgroundColor: "transparent",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          <BsX />
        </button>
      </div>

      <ul className="list-unstyled p-2">
        {sections.map((section, index) => (
          <CollapsibleSection
            key={index}
            title={section.title}
            items={section.items}
            closeSidebar={closeSidebar}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
