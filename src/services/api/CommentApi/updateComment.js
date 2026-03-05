import axios from 'axios';

const API_BASE = 'https://route-posts.routemisr.com';

/**
 * Updates a comment on the server.
 * @param {string} postId - The post ID.
 * @param {string} commentId - The comment ID.
 * @param {FormData} formData - Must include 'content'.
 * @param {string} token - Auth token.
 * @returns {Promise<Object>} - Full axios response (use response.data for updated comment path).
 */
export default async function updateComment(postId, commentId, formData, token) {
  const response = await axios.put(
    `${API_BASE}/posts/${postId}/comments/${commentId}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
}
