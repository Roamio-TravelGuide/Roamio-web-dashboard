import { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiCheck, FiArrowLeft } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resetPasswordWithOTP } from '../../api/auth/authApi'; 

const ResetPasswordForm = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: ''
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { email, otp } = location.state || {};

  // Check if user came from OTP verification
  if (!email || !otp) {
    navigate('/forgot-password');
    return null;
  }

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score += 1;
    else feedback.push('8+ characters');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercase letter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercase letter');

    if (/[0-9]/.test(password)) score += 1;
    else feedback.push('number');

    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    else feedback.push('special character');

    return {
      score,
      feedback: feedback.length > 0 ? `Needs: ${feedback.join(', ')}` : 'Strong password'
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'newPassword') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const getStrengthColor = (score) => {
    if (score === 0) return 'bg-gray-200';
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error('Password is too weak. Please choose a stronger password.');
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Resetting password...');

    try {
      // Call your API to reset password with OTP
      await resetPasswordWithOTP(email, otp, formData.newPassword);
      
      toast.success('Password reset successfully!', { id: toastId });
      
      // Redirect to login page after successful reset
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Your password has been reset successfully. Please login with your new password.' } 
        });
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to reset password. Please try again.', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const strengthLabels = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong',
    5: 'Very Strong'
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      {/* Video Background Container - Only shows on larger screens */}
      <div className="fixed inset-0 hidden w-full h-full overflow-hidden lg:block">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 object-cover w-full h-full"
        >
          <source src="/uploads/roamio3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/30"></div>
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-3 text-sm text-gray-600 hover:text-gray-800 transition-colors lg:text-white"
        >
          <FiArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {/* Card - Reduced padding */}
        <div className={`rounded-xl shadow-xl overflow-hidden ${window.innerWidth >= 1024 ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white'}`}>
          <div className="p-6 sm:p-7">
            {/* Branding Section - Compact */}
            <div className="mb-6 text-center">
              <div className="flex justify-center">
                <FiCheck className="w-8 h-8 text-teal-600 p-1.5 bg-teal-100 rounded-full" />
              </div>
              <h1 className="mt-2 text-2xl font-bold text-gray-800 lg:text-white">Set New Password</h1>
              <p className={`mt-1 text-xs ${window.innerWidth >= 1024 ? 'text-white/80' : 'text-gray-600'}`}>
                Create a strong password for your account
              </p>
            </div>

            {/* Password Reset Form - Compact spacing */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className={`block text-sm font-medium mb-1.5 ${window.innerWidth >= 1024 ? 'text-white' : 'text-gray-700'}`}>
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className={`h-4 w-4 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword.newPassword ? 'text' : 'password'}
                    id="newPassword"
                    className={`block w-full pl-9 pr-9 py-2.5 text-sm rounded-lg ${window.innerWidth >= 1024 ? 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white' : 'bg-white text-gray-800 border-gray-300 focus:ring-teal-500'} border focus:outline-none focus:ring-1 focus:border-transparent transition-all`}
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword.newPassword ? (
                      <FiEyeOff className={`h-4 w-4 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'} hover:text-gray-600`} />
                    ) : (
                      <FiEye className={`h-4 w-4 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'} hover:text-gray-600`} />
                    )}
                  </button>
                </div>

                {/* Password Strength Meter - Compact */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs ${window.innerWidth >= 1024 ? 'text-white/80' : 'text-gray-600'}`}>
                        Strength: <span className="font-medium">{strengthLabels[passwordStrength.score]}</span>
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-1">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <p className={`text-xs ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-500'}`}>
                      {passwordStrength.feedback}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium mb-1.5 ${window.innerWidth >= 1024 ? 'text-white' : 'text-gray-700'}`}>
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className={`h-4 w-4 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type={showPassword.confirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={`block w-full pl-9 pr-9 py-2.5 text-sm rounded-lg ${window.innerWidth >= 1024 ? 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white' : 'bg-white text-gray-800 border-gray-300 focus:ring-teal-500'} border focus:outline-none focus:ring-1 focus:border-transparent transition-all`}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword.confirmPassword ? (
                      <FiEyeOff className={`h-4 w-4 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'} hover:text-gray-600`} />
                    ) : (
                      <FiEye className={`h-4 w-4 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'} hover:text-gray-600`} />
                    )}
                  </button>
                </div>

                {/* Password Match Indicator - Compact */}
                {formData.confirmPassword && (
                  <div className="mt-1">
                    <div className={`flex items-center text-xs ${formData.newPassword === formData.confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                      {formData.newPassword === formData.confirmPassword ? (
                        <>
                          <FiCheck className="w-3 h-3 mr-1" />
                          Passwords match
                        </>
                      ) : (
                        'Passwords do not match'
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button - Compact */}
              <button
                type="submit"
                disabled={isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || passwordStrength.score < 3}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all ${
                  isLoading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || passwordStrength.score < 3
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-3 h-3 mr-1.5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            {/* Password Requirements - Compact */}
            <div className={`mt-4 p-3 rounded-lg text-xs ${window.innerWidth >= 1024 ? 'bg-white/10 text-white/90' : 'bg-gray-50 text-gray-700'}`}>
              <h3 className="font-medium mb-1.5">Password Requirements:</h3>
              <ul className="space-y-1">
                <li className="flex items-center">
                  <FiCheck className="w-3 h-3 mr-1.5 text-green-500" />
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-3 h-3 mr-1.5 text-green-500" />
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-3 h-3 mr-1.5 text-green-500" />
                  One lowercase letter
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-3 h-3 mr-1.5 text-green-500" />
                  One number
                </li>
                <li className="flex items-center">
                  <FiCheck className="w-3 h-3 mr-1.5 text-green-500" />
                  One special character
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;