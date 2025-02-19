import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ResearchForm = () => {
  const faculty_id = sessionStorage.getItem("faculty_id");
  const [formData, setFormData] = useState({
    guideName: "",
    guideDepartment: "",
    scholarName: "",
    scholarDepartment: "",
    admissionDate: "",
    university: "",
    workTitle: "",
    admissionStatus: "",
    awardDate: "",
    fellowship: "",
    admissionLetter: null,
    guideAllotmentLetter: null,
    completionProceedings: null,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
  
    switch (name) {
      case "guideName":
        if (!value) {
          error = "Guide Name is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Guide Name should contain only letters.";
        }
        break;
  
      case "guideDepartment":
        if (!value) {
          error = "Guide Department is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Guide Department should contain only letters.";
        }
        break;
  
      case "scholarName":
        if (!value) {
          error = "Scholar Name is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Scholar Name should contain only letters.";
        }
        break;
  
      case "scholarDepartment":
        if (!value) {
          error = "Scholar Department is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Scholar Department should contain only letters.";
        }
        break;
  
      case "admissionDate":
        if (!value) {
          error = "Admission Date is required.";
        } else if (!/\d{4}-\d{2}-\d{2}/.test(value)) {
          error = "Admission Date should be a valid date.";
        }
        break;
  
      case "university":
        if (!value) {
          error = "University is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "University should contain only letters.";
        }
        break;
  
      case "workTitle":
        if (!value) {
          error = "Work Title is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Work Title should contain only letters.";
        }
        break;
  
      case "admissionStatus":
        if (!value) {
          error = "Admission Status is required.";
        }
        break;
  
      case "awardDate":
        if (formData.admissionStatus === "completed" && !value) {
          error = "Award Date is required";
        } else if (value && !/\d{4}-\d{2}-\d{2}/.test(value)) {
          error = "Award Date should be a valid date.";
        }
        break;
  
      case "fellowship":
        if (!value) {
          error = "Fellowship is required.";
        } else if (!/^[A-Za-z ]+$/.test(value)) {
          error = "Fellowship should contain only letters.";
        }
        break;
  
      case "admissionLetter":
        if (!value) {
          error = "Admission Letter is required.";
        } else if (!["application/pdf", "image/png", "image/jpeg"].includes(value.type)) {
          error = "Admission Letter must be a PDF, PNG, or JPG file.";
        }
        break;
  
      case "guideAllotmentLetter":
        if (!value) {
          error = "Guide Allotment Letter is required.";
        } else if (!["application/pdf", "image/png", "image/jpeg"].includes(value.type)) {
          error = "Guide Allotment Letter must be a PDF, PNG, or JPG file.";
        }
        break;
  
      case "completionProceedings":
        if (!value) {
          error = "Completion Proceedings is required.";
        } else if (!["application/pdf", "image/png", "image/jpeg"].includes(value.type)) {
          error = "Completion Proceedings must be a PDF, PNG, or JPG file.";
        }
        break;
  
      default:
        break;
    }
  
    return error;
  };

  const validate = () => {
    const formErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) formErrors[key] = error;
    });
    return formErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      alert("Please fill in all required fields before submitting.");
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("faculty_id", faculty_id);

    try {
      const response = await fetch("http://localhost:5000/addResearch", {
        method: "POST",
        body: formDataToSend,
      });

      if (response.ok) {
        alert("Form details got submitted successfully.");
        navigate("/viewscholars");
        setFormData({
          guideName: "",
          guideDepartment: "",
          scholarName: "",
          scholarDepartment: "",
          admissionDate: "",
          university: "",
          workTitle: "",
          admissionStatus: "",
          awardDate: "",
          fellowship: "",
          admissionLetter: null,
          guideAllotmentLetter: null,
          completionProceedings: null,
        });
        setErrors({});
      } else {
        alert("Error submitting form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    }
  };

return (
    <div className="container mt-2">
      <h2 className="text-center text-dark mb-4">Add Research Scholar</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name of the Guide<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="guideName" className="form-control" value={formData.guideName} onChange={handleChange} />
            {errors.guideName && <div className="text-danger">{errors.guideName}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Department of Guide<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="guideDepartment" className="form-control" value={formData.guideDepartment} onChange={handleChange} />
            {errors.guideDepartment && <div className="text-danger">{errors.guideDepartment}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Name of the Scholar<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="scholarName" className="form-control" value={formData.scholarName} onChange={handleChange} />
            {errors.scholarName && <div className="text-danger">{errors.scholarName}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Department of Scholar<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="scholarDepartment" className="form-control" value={formData.scholarDepartment} onChange={handleChange} />
            {errors.scholarDepartment && <div className="text-danger">{errors.scholarDepartment}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Date of Admission<span style={{ color: "red" }}>*</span></label>
            <input type="date" name="admissionDate" className="form-control" value={formData.admissionDate} onChange={handleChange} />
            {errors.admissionDate && <div className="text-danger">{errors.admissionDate}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>University of Admission<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="university" className="form-control" value={formData.university} onChange={handleChange} />
            {errors.university && <div className="text-danger">{errors.university}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Title of the Work<span style={{ color: "red" }}>*</span></label>
            <input type="text" name="workTitle" className="form-control" value={formData.workTitle} onChange={handleChange} />
            {errors.workTitle && <div className="text-danger">{errors.workTitle}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Status of Admission<span style={{ color: "red" }}>*</span></label>
            <select name="admissionStatus" className="form-control" value={formData.admissionStatus} onChange={handleChange}>
              <option value="">Select Status</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
            {errors.admissionStatus && <div className="text-danger">{errors.admissionStatus}</div>}
          </div>
        </div>

        {formData.admissionStatus === "completed" && (
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Date of Award<span style={{ color: "red" }}>*</span></label>
              <input type="date" name="awardDate" className="form-control" value={formData.awardDate} onChange={handleChange} />
              {errors.awardDate && <div className="text-danger">{errors.awardDate}</div>}
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Any Fellowship/Scholarship received</label>
            <input type="text" name="fellowship" className="form-control" value={formData.fellowship} onChange={handleChange} />
            {errors.fellowship && <div className="text-danger">{errors.fellowship}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Upload Admission Letter<span style={{ color: "red" }}>*</span></label>
            <input type="file" name="admissionLetter" className="form-control" onChange={handleFileChange} />
            {errors.admissionLetter && <div className="text-danger">{errors.admissionLetter}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Upload Guide Allotment Letter<span style={{ color: "red" }}>*</span></label>
            <input type="file" name="guideAllotmentLetter" className="form-control" onChange={handleFileChange} />
            {errors.guideAllotmentLetter && <div className="text-danger">{errors.guideAllotmentLetter}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label>Upload Completion Proceedings<span style={{ color: "red" }}>*</span></label>
            <input type="file" name="completionProceedings" className="form-control" onChange={handleFileChange} />
            {errors.completionProceedings && <div className="text-danger">{errors.completionProceedings}</div>}
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ResearchForm;