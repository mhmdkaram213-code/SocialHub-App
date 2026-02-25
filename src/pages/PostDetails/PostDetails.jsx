import axios from "axios"
import { useContext, useState } from "react"
import { useParams } from "react-router-dom"
import { AuthContext } from "../../context/Auth/Auth.Context"
import PostCard from "../../components/PostCard/PostCard"
import PostCardSkeleton from "../../components/PostCardSkeleton/PostCardSkeleton"

export default function PostDetails() {
  const { id } = useParams() // to get the post id from the url
  const {token} = useContext(AuthContext) // to get the token from the context
  const [postDetails, setPostDetails] = useState(null)
  const options = {
    method: 'GET',
    url: `https://route-posts.routemisr.com/posts/${id}`,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  async function fetchPostDetails() {
    // fetch post details using the id
    const {data} = await axios.request(options)
    console.log(data);
    if(data.message === 'success') {
      setPostDetails(data.data.post)
    }
  }
  // call fetchPostDetails when the component mounts
  useState(() => {
    fetchPostDetails()
  }, [])
  return (
    <>
    <section>
      <div className="container mx-auto max-w-2xl my-8">
        {postDetails ? <PostCard post={postDetails} /> : <PostCardSkeleton />}
      </div>
    </section>
    </>
  )
}
