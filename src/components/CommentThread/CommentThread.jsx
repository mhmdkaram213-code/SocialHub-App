import { useState, useEffect } from 'react';
import { Button } from '@heroui/react';
import getCommentReplies from '../../services/api/CommentApi/getCommentReplies';
import ReplyForm from '../ReplyForm/ReplyForm';
import CommentCard from '../CommentCard/CommentCard';

export default function CommentThread({ comment, postId, onCommentDeleted, showAllReplies = false }) {
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

    // Handle reply deletion - optimistically update UI
    const handleReplyDeleted = (replyId) => {
        setReplies(prevReplies => prevReplies.filter(reply => reply._id !== replyId));
        setTotalReplies(prevTotal => Math.max(0, prevTotal - 1));
    };

    return (
        <div className="comment-thread space-y-3">
            {/* Main Comment */}
            <CommentCard
                comment={comment}
                postId={postId}
                onCommentDeleted={onCommentDeleted}
            />

            {/* Reply Toggle/Form Action area */}
            <div className="ml-13 mb-2">
                {showReplyForm ? (
                    <ReplyForm
                        postId={postId}
                        commentId={comment._id}
                        onReplyCreated={handleReplyCreated}
                        onCancel={() => setShowReplyForm(false)}
                    />
                ) : (
                    <button
                        onClick={() => setShowReplyForm(true)}
                        className="text-[10px] text-blue-600 hover:underline cursor-pointer"
                    >
                        Write a reply...
                    </button>
                )}
            </div>

            {/* Replies */}
            {isLoadingReplies ? (
                <div className="text-gray-500 text-xs ml-13">Loading replies...</div>
            ) : replies.length > 0 ? (
                <div className="ml-13 space-y-3 border-l-2 border-gray-100 pl-4">
                    {replies.map((reply) => (
                        <CommentCard
                            key={reply._id}
                            comment={reply}
                            postId={postId}
                            isReply={true}
                            onCommentDeleted={handleReplyDeleted}
                        />
                    ))}

                    {/* View All Replies Button */}
                    {!showAllReplies && totalReplies > replies.length && (
                        <Button
                            variant="light"
                            size="sm"
                            className="text-blue-600 h-auto p-0 text-xs"
                        >
                            View {totalReplies - replies.length} more replies
                        </Button>
                    )}
                </div>
            ) : null}
        </div>
    );
}
