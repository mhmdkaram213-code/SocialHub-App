import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommentCard from '../CommentCard/CommentCard';
import { Link } from 'react-router-dom';
import defaultAvatar from '../../assets/images/user.jpg';

export default function PostCard({ post }) {
    // Fallback user data structure
    const user = post?.user || {};
    const userPhoto = user.photo || defaultAvatar;
    const userName = user.name || 'Unknown User';
    
    return (
        <>
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
                    <button>
                        <FontAwesomeIcon icon={fas.faEllipsisVertical} />
                    </button>
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
                <div className="action-btn flex items-center text-lg -mx-8 text-gray-700 border-y border-gray-400/30 p-2 *:rounded-lg *:py-2 *:grow *:cursor-pointer *:hover:bg-gray-100 *:transition-colors *:duration-200 *:flex *:items-center *:justify-center">
                    <button className='space-x-1'>
                        <FontAwesomeIcon icon={far.faThumbsUp} />
                        <span>Like</span>
                    </button>
                    <button className='space-x-1'>
                        <FontAwesomeIcon icon={far.faComment} />
                        <span>Comment</span>
                    </button>
                    <button className='space-x-1.25'>
                        <FontAwesomeIcon icon={far.faShareSquare} />
                        <span>Share</span>
                    </button>
                </div>
                <section>
                    {post?.topComment ? (
                        <div className="all-comments space-y-4">
                            <CommentCard comment={post.topComment} />
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center">
                            <p>No Comments yet, Be the First Comment</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}
