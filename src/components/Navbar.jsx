import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout, isAdmin } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    BadmintonHub
                </Link>

                <div className="navbar-links">
                    <Link to="/" className="navbar-link">
                        Home
                    </Link>
                    <Link to="/equipment" className="navbar-link">
                        Equipment
                    </Link>
                    <Link to="/forum" className="navbar-link">
                        Forum
                    </Link>

                    <span className="navbar-divider"></span>

                    {user ? (
                        <>
                            {isAdmin() && (
                                <Link to="/admin" className="navbar-link admin-link">
                                    Admin
                                </Link>
                            )}
                            <span className="navbar-username">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                                {user.name}
                            </span>
                            <button onClick={handleLogout} className="navbar-logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="navbar-auth-btn login">
                                Login
                            </Link>
                            <Link to="/register" className="navbar-auth-btn register">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
