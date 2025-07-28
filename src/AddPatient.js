// src/AddPatient.js
import { useState } from "react";
import { addPatient } from "./services/ApiServices";
import PropTypes from "prop-types";

const AddPatient = ({ onPatientAdded }) => {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [blood_group, setBloodGroup] = useState("");
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleCancelBtn = () => {
        setFirstName("");
        setLastName("");
        setBloodGroup("");
        setErrors({});
        setSuccessMessage("");
    };

    const validateForm = () => {
        const newErrors = {};
        if (!first_name.trim()) newErrors.first_name = "First name is required";
        if (!last_name.trim()) newErrors.last_name = "Last name is required";
        if (!blood_group.trim()) {
            newErrors.blood_group = "Blood group is required";
        } else if (!/^(A|B|AB|O)[+-]$/.test(blood_group.trim())) {
            newErrors.blood_group = "Invalid blood group format (e.g., A+, B-, AB+, O-)";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage("");
        if (validateForm()) {
            setIsSubmitting(true);
            try {
                const patientData = { first_name, last_name, blood_group };
                await addPatient(patientData);
                setSuccessMessage("Patient added successfully!");
                setFirstName("");
                setLastName("");
                setBloodGroup("");
                if (onPatientAdded) onPatientAdded();
            } catch (error) {
                console.error("Error adding patient:", error);
                setErrors({ submit: error.message || "Failed to add patient. Please try again." });
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <div className="card mb-4">
            <div className="card-header">
                <h3>Add New Patient</h3>
            </div>
            <div className="card-body">
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}
                <form onSubmit={handleAddSubmit}>
                    <div className="mb-3">
                        <label className="form-label">First Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
                            value={first_name}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.first_name && <div className="invalid-feedback">{errors.first_name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Last Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
                            value={last_name}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.last_name && <div className="invalid-feedback">{errors.last_name}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Blood Group</label>
                        <input
                            type="text"
                            className={`form-control ${errors.blood_group ? "is-invalid" : ""}`}
                            value={blood_group}
                            onChange={(e) => setBloodGroup(e.target.value)}
                            disabled={isSubmitting}
                        />
                        {errors.blood_group && <div className="invalid-feedback">{errors.blood_group}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary me-2" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>
                    <button type="button" className="btn btn-danger" onClick={handleCancelBtn} disabled={isSubmitting}>
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

AddPatient.propTypes = { onPatientAdded: PropTypes.func };
AddPatient.defaultProps = { onPatientAdded: () => {} };

export default AddPatient;
