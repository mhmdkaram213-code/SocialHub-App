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
    // Normalize the new post to ensure it has the same shape as posts from the server
    const hasServerUserObject =
      newPost &&
      typeof newPost.user === 'object' &&
      newPost.user !== null;

    const hasServerUserDisplayFields =
      hasServerUserObject &&
      (newPost.user.name ||
        newPost.user.username ||
        newPost.user.userName ||
        newPost.user.photo);

    // Start with the server post as the source of truth for everything else
    let normalizedPost = {
      ...newPost,
      likes: newPost.likes || [],
      commentsCount: newPost.commentsCount || 0,
      topComment: newPost.topComment || null
    };

    if (hasServerUserDisplayFields) {
      // Server already returned a populated user object – just ensure field names are consistent
      const serverUser = newPost.user;
      normalizedPost.user = {
        ...serverUser,
        _id: serverUser._id || serverUser.id || serverUser._id,
        name:
          serverUser.name ||
          serverUser.username ||
          serverUser.userName ||
          user?.name ||
          user?.username ||
          user?.userName,
        photo: serverUser.photo || user?.photo || serverUser.photo
      };
    } else if (user) {
      // Server user is missing or minimal – fall back to the confirmed auth user
      normalizedPost.user = {
        _id: user._id || user.id || (typeof newPost.user === 'string' ? newPost.user : undefined),
        name: user.name || user.username || user.userName,
        photo: user.photo
      };
    } else {
      // No auth user loaded yet – keep whatever the server sent without fabricating display data
      normalizedPost = {
        ...normalizedPost,
        user: newPost.user
      };
    }

    // Optimistically insert the normalized post at the top
    setPosts(prevPosts => {
      if (prevPosts === null) return [normalizedPost];
      return [normalizedPost, ...prevPosts];
    });
  };

  // Handle post update from edit modal — use full post from server
  const handlePostUpdated = (updatedPostFromServer) => {
    if (!updatedPostFromServer?.id && !updatedPostFromServer?._id) return;
    const postId = updatedPostFromServer._id ?? updatedPostFromServer.id;
    setPosts((prevPosts) => {
      if (!prevPosts) return prevPosts;
      return prevPosts.map((p) =>
        (p._id === postId || p.id === postId) ? updatedPostFromServer : p
      );
    });
  };

  // Handle post deletion with optimistic UI update
  const handlePostDeleted = (postId) => {
    setPosts(prevPosts => {
      if (prevPosts === null) return null;
      return prevPosts.filter(post => post._id !== postId && post.id !== postId);
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
        onPostDeleted={handlePostDeleted}
        onPostUpdated={handlePostUpdated}
      />
    </>
  );
}
