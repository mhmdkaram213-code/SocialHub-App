import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '../../context/Auth/Auth.Context';
import { Button, Card, CardBody, Spinner } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { changePassword } from '../../services/api/userApi';
import { changePasswordSchema } from '../../schema/changePasswordSchema/changePasswordSchema';

export default function ChangePassword() {
  const { token, setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState({
    password: false,
    newPassword: false,
    rePassword: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onBlur'
  });

  // Redirect if not logged in
  if (!token) {
    navigate('/login');
    return null;
  }

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await changePassword(token, data.password, data.newPassword);

      if (result.success) {
        // Update token if returned from API
        if (result.token) {
          localStorage.setItem('token', result.token);
          setToken(result.token);
        }

        toast.success(result.message || 'Password changed successfully!');

        // Reset form
        reset();

        // Redirect to profile after 2 seconds
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('An error occurred while changing password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-password-page bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto max-w-md">
        <Card className="bg-white shadow-lg">
          <CardBody className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={fas.faLock} className="text-3xl text-blue-500" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Change Password</h1>
              <p className="text-gray-600">Update your account password to keep it secure</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Password */}
              <div className="password">
                <label className="text-sm mb-1 font-semibold text-gray-700 block" htmlFor="password">
                  Current Password
                </label>
                <div className="input-field relative">
                  <input
                    {...register('password')}
                    id="password"
                    type={showPassword.password ? 'text' : 'password'}
                    placeholder="Enter your current password"
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.password && touchedFields.password
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-gray-50'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isSubmitting}
                  />
                  <FontAwesomeIcon
                    icon={fas.faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={showPassword.password ? fas.faEyeSlash : fas.faEye} />
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="password">
                <label className="text-sm mb-1 font-semibold text-gray-700 block" htmlFor="newPassword">
                  New Password
                </label>
                <div className="input-field relative">
                  <input
                    {...register('newPassword')}
                    id="newPassword"
                    type={showPassword.newPassword ? 'text' : 'password'}
                    placeholder="Enter your new password"
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.newPassword && touchedFields.newPassword
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-gray-50'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isSubmitting}
                  />
                  <FontAwesomeIcon
                    icon={fas.faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={showPassword.newPassword ? fas.faEyeSlash : fas.faEye} />
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="password">
                <label className="text-sm mb-1 font-semibold text-gray-700 block" htmlFor="rePassword">
                  Confirm New Password
                </label>
                <div className="input-field relative">
                  <input
                    {...register('rePassword')}
                    id="rePassword"
                    type={showPassword.rePassword ? 'text' : 'password'}
                    placeholder="Confirm your new password"
                    className={`w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      errors.rePassword && touchedFields.rePassword
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-300 bg-gray-50'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                    disabled={isSubmitting}
                  />
                  <FontAwesomeIcon
                    icon={fas.faLock}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({ ...showPassword, rePassword: !showPassword.rePassword })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <FontAwesomeIcon icon={showPassword.rePassword ? fas.faEyeSlash : fas.faEye} />
                  </button>
                </div>
                {errors.rePassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.rePassword.message}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  color="primary"
                  className="flex-1 bg-blue-500 text-white hover:bg-blue-600 font-semibold h-11"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner size="sm" color="white" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={fas.faLock} />
                      Update Password
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => navigate('/profile')}
                  disabled={isSubmitting}
                  variant="bordered"
                  className="flex-1 border-gray-300 text-gray-800 font-semibold h-11"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Help Text */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>
            <FontAwesomeIcon icon={fas.faShieldAlt} className="text-green-500 mr-2" />
            Your password is encrypted and secure
          </p>
        </div>
      </div>
    </div>
  );
}
