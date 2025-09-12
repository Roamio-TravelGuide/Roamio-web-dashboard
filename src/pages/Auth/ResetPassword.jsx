import { useState, useEffect } from 'react';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCompass, FiClock, FiX, FiCheck } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/authContext.jsx';
import { toast } from 'react-hot-toast';
import { forgotPassword, verifyOTP } from '../../api/auth/authApi';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpExpiry, setOtpExpiry] = useState(null);
  
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!email) {
    toast.error('Please enter your email address');
    return;
  }
  
  setIsLoading(true);
  const toastId = toast.loading('Sending OTP...');
  
  try {
    // Call your API to send OTP
    const response = await forgotPassword(email);
    
    toast.success('OTP sent to your email!', { id: toastId });
    setShowOtpPopup(true);
    
    // FIXED: Match backend expiry time (15 minutes)
    const expiryTime = new Date(Date.now() + 1 * 60 * 1000); // 1 minute to match backend
    setOtpExpiry(expiryTime);
    
    // Optional: Store the timestamp when OTP was sent for additional validation
  const now = Date.now();
  localStorage.setItem('otpSentTime', now.toString());
  // also set remainingTime immediately so UI doesn't show expired
  setRemainingTime(Math.floor((expiryTime - new Date()) / 1000));
    
  } catch (error) {
    console.error('OTP send error:', error);
    toast.error(error.message || 'Failed to send OTP', { id: toastId });
  } finally {
    setIsLoading(false);
  }
};

// Additional helper function to check if OTP is still valid on frontend
const isOTPStillValid = () => {
  const sentTime = localStorage.getItem('otpSentTime');
  if (!sentTime) return false;
  
  const timeDiff = Date.now() - parseInt(sentTime);
  const minutesElapsed = timeDiff / (1000 * 60);
  
  return minutesElapsed < 15; // 15 minutes limit
};

// Enhanced OTP verification handler
const handleOTPVerification = async (enteredOTP) => {
  if (!isOTPStillValid()) {
    toast.error('OTP has expired. Please request a new one.');
    return;
  }
  
  if (!enteredOTP || enteredOTP.length !== 6) {
    toast.error('Please enter a valid 6-digit OTP');
    return;
  }
  
  setIsVerifyingOtp(true);
  const toastId = toast.loading('Verifying OTP...');
  
  try {
    // Call your verify OTP API
    const response = await verifyOTP(email, enteredOTP);
    
    if (response.success) {
      toast.success('OTP verified successfully!', { id: toastId });
      // Clear the stored timestamp
      localStorage.removeItem('otpSentTime');
      // Proceed to password reset form
      setShowPasswordResetForm(true);
    } else {
      toast.error('Invalid OTP. Please try again.', { id: toastId });
    }
    
  } catch (error) {
    console.error('OTP verification error:', error);
    
    // Handle specific error messages from backend
    if (error.message.includes('expired')) {
      toast.error('OTP has expired. Please request a new one.', { id: toastId });
      // Clear expired data
      localStorage.removeItem('otpSentTime');
      setShowOtpPopup(false);
    } else if (error.message.includes('Invalid')) {
      toast.error('Invalid OTP. Please check and try again.', { id: toastId });
    } else {
      toast.error(error.message || 'OTP verification failed', { id: toastId });
    }
    
  } finally {
    setIsVerifyingOtp(false);
  }
};

