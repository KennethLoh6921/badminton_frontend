// Use api to talk to backend
import api from "./api";

// Get all reviews for one equipment
export const getReviewsByEquipment = async (equipmentId) => {
    const response = await api.get(`/reviews/equipment/${equipmentId}`);
    return response.data;
};

// Create a new review (user must be logged in)
export const createReview = async (reviewData) => {
    const response = await api.post("/reviews", reviewData);
    return response.data;
};

// Edit a review (only the person who wrote it can edit)
export const updateReview = async (id, reviewData) => {
    const response = await api.put(`/reviews/${id}`, reviewData);
    return response.data;
};

// Delete a review (only the person who wrote it can delete)
export const deleteReview = async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
};
