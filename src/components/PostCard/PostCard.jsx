import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentThread from '../CommentThread/CommentThread';
import CommentForm from '../CommentForm/CommentForm';
import PostLikeButton from '../PostLikeButton/PostLikeButton';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/images/user.jpg';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/Auth/Auth.Context';
import { Button } from '@heroui/react';
import getPostComments from '../../services/api/CommentApi/getPostComments';
import { useRef } from 'react';
import deletePost from '../../services/api/PostApi/deletePost';
import { toast } from 'react-toastify';

export default function PostCard({ post, onPostDeleted }) {
    const { token, user: authUser } = useContext(AuthContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const dropdownRef = useRef(null);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);

    // Fallback user data structure - Ensure we pull from post.user correctly
    const postUser = post?.user && typeof post.user === 'object' ? post.user : {};

    // ROOT CAUSE BUG 2 INVESTIGATION (as requested)
    const authId = authUser?._id || authUser?.id;
    const postOwnerRaw = post?.user;
    const ownerId = (typeof postOwnerRaw === 'string') ? postOwnerRaw : (postOwnerRaw?._id || postOwnerRaw?.id);

    console.log("Current user ID:", authId, typeof authId);
    console.log("Post author ID:", ownerId, typeof ownerId);

    const isPostOwner = authId && ownerId && String(authId) === String(ownerId);

    // BUG 1 FIX: If it's the owner, use official authUser data to avoid stale/unpopulated info
    const displayUser = isPostOwner ? authUser : postUser;
    const userPhoto = displayUser?.photo || defaultAvatar;
    const userName = displayUser?.name || displayUser?.username || displayUser?.userName || 'User';

    // Handle outside click to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Fetch comments on mount
    useEffect(() => {
        const fetchComments = async () => {
            setIsLoadingComments(true);
            const response = await getPostComments(post._id, 1);

            if (response?.data?.comments) {
                setComments(response.data.comments);
                setTotalComments(response?.data?.count || 0);
            }
            setIsLoadingComments(false);
        };

        if (post?._id) {
            fetchComments();
        }
    }, [post?._id]);

    // Handle comment creation - optimistically update UI
    const handleCommentCreated = (newComment) => {
        setComments(prevComments => [newComment, ...prevComments]);
        setTotalComments(prevTotal => prevTotal + 1);
        setShowCommentForm(false);
    };

    // Handle comment deletion - optimistically update UI
    const handleCommentDeleted = (commentId) => {
        setComments(prevComments => prevComments.filter(c => c._id !== commentId));
        setTotalComments(prevTotal => Math.max(0, prevTotal - 1));
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await deletePost(post._id, token);
            if (response.status === 200 || response.status === 204 || response.data?.message === 'success') {
                toast.success('Post deleted successfully');
                setIsDropdownOpen(false);
                if (onPostDeleted) {
                    onPostDeleted(post._id);
                }
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to delete post');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="post-card bg-white rounded-lg shadow p-8 space-y-6">
            <header className="post-header flex items-center justify-between">
                <div className="user-info flex items-center gap-2">
                    <img
                        src={userPhoto}
                        alt={userName}
                        className='size-12 rounded-full object-cover object-center'
                        onError={(e) => {
                            e.target.src = defaultAvatar;
                        }}
                    />
                    <div>
                        <h3 className='font-semibold'>{userName}</h3>
                        <time className='text-sm text-gray-600 block -mt-1' >
                            <Link to={`/post/${post?._id || post?.id}`} className='hover:underline'>
                                {post?.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
                            </Link>
                        </time>
                    </div>
                </div>

                {/* Show three-dots icon only if user is post owner */}
                {isPostOwner && (
                    <div className="relative" ref={dropdownRef}>
                        <Button
                            isIconOnly
                            variant="light"
                            className="text-gray-600 text-xl font-bold"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            ⋮
                        </Button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                                <button
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                                    onClick={() => {
                                        toast.info("Edit feature coming soon!");
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <FontAwesomeIcon icon={fas.faEdit} className="text-gray-400 w-4" />
                                    Edit Post
                                </button>
                                <button
                                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    <FontAwesomeIcon icon={fas.faTrash} className="w-4" />
                                    {isDeleting ? 'Deleting...' : 'Delete Post'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </header>
            <figure className="post-info">
                <figcaption className='mb-4 text-gray-700'>
                    {post?.body}
                </figcaption>
                {post?.image && <div className='-mx-8'>
                    <img src={post.image} alt="Post Body" className="w-full h-120 object-cover object-center" />
                </div>}
            </figure>
            <div className="reactions flex items-center justify-between">
                <div className="likes flex items-center gap-1">
                    <div className="icons flex gap-1 *:hover:scale-110 *:transition-transform *:duration-200 items-center *:cursor-pointer *:size-8 *:rounded-full *:flex *:justify-center *:items-center">
                        <div className="icon bg-blue-400 text-white ">
                            <FontAwesomeIcon icon={fas.faThumbsUp} />
                        </div>
                        <div className="icon bg-red-400 text-white">
                            <FontAwesomeIcon icon={fas.faHeart} />
                        </div>
                    </div>
                    <span>{post?.likes?.length || 0} likes</span>
                </div>
                <div>
                    <span>{post?.commentsCount || 0} comments</span>
                </div>
            </div>
            <div className="action-btn flex items-center text-lg -mx-8 text-gray-700 border-y border-gray-400/30 p-4 gap-0">
                <div className="flex-1 rounded-lg py-2 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center">
                    <PostLikeButton
                        postId={post._id}
                        initialLikesCount={post?.likes?.length || 0}
                        initialIsLiked={post?.isLiked || false}
                    />
                </div>
                <button className='flex-1 space-x-1 rounded-lg py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center'>
                    <FontAwesomeIcon icon={far.faComment} />
                    <span>Comment</span>
                </button>
                <button className='flex-1 space-x-1.25 rounded-lg py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center'>
                    <FontAwesomeIcon icon={far.faShareSquare} />
                    <span>Share</span>
                </button>
            </div>
            <section>
                {isLoadingComments ? (
                    <div className="text-gray-500 text-center text-sm">Loading comments...</div>
                ) : (
                    <div className="comments-section space-y-4">
                        {/* Comment Form Toggle */}
                        {!showCommentForm ? (
                            <button
                                onClick={() => setShowCommentForm(true)}
                                className="w-full text-left text-gray-600 hover:text-gray-800 text-sm py-2"
                            >
                                Write a comment...
                            </button>
                        ) : (
                            <CommentForm
                                postId={post._id}
                                onCommentCreated={handleCommentCreated}
                            />
                        )}

                        {/* Comments List */}
                        {comments.length > 0 && (
                            <div className="space-y-4 py-4">
                                {comments.map(comment => (
                                    <CommentThread
                                        key={comment._id}
                                        comment={comment}
                                        postId={post._id}
                                        showAllReplies={false}
                                        onCommentDeleted={handleCommentDeleted}
                                    />
                                ))}

                                {/* View All Comments Button */}
                                {totalComments > 1 && (
                                    <Link to={`/post/${post._id}`}>
                                        <Button
                                            variant="light"
                                            size="sm"
                                            className="text-blue-600"
                                        >
                                            View all {totalComments} comments
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        )}

                        {/* No Comments Message */}
                        {comments.length === 0 && !showCommentForm && (
                            <div className="text-gray-500 text-center text-sm py-4">
                                <p>No comments yet. Be the first to comment!</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
