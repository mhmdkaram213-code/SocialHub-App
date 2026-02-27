import { useState } from 'react';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { createComment } from '../../services/api/CommentApi/commentApi';

export default function CommentForm({ postId, onCommentCreated }) {
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

    // Submit comment
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            setError('Comment cannot be empty');
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

            // Create comment
            const result = await createComment(postId, formData);

            if (result.success) {
                // Reset form
                setContent('');
                setSelectedImage(null);
                setPreviewUrl(null);
                
                // Call callback to update comments list
                if (onCommentCreated) {
                    onCommentCreated(result.data);
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="comment-form space-y-3">
            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded">
                    {error}
                </div>
            )}

            {/* Textarea */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write a comment..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                disabled={isLoading}
            />

            {/* Image Preview */}
            {previewUrl && (
                <div className="relative">
                    <img
                        src={previewUrl}
                        alt="Comment preview"
                        className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        disabled={isLoading}
                        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 disabled:opacity-50"
                    >
                        Remove
                    </button>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
                {/* Image Upload Button */}
                <div>
                    <input
                        id="comment-image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={isLoading}
                    />
                    <label
                        htmlFor="comment-image"
                        className="inline-flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                    >
                        <FontAwesomeIcon icon={fas.faImage} />
                        <span>Add Image</span>
                    </label>
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    size="sm"
                    color="primary"
                    isLoading={isLoading}
                    disabled={isLoading || !content.trim()}
                >
                    {isLoading ? 'Posting...' : 'Post Comment'}
                </Button>
            </div>
        </form>
    );
}
