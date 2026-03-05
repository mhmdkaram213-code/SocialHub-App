import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import userPlaceholder from '../../assets/images/user.jpg';
import updatePost from '../../services/api/PostApi/updatePost';

export default function EditPostModal({ post, isOpen, onClose, onPostUpdated, token, authUser }) {
    const getPostBody = (p) => p?.body || p?.content || p?.text || '';

    const [postBody, setPostBody] = useState(() => post?.body ?? getPostBody(post));
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(post?.image || '');
    const [isLoading, setIsLoading] = useState(false);

    console.log("EditPostModal - post object:", post);
    console.log("EditPostModal - calculated postBody:", getPostBody(post));

    useEffect(() => {
        if (isOpen) {
            const body = getPostBody(post);
            console.log("EditPostModal opened with body:", body);
            setPostBody(body);
            setPreviewUrl(post?.image || '');
            setImageFile(null);
        }
    }, [isOpen, post]);

    if (!isOpen) return null;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith('image/')) {
                toast.error('Please select a valid image file');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (!postBody.trim() && !previewUrl) {
            toast.warning('Post cannot be empty');
            return;
        }

        setIsLoading(true);
        try {
            // Always use current text (editedText) and optional new image file
            const editedText = postBody.trim();
            const newImageFile = imageFile;

            console.log("editedText value:", editedText);
            console.log("newImageFile value:", newImageFile);

            const formData = new FormData();
            formData.append('body', editedText);
            if (newImageFile) formData.append('image', newImageFile);

            // Log what's actually inside FormData
            for (const [key, value] of formData.entries()) {
                console.log("FormData entry:", key, value);
            }

            const postId = post?._id || post?.id;

            const response = await updatePost(postId, formData, token);

            console.log("Full API response:", response);
            console.log("response.data:", response.data);

            if (response.status === 200 || response.data?.message === 'success') {
                toast.success('Post updated successfully');

                const fullPostFromServer =
                    response.data?.data?.post ??
                    response.data?.post ??
                    response.data?.data ??
                    response.data;

                if (onPostUpdated && fullPostFromServer) {
                    onPostUpdated(fullPostFromServer);
                }

                setImageFile(null);
                setPreviewUrl(null);
                setPostBody('');
                onClose();
            } else {
                toast.error('Failed to update post');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Dark Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-[999] animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Centered Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 z-[1000] animate-in zoom-in-95 fade-in duration-300">
                <form onSubmit={handleSave}>
                    <header className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="avatar border-3 rounded-full border-blue-300 overflow-hidden w-12 h-12">
                                <img
                                    src={authUser?.user?.photo || userPlaceholder}
                                    alt="User Avatar"
                                    className="w-full h-full rounded-full object-cover"
                                    onError={(e) => { e.target.src = userPlaceholder; }}
                                />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Edit Post</h2>
                                <p className="text-sm text-gray-500">Update your thoughts</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            <FontAwesomeIcon icon={fas.faTimes} className="text-xl" />
                        </button>
                    </header>

                    <textarea
                        value={postBody}
                        onChange={(e) => setPostBody(e.target.value)}
                        placeholder="What's on your mind?"
                        disabled={isLoading}
                        className="w-full min-h-[150px] p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none text-gray-700"
                    />

                    {previewUrl && (
                        <div className="relative mt-4 rounded-xl overflow-hidden group">
                            <img
                                src={previewUrl}
                                alt="Post Preview"
                                className="w-full h-80 object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setPreviewUrl('');
                                    setImageFile(null);
                                }}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <FontAwesomeIcon icon={fas.faTrash} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <label
                            htmlFor="edit-image"
                            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                            <FontAwesomeIcon icon={fas.faImage} className="text-blue-500" />
                            <span className="font-medium text-gray-700">Change Media</span>
                            <input
                                id="edit-image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={isLoading}
                            />
                        </label>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Save Changes</span>
                                        <FontAwesomeIcon icon={fas.faCheck} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
