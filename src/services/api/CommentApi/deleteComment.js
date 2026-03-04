import axios from "axios";

/**
 * Deletes a comment from a post.
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The API response.
 */
export default async function deleteComment(postId, commentId, token) {
    const options = {
        url: `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
}
