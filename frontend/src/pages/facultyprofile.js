import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyDetails = () => {
  const [facultyData, setFacultyData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const facultyId = sessionStorage.getItem('faculty_id');
    if (facultyId) {
      axios.get(`http://localhost:5000/facultyprofile/${facultyId}`)
        .then((response) => {
          setFacultyData(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load faculty details');
          setLoading(false);
        });
    } else {
      setError('No faculty ID found in session.');
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger mt-5">{error}</div>;
  }

  const filterNonNullFields = (data) => {
    return Object.keys(data).reduce((acc, key) => {
      if (data[key] !== null && data[key] !== "" && data[key] !== undefined) {
        acc[key] = data[key];
      }
      return acc;
    }, {});
  };

  const getFieldDisplayName = (field) => {
    if (field === "password1") return "PASSWORD";
    return field.replace(/_/g, ' ').toUpperCase();
  };

  const filteredFacultyData = filterNonNullFields(facultyData);

  const handleEditClick = () => {
    const facultyId = sessionStorage.getItem('faculty_id');
    const facultyData = { ...filteredFacultyData, facultyId };
    navigate("/editprofile", { state: { facultyData } });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary text-center mb-4">Faculty Profile</h2>
      
      <div className="card shadow-lg border-0 rounded-3 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-secondary">Faculty Details</h4>
          <button className="btn btn-warning px-4" onClick={handleEditClick}>
            Edit Details
          </button>
        </div>

        <table className="table table-bordered">
          <tbody>
            {Object.keys(filteredFacultyData).map((key) => (
              <tr key={key}>
                <th className="text-uppercase text-secondary">{getFieldDisplayName(key)}</th>
                <td >{filteredFacultyData[key]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacultyDetails;
