import axios from "axios";

/**
 * Updates a post on the server.
 * @param {string} postId - The ID of the post to update.
 * @param {FormData} formData - The updated post data (body and optional image).
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} - The API response.
 */
export default async function updatePost(postId, formData, token) {
    const options = {
        url: `https://route-posts.routemisr.com/posts/${postId}`,
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    };

    try {
        const response = await axios.request(options);
        return response;
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
}
