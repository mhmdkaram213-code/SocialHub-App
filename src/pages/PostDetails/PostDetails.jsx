import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/Auth/Auth.Context";
import PostCard from "../../components/PostCard/PostCard";
import PostCardSkeleton from "../../components/PostCardSkeleton/PostCardSkeleton";
import CommentThread from "../../components/CommentThread/CommentThread";
import CommentForm from "../../components/CommentForm/CommentForm";
import getPostComments from "../../services/api/CommentApi/getPostComments";

export default function PostDetails() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [postDetails, setPostDetails] = useState(null);
    const [comments, setComments] = useState([]);
    const [isLoadingPost, setIsLoadingPost] = useState(false);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [error, setError] = useState(null);

    // Fetch post details
    useEffect(() => {
        const fetchPostDetails = async () => {
            try {
                setIsLoadingPost(true);
                const options = {
                    method: 'GET',
                    url: `https://route-posts.routemisr.com/posts/${id}`,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
                const { data } = await axios.request(options);

                if (data.message === 'success') {
                    setPostDetails(data.data.post);
                }
            } catch (err) {
                console.error('Error fetching post details:', err);
                setError('Failed to load post details');
            } finally {
                setIsLoadingPost(false);
            }
        };

        if (id && token) {
            fetchPostDetails();
        }
    }, [id, token]);

    // Fetch all comments for post details
    useEffect(() => {
        const fetchAllComments = async () => {
            try {
                setIsLoadingComments(true);
                const response = await getPostComments(id, 50);

                if (response?.data?.comments) {
                    setComments(response.data.comments);
                }
            } catch (err) {
                console.error('Error fetching comments:', err);
                setComments([]);
            } finally {
                setIsLoadingComments(false);
            }
        };

        if (id) {
            fetchAllComments();
        }
    }, [id]);

    // Handle comment creation - optimistically update UI
    const handleCommentCreated = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
    };

    // Handle comment deletion - optimistically update UI
    const handleCommentDeleted = (commentId) => {
        setComments(prevComments => prevComments.filter(c => c._id !== commentId));
    };

    // Handle comment edit - use full comment from server response
    const handleCommentUpdated = (updatedCommentFromServer) => {
        if (!updatedCommentFromServer?._id) return;
        setComments((prev) =>
            prev.map((c) => (c._id === updatedCommentFromServer._id ? updatedCommentFromServer : c))
        );
    };

    const handlePostDeleted = () => {
        navigate('/');
    };

    return (
        <>
            <section>
                <div className="container mx-auto max-w-2xl my-8 space-y-6">
                    {/* Post Section */}
                    {isLoadingPost ? (
                        <PostCardSkeleton />
                    ) : postDetails ? (
                        <PostCard
                            post={postDetails}
                            onPostDeleted={handlePostDeleted}
                        />
                    ) : (
                        <div className="text-center text-gray-500 py-8">
                            {error || 'Post not found'}
                        </div>
                    )}

                    {/* Comments Section */}
                    <div className="comments-section bg-white rounded-lg shadow p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold mb-6">
                                Comments ({comments.length})
                            </h3>

                            {/* Comment Form */}
                            <div className="mb-6">
                                <CommentForm
                                    postId={id}
                                    onCommentCreated={handleCommentCreated}
                                />
                            </div>
                        </div>

                        {/* Comments List */}
                        {isLoadingComments ? (
                            <div className="text-gray-500 text-center py-8">
                                Loading comments...
                            </div>
                        ) : comments.length > 0 ? (
                            <div className="space-y-6">
                                {comments.map(comment => (
                                    <CommentThread
                                        key={comment._id}
                                        comment={comment}
                                        postId={id}
                                        showAllReplies={true}
                                        onCommentDeleted={handleCommentDeleted}
                                        onCommentUpdated={handleCommentUpdated}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-500 text-center py-8">
                                No comments yet. Be the first to comment!
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
