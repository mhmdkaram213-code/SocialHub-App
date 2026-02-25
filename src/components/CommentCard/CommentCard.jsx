export default function CommentCard({ comment }) {
  return (
    <div className="comment-card flex items-start  gap-4 w-full">
      
      <img
        src={comment.commentCreator.photo}
        alt="User"
        className="size-12 rounded-full shrink-0 mt-3"
      />

      <div className="comment-body flex-1">
        
        <div className="comment bg-gray-100 shadow p-4 rounded-lg w-full">
          <h4 className="font-semibold">
            {comment.commentCreator.name}
          </h4>
          <p className="text-gray-600">
            {comment.content}
          </p>
        </div>

        <div className="flex gap-2 items-center text-gray-500 text-sm mt-2 ml-1">
          <span>
            {new Date(comment.createdAt).toLocaleString()}
          </span>
          <button className="cursor-pointer">like</button>
          <button className="cursor-pointer">reply</button>
        </div>

      </div>
    </div>
  )
}