// Use api to talk to backend
import api from "./api";

// Get all posts, can also search by keyword
export const getAllPosts = async (filters = {}) => {
    const params = new URLSearchParams();
    // If user types a search word, add it to the request
    if (filters.search) {
        params.append("search", filters.search);
    }
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
};

// Get one post by its ID
export const getPostById = async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
};

// Create a new post (user must be logged in)
export const createPost = async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
};

// Edit a post (only the person who wrote it can edit)
export const updatePost = async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
};

// Delete a post (only the person who wrote it or admin can delete)
export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
};
