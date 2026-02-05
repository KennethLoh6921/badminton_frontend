import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../services/postService";
import { getAllEquipment } from "../services/equipmentService";

// This component is used to create a new post
const CreatePost = () => {
    const navigate = useNavigate();

    // Save equipment list
    const [equipment, setEquipment] = useState([]);

    // Save form input data
    const [formData, setFormData] = useState({
        post_title: "",
        post_content: "",
        post_eq: "",
    });

    // Save error message
    const [error, setError] = useState("");

    // Save loading status (example: when submitting form)
    const [loading, setLoading] = useState(false);

    // Run when page first load
    // Get equipment list from database
    useEffect(() => {
        fetchEquipment();
    }, []);

    // Get all equipment from backend
    const fetchEquipment = async () => {
        try {
            const data = await getAllEquipment(); // Get data from service
            setEquipment(data); // Save into state
        } catch (error) {
            console.error("Error fetching equipment:", error);
        }
    };

    // When user type or change input
    // Update form data
    const handleChange = (e) => {
        setFormData({
            ...formData, // Keep old data
            [e.target.name]: e.target.value, // Update new value
        });
    };

    // When user submit form
    const handleSubmit = async (e) => {
        e.preventDefault(); // Stop page refresh

        setError("");
        setLoading(true);

        // Check if title or content is empty
        if (!formData.post_title.trim() || !formData.post_content.trim()) {
            setError("Title and content are required");
            setLoading(false);
            return;
        }

        try {
            // Prepare data to send to backend
            const postData = {
                post_title: formData.post_title,
                post_content: formData.post_content,
                post_eq: formData.post_eq || null,
            };

            // Send data to backend to create post
            const newPost = await createPost(postData);

            // Go to the new post page
            navigate(`/forum/${newPost._id}`);
        } catch (error) {
            // Show error if create post failed
            setError(error.response?.data?.message || "Failed to create post");
            setLoading(false);
        }
    };

    return (
        <div className="page-container" style={{ display: "flex", justifyContent: "center" }}>
            <div className="form-container" style={{ width: "100%", maxWidth: "800px" }}>
                <h1 className="form-title">Create New Post</h1>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label">Title *</label>
                        <input type="text" name="post_title" value={formData.post_title} onChange={handleChange} required className="form-input" placeholder="Enter post title" />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content *</label>
                        <textarea name="post_content" value={formData.post_content} onChange={handleChange} required className="form-textarea" placeholder="Share your thoughts, questions, or experiences..." rows={10} />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Related Equipment (Optional)</label>
                        <select name="post_eq" value={formData.post_eq} onChange={handleChange} className="form-select">
                            <option value="">No related equipment</option>
                            {equipment.map((item) => (
                                <option key={item._id} value={item._id}>
                                    {item.eq_name} ({item.eq_type})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-buttons">
                        <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                            {loading ? "Creating..." : "Create Post"}
                        </button>
                        <button type="button" onClick={() => navigate("/forum")} className="btn btn-danger" style={{ flex: 1 }}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
