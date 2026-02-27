import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import Feed from '../../components/Feed/Feed';
import PostUpload from '../../components/PostUpload/PostUpload';
import { AuthContext } from '../../context/Auth/Auth.Context';

export default function Home() {
  const { token, user, setUser } = useContext(AuthContext);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const options = {
        url: 'https://route-posts.routemisr.com/posts',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const { data } = await axios.request(options);
      const fetchedPosts = data.data.posts;
      setPosts(fetchedPosts);

      // Extract and store current user's data from first fetched post (for optimistic updates)
      if (fetchedPosts && fetchedPosts.length > 0 && !user) {
        const firstPost = fetchedPosts[0];
        if (firstPost.user) {
          setUser({
            _id: firstPost.user._id,
            name: firstPost.user.name,
            photo: firstPost.user.photo
          });
        }
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Load posts on mount
  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle new post creation with optimistic UI update
  const handlePostCreated = (newPost) => {
    // Normalize the new post to ensure it has the full user object
    const normalizedPost = {
      ...newPost,
      user: {
        _id: newPost.user?._id || user?._id,
        name: newPost.user?.name || user?.name,
        photo: newPost.user?.photo || user?.photo
      },
      likes: newPost.likes || [],
      commentsCount: newPost.commentsCount || 0,
      topComment: newPost.topComment || null
    };

    // Optimistically insert the normalized post at the top
    setPosts(prevPosts => {
      if (prevPosts === null) return [normalizedPost];
      return [normalizedPost, ...prevPosts];
    });
  };

  return (
    <>
      <PostUpload onPostCreated={handlePostCreated} />
      <Feed
        posts={posts}
        isLoading={isLoading}
        error={error}
        refreshPosts={fetchPosts}
      />
    </>
  );
}
