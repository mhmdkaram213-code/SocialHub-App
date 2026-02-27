import axios from 'axios';

export async function createComment(postId, formData) {
    try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        return { success: true, data: data.data.comment };
    } catch (error) {
        console.error('Error creating comment:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to create comment'
        };
    }
}

export async function createReply(postId, commentId, formData) {
    try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.post(
            `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        return { success: true, data: data.data.reply };
    } catch (error) {
        console.error('Error creating reply:', error);
        return { 
            success: false, 
            message: error.response?.data?.message || 'Failed to create reply'
        };
    }
}
