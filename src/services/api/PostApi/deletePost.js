import axios from "axios";

/**
 * Deletes a post from the server.
 * @param {string} postId - The ID of the post to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The API response.
 */
export default async function deletePost(postId, token) {
    const options = {
        url: `https://route-posts.routemisr.com/posts/${postId}`,
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`
        }
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
}
