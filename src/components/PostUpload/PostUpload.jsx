import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import user from '../../assets/images/user.jpg';
import { AuthContext } from '../../context/Auth/Auth.Context';

export default function PostUpload({ onPostCreated }) {
  const { token, user: authUser } = useContext(AuthContext);
  const [postBody, setPostBody] = useState('');
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function addPost(e) {
    e.preventDefault();
    console.log("Current user at post creation:", authUser);
    // Validation: Check if post has content
    if (!postBody.trim() && !image) {
      toast.warning('Please add some content or an image');
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('body', postBody.trim());
      if (image) {
        formData.append('image', image);
      }
      const options = {
        url: 'https://route-posts.routemisr.com/posts',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        data: formData
      };
      const { data, status } = await axios.request(options);
      console.log(data);
      if (status === 201 && data.success) {
        toast.success(data.message);
        // Optimistic UI update: Pass the new post to parent
        const newPost = data.data.post;
        if (onPostCreated && newPost) {
          onPostCreated(newPost);
        }
        // Reset form
        setPostBody('');
        setImage('');
        setImageUrl('');
      } else {
        toast.error('Failed to create post');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create post. Please try again.';
      toast.error(errorMessage);
      console.error('Post creation error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  function handleImg(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      e.target.value = '';
    }
  }
  return (
    <section className='mt-8'>
      <form onSubmit={addPost} className="container mx-auto max-w-2xl bg-white rounded-2xl shadow-lg p-5">
        <header className="flex items-center space-x-4 mb-4">
          <div className="avatar border-3 rounded-full border-blue-300 overflow-hidden w-12 h-12">
            <img
              src={authUser?.photo || user}
              alt="User Avatar"
              className="w-full h-full rounded-full object-cover object-center"
              onError={(e) => { e.target.src = user; }}
            />
          </div>
          <div className="author">
            <h2 className="text-lg font-semibold">Create Post</h2>
            <p className="text-sm text-gray-600">Share your thoughts with the world</p>
          </div>
        </header>
        <textarea
          value={postBody}
          onChange={(e) => setPostBody(e.target.value)}
          name="postContent"
          id="postContent"
          placeholder='Whats on your mind?'
          disabled={isLoading}
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {imageUrl && (
          <div className='relative mt-4 rounded-lg overflow-hidden'>
            <img className='w-full h-96 object-cover' src={imageUrl} alt="preview" />
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                setImage('');
              }}
              aria-label="Remove image"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="flex justify-between items-center border-t border-gray-400/30 mt-4 pt-4 gap-3">
          <label
            className="border border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            htmlFor="image"
          >
            <div className='space-x-2 flex items-center'>
              <FontAwesomeIcon icon={fas.faImage} className="text-blue-500" />
              <span>Photo</span>
            </div>
            <input
              onChange={handleImg}
              type="file"
              accept="image/*"
              className='hidden'
              id="image"
              disabled={isLoading}
            />
          </label>
          <button
            type="submit"
            disabled={isLoading}
            className="space-x-2 bg-linear-to-r from-blue-700 to-blue-500 text-white hover:from-blue-600 hover:to-blue-400 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-all duration-200 flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <span>Post</span>
                <FontAwesomeIcon icon={fas.faPaperPlane} />
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
