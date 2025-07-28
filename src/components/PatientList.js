// src/components/PatientList.js
import { useState, useEffect, useCallback } from "react";
import { getPatient, deletePatient, updatePatient } from "../services/ApiServices";
import AddPatient from "../AddPatient";

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingPatient, setEditingPatient] = useState(null);
    const [editFormData, setEditFormData] = useState({
        first_name: "",
        last_name: "",
        blood_group: ""
    });
    const [editFormErrors, setEditFormErrors] = useState({});

    const fetchPatients = useCallback(() => {
        setLoading(true);
        setError(null);
        getPatient()
            .then(res => setPatients(res))
            .catch(err => setError(err.message || "Failed to load patients"))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchPatients(); }, [fetchPatients]);

    const handleDelete = async (id) => {
        try {
            await deletePatient(id);
            fetchPatients();
        } catch (err) {
            setError(err.message || "Failed to delete patient");
        }
    };

    const handleEdit = (patient) => {
        setEditingPatient(patient);
        setEditFormData({
            first_name: patient.first_name,
            last_name: patient.last_name,
            blood_group: patient.blood_group
        });
    };

    const handleEditFormChange = (e) => {
        setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
    };

    const validateEditForm = () => {
        const newErrors = {};
        if (!editFormData.first_name.trim()) newErrors.first_name = "First name is required";
        if (!editFormData.last_name.trim()) newErrors.last_name = "Last name is required";
        if (!editFormData.blood_group.trim()) newErrors.blood_group = "Blood group is required";
        else if (!/^(A|B|AB|O)[+-]$/.test(editFormData.blood_group.trim())) newErrors.blood_group = "Invalid blood group";
        setEditFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (validateEditForm()) {
            try {
                await updatePatient(editingPatient.patient_id, editFormData);
                setEditingPatient(null);
                fetchPatients();
            } catch (err) {
                setError(err.message || "Failed to update patient");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingPatient(null);
        setEditFormErrors({});
    };

    return (
        <div className="container">
            <h2 className="my-4">Hospital Patient Management System</h2>
            <AddPatient onPatientAdded={fetchPatients} />

            {editingPatient && (
                <div className="card mb-4">
                    <div className="card-header"><h3>Edit Patient</h3></div>
                    <div className="card-body">
                        <form onSubmit={handleUpdateSubmit}>
                            <div className="mb-3">
                                <label className="form-label">First Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${editFormErrors.first_name ? "is-invalid" : ""}`}
                                    name="first_name"
                                    value={editFormData.first_name}
                                    onChange={handleEditFormChange}
                                />
                                {editFormErrors.first_name && <div className="invalid-feedback">{editFormErrors.first_name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Last Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${editFormErrors.last_name ? "is-invalid" : ""}`}
                                    name="last_name"
                                    value={editFormData.last_name}
                                    onChange={handleEditFormChange}
                                />
                                {editFormErrors.last_name && <div className="invalid-feedback">{editFormErrors.last_name}</div>}
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Blood Group</label>
                                <input
                                    type="text"
                                    className={`form-control ${editFormErrors.blood_group ? "is-invalid" : ""}`}
                                    name="blood_group"
                                    value={editFormData.blood_group}
                                    onChange={handleEditFormChange}
                                />
                                {editFormErrors.blood_group && <div className="invalid-feedback">{editFormErrors.blood_group}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary me-2">Update</button>
                            <button type="button" className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="card mt-4">
                <div className="card-header"><h3>Patient List</h3></div>
                <div className="card-body">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {loading ? (
                        <p>Loading...</p>
                    ) : patients.length === 0 ? (
                        <p>No patients found.</p>
                    ) : (
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Blood Group</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {patients.map((p) => (
                                <tr key={p.patient_id}>
                                    <td>{p.first_name}</td>
                                    <td>{p.last_name}</td>
                                    <td>{p.blood_group}</td>
                                    <td>
                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(p)}>Edit</button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.patient_id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientList;
