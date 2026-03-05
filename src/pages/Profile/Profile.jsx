import { useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/Auth.Context';
import { Button, Card, CardBody, Divider, Spinner } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import userImage from '../../assets/images/user.jpg';
import PostCard from '../../components/PostCard/PostCard';
import { getUserPosts, uploadProfilePhoto } from '../../services/api/userApi';
import { toast } from 'react-toastify';

export default function Profile() {
  const { token, user: authUser, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  console.log("Profile component - authUser from context:", authUser);
  console.log("Profile component - token from context:", token);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
  }, [token, navigate]);

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoadingPosts(true);
        const result = await getUserPosts(token);

        if (result.success) {
          setUserPosts(result.data);
        } else {
          console.error('Error fetching posts:', result.message);
          setUserPosts([]);
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
        setUserPosts([]);
      } finally {
        setIsLoadingPosts(false);
      }
    };

    if (token) {
      fetchUserPosts();
    }
  }, [token]);

  const handleImageClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadProfilePhoto(token, file);

      if (res.success) {
        toast.success('Profile photo updated!');
        // INSTANT UPDATE: Update the global AuthContext
        setUser(res.data);
      } else {
        toast.error(res.message || 'Failed to update photo');
      }
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong during upload');
    } finally {
      setIsUploading(false);
      // Reset input value to allow selecting same file again if needed
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const profile = authUser.user; // Use AuthContext as source of truth

  return (
    <div className="profile-page bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card className="bg-white shadow-lg">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image with Upload Trigger */}
              <div className="shrink-0 relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg cursor-pointer ${isUploading ? 'opacity-70 cursor-not-allowed' : 'hover:brightness-90'}`}
                  onClick={handleImageClick}
                >
                  <img
                    src={profile?.photo || userImage}
                    alt={profile?.name || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = userImage;
                    }}
                  />

                  {/* Camera Icon Overlay */}
                  <div className={`absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white transition-opacity duration-300 ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {isUploading ? (
                      <Spinner size="sm" color="white" />
                    ) : (
                      <>
                        <FontAwesomeIcon icon={fas.faCamera} className="text-xl mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile?.name || 'User'}
                </h1>

                <div className="space-y-3 mb-6">
                  <p className="text-gray-600 text-lg flex items-center justify-center md:justify-start gap-2">
                    <FontAwesomeIcon icon={fas.faEnvelope} className="text-blue-500" />
                    <span>{profile?.email || 'No email'}</span>
                  </p>

                  {profile?.gender && (
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                      <FontAwesomeIcon icon={fas.faVenusMars} className="text-blue-500" />
                      <span className="capitalize">{profile.gender}</span>
                    </p>
                  )}

                  {profile?.dateOfBirth && !isNaN(new Date(profile.dateOfBirth).getTime()) && (
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                      <FontAwesomeIcon icon={fas.faCakeCanary} className="text-blue-500" />
                      <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </p>
                  )}

                  {profile?.createdAt && !isNaN(new Date(profile.createdAt).getTime()) && (
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                      <FontAwesomeIcon icon={fas.faCalendarDays} className="text-blue-500" />
                      <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex gap-8 justify-center md:justify-start mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">{userPosts.length}</p>
                    <p className="text-gray-600 text-sm">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">0</p>
                    <p className="text-gray-600 text-sm">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">0</p>
                    <p className="text-gray-600 text-sm">Following</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button
                    color="primary"
                    onClick={() => navigate('/change-password')}
                    className="bg-blue-500 text-white hover:bg-blue-600"
                  >
                    <FontAwesomeIcon icon={fas.faLock} />
                    Change Password
                  </Button>
                  <Button
                    color="default"
                    variant="bordered"
                    onClick={() => navigate('/')}
                    className="border-blue-500 text-blue-500"
                  >
                    <FontAwesomeIcon icon={fas.faHome} />
                    Back to Home
                  </Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Divider />

        {/* User Posts Section */}
        <div className="posts-section">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={fas.faFileLines} />
            Recent Posts
          </h2>

          {isLoadingPosts ? (
            <Card className="bg-white">
              <CardBody className="py-12">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Spinner size="lg" label="Loading your posts..." />
                  <p className="text-gray-600 text-center">Fetching your posts...</p>
                </div>
              </CardBody>
            </Card>
          ) : userPosts.length > 0 ? (
            <div className="space-y-6">
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="bg-white">
              <CardBody className="text-center py-12">
                <FontAwesomeIcon icon={fas.faImages} className="text-4xl text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg">No posts yet</p>
                <p className="text-gray-500">Start sharing your thoughts with the world!</p>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
