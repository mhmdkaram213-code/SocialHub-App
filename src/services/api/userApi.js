import axios from 'axios';

const API_BASE = 'https://route-posts.routemisr.com';

export async function getUserProfile(token) {
  try {
    const { data } = await axios.get(
      `${API_BASE}/users/profile-data`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log("Profile API Response Data:", data);
    return {
      success: true,
      data: data.data
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch profile'
    };
  }
}

export async function changePassword(token, currentPassword, newPassword) {
  try {
    const { data } = await axios.patch(
      `${API_BASE}/users/change-password`,
      {
        password: currentPassword,
        newPassword: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return {
      success: true,
      token: data.data?.token || null,
      message: data.message || 'Password changed successfully'
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to change password'
    };
  }
}

export async function getUserPosts(token) {
  try {
    const { data } = await axios.get(
      `${API_BASE}/users/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // The API returns { data: [...posts] } where data is an array
    const posts = Array.isArray(data.data) ? data.data : [];

    return {
      success: true,
      data: posts
    };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch posts',
      data: []
    };
  }
}

export async function uploadProfilePhoto(token, file) {
  try {
    const formData = new FormData();
    formData.append('photo', file);

    const { data } = await axios.put(
      `${API_BASE}/users/upload-photo`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return {
      success: true,
      data: data.user || data.data || data, // Handle different API response structures
      message: 'Photo updated successfully'
    };
  } catch (error) {
    console.error('Error uploading photo:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to upload photo'
    };
  }
}
