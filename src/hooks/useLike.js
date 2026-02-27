import { useState, useCallback, useRef } from 'react';
import { toggleCommentLike, togglePostLike } from '../services/api/LikeApi/likeApi';

export function usePostLike(postId, initialLikesCount = 0, initialIsLiked = false) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isLoadingRef = useRef(false);

    const toggleLike = useCallback(async () => {
        // Prevent multiple rapid clicks using ref to avoid race conditions
        if (isLoadingRef.current) return;

        // Store previous state for rollback
        const previousLikesCount = likesCount;
        const previousIsLiked = isLiked;

        // Mark as loading
        isLoadingRef.current = true;
        setIsLoading(true);
        setError(null);

        // Optimistic update
        setIsLiked(prev => !prev);
        setLikesCount(prev => (previousIsLiked ? prev - 1 : prev + 1));

        try {
            const result = await togglePostLike(postId);

            if (result.success) {
                // Update with actual server response
                setIsLiked(result.isLiked);
                setLikesCount(result.likesCount);
            } else {
                // Rollback on failure
                setIsLiked(previousIsLiked);
                setLikesCount(previousLikesCount);
                setError(result.message);
            }
        } catch (err) {
            // Rollback on error
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
            setError('Failed to update like');
            console.error('Error toggling post like:', err);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [postId, isLiked, likesCount]);

    return { likesCount, isLiked, isLoading, error, toggleLike };
}

export function useCommentLike(postId, commentId, initialLikesCount = 0, initialIsLiked = false) {
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isLoadingRef = useRef(false);

    const toggleLike = useCallback(async () => {
        // Prevent multiple rapid clicks using ref to avoid race conditions
        if (isLoadingRef.current) return;

        // Store previous state for rollback
        const previousLikesCount = likesCount;
        const previousIsLiked = isLiked;

        // Mark as loading
        isLoadingRef.current = true;
        setIsLoading(true);
        setError(null);

        // Optimistic update
        setIsLiked(prev => !prev);
        setLikesCount(prev => (previousIsLiked ? prev - 1 : prev + 1));

        try {
            const result = await toggleCommentLike(postId, commentId);

            if (result.success) {
                // Update with actual server response
                setIsLiked(result.isLiked);
                setLikesCount(result.likesCount);
            } else {
                // Rollback on failure
                setIsLiked(previousIsLiked);
                setLikesCount(previousLikesCount);
                setError(result.message);
            }
        } catch (err) {
            // Rollback on error
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikesCount);
            setError('Failed to update like');
            console.error('Error toggling comment like:', err);
        } finally {
            isLoadingRef.current = false;
            setIsLoading(false);
        }
    }, [postId, commentId, isLiked, likesCount]);

    return { likesCount, isLiked, isLoading, error, toggleLike };
}
