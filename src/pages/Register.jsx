// Import required React hooks and components
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

// Register component - handles new user registration
const Register = () => {
    // State to store form input data (user_id, name, email, password, confirmPassword)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    // State to store and display error messages
    const [error, setError] = useState("");
    // State to show loading status while registering
    const [loading, setLoading] = useState(false);

    // Get login function from AuthContext to set user after registration
    const { login: setUser } = useContext(AuthContext);
    // Hook to navigate to different pages
    const navigate = useNavigate();

    /**
     * Function to handle input field changes
     * Updates formData when user types in any input field
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Function to handle form submission
     * Validates input and sends registration data to backend
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        setError(""); // Clear any previous errors

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Check if password is at least 6 characters
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true); // Show loading state

        try {
            // Remove confirmPassword before sending to backend (not needed in database)
            const { confirmPassword, ...registerData } = formData;
            // Call register API and get user data back
            const userData = await register(registerData);
            // Set user in context (log them in)
            setUser(userData);
            // Navigate to home page after successful registration
            navigate("/");
        } catch (error) {
            // Show error message if registration fails
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="form-container" style={{ width: "100%", maxWidth: "450px" }}>
                <h2 className="form-title">Register for BadmintonHub</h2>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
                    <div className="form-group">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Enter your password (min 6 characters)"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="form-text">
                    Already have an account?{" "}
                    <Link to="/login" className="form-link">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
