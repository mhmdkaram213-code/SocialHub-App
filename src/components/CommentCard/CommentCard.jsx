import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/Auth/Auth.Context';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import deleteComment from '../../services/api/CommentApi/deleteComment';
import CommentLikeButton from '../CommentLikeButton/CommentLikeButton';

export default function CommentCard({ comment, postId, onCommentDeleted, isReply = false }) {
  const { token, user: authUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dropdownRef = useRef(null);

  // Check if the comment creator is the same as the logged-in user
  const creator = comment.commentCreator || comment.user || {};

  // ROOT CAUSE BUG 2 INVESTIGATION (as requested)
  const authId = authUser?._id || authUser?.id;

  const ownerIdFromCreatorObject = creator?._id || creator?.id;
  const rawCreatorField = comment.commentCreator ?? comment.user;
  const ownerIdFromTopLevel =
    comment?.userId ||
    comment?.authorId ||
    (typeof rawCreatorField === 'string' ? rawCreatorField : null);

  const ownerId = ownerIdFromCreatorObject || ownerIdFromTopLevel;

  console.log("Current user ID (for comment):", authId, typeof authId);
  console.log("Comment author ID:", ownerId, typeof ownerId);

  const isCommentOwner = authId && ownerId && String(authId) === String(ownerId);

  // BUG 1 & 3 FIX: If it's the owner, use official authUser data for real-time sync
  const displayUser = isCommentOwner ? authUser : creator;
  const userName = displayUser?.name || displayUser?.username || displayUser?.userName || 'User';
  const userPhoto = displayUser?.photo;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteComment(postId, comment._id, token);
      if (response.status === 200 || response.data?.message === 'success') {
        toast.success('Comment deleted successfully');
        setIsDropdownOpen(false);
        if (onCommentDeleted) {
          onCommentDeleted(comment._id);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete comment');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`comment-card flex items-start gap-3 w-full group`}>
      <img
        src={userPhoto}
        alt={userName}
        className={`${isReply ? 'size-8' : 'size-10'} rounded-full shrink-0 mt-1 object-cover`}
        onError={(e) => { e.target.src = 'https://route-posts.routemisr.com/uploads/default.png'; }}
      />
      <div className="comment-body flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <div className={`${isReply ? 'bg-gray-50 p-2' : 'bg-gray-100 p-3'} rounded-lg flex-1 min-w-0 relative shadow-sm`}>
            <h4 className={`font-semibold ${isReply ? 'text-xs' : 'text-sm'} truncate pr-6`}>
              {userName}
            </h4>
            <p className={`${isReply ? 'text-xs' : 'text-sm'} text-gray-700 break-words`}>
              {comment.content}
            </p>

            {/* Step 4: Ensure positioning is correct */}
            {isCommentOwner && (
              <div className="absolute top-2 right-2 z-10" ref={dropdownRef}>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 leading-none"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FontAwesomeIcon icon={fas.faEllipsisVertical} className="w-4 h-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">
                    <button
                      className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      onClick={() => {
                        toast.info("Edit feature coming soon!");
                        setIsDropdownOpen(false);
                      }}
                    >
                      <FontAwesomeIcon icon={fas.faEdit} className="text-gray-400 w-3" />
                      Edit Comment
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      <FontAwesomeIcon icon={fas.faTrash} className="w-3" />
                      {isDeleting ? 'Deleting...' : 'Delete Comment'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 items-center text-gray-500 text-[10px] mt-1 ml-1">
          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
          <CommentLikeButton
            postId={postId}
            commentId={comment._id}
            initialLikesCount={comment?.likes?.length || 0}
            initialIsLiked={comment?.isLiked || false}
          />
          {!isReply && (
            <button className="cursor-pointer hover:text-gray-700">Reply</button>
          )}
        </div>
      </div>
    </div>
  );
}