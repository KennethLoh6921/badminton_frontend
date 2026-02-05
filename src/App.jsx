import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EquipmentBrowse from "./pages/EquipmentBrowse";
import EquipmentDetail from "./pages/EquipmentDetail";
import Forum from "./pages/Forum";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/equipment" element={<EquipmentBrowse />} />
                        <Route path="/equipment/:id" element={<EquipmentDetail />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/forum/:id" element={<PostDetail />} />

                        {/* Protected Routes */}
                        <Route
                            path="/forum/create"
                            element={
                                <ProtectedRoute>
                                    <CreatePost />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin Only Routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute adminOnly={true}>
                                    <AdminDashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
