import axios from 'axios';

export default async function getCommentReplies(postId, commentId, limit = 1, page = 1) {
    try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.get(
            `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/replies`,
            {
                params: {
                    page,
                    limit
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        
        return data;
    } catch (error) {
        console.error('Error fetching replies:', error);
        return { data: { replies: [] } };
    }
}
