// Import required React hooks
//useState is used to store and change data in a React component.
import { useState, useEffect } from "react";
// Import equipment service functions to communicate with backend
import { getAllEquipment, createEquipment, updateEquipment, deleteEquipment } from "../services/equipmentService";

// AdminDashboard component - allows admin to manage equipment (add, edit, delete)
const AdminDashboard = () => {
    // State to store list of all equipment
    const [equipment, setEquipment] = useState([]);
    // State to show loading status
    const [loading, setLoading] = useState(true);
    // State to show/hide the add/edit form
    const [showForm, setShowForm] = useState(false);
    // State to store ID of equipment being edited (null if adding new)
    const [editingId, setEditingId] = useState(null);
    // State to store form input data
    const [formData, setFormData] = useState({
        eq_name: "",
        eq_type: "racket",
        eq_price: "",
        eq_brand: "",
        eq_description: "",
        eq_image: "",
    });
    // State to store error messages
    const [error, setError] = useState("");

    // Fetch all equipment when component loads
    useEffect(() => {
        fetchEquipment();
    }, []);

    /**
     * Function to fetch all equipment from backend
     * Called when page loads and after add/edit/delete operations
     */
    const fetchEquipment = async () => {
        try {
            const data = await getAllEquipment();
            setEquipment(data);
        } catch (error) {
            console.error("Error fetching equipment:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Function to handle input field changes in the form
     * Updates formData when admin types in any field
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Function to handle form submission
     * Either creates new equipment or updates existing one
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (editingId) {
                // If editingId exists, update existing equipment
                await updateEquipment(editingId, formData);
            } else {
                // Otherwise, create new equipment
                await createEquipment(formData);
            }

            resetForm(); // Clear the form
            fetchEquipment(); // Refresh equipment list
        } catch (error) {
            setError(error.response?.data?.message || "Operation failed");
        }
    };

    /**
     * Function to handle edit button click
     * Fills the form with equipment data for editing
     */
    const handleEdit = (item) => {
        setFormData({
            eq_name: item.eq_name,
            eq_type: item.eq_type,
            eq_price: item.eq_price,
            eq_brand: item.eq_brand || "",
            eq_description: item.eq_description || "",
            eq_image: item.eq_image || "",
        });
        setEditingId(item._id); // Set the ID to edit mode
        setShowForm(true); // Show the form
    };

    /**
     * Function to delete equipment
     * Asks for confirmation before deleting
     */
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this equipment?")) {
            return;
        }

        try {
            await deleteEquipment(id);
            fetchEquipment(); // Refresh list after deletion
        } catch (error) {
            console.error("Error deleting equipment:", error);
        }
    };

    /**
     * Function to reset form to initial empty state
     * Called after successful add/edit or when canceling
     */
    const resetForm = () => {
        setFormData({
            eq_name: "",
            eq_type: "racket",
            eq_price: "",
            eq_brand: "",
            eq_description: "",
            eq_image: "",
        });
        setEditingId(null);
        setShowForm(false);
        setError("");
    };

    if (loading) {
        return <div className="loading">Loading</div>;
    }

    return (
        <div className="page-container">
            <div className="content-container">
                <h1 className="page-title">Admin Dashboard</h1>

                <div className="page-header">
                    <h2 className="section-title">Manage Equipment</h2>
                    <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                        {showForm ? "Cancel" : "+ Add Equipment"}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="form-container" style={{ marginBottom: "2rem" }}>
                        <h3 style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>{editingId ? "Edit Equipment" : "Add New Equipment"}</h3>
                        {error && <div className="form-error">{error}</div>}

                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Name *</label>
                                    <input type="text" name="eq_name" value={formData.eq_name} onChange={handleChange} required className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Type *</label>
                                    <select name="eq_type" value={formData.eq_type} onChange={handleChange} required className="form-select">
                                        <option value="racket">Racket</option>
                                        <option value="shuttlecock">Shuttlecock</option>
                                        <option value="shoes">Shoes</option>
                                        <option value="bag">Bag</option>
                                        <option value="grip">Grip</option>
                                        <option value="string">String</option>
                                        <option value="accessories">Accessories</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label className="form-label">Price *</label>
                                    <input type="number" name="eq_price" value={formData.eq_price} onChange={handleChange} required min="0" step="0.01" className="form-input" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Brand</label>
                                    <input type="text" name="eq_brand" value={formData.eq_brand} onChange={handleChange} className="form-input" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Image URL</label>
                                <input type="text" name="eq_image" value={formData.eq_image} onChange={handleChange} className="form-input" placeholder="https://example.com/image.jpg" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea name="eq_description" value={formData.eq_description} onChange={handleChange} className="form-textarea" rows={3} />
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingId ? "Update" : "Create"}
                                </button>
                                <button type="button" onClick={resetForm} className="btn btn-danger" style={{ flex: 1 }}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Equipment Table */}
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Brand</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipment.map((item) => (
                                <tr key={item._id}>
                                    <td style={{ color: "var(--text-primary)", fontWeight: "600" }}>{item.eq_name}</td>
                                    <td style={{ textTransform: "capitalize" }}>{item.eq_type}</td>
                                    <td>{item.eq_brand || "-"}</td>
                                    <td style={{ color: "var(--primary)", fontWeight: "600" }}>${item.eq_price}</td>
                                    <td style={{ color: "var(--rating)" }}>{item.averageRating > 0 ? `⭐ ${item.averageRating.toFixed(1)}` : "No reviews"}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button onClick={() => handleEdit(item)} className="btn btn-edit btn-sm">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="btn btn-danger btn-sm">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
