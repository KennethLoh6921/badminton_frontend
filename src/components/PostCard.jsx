import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="card" style={{ marginBottom: "1rem" }}>
            <div className="card-content">
                <h3 className="card-title">{post.post_title}</h3>

                <div className="card-meta">
                    <span>👤 {post.post_user_id?.name || "Anonymous"}</span>
                    <span>📅 {formatDate(post.createdAt)}</span>
                    <span>💬 {post.commentCount || 0} comments</span>
                </div>

                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6", marginBottom: "1rem" }}>
                    {post.post_content.substring(0, 150)}
                    {post.post_content.length > 150 ? "..." : ""}
                </p>

                {post.post_eq && (
                    <div className="card-badge">
                        🏸 Related: {post.post_eq.eq_name}
                    </div>
                )}

                <Link to={`/forum/${post._id}`} className="btn btn-primary btn-sm">
                    Read More
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
