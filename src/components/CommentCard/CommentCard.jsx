import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../../context/Auth/Auth.Context';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import deleteComment from '../../services/api/CommentApi/deleteComment';
import updateComment from '../../services/api/CommentApi/updateComment';
import CommentLikeButton from '../CommentLikeButton/CommentLikeButton';

export default function CommentCard({ comment, postId, onCommentDeleted, onCommentUpdated, isReply = false }) {
  const { token, user: authUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment?.content ?? '');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const dropdownRef = useRef(null);

  // Check if the comment creator is the same as the logged-in user
  const creator = comment.commentCreator || comment.user || {};

  // ROOT CAUSE BUG 2 INVESTIGATION (as requested)
  const authId = authUser?.user?._id || authUser?.user?.id;

  const ownerIdFromCreatorObject = creator?._id || creator?.id;
  const rawCreatorField = comment.commentCreator ?? comment.user;
  const ownerIdFromTopLevel =
    comment?.userId ||
    comment?.authorId ||
    (typeof rawCreatorField === 'string' ? rawCreatorField : null);

  const ownerId = ownerIdFromCreatorObject || ownerIdFromTopLevel;

  console.log("currentUser id (comment):", authId, typeof authId);
  console.log("comment author id:", ownerId, typeof ownerId);

  const isCommentOwner = authId && ownerId && String(authId) === String(ownerId);

  // BUG 1 & 3 FIX: If it's the owner, use official authUser data for real-time sync
  const displayUser = isCommentOwner ? authUser.user : creator;
  const userName = displayUser?.name || displayUser?.username || displayUser?.userName || 'User';
  const userPhoto = displayUser?.photo;

  useEffect(() => {
    setEditedContent(comment?.content ?? '');
  }, [comment?.content]);

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

  const startEditing = () => {
    setIsEditing(true);
    setEditedContent(comment?.content ?? '');
    setIsDropdownOpen(false);
  };

  const handleSaveEdit = async () => {
    try {
      setIsSavingEdit(true);
      const formData = new FormData();
      formData.append('content', editedContent.trim());
      const response = await updateComment(postId, comment._id, formData, token);
      console.log('Edit comment response:', response.data);
      const fullCommentFromServer =
        response.data?.data?.comment ??
        response.data?.comment ??
        response.data?.data ??
        response.data;
      if (fullCommentFromServer && onCommentUpdated) {
        onCommentUpdated(fullCommentFromServer);
      }
      setIsEditing(false);
      toast.success('Comment updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update comment');
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(comment?.content ?? '');
    setIsEditing(false);
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
            {isEditing ? (
              <div className="space-y-2 mt-1">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  autoFocus
                  disabled={isSavingEdit}
                  className={`w-full resize-none border border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isReply ? 'text-xs min-h-[60px]' : 'text-sm min-h-[80px]'}`}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit || !editedContent.trim()}
                    className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingEdit ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSavingEdit}
                    className="px-3 py-1.5 text-xs font-medium border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className={`${isReply ? 'text-xs' : 'text-sm'} text-gray-700 break-words`}>
                {comment.content}
              </p>
            )}

            {/* Three-dot menu: only when not editing */}
            {isCommentOwner && !isEditing && (
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
                      onClick={startEditing}
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