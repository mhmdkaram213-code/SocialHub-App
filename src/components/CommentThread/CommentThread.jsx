import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import getCommentReplies from '../../services/api/CommentApi/getCommentReplies';
import ReplyForm from '../ReplyForm/ReplyForm';
import CommentLikeButton from '../CommentLikeButton/CommentLikeButton';

export default function CommentThread({ comment, postId, showAllReplies = false }) {
    const [replies, setReplies] = useState([]);
    const [isLoadingReplies, setIsLoadingReplies] = useState(false);
    const [totalReplies, setTotalReplies] = useState(0);
    const [showReplyForm, setShowReplyForm] = useState(false);

    useEffect(() => {
        const fetchReplies = async () => {
            setIsLoadingReplies(true);
            const limit = showAllReplies ? 50 : 1;
            const response = await getCommentReplies(postId, comment._id, limit);
            
            if (response?.data?.replies) {
                setReplies(response.data.replies);
                setTotalReplies(response?.data?.count || response.data.replies.length);
            }
            setIsLoadingReplies(false);
        };

        fetchReplies();
    }, [postId, comment._id, showAllReplies]);

    // Handle reply creation - optimistically update UI
    const handleReplyCreated = (newReply) => {
        setReplies(prevReplies => [newReply, ...prevReplies]);
        setTotalReplies(prevTotal => prevTotal + 1);
        setShowReplyForm(false);
    };

    return (
        <div className="comment-thread space-y-3">
            {/* Main Comment */}
            <div className="comment-card flex items-start gap-4 w-full">
                <img
                    src={comment.commentCreator.photo}
                    alt={comment.commentCreator.name}
                    className="size-10 rounded-full shrink-0 mt-1 object-cover"
                />
                <div className="comment-body flex-1">
                    <div className="comment bg-gray-100 p-3 rounded-lg w-full">
                        <h4 className="font-semibold text-sm">
                            {comment.commentCreator.name}
                        </h4>
                        <p className="text-gray-700 text-sm">
                            {comment.content}
                        </p>
                    </div>
                    <div className="flex gap-3 items-center text-gray-500 text-xs mt-2 ml-1">
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        <CommentLikeButton 
                            postId={postId}
                            commentId={comment._id}
                            initialLikesCount={comment?.likes?.length || 0}
                            initialIsLiked={comment?.isLiked || false}
                        />
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="cursor-pointer hover:text-gray-700"
                        >
                            {showReplyForm ? 'Cancel' : 'Reply'}
                        </button>
                    </div>

                    {/* Reply Form */}
                    {showReplyForm && (
                        <div className="mt-3">
                            <ReplyForm
                                postId={postId}
                                commentId={comment._id}
                                onReplyCreated={handleReplyCreated}
                                onCancel={() => setShowReplyForm(false)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Replies */}
            {isLoadingReplies ? (
                <div className="text-gray-500 text-sm ml-8">Loading replies...</div>
            ) : replies.length > 0 ? (
                <div className="ml-8 space-y-3 border-l border-gray-200 pl-4">
                    {replies.map((reply) => (
                        <div key={reply._id} className="reply-card flex items-start gap-3">
                            <img
                                src={reply.commentCreator.photo}
                                alt={reply.commentCreator.name}
                                className="size-8 rounded-full shrink-0 mt-1 object-cover"
                            />
                            <div className="reply-body flex-1">
                                <div className="reply bg-gray-50 p-2 rounded text-sm">
                                    <h5 className="font-semibold text-xs">
                                        {reply.commentCreator.name}
                                    </h5>
                                    <p className="text-gray-700 text-xs">
                                     CommentLikeButton 
                                        postId={postId}
                                        commentId={reply._id}
                                        initialLikesCount={reply?.likes?.length || 0}
                                        initialIsLiked={reply?.isLiked || false}
                                    /
                                    </p>
                                </div>
                                <div className="flex gap-2 items-center text-gray-500 text-xs mt-1 ml-1">
                                    <span>{new Date(reply.createdAt).toLocaleDateString()}</span>
                                    <button className="cursor-pointer hover:text-gray-700">Like</button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* View All Replies Button */}
                    {!showAllReplies && totalReplies > 1 && (
                        <Button
                            variant="light"
                            size="sm"
                            className="text-blue-600 h-auto p-0 text-sm"
                        >
                            View {totalReplies - 1} more replies
                        </Button>
                    )}
                </div>
            ) : null}
        </div>
    );
}
