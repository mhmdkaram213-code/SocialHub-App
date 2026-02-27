import { useState } from 'react';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createReply } from '../../services/api/CommentApi/commentApi';

export default function ReplyForm({ postId, commentId, onReplyCreated, onCancel }) {
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle image selection and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove selected image
    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    // Submit reply
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            setError('Reply cannot be empty');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            // Prepare form data
            const formData = new FormData();
            formData.append('content', content);
            if (selectedImage) {
                formData.append('image', selectedImage);
            }

            // Create reply
            const result = await createReply(postId, commentId, formData);

            if (result.success) {
                // Reset form
                setContent('');
                setSelectedImage(null);
                setPreviewUrl(null);
                
                // Call callback to update replies list
                if (onReplyCreated) {
                    onReplyCreated(result.data);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Error submitting reply:', err);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="reply-form space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-2 rounded">
                    {error}
                </div>
            )}

            {/* Textarea */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a reply..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="2"
                disabled={isLoading}
            />

            {/* Image Preview */}
            {previewUrl && (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Reply preview"
                        className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between gap-2">
                {/* Image Upload Button */}
                <div>
                    <input
                        id={`reply-image-${commentId}`}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isLoading}
                    />
                    <label
                        htmlFor={`reply-image-${commentId}`}
                        className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={fas.faImage} size="sm" />
                        <span>Image</span>
                    </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="light"
                        onPress={onCancel}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        color="primary"
                        isLoading={isLoading}
                        disabled={isLoading || !content.trim()}
                    >
                        {isLoading ? 'Posting...' : 'Reply'}
                    </Button>
                </div>
            </div>
        </form>
    );
}
