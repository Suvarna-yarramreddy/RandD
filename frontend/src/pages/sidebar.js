import React, { useState, useRef, useLayoutEffect } from "react";
import { BsChevronDown, BsChevronUp, BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const DropdownMenu = ({ title, items, isOpen, setOpenDropdown, isHome }) => {
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ visibility: "hidden" });
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top: rect.bottom + "px",
        left: rect.left + "px",
        background: "#fff",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
        padding: "10px",
        minWidth: "200px",
        zIndex: 1050,
        border: "1px solid #ddd",
        whiteSpace: "nowrap",
        visibility: "visible",
      });
    }
  }, [isOpen]);

  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      setOpenDropdown(null);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative", margin: "0 15px", flexShrink: 0 }}>
      <button
        ref={buttonRef}
        onClick={() => (isHome ? navigate("/home") : setOpenDropdown(isOpen ? null : title))}
        style={{
          background: "none",
          border: "none",
          fontSize: "16px",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          color: "#2E8BC0",
        }}
      >
        {title} {!isHome && (isOpen ? <BsChevronUp /> : <BsChevronDown />)}
      </button>

      {!isHome && isOpen && (
        <div ref={dropdownRef} style={dropdownStyle}>
          {items.map((item, index) => (
            <Link
              key={index}
              to={`/${item.replace(/\s+/g, "").toLowerCase()}`}
              style={{
                display: "block",
                padding: "8px 12px",
                textDecoration: "none",
                color: "#0077b6",
                fontSize: "14px",
                fontWeight: "500",
                borderRadius: "3px",
                transition: "background 0.3s ease-in-out, color 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#e3f2fd")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Topbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const menuRef = useRef(null);

  const sections = [
    { title: "Home", isHome: true },
    { title: "Publications", items: ["Add Publication", "View Publications"] },
    { title: "Patents", items: ["Add Patent", "View Patents"] },
    { title: "Seed Money", items: ["Add Seed Money", "View Seed Money"] },
    { title: "External Funded Projects", items: ["Add Project", "View Projects"] },
    { title: "Consultancy", items: ["Add Consultant", "View Consultants"] },
    { title: "Research Scholars", items: ["Add Scholar", "View Scholars"] },
    { title: "Proposals Submitted", items: ["Add Proposal", "View Proposals"] },
  ];

  const scrollMenu = (direction) => {
    if (menuRef.current) {
      const scrollAmount = 150;
      menuRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        background: "#f8f9fa",
        padding: "10px 20px",
        boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
        position: "sticky",
        top: "98px",
        left: "0",
        zIndex: 999,
        justifyContent: "space-between",
      }}
    >
      <button
        onClick={() => scrollMenu("left")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          color: "#000",
        }}
      >
        <BsChevronLeft style={{ strokeWidth: "1px" }} />
      </button>

      <div
        ref={menuRef}
        style={{
          display: "flex",
          overflow: "hidden",
          maxWidth: "80vw",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          flexGrow: 1,
          padding: "5px 0",
        }}
      >
        {sections.map((section) => (
          <DropdownMenu
            key={section.title}
            title={section.title}
            items={section.items}
            isOpen={openDropdown === section.title}
            setOpenDropdown={setOpenDropdown}
            isHome={section.isHome}
          />
        ))}
      </div>

      <button
        onClick={() => scrollMenu("right")}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          color: "#000",
        }}
      >
        <BsChevronRight style={{ strokeWidth: "1px" }} />
      </button>
    </div>
  );
};

export default Topbar;
