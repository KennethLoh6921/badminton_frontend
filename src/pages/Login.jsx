// Import required React hooks and components
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

// Login component - handles user login
const Login = () => {
    // State to store form input data (email and password)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    // State to store and display error messages
    const [error, setError] = useState("");
    // State to show loading status while logging in
    const [loading, setLoading] = useState(false);

    // Get login function from AuthContext to set user after login
    const { login: setUser } = useContext(AuthContext);
    // Hook to navigate to different pages
    const navigate = useNavigate();

    /**
     * Function to handle input field changes
     * Updates formData when user types in email or password field
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    /**
     * Function to handle form submission
     * Sends login credentials to backend and logs user in
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload on form submit
        setError(""); // Clear any previous errors
        setLoading(true); // Show loading state

        try {
            // Call login API and get user data back
            const userData = await login(formData);
            // Set user in context (log them in)
            setUser(userData);
            // Navigate to home page after successful login
            navigate("/");
        } catch (error) {
            // Show error message if login fails
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false); // Hide loading state
        }
    };

    return (
        <div className="page-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div className="form-container" style={{ width: "100%", maxWidth: "450px" }}>
                <h2 className="form-title">Login to BadmintonHub</h2>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleSubmit} className="form">
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
                            placeholder="Enter your password"
                        />
                    </div>

                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="form-text">
                    Don't have an account?{" "}
                    <Link to="/register" className="form-link">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
