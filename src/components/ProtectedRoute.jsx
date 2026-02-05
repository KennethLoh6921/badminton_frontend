import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, loading, isAdmin } = useContext(AuthContext);

    if (loading) {
        return <div style={styles.loading}>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (adminOnly && !isAdmin()) {
        return <Navigate to="/" />;
    }

    return children;
};

const styles = {
    loading: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "1.5rem",
    },
};

export default ProtectedRoute;
