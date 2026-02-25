import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import PostCard from '../PostCard/PostCard';
import PostCardSkeleton from '../PostCardSkeleton/PostCardSkeleton';
import { AuthContext } from './../../context/Auth/Auth.Context';

export default function Feed() {
  const { token } = useContext(AuthContext)
  const [posts, setPosts] = useState(null)
  const options = {
    url: 'https://route-posts.routemisr.com/posts',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  async function getAllPosts() {
    try {
      const { data } = await axios.request(options)
      console.log(data)
      setPosts(data.data.posts)
    } catch (error) {
      console.error(error)
    }
  }
  useEffect(() => {
    const fetchPosts = async () => {
      await getAllPosts()
    }
    fetchPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <section className='py-10'>
        <div className="container mx-auto max-w-2xl">
          <h2 className='text-2xl mb-3 font-semibold text-gray-600'>Latest Posts</h2>
          {posts ? (<div className="posts space-y-8">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          ) : (
            <div className="loading space-y-6">
              {[...Array(5)].map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
