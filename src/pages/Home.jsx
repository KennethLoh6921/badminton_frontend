//memory for your React component.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEquipment } from "../services/equipmentService";
import { getAllPosts } from "../services/postService";
import EquipmentCard from "../components/EquipmentCard";
import PostCard from "../components/PostCard";

// Home page component
//const is a variable that cannot change.
const Home = () => {
    // Save top equipment list
    const [featuredEquipment, setFeaturedEquipment] = useState([]);

    // Save recent forum posts
    const [recentPosts, setRecentPosts] = useState([]);

    // Save loading status
    //loading is true on initial load
    const [loading, setLoading] = useState(true);

    // Run when page first load
    //When home page load, I use useEffect to call the backend and get all the equipment. Then I sort by rating, highest first, and take top 3 only using slice
    useEffect(() => {
        // Function to get data from backend
        const fetchData = async () => {
            try {
                // Get equipment and posts at same time
                const [equipmentData, postsData] = await Promise.all([getAllEquipment(), getAllPosts()]);

                // Get top 3 equipment based on rating
                const topEquipment = equipmentData.sort((a, b) => b.averageRating - a.averageRating).slice(0, 3);

                // Save data into state
                setFeaturedEquipment(topEquipment);
                setRecentPosts(postsData.slice(0, 3)); // Get latest 3 posts
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchData();
    }, []);
    //is the dependency array
    //run only one time

    // If still loading → show loading text
    if (loading) {
        return <div className="loading">Loading</div>;
    }

    return (
        <div className="page-container" style={{ padding: 0 }}>
            {/* Hero Section */}
            <section className="hero">
                <h1 className="hero-title">Welcome to BadmintonHub</h1>
                <p className="hero-text">Your ultimate platform for badminton equipment and community discussions</p>
                <div className="hero-buttons">
                    <Link to="/equipment" className="btn btn-primary btn-lg">
                        Browse Equipment
                    </Link>
                    <Link to="/forum" className="btn btn-secondary btn-lg">
                        Join Forum
                    </Link>
                </div>
            </section>

            {/* Featured Equipment */}
            <section className="section">
                <div className="content-container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Equipment</h2>
                        <Link to="/equipment" className="view-all-link">
                            View All →
                        </Link>
                    </div>
                    <div className="grid grid-3">
                        {featuredEquipment.map((equipment) => (
                            <EquipmentCard key={equipment._id} equipment={equipment} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Recent Posts */}
            <section className="section">
                <div className="content-container">
                    <div className="section-header">
                        <h2 className="section-title">Recent Forum Posts</h2>
                        <Link to="/forum" className="view-all-link">
                            View All →
                        </Link>
                    </div>
                    <div>
                        {recentPosts.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
