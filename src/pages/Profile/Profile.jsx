import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/Auth/Auth.Context';
import { Button, Card, CardBody, Divider, Spinner } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import userImage from '../../assets/images/user.jpg';
import PostCard from '../../components/PostCard/PostCard';
import { useProfile } from '../../hooks/useProfile';
import { getUserPosts } from '../../services/api/userApi';

export default function Profile() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { profile, isLoading: isLoadingProfile, error: profileError } = useProfile(token);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

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

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto max-w-2xl py-8 flex items-center justify-center min-h-screen">
        <Spinner label="Loading profile..." />
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="container mx-auto max-w-2xl py-8">
        <Card className="bg-red-50 border border-red-200">
          <CardBody className="text-center py-8">
            <p className="text-red-600 text-lg font-semibold">Error Loading Profile</p>
            <p className="text-red-500 mb-4">{profileError || 'Unable to load profile information'}</p>
            <Button
              color="primary"
              onClick={() => navigate('/')}
              className="bg-blue-500 text-white"
            >
              Back to Home
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="profile-page bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        {/* Profile Header */}
        <Card className="bg-white shadow-lg">
          <CardBody className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Image */}
              <div className="shrink-0">
                <img
                  src={userImage}
                  alt={profile?.username || 'User'}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  onError={(e) => {
                    e.target.src = userImage;
                  }}
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  {profile?.username || 'User'}
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
                  
                  {profile?.dateOfBirth && (
                    <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                      <FontAwesomeIcon icon={fas.faCake} className="text-blue-500" />
                      <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </p>
                  )}
                  
                  {profile?.createdAt && (
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
            <FontAwesomeIcon icon={fas.faPosts} />
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
