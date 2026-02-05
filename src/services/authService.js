// Import API instance for making HTTP requests
import api from "./api";

/**
 * Register function - creates a new user account
 * @param {Object} userData - contains user_id, name, email, password
 * @returns {Object} user data with token
 */
export const register = async (userData) => {
    // Send registration data to backend
    const response = await api.post("/users/register", userData);
    if (response.data.token) {
        // Save token to browser storage for future requests
        localStorage.setItem("token", response.data.token);
        // Save user data (without token) to browser storage
        const { token, ...user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
};

/**
 * Login function - authenticates existing user
 * @param {Object} credentials - contains email and password
 * @returns {Object} user data with token
 */
export const login = async (credentials) => {
    // Send login credentials to backend
    const response = await api.post("/users/login", credentials);
    if (response.data.token) {
        // Save token to browser storage
        localStorage.setItem("token", response.data.token);
        // Save user data to browser storage
        const { token, ...user } = response.data;
        localStorage.setItem("user", JSON.stringify(user));
    }
    return response.data;
};

/**
 * Logout function - removes user session
 * Clears token and user data from browser storage
 */
export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
};

/**
 * Get current logged in user from browser storage
 * @returns {Object|null} user object or null if not logged in
 */
export const getCurrentUser = () => {
    const userStr = localStorage.getItem("user");
    // Check if user data exists and is valid
    if (userStr && userStr !== "undefined") {
        try {
            // Convert JSON string back to object
            return JSON.parse(userStr);
        } catch {
            // Return null if data is corrupted
            return null;
        }
    }
    return null;
};

/**
 * Get authentication token from browser storage
 * @returns {string|null} token or null if not logged in
 */
export const getToken = () => {
    return localStorage.getItem("token");
};
