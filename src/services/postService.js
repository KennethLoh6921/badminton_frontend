import api from "./api";

export const getAllPosts = async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) {
        params.append("search", filters.search);
    }
    const response = await api.get(`/posts?${params.toString()}`);
    return response.data;
};

export const getPostById = async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await api.post("/posts", postData);
    return response.data;
};

export const updatePost = async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
};
