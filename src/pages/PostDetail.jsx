// Import required React hooks and components
import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../services/postService";
import { getCommentsByPost, createComment, deleteComment } from "../services/commentService";
import { AuthContext } from "../context/AuthContext";

// PostDetail component - displays a single forum post with its comments
const PostDetail = () => {
    // Get post ID from URL parameters
    const { id } = useParams();
    const navigate = useNavigate();
    // Get current user and isAdmin function from context
    const { user, isAdmin } = useContext(AuthContext);

    // State to store the post data
    const [post, setPost] = useState(null);
    // State to store all comments for this post
    const [comments, setComments] = useState([]);
    // State to show loading status
    const [loading, setLoading] = useState(true);
    // State to store new comment text being typed
    const [commentText, setCommentText] = useState("");
    // State to store error messages
    const [error, setError] = useState("");

    // Fetch post and comments when component loads or ID changes
    useEffect(() => {
        fetchPostData();
    }, [id]);

    /**
     * Function to fetch post and its comments from backend
     * Uses Promise.all to fetch both at the same time for better performance
     */
    const fetchPostData = async () => {
        try {
            // Fetch post and comments together
            const [postData, commentsData] = await Promise.all([getPostById(id), getCommentsByPost(id)]);
            setPost(postData);
            setComments(commentsData);
        } catch (error) {
            console.error("Error fetching post:", error);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Function to handle comment submission
     * Creates a new comment and adds it to the post
     */
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Check if user is logged in
        if (!user) {
            navigate("/login");
            return;
        }

        // Check if comment is not empty
        if (!commentText.trim()) {
            setError("Comment cannot be empty");
            return;
        }

        try {
            // Create comment with post ID and comment text
            await createComment({
                comment_post: id,
                comment_text: commentText,
            });
            setCommentText(""); // Clear the input field
            fetchPostData(); // Refresh comments to show new comment
        } catch (error) {
            setError(error.response?.data?.message || "Failed to post comment");
        }
    };

    /**
     * Function to delete a comment
     * Only the comment owner or admin can delete
     */
    const handleDeleteComment = async (commentId) => {
        // Ask user to confirm deletion
        if (!window.confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        try {
            await deleteComment(commentId);
            fetchPostData(); // Refresh to remove deleted comment from list
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    /**
     * Function to delete the entire post
     * Only post owner or admin can delete
     */
    const handleDeletePost = async () => {
        // Ask user to confirm deletion
        if (!window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        try {
            await deletePost(id);
            navigate("/forum"); // Go back to forum after deletion
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    /**
     * Function to format date into readable format
     * Example: "February 4, 2026 at 10:14 AM"
     */
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return <div className="loading">Loading</div>;
    }

    if (!post) {
        return <div className="page-container"><div className="form-error" style={{ textAlign: "center", maxWidth: "500px", margin: "0 auto" }}>Post not found</div></div>;
    }

    const canDeletePost = user && (user._id === post.post_user_id?._id || isAdmin());

    return (
        <div className="page-container">
            <div className="content-container">
                {/* Post Content */}
                <div className="post-container">
                    <div className="post-header">
                        <h1 className="post-title">{post.post_title}</h1>
                        {canDeletePost && (
                            <button onClick={handleDeletePost} className="btn btn-danger">
                                Delete Post
                            </button>
                        )}
                    </div>

                    <div className="post-meta">
                        <span>👤 {post.post_user_id?.name || "Anonymous"}</span>
                        <span>📅 {formatDate(post.createdAt)}</span>
                    </div>

                    {post.post_eq && (
                        <div className="post-related">
                            🏸 Related Equipment:{" "}
                            <a href={`/equipment/${post.post_eq._id}`}>
                                {post.post_eq.eq_name}
                            </a>
                        </div>
                    )}

                    <div className="post-content">{post.post_content}</div>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                    <h2 style={{ color: "var(--text-primary)", marginBottom: "1.5rem" }}>Comments ({comments.length})</h2>

                    {/* Comment Form */}
                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="comment-form">
                            {error && <div className="form-error">{error}</div>}
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="form-textarea"
                                rows={4}
                            />
                            <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem" }}>
                                Post Comment
                            </button>
                        </form>
                    ) : (
                        <div className="login-prompt">
                            Please{" "}
                            <a href="/login">login</a>{" "}
                            to comment.
                        </div>
                    )}

                    {/* Comments List */}
                    <div>
                        {comments.length === 0 ? (
                            <p className="no-comments">No comments yet. Be the first to comment!</p>
                        ) : (
                            comments.map((comment) => {
                                const canDelete = user && (user._id === comment.comment_user_id?._id || isAdmin());

                                return (
                                    <div key={comment._id} className="comment-card">
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                                            <div>
                                                <strong style={{ color: "var(--text-primary)" }}>{comment.comment_user_id?.name || "Anonymous"}</strong>
                                                <span className="comment-author" style={{ marginLeft: "0.5rem" }}>
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            {canDelete && (
                                                <button onClick={() => handleDeleteComment(comment._id)} className="btn btn-danger btn-sm">
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <p className="comment-text">{comment.comment_text}</p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
