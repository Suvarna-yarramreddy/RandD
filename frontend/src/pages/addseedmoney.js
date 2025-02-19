import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

function SeedMoneyPage() {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    financialYear: '',
    facultyName: '',
    department: '',
    numStudents: '',
    projectTitle: '',
    amountSanctioned: '',
    amountReceived: '',
    objectives: '',
    outcomes: '',
    proof: [], // Store multiple files
    students: [{ registration: '', name: '' }]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value); // real-time validation after each change
  };
  
  const handleStudentChange = (index, field, value) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index][field] = value;
    setFormData((prevData) => ({ ...prevData, students: updatedStudents }));
    validateField(`student-${field}-${index}`, value); // real-time validation for student fields
  };
  
  const handleNumStudentsChange = (e) => {
    const value = parseInt(e.target.value) ;
    const students = value > 0 ? Array.from({ length: value }, () => ({ registration: "", name: "" })) : [];
    setFormData((prevData) => ({ ...prevData, numStudents: value, students }));
    validateField("numStudents", value); // real-time validation
  };
  
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      proof: [...prevData.proof, ...newFiles],
    }));
    validateField("proof", newFiles); // real-time validation for proof files
  };
  
 
  
 // Validation logic for the form
 const validateForm = () => {
  let isValid = true;
  const newErrors = {}; // Initialize an empty error object

  // Validate required fields
  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    if (!value && key !== "proof" && key!== "amountReceived") {
      newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required.`; // Auto-generate error message
      isValid = false;
    }
  });
  if (!formData.proof || formData.proof.length === 0) {
    newErrors.proof = "Proof document is required.";
    isValid = false;
  }
  
  // Validate numStudents
  if (!formData.numStudents || formData.numStudents <= 0) {
    newErrors.numStudents = "Number of students must be greater than 0.";
    isValid = false;
  }

  // Validate student fields if numStudents > 0
  if (formData.numStudents > 0) {
    formData.students.forEach((student, index) => {
      if (!student.registration.trim()) {
        newErrors[`student-registration-${index}`] = `Student ${index + 1}: Registration is required.`;
        isValid = false;
      }
      if (!student.name.trim()) {
        newErrors[`student-name-${index}`] = `Student ${index + 1}: Name is required.`;
        isValid = false;
      }
    });
  }

  setErrors(newErrors); // ✅ Update error state properly

  return isValid;
};


// Real-time field validation
const validateField = (name, value) => {
  const newErrors = { ...errors };

  switch (name) {
    case "financialYear":
      if (!value) newErrors.financialYear = "Financial Year is required.";
      else delete newErrors.financialYear;
      break;

    case "facultyName":
      if (!value.trim()) newErrors.facultyName = "Faculty Name is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) // Only characters and spaces
        newErrors.facultyName = "Faculty Name must contain only letters and spaces.";
      else delete newErrors.facultyName;
      break;

    case "department":
      if (!value.trim()) newErrors.department = "Department is required.";
      else if (!/^[A-Za-z\s]+$/.test(value)) // Only characters and spaces
        newErrors.department = "Department name must contain only letters and spaces.";
      else delete newErrors.department;
      break;

      case "numStudents":
        if (!value || value <= 0) 
          newErrors.numStudents = "Number of students involved is required and must be greater than 0.";
        else 
          delete newErrors.numStudents;
        break;
      

    case "projectTitle":
      if (!value.trim()) newErrors.projectTitle = "Project Title is required.";
      else delete newErrors.projectTitle;
      break;

    case "amountSanctioned":
      if (!value || isNaN(value))
        newErrors.amountSanctioned = "Amount Sanctioned must be a valid number.";
      else if (parseFloat(value) <= 0)
        newErrors.amountSanctioned = "Amount Sanctioned must be greater than zero.";
      else delete newErrors.amountSanctioned;
      break;

    case "objectives":
      if (!value.trim()) newErrors.objectives = "Objectives are required.";
      else delete newErrors.objectives;
      break;

    case "outcomes":
      if (!value.trim()) newErrors.outcomes = "Outcomes are required.";
      else delete newErrors.outcomes;
      break;
      case "proof":
        if (!value || value.length === 0) {
          newErrors.proof = "Proof document is required.";
        } else {
          delete newErrors.proof;
        }
        break;
      
    default:
      // Validate student fields if numStudents > 0
      if (formData.numStudents > 0) {
        if (name.startsWith("student-registration-")) {
          const index = Number(name.split("-")[2]); // Ensure a number
          if (!value.trim()) {
            newErrors[`student-registration-${index}`] = `Student ${index + 1}: Registration is required.`;
          } else {
            delete newErrors[`student-registration-${index}`];
          }
        }
        

        if (name.startsWith("student-name")) {
          const index = parseInt(name.split("-")[2], 10);
          if (!value.trim()) newErrors[`student-name-${index}`] = `Student ${index + 1}: Name is required.`;
          else if (!/^[A-Za-z\s]+$/.test(value)) // Only characters and spaces for student names
            newErrors[`student-name-${index}`] = `Student ${index + 1}: Name must contain only letters and spaces.`;
          else delete newErrors[`student-name-${index}`];
        }
      }
      break;
  }
  setErrors(newErrors); // Update the error state
  console.log("Validation Errors:", newErrors);
  return newErrors;

};
const handleSubmit = async (e) => {
  e.preventDefault();

  if (validateForm()) {
    // Form is valid, prepare the data to be sent
    const formDataToSend = new FormData();
    formDataToSend.append('faculty_id', faculty_id);
    formDataToSend.append('financialYear', formData.financialYear);
    formDataToSend.append('facultyName', formData.facultyName);
    formDataToSend.append('department', formData.department);
    formDataToSend.append('numStudents', formData.numStudents);
    formDataToSend.append('projectTitle', formData.projectTitle);
    formDataToSend.append('amountSanctioned', formData.amountSanctioned);
    formDataToSend.append('amountReceived', formData.amountReceived); 
    formDataToSend.append('objectives', formData.objectives);
    formDataToSend.append('outcomes', formData.outcomes);

    // ✅ Append proof files correctly
    if (formData.proof && Array.isArray(formData.proof)) {
      formData.proof.forEach(file => {
        if (file instanceof File) {
          formDataToSend.append('proof', file);
        }
      });
    }

    // ✅ Fix: Append students as a JSON string instead of separate keys
    formDataToSend.append('students', JSON.stringify(formData.students));

    try {
      const response = await fetch('http://localhost:5000/addSeedMoney', {
        method: 'POST',
        body: formDataToSend,
      });

      // ✅ Handle JSON response safely
      const contentType = response.headers.get('Content-Type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (response.ok) {
        // ✅ Reset form state after successful submission
        setFormData({
          financialYear: '',
          facultyName: '',
          department: '',
          numStudents: '',
          projectTitle: '',
          amountSanctioned: '',
          amountReceived: '',
          objectives: '',
          outcomes: '',
          proof: [],
          students: [{ registration: '', name: '' }]
        });

        navigate("/viewseedmoney");
      } else {
        console.error('Error:', data);
        alert('Failed to submit the form: ' + (data.message || data));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to submit the form due to network issues');
    }
  } else {
    
    alert('Fill all the required fields');

    // ✅ Scroll to the first error field
    const firstErrorField = Object.keys(errors)[0];
    if (firstErrorField) {
      const errorField = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorField) {
        errorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
};


  return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Add Seed Money</h2>
      <form onSubmit={handleSubmit}  method="POST" encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label" >Financial Year<span style={{ color: "red" }}>*</span></label>
            <select
            className="form-select"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            >
              <option value="">Select Financial Year</option>
              <option value="2020-21">2020-21</option>
              <option value="2021-22">2021-22</option>
              <option value="2022-23">2022-23</option>
              <option value="2024-25">2024-25</option>
              </select>
              {errors.financialYear && <div className="text-danger">{errors.financialYear}</div>}
            </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Faculty Name<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="facultyName"
              value={formData.facultyName}
              onChange={handleChange}
            />
            {errors.facultyName && <div className="text-danger">{errors.facultyName}</div>}
          </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Department<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="department"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <div className="text-danger">{errors.department}</div>}
          </div>
        {/* Student Details */}
        
          <div className="col-md-6 mb-3">
            <label className="form-label">Number of Students Involved<span style={{ color: "red" }}>*</span></label>
            <input
              type="number"
              className="form-control"
              name="numStudents"
              value={formData.numStudents}
              onChange={handleNumStudentsChange}
              min=""
            />
            {errors.numStudents && <span style={{ color: "red" }}>{errors.numStudents}</span>}
          </div>
        </div>

        {formData.numStudents > 0 && formData.students.map((student, index) => (
          <div className="row" key={index}>
            <div className="col-md-6 mb-3">
              <label className="form-label">Registration Number (Student {index + 1})<span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="registration"
                value={student.registration}
                onChange={(e) => handleStudentChange(index, 'registration', e.target.value)}
              />
               {errors[`student-registration-${index}`] && <small className="text-danger">{errors[`student-registration-${index}`]}</small>}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Name (Student {index + 1})<span style={{ color: "red" }}>*</span></label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={student.name}
                onChange={(e) => handleStudentChange(index, 'name', e.target.value)}
              />
              {errors[`student-name-${index}`] && <small className="text-danger">{errors[`student-name-${index}`]}</small>}
            </div>
          </div>
        ))}

        {/* Project Details */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Title of the Project<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
            />
            {errors.projectTitle && <div className="text-danger">{errors.projectTitle}</div>}
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Sanctioned (in Rupees)<span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              className="form-control"
              name="amountSanctioned"
              value={formData.amountSanctioned}
              onChange={handleChange}
            />
            {errors.amountSanctioned && <div className="text-danger">{errors.amountSanctioned}</div>}
          </div>
          </div>
          <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Amount Received (in Rupees)</label>
            <input
              type="text"
              className="form-control"
              name="amountReceived"
              value={formData.amountReceived}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-md-6 mb-3">
            <label className="form-label">Objectives of the Project<span style={{ color: "red" }}>*</span></label>
            <textarea
              className="form-control"
              name="objectives"
              value={formData.objectives}
              onChange={handleChange}
              style={{ height: '30%' }}
            />
            {errors.objectives && <div className="text-danger">{errors.objectives}</div>}
          </div>
          </div>
          <div className='row'>
          <div className="col-md-6 mb-3">
            <label className="form-label">Outcomes of the Project<span style={{ color: "red" }}>*</span></label>
            <textarea
              className="form-control"
              name="outcomes"
              value={formData.outcomes}
              onChange={handleChange}
              style={{ height: '30%' }}
            />
            {errors.outcomes && <div className="text-danger">{errors.outcomes}</div>}
          </div>
        
          <div className="col-md-6 mb-3">
  <label className="form-label">Upload Proof<span style={{ color: "red" }}>*</span></label>
  <div className="custom-file">
    <input
      type="file"
      name="proof"
      className="form-control"
      multiple
      onChange={handleFileChange}
    />
     {errors.proof && <div className="text-danger">{errors.proof}</div>}
  </div>
  {formData.proof.length > 0 && (
    <div className="mt-3">
      <label className="form-label">Selected Files:</label>
      <ul className="list-group">
        {formData.proof.map((file, index) => (
          <li className="list-group-item" key={index}>
            <span className="file-name">{file.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

        
        </div>
        
        <div className="text-center">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
        </div>
      </form>
    </div>
  );
}

export default SeedMoneyPage;