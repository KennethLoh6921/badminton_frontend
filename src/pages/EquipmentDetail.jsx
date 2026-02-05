import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEquipmentById } from "../services/equipmentService";
import { getReviewsByEquipment, createReview, deleteReview } from "../services/reviewService";
import { AuthContext } from "../context/AuthContext";

// This component shows equipment details and reviews
const EquipmentDetail = () => {
    const { id } = useParams(); // Get equipment id from URL
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get current login user

    // Save equipment data
    const [equipment, setEquipment] = useState(null);

    // Save review list
    const [reviews, setReviews] = useState([]);

    // Save loading status
    const [loading, setLoading] = useState(true);

    // Show or hide review form
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Save review form data
    const [reviewForm, setReviewForm] = useState({
        r_star: 5,
        r_title: "",
        r_text: "",
    });

    // Save error message
    const [error, setError] = useState("");

    // Run when page load or id change
    useEffect(() => {
        fetchEquipmentData();
    }, [id]);

    // Get equipment details and reviews from backend
    const fetchEquipmentData = async () => {
        try {
            // Get equipment data and reviews at same time
            const [equipmentData, reviewsData] = await Promise.all([getEquipmentById(id), getReviewsByEquipment(id)]);

            setEquipment(equipmentData); // Save equipment data
            setReviews(reviewsData); // Save reviews
        } catch (error) {
            console.error("Error fetching equipment:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    // When user submit review form
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // If user not login → go login page
        if (!user) {
            navigate("/login");
            return;
        }

        try {
            // Send review data to backend
            await createReview({
                ...reviewForm,
                r_eq: id,
            });

            // Reset form and refresh data
            setShowReviewForm(false);
            setReviewForm({ r_star: 5, r_title: "", r_text: "" });
            fetchEquipmentData();
        } catch (error) {
            setError(error.response?.data?.message || "Failed to submit review");
        }
    };

    // Delete review
    const handleDeleteReview = async (reviewId) => {
        // Ask user confirm before delete
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            await deleteReview(reviewId); // Delete review from backend
            fetchEquipmentData(); // Refresh data
        } catch (error) {
            console.error("Error deleting review:", error);
        }
    };

    // If still loading → show loading text
    if (loading) {
        return <div className="loading">Loading</div>;
    }

    // If equipment not found → show error message
    if (!equipment) {
        return (
            <div className="page-container">
                <div className="form-error" style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>
                    Equipment not found
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="content-container">
                {/* Equipment Details */}
                <div className="form-container detail-grid" style={{ marginBottom: "2rem" }}>
                    <div className="detail-image">{equipment.eq_image ? <img src={equipment.eq_image} alt={equipment.eq_name} /> : <div className="detail-placeholder">🏸</div>}</div>

                    <div className="detail-info">
                        <h1 className="detail-name">{equipment.eq_name}</h1>
                        <p className="detail-type">Type: {equipment.eq_type}</p>
                        {equipment.eq_brand && <p className="detail-brand">Brand: {equipment.eq_brand}</p>}
                        <p className="detail-price">${equipment.eq_price}</p>

                        {equipment.averageRating > 0 && (
                            <div className="detail-rating">
                                ⭐ {equipment.averageRating.toFixed(1)} ({equipment.totalReviews} reviews)
                            </div>
                        )}

                        {equipment.eq_description && (
                            <div className="detail-description">
                                <h3>Description</h3>
                                <p>{equipment.eq_description}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="reviews-section">
                    <div className="reviews-header">
                        <h2>Reviews</h2>
                        {user && !showReviewForm && (
                            <button onClick={() => setShowReviewForm(true)} className="btn btn-primary">
                                Write a Review
                            </button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && (
                        <div className="review-form">
                            {error && <div className="form-error">{error}</div>}

                            <form onSubmit={handleReviewSubmit} className="form">
                                <div className="form-group">
                                    <label className="form-label">Rating</label>
                                    <select value={reviewForm.r_star} onChange={(e) => setReviewForm({ ...reviewForm, r_star: Number(e.target.value) })} className="form-select">
                                        <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                                        <option value={4}>⭐⭐⭐⭐ (4)</option>
                                        <option value={3}>⭐⭐⭐ (3)</option>
                                        <option value={2}>⭐⭐ (2)</option>
                                        <option value={1}>⭐ (1)</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Title (optional)</label>
                                    <input type="text" value={reviewForm.r_title} onChange={(e) => setReviewForm({ ...reviewForm, r_title: e.target.value })} className="form-input" placeholder="Summary of your review" />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Review</label>
                                    <textarea value={reviewForm.r_text} onChange={(e) => setReviewForm({ ...reviewForm, r_text: e.target.value })} className="form-textarea" placeholder="Share your experience with this equipment" rows={5} />
                                </div>

                                <div className="form-buttons">
                                    <button type="submit" className="btn btn-primary">
                                        Submit Review
                                    </button>
                                    <button type="button" onClick={() => setShowReviewForm(false)} className="btn btn-danger">
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Reviews List */}
                    <div>
                        {reviews.length === 0 ? (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        ) : (
                            reviews.map((review) => (
                                <div key={review._id} className="review-card">
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                        <div>
                                            <div className="review-rating">{"⭐".repeat(review.r_star)}</div>
                                            {review.r_title && <h4 className="review-title">{review.r_title}</h4>}
                                            <p className="review-author">
                                                By {review.r_user?.name || "Anonymous"} • {new Date(review.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {user && user._id === review.r_user?._id && (
                                            <button onClick={() => handleDeleteReview(review._id)} className="btn btn-danger btn-sm">
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                    {review.r_text && <p className="review-text">{review.r_text}</p>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;
