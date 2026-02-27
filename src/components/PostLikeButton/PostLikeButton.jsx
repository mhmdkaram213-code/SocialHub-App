import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { usePostLike } from '../../hooks/useLike';

export default function PostLikeButton({ postId, initialLikesCount = 0, initialIsLiked = false }) {
    const { likesCount, isLiked, isLoading, error, toggleLike } = usePostLike(
        postId,
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
            className={`flex items-center gap-2 transition-colors duration-200 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            } ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
            title={isLiked ? 'Unlike' : 'Like'}
        >
            <FontAwesomeIcon
                icon={isLiked ? fas.faHeart : far.faHeart}
                className="text-lg"
            />
            <span className="text-sm font-medium">{likesCount}</span>
        </button>
    );
}
