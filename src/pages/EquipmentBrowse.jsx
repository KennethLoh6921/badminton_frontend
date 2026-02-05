// Import required React hooks and components
import { useEffect, useState } from "react";
import { getAllEquipment } from "../services/equipmentService";
import EquipmentCard from "../components/EquipmentCard";

// EquipmentBrowse component - displays all equipment with filter options
const EquipmentBrowse = () => {
    // State to store list of equipment
    const [equipment, setEquipment] = useState([]);
    // State to show loading status
    const [loading, setLoading] = useState(true);
    // State to store filter values (search, type, minPrice, maxPrice)
    const [filters, setFilters] = useState({
        search: "",
        type: "",
        minPrice: "",
        maxPrice: "",
    });

    // Fetch all equipment when page loads
    useEffect(() => {
        fetchEquipment();
    }, []);

    /**
     * Function to fetch equipment from backend with optional filters
     * @param {Object} filterParams - contains search, type, minPrice, maxPrice
     */
    const fetchEquipment = async (filterParams = {}) => {
        setLoading(true);
        try {
            const data = await getAllEquipment(filterParams);
            setEquipment(data);
        } catch (error) {
            console.error("Error fetching equipment:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Function to handle filter input changes
     * Updates filter state when user types or selects options
     */
    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Function to handle search button click
     * Builds filter object and fetches equipment based on filters
     */
    const handleSearch = (e) => {
        e.preventDefault();
        // Build filter parameters object from current filters
        const filterParams = {};

        if (filters.search) filterParams.search = filters.search;
        if (filters.type) filterParams.type = filters.type;
        if (filters.minPrice) filterParams.minPrice = filters.minPrice;
        if (filters.maxPrice) filterParams.maxPrice = filters.maxPrice;

        // Fetch equipment with filters applied
        fetchEquipment(filterParams);
    };

    /**
     * Function to reset all filters
     * Clears filter inputs and shows all equipment
     */
    const handleReset = () => {
        setFilters({
            search: "",
            type: "",
            minPrice: "",
            maxPrice: "",
        });
        fetchEquipment(); // Fetch all equipment without filters
    };

    if (loading) {
        return <div className="loading">Loading equipment</div>;
    }

    return (
        <div className="page-container">
            <div className="content-container">
                <h1 className="page-title">Browse Equipment</h1>

                {/* Filter Section */}
                <form onSubmit={handleSearch} className="filter-bar">
                    <input
                        type="text"
                        name="search"
                        placeholder="Search equipment..."
                        value={filters.search}
                        onChange={handleFilterChange}
                        className="form-input"
                    />

                    <select name="type" value={filters.type} onChange={handleFilterChange} className="form-select">
                        <option value="">All Types</option>
                        <option value="racket">Racket</option>
                        <option value="shuttlecock">Shuttlecock</option>
                        <option value="shoes">Shoes</option>
                        <option value="bag">Bag</option>
                        <option value="grip">Grip</option>
                        <option value="string">String</option>
                        <option value="accessories">Accessories</option>
                    </select>

                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min Price"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        className="form-input"
                        style={{ maxWidth: "150px" }}
                    />

                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max Price"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        className="form-input"
                        style={{ maxWidth: "150px" }}
                    />

                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                    <button type="button" onClick={handleReset} className="btn btn-danger">
                        Reset
                    </button>
                </form>

                {/* Equipment Grid */}
                {equipment.length === 0 ? (
                    <div className="no-reviews">No equipment found. Try adjusting your filters.</div>
                ) : (
                    <div className="grid grid-3">
                        {equipment.map((item) => (
                            <EquipmentCard key={item._id} equipment={item} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipmentBrowse;
