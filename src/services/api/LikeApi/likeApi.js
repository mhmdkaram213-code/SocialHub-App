import axios from 'axios';

export async function togglePostLike(postId) {
    try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.put(
            `https://route-posts.routemisr.com/posts/${postId}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        return { 
            success: true, 
            isLiked: data.data.isLiked,
            likesCount: data.data.likesCount
        };
    } catch (error) {
        console.error('Error toggling post like:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to toggle like'
        };
    }
}

export async function toggleCommentLike(postId, commentId) {
    try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.put(
            `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        return { 
            success: true, 
            isLiked: data.data.isLiked,
            likesCount: data.data.likesCount
        };
    } catch (error) {
        console.error('Error toggling comment like:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to toggle like'
        };
    }
}
