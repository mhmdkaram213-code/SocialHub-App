import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useCommentLike } from '../../hooks/useLike';

export default function CommentLikeButton({ postId, commentId, initialLikesCount = 0, initialIsLiked = false }) {
    const { likesCount, isLiked, isLoading, error, toggleLike } = useCommentLike(
        postId,
        commentId,
        initialLikesCount,
        initialIsLiked
    );

    // Handle error display
    useEffect(() => {
        if (error) {
            console.error('Like error:', error);
            // Optional: Show toast notification here
        }
    }, [error]);

    return (
        <button
            onClick={toggleLike}
            disabled={isLoading}
            className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            title={isLiked ? 'Unlike' : 'Like'}
        >
            <FontAwesomeIcon
                icon={isLiked ? fas.faHeart : far.faHeart}
                size="sm"
            />
            {likesCount > 0 && <span>{likesCount}</span>}
        </button>
    );
}
