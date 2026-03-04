import PostCard from '../PostCard/PostCard';
import PostCardSkeleton from '../PostCardSkeleton/PostCardSkeleton';

export default function Feed({ posts, isLoading, error, refreshPosts, onPostDeleted }) {
  return (
    <>
      <section className='py-10'>
        <div className="container mx-auto max-w-2xl">
          <div className="flex justify-between items-center mb-3">
            <h2 className='text-2xl font-semibold text-gray-600'>Latest Posts</h2>
            {!isLoading && posts && (
              <button
                onClick={refreshPosts}
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Refresh
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4">
              {error}
              <button
                onClick={refreshPosts}
                className="ml-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading space-y-6">
              {[...Array(5)].map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="posts space-y-8">
              {posts.map(post => (
                <PostCard
                  key={post._id ?? post.id}
                  post={post}
                  onPostDeleted={onPostDeleted}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state text-center py-8">
              <p className="text-gray-600">No posts yet. Be the first to create one!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
