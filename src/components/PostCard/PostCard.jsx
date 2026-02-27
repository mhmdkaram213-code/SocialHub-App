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

export default function PostCard({ post }) {
    const { user: authUser } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [totalComments, setTotalComments] = useState(0);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [showCommentForm, setShowCommentForm] = useState(false);
    
    // Fallback user data structure
    const user = post?.user || {};
    const userPhoto = user.photo || defaultAvatar;
    const userName = user.name || 'Unknown User';
    
    // Check if logged-in user is the post owner
    const isPostOwner = authUser?._id === post?.user?._id;

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
                            <Link to={`/post/${post?.id}`} className='hover:underline'>
                                {post?.createdAt ? new Date(post.createdAt).toLocaleString() : 'Just now'}
                            </Link>
                        </time>
                    </div>
                </div>

                {/* Show three-dots icon only if user is post owner */}
                {isPostOwner && (
                    <Button
                        isIconOnly
                        variant="light"
                        className="text-gray-600"
                    >
                        ⋮
                    </Button>
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