// Function to resend OTP
const handleResendOTP = async () => {
  // Clear any existing OTP data
  localStorage.removeItem('otpSentTime');
  
  setIsLoading(true);
  const toastId = toast.loading('Resending OTP...');
  
  try {
    const response = await forgotPassword(email);
    
    toast.success('New OTP sent to your email!', { id: toastId });
    
    // Reset expiry time
    const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
    setOtpExpiry(expiryTime);
    const now = Date.now();
    localStorage.setItem('otpSentTime', now.toString());
    setRemainingTime(Math.floor((expiryTime - new Date()) / 1000));
    
  } catch (error) {
    console.error('Resend OTP error:', error);
    toast.error(error.message || 'Failed to resend OTP', { id: toastId });
  } finally {
    setIsLoading(false);
  }
};

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };


  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    if (/^\d{6}$/.test(pastedData)) {
      const otpArray = pastedData.split('');
      setOtp(otpArray);
      otpArray.forEach((digit, index) => {
        if (index < 6) {
          document.getElementById(`otp-${index}`).value = digit;
        }
      });
      document.getElementById('otp-5').focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifyingOtp(true);
    const toastId = toast.loading('Verifying OTP...');

    try {
      // Call your API to verify OTP
      // You'll need to create this API function
      const response = await verifyOTP(email, otpCode);
      
      toast.success('OTP verified successfully!', { id: toastId });
      navigate('/reset-password-form', { state: { email, otp: otpCode } });
    } catch (error) {
      toast.error(error.message || 'Invalid OTP. Please try again.', { id: toastId });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const resendOtp = async () => {
    setIsLoading(true);
    const toastId = toast.loading('Resending OTP...');
    
    try {
      await forgotPassword(email);
      toast.success('OTP resent to your email!', { id: toastId });
      setOtp(['', '', '', '', '', '']);
      
      // Reset expiry time
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
      setOtpExpiry(expiryTime);
      setRemainingTime(Math.floor((expiryTime - new Date()) / 1000));
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP', { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

   // Calculate remaining time
  const getRemainingTime = () => {
    if (!otpExpiry) return 0;
    
    const now = new Date();
    const diff = otpExpiry - now;
    return Math.max(0, Math.floor(diff / 1000));
  };
  
  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  
  // Update remaining time every second
  useEffect(() => {
    if (showOtpPopup && otpExpiry) {
      // initialize remaining time immediately
      setRemainingTime(getRemainingTime());

      const timer = setInterval(() => {
        const time = getRemainingTime();
        setRemainingTime(time);
        if (time === 0) {
          clearInterval(timer);
        }
      }, 1000);

      return () => clearInterval(timer);
    }

    // when popup is closed or no expiry set, ensure remainingTime is cleared
    setRemainingTime(0);
  }, [showOtpPopup, otpExpiry]);

   const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        {/* Card with conditional background based on screen size */}
        <div className={`rounded-xl shadow-xl overflow-hidden ${window.innerWidth >= 1024 ? 'bg-white/10 backdrop-blur-md border border-white/20' : 'bg-white'}`}>
          <div className="p-8 sm:p-10">
            {/* Branding Section */}
            <div className="mb-8 text-center">
              <div className="flex justify-center">
                <FiCompass className="w-10 h-10 text-teal-600" />
              </div>
              <h1 className="mt-3 text-3xl font-bold text-gray-800 lg:text-white">Welcome to Roamio</h1>
              <p className={`mt-2 ${window.innerWidth >= 1024 ? 'text-white/80' : 'text-gray-600'}`}>
                Reset your password with simple steps
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className={`block text-sm font-medium mb-2 ${window.innerWidth >= 1024 ? 'text-white' : 'text-gray-700'}`}>
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiMail className={`h-5 w-5 ${window.innerWidth >= 1024 ? 'text-white/70' : 'text-gray-400'}`} />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className={`block w-full pl-10 pr-3 py-3 rounded-lg ${window.innerWidth >= 1024 ? 'bg-white/20 text-white placeholder-white/70 border-white/30 focus:ring-white' : 'bg-white text-gray-800 border-gray-300 focus:ring-teal-500'} border focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-teal-600 to-blue-700 hover:from-teal-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send OTP <FiArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* OTP Popup Modal */}
       {/* OTP Popup Modal */}
      {showOtpPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-6 sm:p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowOtpPopup(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>

            {/* OTP Content */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-teal-100 rounded-full">
                  <FiCheck className="w-6 h-6 text-teal-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-4">
                We've sent a 6-digit verification code to <span className="font-semibold">{email}</span>
              </p>

              {/* Timer */}
              {remainingTime > 0 && (
                <div className="flex items-center justify-center mb-4 text-sm text-gray-600">
                  <FiClock className="w-4 h-4 mr-1" />
                  Expires in: {formatTime(remainingTime)}
                </div>
              )}

              {remainingTime === 0 && (
                <div className="mb-4 text-sm text-red-600">
                  OTP has expired. Please request a new one.
                </div>
              )}

              {/* OTP Input Fields - 6 digits */}
              <div className="flex justify-center space-x-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={handleOtpPaste}
                    className="w-12 h-12 text-xl text-center border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
                    autoFocus={index === 0}
                    disabled={remainingTime === 0}
                  />
                ))}
              </div>

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={isVerifyingOtp || otp.join('').length !== 6 || remainingTime === 0}
                className="w-full py-3 px-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-4"
              >
                {isVerifyingOtp ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  'Verify OTP'
                )}
              </button>

              {/* Resend OTP Link */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={resendOtp}
                  disabled={isLoading || remainingTime > 0}
                  className="text-teal-600 hover:text-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                >
                  Didn't receive the code? Resend OTP
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;