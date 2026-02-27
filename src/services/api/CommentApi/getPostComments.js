import axios from 'axios';

export default async function getPostComments(postId, limit = 1, page = 1) {
    try {
        const token = localStorage.getItem('token');
        
        const { data } = await axios.get(
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
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
        console.error('Error fetching comments:', error);
        return { data: { comments: [] } };
    }
}
