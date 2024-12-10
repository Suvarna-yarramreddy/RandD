import React, { createContext, useContext, useState } from "react";

// Create the Faculty Context
const FacultyContext = createContext();

// Create a Provider Component
export const FacultyProvider = ({ children }) => {
  const [faculty_id, setFacultyId] = useState(null);

  return (
    <FacultyContext.Provider value={{ faculty_id, setFacultyId }}>
      {children}
    </FacultyContext.Provider>
  );
};

// Custom Hook to Use Faculty Context
export const useFaculty = () => useContext(FacultyContext);
