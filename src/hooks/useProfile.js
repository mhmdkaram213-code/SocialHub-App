import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/api/userApi';

export function useProfile(token) {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('No token available');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getUserProfile(token);

        if (result.success) {
          setProfile(result.data);
          setError(null);
        } else {
          setError(result.message);
          setProfile(null);
        }
      } catch (err) {
        setError('Failed to fetch profile');
        console.error('Profile fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  return { profile, isLoading, error };
}
