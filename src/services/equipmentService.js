// Import API instance for making HTTP requests
import api from "./api";

/**
 * Get all equipment with optional filters
 * @param {Object} filters - contains type, search, minPrice, maxPrice
 * @returns {Array} list of equipment
 */
export const getAllEquipment = async (filters = {}) => {
    // Build query parameters from filters
    const params = new URLSearchParams();
    if (filters.type) {
        params.append("type", filters.type); // Filter by equipment type (racket, shoes, etc)
    }
    if (filters.search) {
        params.append("search", filters.search); // Search by name
    }
    if (filters.minPrice) {
        params.append("minPrice", filters.minPrice); // Filter by minimum price
    }
    if (filters.maxPrice) {
        params.append("maxPrice", filters.maxPrice); // Filter by maximum price
    }
    // Send GET request with filters
    //build the parameter for get string filter url
    const response = await api.get(`/catalogue?${params.toString()}`);
    return response.data;
};

/**
 * Get single equipment by ID
 * @param {string} id - equipment ID
 * @returns {Object} equipment details
 */
export const getEquipmentById = async (id) => {
    const response = await api.get(`/catalogue/${id}`);
    return response.data;
};

/**
 * Create new equipment (Admin only)
 * @param {Object} equipmentData - contains name, type, price, brand, description, image
 * @returns {Object} created equipment
 */
export const createEquipment = async (equipmentData) => {
    const response = await api.post("/catalogue", equipmentData);
    return response.data;
};

/**
 * Update existing equipment (Admin only)
 * @param {string} id - equipment ID
 * @param {Object} equipmentData - updated equipment data
 * @returns {Object} updated equipment
 */
export const updateEquipment = async (id, equipmentData) => {
    const response = await api.put(`/catalogue/${id}`, equipmentData);
    return response.data;
};

/**
 * Delete equipment (Admin only)
 * @param {string} id - equipment ID
 * @returns {Object} success message
 */
export const deleteEquipment = async (id) => {
    const response = await api.delete(`/catalogue/${id}`);
    return response.data;
};
