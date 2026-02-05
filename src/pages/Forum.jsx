// Import required React hooks and components
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getAllPosts } from "../services/postService";
import { AuthContext } from "../context/AuthContext";
import PostCard from "../components/PostCard";

// Forum component - displays list of all forum posts with search
const Forum = () => {
    // Get current user from context
    const { user } = useContext(AuthContext);
    // State to store list of posts
    const [posts, setPosts] = useState([]);
    // State to show loading status
    const [loading, setLoading] = useState(true);
    // State to store search input text
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch all posts when page loads
    useEffect(() => {
        fetchPosts();
    }, []);

    /**
     * Function to fetch posts from backend with optional search
     * @param {string} search - search term to filter posts by title
     */
    const fetchPosts = async (search = "") => {
        setLoading(true);
        try {
            // Build filters object (only add search if provided)
            const filters = search ? { search } : {};
            const data = await getAllPosts(filters);
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Function to handle search form submission
     * Fetches posts filtered by search term
     */
    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts(searchTerm);
    };

    if (loading) {
        return <div className="loading">Loading posts</div>;
    }

    return (
        <div className="page-container">
            <div className="content-container">
                <div className="page-header">
                    <h1 className="section-title">Community Forum</h1>
                    {user && (
                        <Link to="/forum/create" className="btn btn-primary">
                            Create Post
                        </Link>
                    )}
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="form-input"
                    />
                    <button type="submit" className="btn btn-primary">
                        Search
                    </button>
                </form>

                {/* Posts List */}
                <div>
                    {posts.length === 0 ? (
                        <div className="no-reviews">
                            No posts found. {user && "Be the first to create one!"}
                        </div>
                    ) : (
                        posts.map((post) => <PostCard key={post._id} post={post} />)
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forum;
